import { describe, expect, it, vi } from 'vitest';
import {
  createGumroadWebhookHandler,
  normalizeGumroadSale,
} from './gumroad-webhook.mts';
import {
  createRestoreCode,
  findPurchaseByRestoreCode,
  findPurchaseBySaleId,
  ensurePurchaseRecord,
} from './_shared/purchase-ledger.mts';

const REALISTIC_PRODUCT_ID = 'EIMdnG5PO1Mswtbp0o8vUg==';
const REALISTIC_PRODUCT_PERMALINK = 'tjkti';

function createFormRequest(body, options = {}) {
  const method = options.method ?? 'POST';
  return new Request('https://example.com/.netlify/functions/gumroad-webhook', {
    method,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: method === 'POST' ? new URLSearchParams(body) : undefined,
  });
}

function createMemoryStore() {
  const values = new Map();

  return {
    async get(key) {
      return values.get(key) ?? null;
    },
    async setJSON(key, value) {
      values.set(key, structuredClone(value));
    },
  };
}

describe('normalizeGumroadSale', () => {
  it('maps a representative Gumroad payload into the internal sale shape', () => {
    expect(
      normalizeGumroadSale({
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        product_permalink: REALISTIC_PRODUCT_PERMALINK,
        sale_timestamp: '2026-03-30T20:15:16.130Z',
        resource_name: 'sale',
        refunded: 'false',
        disputed: 'false',
      }),
    ).toMatchObject({
      saleId: 'sale-123',
      productId: REALISTIC_PRODUCT_ID,
      productPermalink: REALISTIC_PRODUCT_PERMALINK,
      createdAt: '2026-03-30T20:15:16.130Z',
      resourceName: 'sale',
      isRefunded: false,
      isDisputed: false,
    });
  });
});

describe('purchase ledger helpers', () => {
  it('creates deterministic restore codes for the same sale', () => {
    expect(
      createRestoreCode({
        sale_id: 'sale-123',
        product_id: 'prod-456',
      }),
    ).toBe(
      createRestoreCode({
        sale_id: 'sale-123',
        product_id: 'prod-456',
      }),
    );
  });

  it('stores and looks up purchase records by sale id and restore code', async () => {
    const store = createMemoryStore();
    const created = await ensurePurchaseRecord(
      {
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        created_at: '2026-03-30T20:15:16.130Z',
      },
      store,
    );

    expect(created.created).toBe(true);
    expect(created.repaired).toBe(false);
    await expect(findPurchaseBySaleId('sale-123', store)).resolves.toMatchObject({
      sale_id: 'sale-123',
      product_id: REALISTIC_PRODUCT_ID,
    });
    await expect(findPurchaseByRestoreCode(created.record.restore_code, store)).resolves.toMatchObject({
      sale_id: 'sale-123',
      restore_code: created.record.restore_code,
    });
  });

  it('repairs the restore index when a duplicate sale exists without it', async () => {
    const store = createMemoryStore();
    const restoreCode = createRestoreCode({
      sale_id: 'sale-123',
      product_id: REALISTIC_PRODUCT_ID,
    });
    await store.setJSON('sales/sale-123', {
      sale_id: 'sale-123',
      product_id: REALISTIC_PRODUCT_ID,
      restore_code: restoreCode,
      created_at: '2026-03-30T20:15:16.130Z',
    });

    const ensured = await ensurePurchaseRecord(
      {
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        created_at: '2026-03-30T20:15:16.130Z',
      },
      store,
    );

    expect(ensured.created).toBe(false);
    expect(ensured.repaired).toBe(true);
    await expect(findPurchaseByRestoreCode(restoreCode, store)).resolves.toMatchObject({
      sale_id: 'sale-123',
      product_id: REALISTIC_PRODUCT_ID,
      restore_code: restoreCode,
    });
  });

  it('remains retryable if the sale write fails after the restore index is written', async () => {
    const store = createMemoryStore();
    const originalSetJSON = store.setJSON;
    let setCalls = 0;

    store.setJSON = async (key, value) => {
      setCalls += 1;
      if (setCalls === 2) {
        throw new Error('sale index write failed');
      }

      return originalSetJSON(key, value);
    };

    await expect(
      ensurePurchaseRecord(
        {
          sale_id: 'sale-123',
          product_id: REALISTIC_PRODUCT_ID,
          created_at: '2026-03-30T20:15:16.130Z',
        },
        store,
      ),
    ).rejects.toThrow('sale index write failed');

    store.setJSON = originalSetJSON;

    const retried = await ensurePurchaseRecord(
      {
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        created_at: '2026-03-30T20:15:16.130Z',
      },
      store,
    );

    expect(retried.created).toBe(true);
    expect(retried.repaired).toBe(false);
    await expect(findPurchaseBySaleId('sale-123', store)).resolves.toMatchObject({
      sale_id: 'sale-123',
      product_id: REALISTIC_PRODUCT_ID,
    });
  });
});

