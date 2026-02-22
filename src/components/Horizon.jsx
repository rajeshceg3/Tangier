import { motion as Motion, useScroll, useTransform } from 'framer-motion';

export default function Horizon() {
  const { scrollYProgress } = useScroll();

  // Sky color transition from pale (dawn/haze) to blue (midday/strait)
  const skyColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#fdfbf7', '#dcbfa6', '#aabbc3'] // chalk -> amber -> blue
  );

  // Sea level rise (or just presence)
  const seaOpacity = useTransform(
    scrollYProgress,
    [0.7, 1],
    [0, 1]
  );

  return (
    <Motion.div
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: skyColor }}
    >
      {/* Distant Sea Line */}
      <Motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-pale-atlantic-blue opacity-50 blur-sm"
        style={{ opacity: seaOpacity }}
      />
    </Motion.div>
  );
}
