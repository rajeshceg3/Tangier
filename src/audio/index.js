// src/audio/index.js
import { createWindNode } from './wind';
import { createSeaNode } from './sea';
import { playFerryHorn } from './horn';
import { playFootstep } from './footsteps';
import { playGullCry } from './gulls';
import { playCallToPrayer } from './prayer';

export const setupAudio = (context) => {
  const wind = createWindNode(context);
  const sea = createSeaNode(context);

  // Expose controls
  return {
    wind: wind.node,
    sea: sea.node,
    playHorn: () => playFerryHorn(context),
    playGull: (volume) => playGullCry(context, volume),
    triggerFootstep: (volume) => playFootstep(context, volume),
    playPrayer: (volume) => playCallToPrayer(context, volume),
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
