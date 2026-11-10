import { useEffect, useRef, useState } from "react";
import { createWorld, chapters } from "./world";
import "./App.css";
export default function App() {
  const canvas = useRef(),
    world = useRef();
  const [chapter, setChapter] = useState(0),
    [paused, setPaused] = useState(
      matchMedia("(prefers-reduced-motion:reduce)").matches,
    ),
    [sound, setSound] = useState(false),
    [error, setError] = useState("");
  const notes = useRef();
  useEffect(() => {
    try {
      world.current = createWorld(canvas.current);
      return () => world.current.dispose();
    } catch (e) {
      queueMicrotask(() => setError(e.message));
    }
  }, []);
  function select(i) {
    world.current?.chapter(i);
    setChapter(i);
  }
  return (
    <>
      <canvas
        ref={canvas}
        id="world"
        tabIndex="0"
        aria-label="Three-dimensional imagined Tangier medina. Drag or use arrow keys to look around."
      />
      <header>
        <a className="wordmark" href="./">
          Tangier.
        </a>
        <div className="tools">
          <button
            id="reset"
            aria-label="Reset viewpoint"
            onClick={() => world.current?.reset()}
          >
            ↺
          </button>
          <button
            id="pause"
            aria-label="Pause ambient motion"
            aria-pressed={paused}
            onClick={() => {
              world.current?.pause(!paused);
              setPaused(!paused);
            }}
          >
            {paused ? "▶" : "Ⅱ"}
          </button>
          <button
            id="sound"
            aria-label="Toggle sea and wind sound"
            aria-pressed={sound}
            onClick={async () => {
              await world.current?.sound(!sound);
              setSound(!sound);
            }}
          >
            ♪
          </button>
          <button
            id="about"
            aria-label="About this world"
            onClick={() => notes.current.showModal()}
          >
            i
          </button>
        </div>
      </header>
      <div id="compass">Drag to look around</div>
      <main>
        <section className="story" aria-live="polite">
          <p className="eyebrow">MOROCCO · THE THRESHOLD</p>
          <h1>{chapters[chapter].title}</h1>
          <p id="line">{chapters[chapter].line}</p>
        </section>
        <nav
          aria-label="Tangier viewpoints"
          onKeyDown={(e) => {
            if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
              e.preventDefault();
              select((chapter + (e.key === "ArrowRight" ? 1 : 3)) % 4);
            }
          }}
        >
          {chapters.map((c, i) => (
            <button
              key={c.name}
              data-chapter={i}
              aria-current={chapter === i}
              onClick={() => select(i)}
            >
              {c.name}
            </button>
          ))}
        </nav>
      </main>
      <dialog ref={notes}>
        <button
          className="close"
          aria-label="Close notes"
          onClick={() => notes.current.close()}
        >
          ×
        </button>
        <h2>A city between waters.</h2>
        <p>
          An original, imagined Tangier: limewashed rooftops, a medina passage,
          Kasbah-inspired walls and the Strait. This is a spatial illustration,
          not a surveyed reconstruction, historic record or navigation map.
        </p>
        <p>
          Drag anywhere in the city to look all the way around. Arrow keys turn
          the view. Reset returns to the best angle for the chosen viewpoint.
          Motion can be paused. Sound is an optional, synthesized sea-and-wind
          study, never a field recording.
        </p>
        <p>
          References: the Moroccan National Tourist Office on{" "}
          <a
            href="https://www.visitmorocco.com/en/travel/tangier"
            target="_blank"
            rel="noopener"
          >
            Tangier
          </a>{" "}
          and{" "}
          <a
            href="https://www.visitmorocco.com/en/travel/tangier/medina"
            target="_blank"
            rel="noopener"
          >
            its medina
          </a>
          . Buildings and street arrangements are illustrative. No tracking.
        </p>
      </dialog>
      {error && (
        <div role="alert" id="fallback">
          The city needs WebGL. Try a current browser with hardware
          acceleration. {error}
        </div>
      )}
    </>
  );
}