describe('gumroad webhook handler', () => {
  it('creates a new record for a valid CozyBlock sale', async () => {
    const ensureRecord = vi.fn().mockResolvedValue({
      created: true,
      repaired: false,
      record: {
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        restore_code: 'CB-ABCD-EFGH-IJKL',
        created_at: '2026-03-30T20:15:16.130Z',
      },
    });
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => REALISTIC_PRODUCT_ID,
      getConfiguredProductPermalink: () => REALISTIC_PRODUCT_PERMALINK,
      ensureRecord,
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        product_permalink: REALISTIC_PRODUCT_PERMALINK,
        sale_timestamp: '2026-03-30T20:15:16.130Z',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      created: true,
      duplicate: false,
      repaired: false,
      saleId: 'sale-123',
      productId: REALISTIC_PRODUCT_ID,
      productPermalink: REALISTIC_PRODUCT_PERMALINK,
    });
    expect(ensureRecord).toHaveBeenCalledOnce();
  });

  it('returns duplicate success when the sale already exists', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => REALISTIC_PRODUCT_ID,
      getConfiguredProductPermalink: () => REALISTIC_PRODUCT_PERMALINK,
      ensureRecord: vi.fn().mockResolvedValue({
        created: false,
        repaired: false,
        record: {
          sale_id: 'sale-123',
          product_id: REALISTIC_PRODUCT_ID,
          restore_code: 'CB-ABCD-EFGH-IJKL',
          created_at: '2026-03-30T20:15:16.130Z',
        },
      }),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        product_permalink: REALISTIC_PRODUCT_PERMALINK,
        sale_timestamp: '2026-03-30T20:15:16.130Z',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      duplicate: true,
      repaired: false,
      created: false,
      saleId: 'sale-123',
      productId: REALISTIC_PRODUCT_ID,
      productPermalink: REALISTIC_PRODUCT_PERMALINK,
    });
  });

  it('reports duplicate repair when the restore index had to be recreated', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => REALISTIC_PRODUCT_ID,
      getConfiguredProductPermalink: () => REALISTIC_PRODUCT_PERMALINK,
      ensureRecord: vi.fn().mockResolvedValue({
        created: false,
        repaired: true,
        record: {
          sale_id: 'sale-123',
          product_id: REALISTIC_PRODUCT_ID,
          restore_code: 'CB-ABCD-EFGH-IJKL',
          created_at: '2026-03-30T20:15:16.130Z',
        },
      }),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        product_permalink: REALISTIC_PRODUCT_PERMALINK,
        sale_timestamp: '2026-03-30T20:15:16.130Z',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      duplicate: true,
      repaired: true,
      created: false,
      saleId: 'sale-123',
      productId: REALISTIC_PRODUCT_ID,
      productPermalink: REALISTIC_PRODUCT_PERMALINK,
    });
  });

  it('ignores events for the wrong product without failing', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => REALISTIC_PRODUCT_ID,
      getConfiguredProductPermalink: () => REALISTIC_PRODUCT_PERMALINK,
      ensureRecord: vi.fn(),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: 'other-product-id',
        product_permalink: REALISTIC_PRODUCT_PERMALINK,
        sale_timestamp: '2026-03-30T20:15:16.130Z',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      ignored: true,
      reason: 'wrong_product',
      saleId: 'sale-123',
      productId: 'other-product-id',
      productPermalink: REALISTIC_PRODUCT_PERMALINK,
    });
  });

  it('ignores events with the wrong permalink when a permalink is provided', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => REALISTIC_PRODUCT_ID,
      getConfiguredProductPermalink: () => REALISTIC_PRODUCT_PERMALINK,
      ensureRecord: vi.fn(),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        product_permalink: 'wrong-slug',
        sale_timestamp: '2026-03-30T20:15:16.130Z',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      ignored: true,
      reason: 'wrong_product_permalink',
      saleId: 'sale-123',
      productId: REALISTIC_PRODUCT_ID,
      productPermalink: 'wrong-slug',
    });
  });

  it('accepts a valid payload when the permalink is absent', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => REALISTIC_PRODUCT_ID,
      getConfiguredProductPermalink: () => REALISTIC_PRODUCT_PERMALINK,
      ensureRecord: vi.fn().mockResolvedValue({
        created: true,
        repaired: false,
        record: {
          sale_id: 'sale-123',
          product_id: REALISTIC_PRODUCT_ID,
          restore_code: 'CB-ABCD-EFGH-IJKL',
          created_at: '2026-03-30T20:15:16.130Z',
        },
      }),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        sale_timestamp: '2026-03-30T20:15:16.130Z',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      created: true,
      duplicate: false,
      repaired: false,
      saleId: 'sale-123',
      productId: REALISTIC_PRODUCT_ID,
      productPermalink: null,
    });
  });

  it('rejects malformed payloads with a 400', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => REALISTIC_PRODUCT_ID,
      ensureRecord: vi.fn(),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        product_id: REALISTIC_PRODUCT_ID,
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'missing_required_fields',
    });
  });

  it('rejects non-post requests with a 405', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => REALISTIC_PRODUCT_ID,
      ensureRecord: vi.fn(),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest(
        {
          sale_id: 'sale-123',
          product_id: REALISTIC_PRODUCT_ID,
          sale_timestamp: '2026-03-30T20:15:16.130Z',
        },
        { method: 'GET' },
      ),
    );

    expect(response.status).toBe(405);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'method_not_allowed',
    });
  });

  it('returns a 500 when storage fails unexpectedly', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => REALISTIC_PRODUCT_ID,
      ensureRecord: vi.fn().mockRejectedValue(new Error('storage down')),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: REALISTIC_PRODUCT_ID,
        product_permalink: REALISTIC_PRODUCT_PERMALINK,
        sale_timestamp: '2026-03-30T20:15:16.130Z',
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'internal_error',
    });
  });
});
