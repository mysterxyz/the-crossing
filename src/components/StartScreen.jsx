import "../styles/start-screen.css"

export default function StartScreen({ leaving, onStart }) {
  return (
    <div className={`start-screen${leaving ? " is-leaving" : ""}`}>
      <h1 className="start-title">The Crossing Begins</h1>
      <p className="start-subtitle">
        One bridge<span className="start-dot">.</span> One path
        <span className="start-dot">.</span>
      </p>
      <button className="start-run" type="button" onClick={onStart}>
        Start Run
      </button>
    </div>
  )
}
