// Hand-drawn ink work for Tangier.
// Short, confident strokes; the wobble carries the hand, not ornament.
// Wayfinding of the place: zellige tiles, the medina's keyhole door,
// kasbah crenellation, the Strait, and a souk lantern for the hint tab.

// The souk lantern: where the controls live when they retire.
export const Lantern = ({ className = "" }) => (
  <svg
    className={`ink-lantern ${className}`}
    viewBox="0 0 40 72"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M20 1.5 C 20 5, 20 7, 20 9.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M13.5 10 C 16.5 8.6, 23.5 8.8, 26.5 10.2 L 25.6 14.5 C 22 13.4, 18 13.4, 14.4 14.6 Z"
      fill="currentColor"
    />
    <path
      d="M12.2 16.5 C 9.6 24, 9.8 34, 12.6 42.5 C 17 45.5, 23.2 45.4, 27.6 42.4 C 30.2 34, 30.4 24.5, 27.8 16.4 C 23 14.6, 16.8 14.7, 12.2 16.5 Z"
      fill="var(--glaze, #ffe0a6)"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 15.4 C 15.6 24, 15.7 34, 16.8 43.6 M 23.4 15.3 C 24.3 24, 24.2 34, 23.1 43.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M13 46.8 C 17.5 49.4, 22.8 49.4, 27.2 46.7 L 26 52.5 C 22 54.4, 18 54.3, 14.2 52.6 Z"
      fill="currentColor"
    />
    <path
      d="M20 54.5 C 20 58.5, 20 61, 20 63.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="20" cy="66.4" r="2.6" fill="currentColor" />
  </svg>
);

