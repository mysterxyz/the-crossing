import { useCallback, useRef, useState } from "react"
import { sendMintTransaction } from "../web3/mint"
import {
  connectWallet,
  ensureRobinhoodNetwork,
  getInjectedProvider,
  getWalletChainId,
  isUserRejected,
} from "../web3/wallet"
import { nftConfig } from "../web3/config"

export const MINT_STATUS = {
  idle: "idle",
  connecting: "connecting",
  signing: "signing",
  confirm: "confirm",
  minting: "minting",
  success: "success",
  alreadyMinted: "alreadyMinted",
  wrongNetwork: "wrongNetwork",
  cancelled: "cancelled",
  failed: "failed",
}

const LABELS = {
  [MINT_STATUS.idle]: "Mint your NFT",
  [MINT_STATUS.connecting]: "Connecting wallet",
  [MINT_STATUS.signing]: "Signing",
  [MINT_STATUS.confirm]: "Confirm transaction",
  [MINT_STATUS.minting]: "Minting",
  [MINT_STATUS.success]: "NFT minted successfully",
  [MINT_STATUS.alreadyMinted]: "This wallet already minted",
  [MINT_STATUS.wrongNetwork]: "Wrong network",
  [MINT_STATUS.cancelled]: "Cancelled",
  [MINT_STATUS.failed]: "Mint failed",
}

const BUSY = new Set([
  MINT_STATUS.connecting,
  MINT_STATUS.signing,
  MINT_STATUS.confirm,
  MINT_STATUS.minting,
])

export function useMintNft(tier) {
  const [status, setStatus] = useState(MINT_STATUS.idle)
  const [txHash, setTxHash] = useState("")
  const runId = useRef(0)

  const mint = useCallback(async () => {
    if (BUSY.has(status) || status === MINT_STATUS.success) return
    if (![1, 2, 3].includes(tier)) {
      setStatus(MINT_STATUS.failed)
      return
    }

    const id = ++runId.current
    const still = () => id === runId.current
    const provider = getInjectedProvider()
    if (!provider) {
      setStatus(MINT_STATUS.failed)
      return
    }

    try {
      setStatus(MINT_STATUS.connecting)
      setTxHash("")
      const account = await connectWallet(provider)
      if (!still()) return

      await ensureRobinhoodNetwork(provider)
      const chainId = await getWalletChainId(provider)
      if (chainId !== nftConfig.chainId) {
        setStatus(MINT_STATUS.wrongNetwork)
        return
      }

      const result = await sendMintTransaction({
        provider,
        account,
        tier,
        onSigning: () => still() && setStatus(MINT_STATUS.signing),
        onConfirm: () => still() && setStatus(MINT_STATUS.confirm),
        onSubmitted: (hash) => {
          if (!still()) return
          setTxHash(hash)
          setStatus(MINT_STATUS.minting)
        },
      })

      if (!still()) return
      if (result.alreadyMinted) {
        setStatus(MINT_STATUS.alreadyMinted)
        return
      }
      if (result.hash) setTxHash(result.hash)
      setStatus(MINT_STATUS.success)
    } catch (error) {
      if (!still()) return
      if (isUserRejected(error)) {
        setStatus(MINT_STATUS.cancelled)
        return
      }
      setStatus(MINT_STATUS.failed)
    }
  }, [status, tier])

  return {
    status,
    label: LABELS[status] ?? LABELS[MINT_STATUS.idle],
    busy: BUSY.has(status),
    done: status === MINT_STATUS.success,
    txHash,
    mint,
  }
}
