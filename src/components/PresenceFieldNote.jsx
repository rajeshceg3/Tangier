import { AnimatePresence, motion as Motion } from 'framer-motion';

const getFieldNote = (zone) => {
  if (zone < 0.2) return 'Pause. Let the horizon settle before you descend.';
  if (zone < 0.45) return 'The slope carries sound before it carries thought.';
  if (zone < 0.7) return 'Hold still and the city reveals older layers.';
  if (zone < 0.9) return 'Listen for crossings hidden inside the wind.';
  return 'At the strait, silence becomes the final guide.';
};

export default function PresenceFieldNote({ lingerMs, zone }) {
  const shouldShow = lingerMs >= 3500;
  const note = getFieldNote(zone);

  return (
    <AnimatePresence>
      {shouldShow && (
        <Motion.div
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 0.85, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 px-4 py-2 text-center text-[11px] uppercase tracking-[0.25em] text-muted-indigo/80 pointer-events-none"
        >
          {note}
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