// Rooftops: limewashed terraces stepping toward the sea.
export const TileRooftops = ({ className = "" }) => (
  <svg className={`ink-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M3.5 19.5 L 3.4 12.6 L 9.2 12.4 L 9.2 8 L 14.8 7.8 L 14.9 4.2 L 20.6 4 L 20.6 19.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.2 19.6 C 9 19.2, 15 19.8, 20.8 19.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

// Medina: the blue keyhole door under its arch.
export const TileMedina = ({ className = "" }) => (
  <svg className={`ink-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M6 20.2 L 6.2 11.5 C 6.4 7.2, 9 4.4, 12 4.2 C 15.2 4.4, 17.6 7.4, 17.8 11.6 L 17.7 20.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M9.2 20.3 L 9.3 13.2 C 9.5 11, 10.7 9.7, 12 9.6 C 13.4 9.8, 14.5 11.2, 14.7 13.4 L 14.6 20.2 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="13.4" cy="15.4" r="0.9" fill="currentColor" />
  </svg>
);

// Kasbah: crenellated walls above the white city.
export const TileKasbah = ({ className = "" }) => (
  <svg className={`ink-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M4.5 20.3 L 4.4 10.3 L 7.2 10.2 L 7.1 7.4 L 10.2 7.5 L 10.2 10.2 L 13.8 10.3 L 13.7 7.3 L 16.8 7.4 L 16.9 10.1 L 19.6 10.2 L 19.5 20.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.2 20.4 C 9.5 20, 15 20.6, 19.8 20.2 M 11 14.5 C 11.6 13.4, 12.6 13.4, 13.1 14.6 L 13 17.4 L 11.1 17.3 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// The Strait: two wave strokes and the far shore.
export const TileStrait = ({ className = "" }) => (
  <svg className={`ink-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M3.4 8.2 C 6.5 6.4, 9.5 8.4, 12.4 7 C 15.4 5.6, 18 7.2, 20.6 6.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M3.2 13.4 C 5.4 12, 7.6 13.8, 9.9 12.7 C 12.2 11.6, 14.3 13.3, 16.6 12.5 C 18.3 11.9, 19.6 12.6, 20.7 12.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M4 17.8 C 6.2 16.5, 8.4 18.1, 10.7 17 C 13 15.9, 15.1 17.6, 17.4 16.8 C 18.9 16.3, 20 16.9, 20.9 16.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

// Reset: a hand-turned circular arrow.
export const IconReset = ({ className = "" }) => (
  <svg className={`ink-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M19.2 12.2 C 19.1 16.2, 15.9 19.3, 11.9 19.2 C 8 19.1, 5 16, 5.1 12 C 5.2 8.1, 8.4 5, 12.3 5.1 C 14.7 5.2, 16.8 6.3, 18.1 8.1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M18.4 4.4 C 18.5 6, 18.4 7.4, 18.2 8.9 C 16.6 8.5, 15.2 8.2, 13.7 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Motion: play or pause, two strokes each.
export const IconMotion = ({ paused }) => (
  <svg className="ink-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {paused ? (
      <path
        d="M8.5 5.5 C 12 8.6, 15 10.6, 18.5 12.2 C 15 13.8, 12 15.6, 8.5 18.6 C 8.2 14, 8.4 10, 8.5 5.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M8 5.8 C 8.4 10, 8.2 14, 8 18.2 M 15.6 5.6 C 16 10, 15.8 14, 15.6 18.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    )}
  </svg>
);

// Sound: a small bell of a speaker, waves when on, still when off.
export const IconSound = ({ on }) => (
  <svg className="ink-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M4.5 9.5 C 6 9.2, 7.5 9.6, 8.8 9.4 L 13 5.2 C 13.6 9, 13.4 15, 13 18.8 L 8.8 14.6 C 7.4 14.8, 6 14.6, 4.5 14.8 C 4.2 13, 4.4 11, 4.5 9.5 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinejoin="round"
    />
    {on ? (
      <>
        <path d="M16.2 9.2 C 17.6 10.8, 17.6 13.2, 16.2 14.8" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M18.8 6.8 C 21.4 9.6, 21.4 14.4, 18.8 17.2" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      </>
    ) : (
      <path d="M16.4 10 L 20.6 14.2 M 20.6 10 L 16.4 14.2" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    )}
  </svg>
);

// About: a hand-lettered i on a small ceramic tag.
export const IconAbout = ({ className = "" }) => (
  <svg className={`ink-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
    <path
      d="M12 11 C 12 14, 11.8 16.5, 12 18.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);

// Pin: keeps the controls from retiring.
export const IconPin = ({ pinned }) => (
  <svg className="ink-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {pinned ? (
      <path
        d="M13.8 3.4 C 15.8 6, 17.8 8, 20.6 10.2 C 17.4 11, 15.4 12, 13.4 13.4 C 12.8 15.4, 12.6 17.4, 12.8 19.6 C 10.8 17.6, 8.6 15.8, 6.6 14 C 8.6 13.4, 10.4 12.8, 12 11.8 C 12.8 9.2, 13.4 6.4, 13.8 3.4 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M13.8 3.4 C 15.8 6, 17.8 8, 20.6 10.2 C 17.4 11, 15.4 12, 13.4 13.4 C 12.8 15.4, 12.6 17.4, 12.8 19.6 C 10.8 17.6, 8.6 15.8, 6.6 14 C 8.6 13.4, 10.4 12.8, 12 11.8 C 12.8 9.2, 13.4 6.4, 13.8 3.4 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

// Along the alley: the next-stop arrow.
export const ArrowAlong = ({ className = "" }) => (
  <svg className={`ink-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M3.8 12.2 C 9 11.8, 14 12.4, 19.6 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <path
      d="M14 6.2 C 16.2 8.2, 18 9.8, 20.2 12 C 18 14.2, 16.2 15.8, 14.2 17.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Back up the alley.
export const ArrowBack = ({ className = "" }) => (
  <svg className={`ink-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M20 12.2 C 14 11.8, 9 12.4, 4 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <path
      d="M9.8 6.2 C 7.6 8.2, 5.8 9.8, 3.6 12 C 5.8 14.2, 7.6 15.8, 9.6 17.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
