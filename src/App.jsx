import { useEffect, useState, useRef } from 'react';
import { useScroll, AnimatePresence, motion as Motion } from 'framer-motion';
import Horizon from './components/Horizon';
import MedinaLayers from './components/MedinaLayers';
import NarrativeOverlay from './components/NarrativeOverlay';
import { setupAudio } from './audio';

const LIGHT_GATHERING_DURATION_MS = 2000;
const LINGER_TIMEOUT_MS = 300;
const OVERLAY_FADE_DURATION_S = 2.5;

export default function App() {
  const [audioControls, setAudioControls] = useState(null);
  const { scrollY, scrollYProgress } = useScroll();
  const lastStepY = useRef(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial "Light Gathering" loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LIGHT_GATHERING_DURATION_MS); // 2 seconds of "gathering light"
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleInteraction = async () => {
      if (audioControls) return;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      await context.resume();

      const controls = setupAudio(context);
      setAudioControls(controls);

      // Start wind softly
      controls.setWindVolume(0.05);

      // Remove listener
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [audioControls]);

  useEffect(() => {
    if (!audioControls) return;

    const unsubscribeProgress = scrollYProgress.on("change", (latest) => {
      // Wind: Strongest at top (0) and bottom (1), quieter in Medina (0.3-0.7)
      // Modulation: 0.05 min to 0.2 max
      const windIntensity = 0.05 + (Math.abs(latest - 0.5) * 0.15);
      audioControls.setWindVolume(windIntensity);

      // Sea: Silent at top, grows as we descend (starts at 0.5, max at 1.0)
      const seaVol = latest > 0.5 ? (latest - 0.5) * 0.4 : 0;
      audioControls.setSeaVolume(seaVol);

      // Modulate wind filter based on openness (top and bottom are open)
      // 0 -> Open (1.0), 0.5 -> Closed (0.0), 1 -> Open (1.0)
      const openness = Math.abs(latest - 0.5) * 2;
      audioControls.modulateWind(openness);

      // Occasional Horn at the Strait (near bottom)
      if (latest > 0.8 && Math.random() > 0.995) {
         audioControls.playHorn();
      }
    });

    const unsubscribeScroll = scrollY.on("change", (latestY) => {
      // Handle isScrolling state
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, LINGER_TIMEOUT_MS); // 300ms pause to consider "lingering"

      const dist = Math.abs(latestY - lastStepY.current);
      // Trigger step every ~150px
      if (dist > 150) {
        const progress = scrollYProgress.get();
        // Footsteps only in the Medina (roughly 15% to 85%)
        if (progress > 0.15 && progress < 0.85) {
          const vol = 0.2 + Math.random() * 0.3;
          audioControls.triggerFootstep(vol);
          lastStepY.current = latestY;
        }
      }
    });

    return () => {
      unsubscribeProgress();
      unsubscribeScroll();
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [audioControls, scrollY, scrollYProgress]);

  return (
    <div className="relative w-full h-[800vh] bg-chalk-white overflow-hidden">
      <Horizon />
      <MedinaLayers />
      <NarrativeOverlay isScrolling={isScrolling} />

      {/* Invisible overlay for texture/tint */}
      <div className="fixed inset-0 z-50 pointer-events-none bg-black/5 mix-blend-overlay"></div>

      {/* Light Gathering Overlay */}
      <AnimatePresence>
        {isLoading && (
          <Motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: OVERLAY_FADE_DURATION_S, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-chalk-white pointer-events-none" // Using chalk-white equivalent
          />
        )}
      </AnimatePresence>
    </div>
  );
}
