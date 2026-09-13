import { useGameState } from "../state/GameState"

export default function StepFeedback() {
  const { feedback } = useGameState()
  if (!feedback) return null

  return (
    <div className={`step-feedback is-${feedback.kind}`} aria-live="polite">
      <span className="step-feedback-title">{feedback.title}</span>
      <span className="step-feedback-detail">{feedback.detail}</span>
    </div>
  )
}
