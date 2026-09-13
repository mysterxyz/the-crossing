import { useEffect, useState } from "react"
import background from "../assets/standard_reserve_background_3x.png"
import { CORRECT_TO_FINISH } from "../data/questions"
import { useGameState } from "../state/GameState"
import { HERO_STATES } from "../state/gameLogic"
import FinishScreen from "./FinishScreen"
import Hero from "./Hero"
import QuizQuestion from "./QuizQuestion"
import "../styles/game-screen.css"

export default function GameScreen() {
  const { phase, score, heroState } = useGameState()
  const [viewSize, setViewSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  })

  useEffect(() => {
    const onResize = () => {
      setViewSize({ w: window.innerWidth, h: window.innerHeight })
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const showHero = phase === "playing" || phase === "complete"
  const crossing = phase === "playing" && score < CORRECT_TO_FINISH
  const showQuiz =
    crossing && heroState !== HERO_STATES.finished

  return (
    <div className="stage">
      <img
        className="stage-bg"
        src={background}
        alt=""
        draggable="false"
      />
      {showHero && (
        <Hero
          visible={showHero}
          position={score}
          viewSize={viewSize}
        />
      )}
      {showQuiz && <QuizQuestion />}
      {phase === "complete" && <FinishScreen />}
    </div>
  )
}
