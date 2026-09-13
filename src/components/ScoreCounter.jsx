import { CORRECT_TO_FINISH } from "../data/questions"
import { useGameState } from "../state/GameState"
import { HERO_STATES } from "../state/gameLogic"
import "../styles/score-counter.css"

export default function ScoreCounter() {
  const { score, phase, heroState } = useGameState()
  if (phase !== "playing") return null
  if (heroState === HERO_STATES.finished) return null

  return (
    <div className="score-counter" aria-live="polite">
      {score} / {CORRECT_TO_FINISH}
    </div>
  )
}
