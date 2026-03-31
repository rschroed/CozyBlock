import type { Context } from '@netlify/functions';
import { createPurchaseRecord, findPurchaseBySaleId } from './_shared/purchase-ledger.mts';

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

function normalizeBoolean(value) {
  if (typeof value !== 'string') {
    return false;
  }

  return ['true', '1', 'yes'].includes(value.toLowerCase());
}

function getFirstString(values, keys) {
  for (const key of keys) {
    const value = values[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

async function readIncomingValues(request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = await request.json();
    return Object.fromEntries(
      Object.entries(body ?? {}).map(([key, value]) => [key, typeof value === 'string' ? value : String(value)]),
    );
  }

  const formData = await request.formData();
  return Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, typeof value === 'string' ? value : value.name]),
  );
}

export function normalizeGumroadSale(values) {
  const saleId = getFirstString(values, ['sale_id', 'saleId', 'id']);
  const productId = getFirstString(values, ['product_id', 'productId', 'permalink']);
  const createdAt = getFirstString(values, ['sale_timestamp', 'created_at', 'createdAt']);
  const resourceName = getFirstString(values, ['resource_name', 'resourceName']);

  return {
    saleId,
    productId,
    createdAt,
    resourceName,
    isTest: normalizeBoolean(values.test),
    isRefunded: normalizeBoolean(values.refunded),
    isDisputed: normalizeBoolean(values.disputed) || normalizeBoolean(values.chargebacked),
    raw: values,
  };
}

export function createGumroadWebhookHandler({
  getConfiguredProductId,
  lookupSale = findPurchaseBySaleId,
  createRecord = createPurchaseRecord,
  logger = console,
}) {
  return async function gumroadWebhook(request) {
    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405);
    }

    const configuredProductId = getConfiguredProductId();
    if (!configuredProductId) {
      logger.error('Missing GUMROAD_PRODUCT_ID configuration.');
      return jsonResponse({ ok: false, error: 'server_misconfigured' }, 500);
    }

    let sale;
    try {
      sale = normalizeGumroadSale(await readIncomingValues(request));
    } catch (error) {
      logger.warn('Failed to parse Gumroad webhook payload.', error);
      return jsonResponse({ ok: false, error: 'invalid_payload' }, 400);
    }

    if (sale.resourceName && !['sale', 'purchase'].includes(sale.resourceName)) {
      return jsonResponse({ ok: true, ignored: true, reason: 'unsupported_resource' });
    }

    if (!sale.saleId || !sale.productId || !sale.createdAt) {
      logger.warn('Gumroad webhook payload missing required fields.', sale.raw);
      return jsonResponse({ ok: false, error: 'missing_required_fields' }, 400);
    }

    if (sale.isTest) {
      return jsonResponse({
        ok: true,
        ignored: true,
        reason: 'test_event',
        saleId: sale.saleId,
        productId: sale.productId,
      });
    }

    if (sale.productId !== configuredProductId) {
      return jsonResponse({
        ok: true,
        ignored: true,
        reason: 'wrong_product',
        saleId: sale.saleId,
        productId: sale.productId,
      });
    }

    if (sale.isRefunded || sale.isDisputed) {
      logger.warn('Gumroad webhook sale is not eligible for fulfillment.', {
        saleId: sale.saleId,
        productId: sale.productId,
        refunded: sale.isRefunded,
        disputed: sale.isDisputed,
      });
      return jsonResponse(
        {
          ok: false,
          error: 'sale_not_eligible',
          saleId: sale.saleId,
          productId: sale.productId,
        },
        400,
      );
    }

    try {
      const existingRecord = await lookupSale(sale.saleId);
      if (existingRecord) {
        return jsonResponse({
          ok: true,
          duplicate: true,
          saleId: existingRecord.sale_id,
          productId: existingRecord.product_id,
        });
      }

      const { record } = await createRecord({
        sale_id: sale.saleId,
        product_id: sale.productId,
        created_at: sale.createdAt,
      });

      return jsonResponse({
        ok: true,
        created: true,
        saleId: record.sale_id,
        productId: record.product_id,
      });
    } catch (error) {
      logger.error('Failed to process Gumroad webhook.', error);
      return jsonResponse({ ok: false, error: 'internal_error' }, 500);
    }
  };
}

const handler = createGumroadWebhookHandler({
  getConfiguredProductId: () => Netlify.env.get('GUMROAD_PRODUCT_ID'),
});

export default async (request: Request, _context: Context) => handler(request);
