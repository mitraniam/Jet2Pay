/**
 * Jet2Pay API Client
 *
 * Connects the frontend to the backend REST API.
 */

const API_BASE = import.meta.env.VITE_API_URL || "https://jet2pay-production.up.railway.app";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || data?.error || `API error ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Submit a new compensation claim.
 */
export async function submitClaim(claimData) {
  return request("/api/claims", {
    method: "POST",
    body: JSON.stringify(claimData),
  });
}

/**
 * Get claim status by ID (uses claimToken for auth).
 */
export async function getClaimStatus(claimId) {
  return request(`/api/claims/${claimId}`);
}

/**
 * Upload a document for a claim.
 */
export async function uploadDocument(claimId, claimToken, file, documentType) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("document_type", documentType);
  formData.append("claim_token", claimToken);

  const url = `${API_BASE}/api/claims/${claimId}/documents`;
  const res = await fetch(url, {
    method: "POST",
    body: formData,
    // No Content-Type header — browser sets it with boundary for multipart
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(data?.message || `Upload failed: ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return data;
}

/**
 * Check flight verification.
 */
export async function verifyFlight(flightNumber, date) {
  return request("/api/flights/verify", {
    method: "POST",
    body: JSON.stringify({ flightNumber, date }),
  });
}
