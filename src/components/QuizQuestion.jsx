import { useEffect, useState } from "react"
import { useGameState } from "../state/GameState"
import { HERO_STATES } from "../state/gameLogic"
import "../styles/quiz-question.css"

export default function QuizQuestion() {
  const {
    currentQuestion,
    answerQuestion,
    locked,
    letters,
    heroState,
    phase,
    score,
    target,
    feedback,
  } = useGameState()
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    if (!locked) setPicked(null)
  }, [locked, currentQuestion])

  if (!currentQuestion || heroState === HERO_STATES.finished) return null
  if (phase !== "playing") return null

  const choose = (index) => {
    if (locked) return
    setPicked(index)
    answerQuestion(index)
  }

  return (
    <div className="quiz-layer">
      <div className="quiz-hud">
        <p className="quiz-kicker">
          <span className="quiz-kicker-line" />
          Trial {score} / {target}
          <span className="quiz-kicker-line" />
        </p>

        <div className="quiz-panel">
          <span className="quiz-corner quiz-corner-tl" />
          <span className="quiz-corner quiz-corner-tr" />
          <span className="quiz-corner quiz-corner-bl" />
          <span className="quiz-corner quiz-corner-br" />
          <p className="quiz-prompt">{currentQuestion.question}</p>
          <div className="quiz-answers">
            {currentQuestion.answers.map((answer, index) => {
              const isPicked = picked === index
              const resultClass =
                isPicked && feedback
                  ? ` is-${feedback.kind}`
                  : isPicked
                    ? " is-picked"
                    : ""
              return (
                <button
                  key={`${currentQuestion.question}-${index}`}
                  className={`quiz-answer${resultClass}`}
                  type="button"
                  disabled={locked}
                  onClick={() => choose(index)}
                >
                  {isPicked && feedback?.kind === "correct" && (
                    <span className="quiz-flash" aria-hidden="true">
                      {Array.from({ length: 7 }, (_, i) => (
                        <i key={i} className={`quiz-spark quiz-spark-${i}`} />
                      ))}
                    </span>
                  )}
                  <span className="quiz-letter">{letters[index]}</span>
                  <span className="quiz-answer-text">{answer}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
