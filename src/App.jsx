import { useRef } from "react"
import GameScreen from "./components/GameScreen"
import StartScreen from "./components/StartScreen"
import { GameStateProvider, useGameState } from "./state/GameState"

function QuizRun() {
  const { phase, setPhase, beginRun, startRunClock } = useGameState()
  const timerRef = useRef(0)

  const startRun = () => {
    if (phase !== "start") return
    beginRun()
    setPhase("fading")
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      startRunClock()
      setPhase("playing")
    }, 420)
  }

  return (
    <>
      <GameScreen />
      {(phase === "start" || phase === "fading") && (
        <StartScreen leaving={phase === "fading"} onStart={startRun} />
      )}
    </>
  )
}

export default function App() {
  return (
    <GameStateProvider>
      <QuizRun />
    </GameStateProvider>
  )
}
