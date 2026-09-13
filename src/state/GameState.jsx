import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import { CORRECT_TO_FINISH, questions } from "../data/questions"
import {
  HERO_STATES,
  LETTERS,
  applyAnswer,
  rankFromMistakes,
  shuffle,
} from "./gameLogic"

const GameStateContext = createContext(null)

export function GameStateProvider({ children }) {
  const [phase, setPhase] = useState("start")
  const [score, setScore] = useState(0)
  const [heroState, setHeroState] = useState(HERO_STATES.idle)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [locked, setLocked] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [runQuestions, setRunQuestions] = useState(() => shuffle(questions))
  const [mistakes, setMistakes] = useState(0)
  const [completionTimeMs, setCompletionTimeMs] = useState(0)
  const timerRef = useRef(0)
  const runStartedAtRef = useRef(0)

  const beginRun = useCallback(() => {
    window.clearTimeout(timerRef.current)
    setRunQuestions(shuffle(questions))
    setQuestionIndex(0)
    setScore(0)
    setHeroState(HERO_STATES.idle)
    setLocked(false)
    setFeedback(null)
    setMistakes(0)
    setCompletionTimeMs(0)
    runStartedAtRef.current = 0
  }, [])

  const startRunClock = useCallback(() => {
    runStartedAtRef.current = performance.now()
  }, [])

  const answerQuestion = useCallback(
    (answerIndex) => {
      if (locked || heroState === HERO_STATES.finished) return
      const current = runQuestions[questionIndex]
      if (!current) return

      const isCorrect = answerIndex === current.correctAnswer
      const nextScore = applyAnswer(score, isCorrect, CORRECT_TO_FINISH)
      const reachedExit = nextScore >= CORRECT_TO_FINISH
      const nextMistakes = isCorrect ? mistakes : mistakes + 1

      setLocked(true)
      setHeroState(
        isCorrect ? HERO_STATES.runningForward : HERO_STATES.runningBackward,
      )
      setScore(nextScore)
      if (!isCorrect) setMistakes(nextMistakes)
      if (reachedExit) {
        const startedAt = runStartedAtRef.current
        setCompletionTimeMs(
          startedAt ? Math.round(performance.now() - startedAt) : 0,
        )
      }
      setFeedback({
        kind: isCorrect ? "correct" : "wrong",
        title: isCorrect ? "Correct" : "Wrong",
        detail: isCorrect ? "+1" : "-1",
      })

      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        setFeedback(null)
        if (reachedExit) {
          setHeroState(HERO_STATES.finished)
          setPhase("complete")
          return
        }

        setQuestionIndex((index) => (index + 1) % runQuestions.length)
        setHeroState(HERO_STATES.idle)
        setLocked(false)
      }, 900)
    },
    [locked, heroState, runQuestions, questionIndex, score, mistakes, setPhase],
  )

  const currentQuestion = runQuestions[questionIndex] ?? null
  const rank = rankFromMistakes(mistakes)

  const value = useMemo(
    () => ({
      phase,
      setPhase,
      beginRun,
      startRunClock,
      score,
      position: score,
      heroState,
      questionIndex,
      locked,
      feedback,
      runQuestions,
      currentQuestion,
      answerQuestion,
      letters: LETTERS,
      target: CORRECT_TO_FINISH,
      mistakes,
      completionTime: completionTimeMs,
      rank,
    }),
    [
      phase,
      beginRun,
      startRunClock,
      score,
      heroState,
      questionIndex,
      locked,
      feedback,
      runQuestions,
      currentQuestion,
      answerQuestion,
      mistakes,
      completionTimeMs,
      rank,
    ],
  )

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const ctx = useContext(GameStateContext)
  if (!ctx) {
    throw new Error("useGameState must be used within GameStateProvider")
  }
  return ctx
}
