import {
  createPublicClient,
  createWalletClient,
  custom,
  getAddress,
  http,
} from "viem"
import { theCrossingAbi } from "./abi"
import { nftConfig } from "./config"
import { requestMintSignature } from "./signMint"

export function createNftPublicClient() {
  return createPublicClient({
    chain: nftConfig.chain,
    transport: http(nftConfig.rpcUrl),
  })
}

export async function walletCanMint(account) {
  const publicClient = createNftPublicClient()
  return publicClient.readContract({
    address: getAddress(nftConfig.contractAddress),
    abi: theCrossingAbi,
    functionName: "canMint",
    args: [getAddress(account)],
  })
}

export async function sendMintTransaction({
  provider,
  account,
  tier,
  onSigning,
  onConfirm,
  onSubmitted,
}) {
  const canMint = await walletCanMint(account)
  if (!canMint) {
    return { alreadyMinted: true, hash: null }
  }

  onSigning?.()
  const signature = await requestMintSignature({ wallet: account, tier })

  onConfirm?.()
  const walletClient = createWalletClient({
    account: getAddress(account),
    chain: nftConfig.chain,
    transport: custom(provider),
  })

  const hash = await walletClient.writeContract({
    address: getAddress(nftConfig.contractAddress),
    abi: theCrossingAbi,
    functionName: "mint",
    args: [tier, signature],
    account: getAddress(account),
    chain: nftConfig.chain,
  })

  onSubmitted?.(hash)

  const publicClient = createNftPublicClient()
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  if (receipt.status !== "success") {
    throw new Error("Mint transaction reverted")
  }

  return { alreadyMinted: false, hash }
}
