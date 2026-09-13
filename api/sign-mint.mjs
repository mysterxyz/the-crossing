import { privateKeyToAccount } from "viem/accounts"

const CONTRACT = "0x223b7f4323846e0b842cab1a9d94e8a88aa9ab16"
const CHAIN_ID = 4663

function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body
  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body)
  }
  return {}
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end()
    return
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const rawKey = process.env.SIGNER_PRIVATE_KEY || ""
  if (!rawKey) {
    res.status(500).json({ error: "SIGNER_PRIVATE_KEY is not set" })
    return
  }

  let body
  try {
    body = readJsonBody(req)
  } catch {
    res.status(400).json({ error: "Invalid JSON" })
    return
  }

  const wallet = String(body.wallet || "")
  const tier = Number(body.tier)

  if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    res.status(400).json({ error: "Invalid wallet" })
    return
  }

  if (![1, 2, 3].includes(tier)) {
    res.status(400).json({ error: "Invalid tier" })
    return
  }

  try {
    const account = privateKeyToAccount(
      rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`,
    )
    const signature = await account.signTypedData({
      domain: {
        name: "The Crossing",
        version: "2",
        chainId: CHAIN_ID,
        verifyingContract: CONTRACT,
      },
      types: {
        Mint: [
          { name: "to", type: "address" },
          { name: "tier", type: "uint8" },
        ],
      },
      primaryType: "Mint",
      message: {
        to: wallet,
        tier,
      },
    })

    res.status(200).json({ signature })
  } catch (error) {
    res.status(500).json({ error: error?.message || "Sign failed" })
  }
}
