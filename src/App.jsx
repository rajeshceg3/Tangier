import { useEffect, useRef, useState, useCallback } from "react";
import { createWorld, chapters } from "./world";
import {
  Lantern,
  TileRooftops,
  TileMedina,
  TileKasbah,
  TileStrait,
  IconReset,
  IconMotion,
  IconSound,
  IconAbout,
  IconPin,
  ArrowAlong,
  ArrowBack,
} from "./Ink";
import "./App.css";

const PIN_KEY = "tangier-chrome-pin";
const TOP_ZONE = 96;
const BOTTOM_ZONE = 150;
const RETIRE_MS = 2600;
const tileIcons = [TileRooftops, TileMedina, TileKasbah, TileStrait];

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

  // Chrome: the city leads; controls visit when called and retire when left.
  const [pinned, setPinned] = useState(() => {
    try {
      return localStorage.getItem(PIN_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [chrome, setChrome] = useState(true); // greets on entry, then retires
  const focusWithin = useRef(false);
  const retireTimer = useRef(null);
  const rootRef = useRef(null);

  const retireSoon = useCallback(() => {
    clearTimeout(retireTimer.current);
    retireTimer.current = setTimeout(() => {
      if (!focusWithin.current) setChrome(false);
    }, RETIRE_MS);
  }, []);

  const wake = useCallback(() => {
    setChrome(true);
    retireSoon();
  }, [retireSoon]);

  useEffect(() => {
    retireSoon(); // entry greeting retires on its own
    const onPointerMove = (e) => {
      if (e.pointerType === "touch") return;
      if (e.clientY < TOP_ZONE || e.clientY > window.innerHeight - BOTTOM_ZONE)
        wake();
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        focusWithin.current = false;
        setChrome(false);
      }
    };
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("keydown", onKey);
      clearTimeout(retireTimer.current);
    };
  }, [wake, retireSoon]);

  const togglePin = () => {
    setPinned((p) => {
      const next = !p;
      try {
        next
          ? localStorage.setItem(PIN_KEY, "1")
          : localStorage.removeItem(PIN_KEY);
      } catch {
        /* storage unavailable */
      }
      if (next) setChrome(true);
      return next;
    });
  };

  const onChromeFocus = () => {
    focusWithin.current = true;
    clearTimeout(retireTimer.current);
    setChrome(true);
  };
  const onChromeBlur = (e) => {
    if (!rootRef.current?.contains(e.relatedTarget)) {
      focusWithin.current = false;
      retireSoon();
    }
  };

  const chromeOn = chrome || pinned;

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
    <div
      className="app"
      ref={rootRef}
      onFocusCapture={onChromeFocus}
      onBlurCapture={onChromeBlur}
    >
      <canvas
        ref={canvas}
        id="world"
        tabIndex="0"
        aria-label="Three-dimensional imagined Tangier medina. Drag or use arrow keys to look around."
      />
      {!chromeOn && (
        <button className="chrome-hint" aria-label="Show controls" onClick={wake}>
          <Lantern />
        </button>
      )}
      <header className={`chrome${chromeOn ? " chrome-on" : ""}`}>
        <a className="wordmark" href="./">
          Tangier.
        </a>
        <div className="tools">
          <button
            id="reset"
            className="ink-chip"
            aria-label="Reset viewpoint"
            onClick={() => world.current?.reset()}
          >
            <IconReset />
          </button>
          <button
            id="pause"
            className="ink-chip"
            aria-label="Pause ambient motion"
            aria-pressed={paused}
            onClick={() => {
              world.current?.pause(!paused);
              setPaused(!paused);
            }}
          >
            <IconMotion paused={paused} />
          </button>
          <button
            id="sound"
            className="ink-chip"
            aria-label="Toggle sea and wind sound"
            aria-pressed={sound}
            onClick={async () => {
              await world.current?.sound(!sound);
              setSound(!sound);
            }}
          >
            <IconSound on={sound} />
          </button>
          <button
            id="about"
            className="ink-chip"
            aria-label="About this world"
            onClick={() => notes.current.showModal()}
          >
            <IconAbout />
          </button>
          <button
            id="pin-controls"
            className="ink-chip"
            aria-pressed={pinned}
            aria-label={pinned ? "Let controls retire" : "Keep controls visible"}
            title={pinned ? "Let controls retire" : "Keep controls visible"}
            onClick={togglePin}
          >
            <IconPin pinned={pinned} />
          </button>
        </div>
      </header>
      <div id="compass" className={`chrome${chromeOn ? " chrome-on" : ""}`}>
        Drag to look around
      </div>
      <main>
        <section className="story" aria-live="polite">
          <p className="eyebrow">MOROCCO · THE THRESHOLD</p>
          <h1>{chapters[chapter].title}</h1>
          <p id="line">{chapters[chapter].line}</p>
        </section>
        <div className={`journey chrome${chromeOn ? " chrome-on" : ""}`}>
          <nav
            aria-label="Tangier viewpoints"
            onKeyDown={(e) => {
              if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
                e.preventDefault();
                select((chapter + (e.key === "ArrowRight" ? 1 : 3)) % 4);
              }
            }}
          >
            {chapters.map((c, i) => {
              const Tile = tileIcons[i];
              return (
                <button
                  key={c.name}
                  data-chapter={i}
                  aria-current={chapter === i}
                  onClick={() => select(i)}
                >
                  <Tile />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </nav>
          <div className="walk-row">
            <button
              id="prev-stop"
              className="hand-btn hand-btn--ghost"
              aria-label="Previous viewpoint"
              onClick={() => select((chapter + 3) % 4)}
            >
              <ArrowBack /> Back
            </button>
            <button
              id="next-stop"
              className="hand-btn hand-btn--primary"
              aria-label="Next viewpoint"
              onClick={() => select((chapter + 1) % 4)}
            >
              Follow the alley <ArrowAlong />
            </button>
          </div>
        </div>
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
    </div>
  );
}
