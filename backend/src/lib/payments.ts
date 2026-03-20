/**
 * Wise (TransferWise) Payment Integration — Priority 7
 *
 * Handles payout transfers to claimants via Wise API.
 */

import logger from "@/lib/logger";

// Lazy accessors — avoids crash at Next.js build time
function getWiseConfig() {
  const apiKey = process.env.WISE_API_KEY;
  const profileId = process.env.WISE_PROFILE_ID;
  if (!apiKey || !profileId) {
    throw new Error("Missing WISE_API_KEY or WISE_PROFILE_ID env vars");
  }
  const base = process.env.WISE_SANDBOX === "true"
    ? "https://api.sandbox.transferwise.tech"
    : "https://api.transferwise.com";
  return { apiKey, profileId, base };
}

export const COMMISSION_RATE = 0.30;

export function calculateSplit(grossAmount: number): {
  gross: number;
  companyFee: number;
  clientPayout: number;
} {
  const companyFee = Math.round(grossAmount * COMMISSION_RATE * 100) / 100;
  const clientPayout = Math.round((grossAmount - companyFee) * 100) / 100;
  return { gross: grossAmount, companyFee, clientPayout };
}

/**
 * Create a Wise quote for EUR → EUR transfer.
 */
async function createQuote(amount: number): Promise<{ id: string }> {
  const { apiKey, profileId, base } = getWiseConfig();
  const res = await fetch(`${base}/v3/profiles/${profileId}/quotes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceCurrency: "EUR",
      targetCurrency: "EUR",
      sourceAmount: amount,
      targetAmount: null,
      payOut: "BANK_TRANSFER",
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Wise quote failed: ${res.status} ${errorBody}`);
  }

  return res.json();
}

/**
 * Create a Wise recipient account (EUR IBAN).
 */
async function createRecipient(
  iban: string,
  accountHolderName: string
): Promise<{ id: number }> {
  const { apiKey, profileId, base } = getWiseConfig();
  const res = await fetch(`${base}/v1/accounts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profile: profileId,
      accountHolderName,
      currency: "EUR",
      type: "iban",
      details: { IBAN: iban },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Wise recipient creation failed: ${res.status} ${errorBody}`);
  }

  return res.json();
}

/**
 * Create a Wise transfer.
 */
async function createTransfer(
  quoteId: string,
  recipientId: number,
  reference: string
): Promise<{ id: number; status: string }> {
  const { apiKey, base } = getWiseConfig();
  const res = await fetch(`${base}/v1/transfers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      targetAccount: recipientId,
      quoteUuid: quoteId,
      customerTransactionId: crypto.randomUUID(),
      details: { reference },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Wise transfer creation failed: ${res.status} ${errorBody}`);
  }

  return res.json();
}

/**
 * Fund a Wise transfer (triggers payment).
 */
async function fundTransfer(transferId: number): Promise<void> {
  const { apiKey, profileId, base } = getWiseConfig();
  const res = await fetch(
    `${base}/v3/profiles/${profileId}/transfers/${transferId}/payments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "BALANCE" }),
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Wise fund transfer failed: ${res.status} ${errorBody}`);
  }
}

/**
 * Full payout flow: quote → recipient → transfer → fund.
 */
export async function initiateWiseTransfer(
  amount: number,
  iban: string,
  accountHolderName: string,
  reference: string
): Promise<{ transferId: number; status: string }> {
  logger.info("Initiating Wise transfer", { amount, reference });

  const quote = await createQuote(amount);
  const recipient = await createRecipient(iban, accountHolderName);
  const transfer = await createTransfer(quote.id, recipient.id, reference);
  await fundTransfer(transfer.id);

  logger.info("Wise transfer initiated", {
    transferId: transfer.id,
    status: transfer.status,
  });

  return { transferId: transfer.id, status: transfer.status };
}

/**
 * Verify Wise webhook signature (HMAC SHA-256).
 */
export async function verifyWiseWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.WISE_WEBHOOK_SECRET;
  if (!secret) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSig = Buffer.from(sig).toString("base64");

  return expectedSig === signature;
}
