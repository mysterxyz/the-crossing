import http from "node:http"
import { privateKeyToAccount } from "viem/accounts"
import dotenv from "dotenv"

dotenv.config({ path: "server/.env" })
dotenv.config()

const PORT = Number(process.env.SIGN_SERVER_PORT || 8787)
const CONTRACT =
  process.env.NFT_CONTRACT_ADDRESS ||
  "0x223b7f4323846e0b842cab1a9d94e8a88aa9ab16"
const CHAIN_ID = Number(process.env.CHAIN_ID || 4663)
const rawKey = process.env.SIGNER_PRIVATE_KEY || ""

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end(JSON.stringify(body))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"))
      } catch (error) {
        reject(error)
      }
    })
    req.on("error", reject)
  })
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    json(res, 204, {})
    return
  }

  if (req.method !== "POST" || req.url !== "/sign-mint") {
    json(res, 404, { error: "Not found" })
    return
  }

  if (!rawKey) {
    json(res, 500, { error: "SIGNER_PRIVATE_KEY is not set in server/.env" })
    return
  }

  try {
    const body = await readBody(req)
    const wallet = String(body.wallet || "")
    const tier = Number(body.tier)
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      json(res, 400, { error: "Invalid wallet" })
      return
    }
    if (![1, 2, 3].includes(tier)) {
      json(res, 400, { error: "Invalid tier" })
      return
    }

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

    json(res, 200, { signature })
  } catch (error) {
    json(res, 500, { error: error?.message || "Sign failed" })
  }
})

server.listen(PORT, () => {
  console.log(`Sign server on http://localhost:${PORT}/sign-mint`)
})
