import { robinhood } from "viem/chains"

function env(name) {
  const value = import.meta.env[name]
  return typeof value === "string" ? value.trim() : ""
}

function defaultSignUrl() {
  if (import.meta.env.PROD) return "/api/sign-mint"
  return "http://localhost:8787/sign-mint"
}

export const nftConfig = {
  contractAddress:
    env("VITE_NFT_CONTRACT_ADDRESS") ||
    "0x223b7f4323846e0b842cab1a9d94e8a88aa9ab16",
  chain: robinhood,
  chainId: robinhood.id,
  chainName: robinhood.name,
  rpcUrl: env("VITE_RPC_URL") || robinhood.rpcUrls.default.http[0],
  explorerUrl: (
    env("VITE_EXPLORER_URL") || robinhood.blockExplorers.default.url
  ).replace(/\/$/, ""),
  signUrl: env("VITE_MINT_SIGN_URL") || defaultSignUrl(),
}

export function explorerTxUrl(hash) {
  if (!nftConfig.explorerUrl || !hash) return ""
  return `${nftConfig.explorerUrl}/tx/${hash}`
}

export function chainIdHex() {
  return `0x${nftConfig.chainId.toString(16)}`
}

export const mintTypedData = {
  domain: {
    name: "The Crossing",
    version: "2",
    chainId: nftConfig.chainId,
    verifyingContract: nftConfig.contractAddress,
  },
  types: {
    Mint: [
      { name: "to", type: "address" },
      { name: "tier", type: "uint8" },
    ],
  },
  primaryType: "Mint",
}
