import { nftConfig, chainIdHex } from "./config"

export function getInjectedProvider() {
  if (typeof window === "undefined") return null
  const ethereum = window.ethereum
  if (!ethereum) return null
  if (Array.isArray(ethereum.providers) && ethereum.providers.length > 0) {
    return (
      ethereum.providers.find((provider) => provider.isRabby) ||
      ethereum.providers.find((provider) => provider.isMetaMask) ||
      ethereum.providers[0]
    )
  }
  return ethereum
}

export function isUserRejected(error) {
  const code = error?.code ?? error?.cause?.code
  const message = String(error?.shortMessage || error?.message || "")
  return (
    code === 4001 ||
    code === "ACTION_REJECTED" ||
    /user rejected|denied|rejected the request/i.test(message)
  )
}

export async function connectWallet(provider) {
  const accounts = await provider.request({ method: "eth_requestAccounts" })
  const account = accounts?.[0]
  if (!account) throw new Error("No account returned")
  return account
}

export async function getWalletChainId(provider) {
  const hex = await provider.request({ method: "eth_chainId" })
  return Number.parseInt(hex, 16)
}

export async function ensureRobinhoodNetwork(provider) {
  const current = await getWalletChainId(provider)
  if (current === nftConfig.chainId) return

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex() }],
    })
  } catch (error) {
    if (error?.code === 4902 || /unrecognized chain/i.test(String(error?.message))) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainIdHex(),
            chainName: nftConfig.chainName,
            rpcUrls: [nftConfig.rpcUrl],
            nativeCurrency: nftConfig.chain.nativeCurrency,
            blockExplorerUrls: nftConfig.explorerUrl
              ? [nftConfig.explorerUrl]
              : undefined,
          },
        ],
      })
      return
    }
    throw error
  }
}
