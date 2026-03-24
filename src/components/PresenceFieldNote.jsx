import { AnimatePresence, motion as Motion } from 'framer-motion';

const ABSOLUTE_DELIGHT_CONDITIONS = [
  'Instant clarity: the world answers immediately when you arrive.',
  'Effortless agency: every gesture yields a graceful response.',
  'Growing reward: stillness and curiosity reveal richer layers.',
  'Emotional safety: no abrupt shocks, no clutter, no dead ends.'
];

const getFieldNote = (zone) => {
  if (zone < 0.2) return 'Pause. Let the horizon settle before you descend.';
  if (zone < 0.45) return 'The slope carries sound before it carries thought.';
  if (zone < 0.7) return 'Hold still and the city reveals older layers.';
  if (zone < 0.9) return 'Listen for crossings hidden inside the wind.';
  return 'At the strait, silence becomes the final guide.';
};

const getAbsoluteYesCue = (inactiveMs, hasInteracted) => {
  if (!hasInteracted && inactiveMs > 2600) {
    return 'Move gently: the horizon listens before it speaks.';
  }
  if (inactiveMs > 4200) {
    return ABSOLUTE_DELIGHT_CONDITIONS[2];
  }
  return null;
};

export default function PresenceFieldNote({ lingerMs, zone, hasInteracted, inactiveMs }) {
  const shouldShow = lingerMs >= 3500;
  const note = getFieldNote(zone);
  const delightCue = getAbsoluteYesCue(inactiveMs, hasInteracted);

  return (
    <AnimatePresence>
      {(shouldShow || delightCue) && (
        <Motion.div
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 px-4 py-2 text-center text-[11px] uppercase tracking-[0.22em] text-[#0f2940] bg-chalk-white/75 border border-[#1e3651]/20 rounded-sm shadow-sm pointer-events-none"
        >
          {delightCue || note}
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
