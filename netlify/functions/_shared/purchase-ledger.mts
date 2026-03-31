import { createHash } from 'node:crypto';
import { getDeployStore, getStore } from '@netlify/blobs';

const PURCHASE_LEDGER_STORE = 'cozyblock-purchase-ledger';
const SALE_PREFIX = 'sales/';
const RESTORE_PREFIX = 'restore-codes/';
const RESTORE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function getNetlifyContext() {
  return globalThis.Netlify?.context?.deploy?.context ?? null;
}

export function getPurchaseLedgerStore() {
  if (getNetlifyContext() === 'production') {
    return getStore(PURCHASE_LEDGER_STORE, { consistency: 'strong' });
  }

  return getDeployStore(PURCHASE_LEDGER_STORE);
}

function getSaleKey(saleId) {
  return `${SALE_PREFIX}${saleId}`;
}

function getRestoreCodeKey(restoreCode) {
  return `${RESTORE_PREFIX}${restoreCode}`;
}

function formatRestoreCode(characters) {
  return `CB-${characters.slice(0, 4)}-${characters.slice(4, 8)}-${characters.slice(8, 12)}`;
}

export function createRestoreCode({ sale_id, product_id }) {
  const digest = createHash('sha256').update(`${sale_id}:${product_id}`).digest();
  const characters = Array.from(digest.slice(0, 12), (byte) => RESTORE_ALPHABET[byte & 31]).join('');
  return formatRestoreCode(characters);
}

export async function findPurchaseBySaleId(saleId, store = getPurchaseLedgerStore()) {
  if (!saleId) {
    return null;
  }

  return (await store.get(getSaleKey(saleId), { type: 'json' })) ?? null;
}

export async function findPurchaseByRestoreCode(restoreCode, store = getPurchaseLedgerStore()) {
  if (!restoreCode) {
    return null;
  }

  return (await store.get(getRestoreCodeKey(restoreCode), { type: 'json' })) ?? null;
}

export async function createPurchaseRecord(
  { sale_id, product_id, created_at },
  store = getPurchaseLedgerStore(),
) {
  const existingRecord = await findPurchaseBySaleId(sale_id, store);

  if (existingRecord) {
    return {
      created: false,
      record: existingRecord,
    };
  }

  const record = {
    sale_id,
    product_id,
    restore_code: createRestoreCode({ sale_id, product_id }),
    created_at,
  };

  await store.setJSON(getSaleKey(sale_id), record);
  await store.setJSON(getRestoreCodeKey(record.restore_code), record);

  return {
    created: true,
    record,
  };
}
