import { describe, expect, it, vi } from 'vitest';
import {
  createGumroadWebhookHandler,
  normalizeGumroadSale,
} from './gumroad-webhook.mts';
import {
  createPurchaseRecord,
  createRestoreCode,
  findPurchaseByRestoreCode,
  findPurchaseBySaleId,
} from './_shared/purchase-ledger.mts';

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
        product_id: 'prod-456',
        sale_timestamp: '2026-03-30T20:15:16.130Z',
        resource_name: 'sale',
        refunded: 'false',
        disputed: 'false',
      }),
    ).toMatchObject({
      saleId: 'sale-123',
      productId: 'prod-456',
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
    const created = await createPurchaseRecord(
      {
        sale_id: 'sale-123',
        product_id: 'prod-456',
        created_at: '2026-03-30T20:15:16.130Z',
      },
      store,
    );

    expect(created.created).toBe(true);
    await expect(findPurchaseBySaleId('sale-123', store)).resolves.toMatchObject({
      sale_id: 'sale-123',
      product_id: 'prod-456',
    });
    await expect(findPurchaseByRestoreCode(created.record.restore_code, store)).resolves.toMatchObject({
      sale_id: 'sale-123',
      restore_code: created.record.restore_code,
    });
  });
});

describe('gumroad webhook handler', () => {
  it('creates a new record for a valid CozyBlock sale', async () => {
    const createRecord = vi.fn().mockResolvedValue({
      record: {
        sale_id: 'sale-123',
        product_id: 'cozy-product',
        restore_code: 'CB-ABCD-EFGH-IJKL',
        created_at: '2026-03-30T20:15:16.130Z',
      },
    });
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => 'cozy-product',
      lookupSale: vi.fn().mockResolvedValue(null),
      createRecord,
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: 'cozy-product',
        sale_timestamp: '2026-03-30T20:15:16.130Z',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      created: true,
      saleId: 'sale-123',
      productId: 'cozy-product',
    });
    expect(createRecord).toHaveBeenCalledOnce();
  });

  it('returns duplicate success when the sale already exists', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => 'cozy-product',
      lookupSale: vi.fn().mockResolvedValue({
        sale_id: 'sale-123',
        product_id: 'cozy-product',
        restore_code: 'CB-ABCD-EFGH-IJKL',
        created_at: '2026-03-30T20:15:16.130Z',
      }),
      createRecord: vi.fn(),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: 'cozy-product',
        sale_timestamp: '2026-03-30T20:15:16.130Z',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      duplicate: true,
      saleId: 'sale-123',
      productId: 'cozy-product',
    });
  });

  it('ignores events for the wrong product without failing', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => 'cozy-product',
      lookupSale: vi.fn(),
      createRecord: vi.fn(),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: 'other-product',
        sale_timestamp: '2026-03-30T20:15:16.130Z',
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      ignored: true,
      reason: 'wrong_product',
      saleId: 'sale-123',
      productId: 'other-product',
    });
  });

  it('rejects malformed payloads with a 400', async () => {
    const handler = createGumroadWebhookHandler({
      getConfiguredProductId: () => 'cozy-product',
      lookupSale: vi.fn(),
      createRecord: vi.fn(),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        product_id: 'cozy-product',
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
      getConfiguredProductId: () => 'cozy-product',
      lookupSale: vi.fn(),
      createRecord: vi.fn(),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest(
        {
          sale_id: 'sale-123',
          product_id: 'cozy-product',
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
      getConfiguredProductId: () => 'cozy-product',
      lookupSale: vi.fn().mockRejectedValue(new Error('storage down')),
      createRecord: vi.fn(),
      logger: { error: vi.fn(), warn: vi.fn() },
    });

    const response = await handler(
      createFormRequest({
        sale_id: 'sale-123',
        product_id: 'cozy-product',
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
