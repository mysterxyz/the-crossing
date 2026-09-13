import nftMaster from "../assets/nft-master.png"
import nftPathfinder from "../assets/nft-pathfinder.png"
import nftWayfinder from "../assets/nft-wayfinder.png"
import { useMintNft } from "../hooks/useMintNft"
import { useGameState } from "../state/GameState"
import { formatMistakes, formatMmSs } from "../state/gameLogic"
import { explorerTxUrl } from "../web3/config"
import "../styles/finish-screen.css"

const NFT_BY_TIER = {
  1: nftMaster,
  2: nftWayfinder,
  3: nftPathfinder,
}

export default function FinishScreen() {
  const { completionTime, mistakes, rank } = useGameState()
  const nftArt = NFT_BY_TIER[rank.tier] ?? nftPathfinder
  const { label, busy, done, txHash, mint } = useMintNft(rank.tier)
  const txUrl = explorerTxUrl(txHash)

  return (
    <div className="finish-screen">
      <div className="finish-stack">
        <h2 className="finish-title">
          The crossing
          <br />
          is complete<span className="finish-dot">.</span>
        </h2>
        <p className="finish-subtitle">
          A new chapter begins<span className="finish-dot">.</span>
        </p>
        <div className="finish-stats">
          <div className="finish-stat">
            <span className="finish-stat-label">Time</span>
            <span className="finish-stat-value">{formatMmSs(completionTime)}</span>
          </div>
          <div className="finish-stat">
            <span className="finish-stat-label">Mistakes</span>
            <span className="finish-stat-value">{formatMistakes(mistakes)}</span>
          </div>
          <div className="finish-stat">
            <span className="finish-stat-label">Rank</span>
            <span className="finish-stat-value">{rank.name}</span>
          </div>
        </div>
        <div className="finish-nft">
          <img className="finish-nft-art" src={nftArt} alt="" draggable="false" />
        </div>
        <button
          className="finish-mint"
          type="button"
          disabled={busy || done}
          onClick={mint}
        >
          {label}
        </button>
        {txHash ? (
          txUrl ? (
            <a
              className="finish-tx"
              href={txUrl}
              target="_blank"
              rel="noreferrer"
            >
              {txHash}
            </a>
          ) : (
            <p className="finish-tx">{txHash}</p>
          )
        ) : null}
      </div>
    </div>
  )
}
