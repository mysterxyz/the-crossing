import { nftConfig } from "./config"

export async function requestMintSignature({ wallet, tier }) {
  const response = await fetch(nftConfig.signUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, tier }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload?.signature) {
    throw new Error(payload?.error || "Signature request failed")
  }

  return payload.signature
}
