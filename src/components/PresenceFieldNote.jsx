import { AnimatePresence, motion as Motion } from 'framer-motion';

const getFieldNote = (zone) => {
  if (zone < 0.2) return 'Pause. Let the horizon settle before you descend.';
  if (zone < 0.45) return 'The slope carries sound before it carries thought.';
  if (zone < 0.7) return 'Hold still and the city reveals older layers.';
  if (zone < 0.9) return 'Listen for crossings hidden inside the wind.';
  return 'At the strait, silence becomes the final guide.';
};

export default function PresenceFieldNote({ lingerMs, zone }) {
  // Quiet by default: the note is earned by long stillness, carries no
  // chrome, and reads as a caption to the scene rather than an instruction.
  const shouldShow = lingerMs >= 8000;
  const note = getFieldNote(zone);

  return (
    <AnimatePresence>
      {shouldShow && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 mx-auto w-fit max-w-[86vw] z-40 text-center font-display italic font-light text-sm md:text-base text-[#12355a] pointer-events-none"

        >
          {note}
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
