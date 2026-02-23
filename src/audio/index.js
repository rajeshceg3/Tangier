// src/audio/index.js
import { createWindNode } from './wind';
import { createSeaNode } from './sea';
import { playFerryHorn } from './horn';

export const setupAudio = (context) => {
  const wind = createWindNode(context);
  const sea = createSeaNode(context);

  // Expose controls
  return {
    wind: wind.node,
    sea: sea.node,
    playHorn: () => playFerryHorn(context),
    // Example control methods
    setWindVolume: (volume) => {
      wind.node.gain.setTargetAtTime(volume, context.currentTime, 0.1);
    },
    setSeaVolume: (volume) => {
      sea.node.gain.setTargetAtTime(volume, context.currentTime, 0.1);
    },
    modulateWind: (factor) => {
      // Modulate filter frequency based on scroll or other input
      // This is a placeholder for dynamic modulation
      wind.filter.frequency.setTargetAtTime(200 + factor * 600, context.currentTime, 0.1);
    }
  };
};
