import { useEffect, useState } from "react"
import heroSprite from "../assets/hero.png"
import { mapCoverPoint, SCENE } from "../scene/coverMap"
import { CORRECT_TO_FINISH } from "../data/questions"

export default function Hero({ visible, position, viewSize }) {
  const [shown, setShown] = useState(false)
  const start = mapCoverPoint(SCENE.startX, SCENE.bridgeY, viewSize.w, viewSize.h)
  const end = mapCoverPoint(SCENE.endX, SCENE.bridgeY, viewSize.w, viewSize.h)
  const t = position / CORRECT_TO_FINISH
  const x = start.x + (end.x - start.x) * t
  const height = start.drawH * SCENE.heroHeight

  useEffect(() => {
    if (!visible) {
      setShown(false)
      return
    }
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [visible])

  return (
    <div
      className={`hero${shown ? " is-visible" : ""}${shown ? " is-moving" : ""}`}
      style={{
        left: `${x}px`,
        top: `${start.y}px`,
        height: `${height}px`,
      }}
    >
      <img className="hero-sprite" src={heroSprite} alt="" draggable="false" />
    </div>
  )
}
