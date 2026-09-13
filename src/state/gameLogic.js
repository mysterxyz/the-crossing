export const HERO_STATES = {
  idle: "idle",
  runningForward: "runningForward",
  runningBackward: "runningBackward",
  correct: "correct",
  wrong: "wrong",
  finished: "finished",
}

export const LETTERS = ["A", "B", "C", "D"]

export function applyAnswer(position, isCorrect, maxPosition) {
  if (isCorrect) return Math.min(maxPosition, position + 1)
  return Math.max(0, position - 1)
}

export function shuffle(list) {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = next[i]
    next[i] = next[j]
    next[j] = current
  }
  return next
}

export function formatMmSs(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export function formatMistakes(count) {
  return String(Math.max(0, count)).padStart(2, "0")
}

export function rankFromMistakes(mistakes) {
  if (mistakes <= 0) return { tier: 1, name: "Master" }
  if (mistakes <= 3) return { tier: 2, name: "Wayfinder" }
  return { tier: 3, name: "Pathfinder" }
}
