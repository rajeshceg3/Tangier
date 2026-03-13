import { motion as Motion, useScroll, useTransform } from 'framer-motion';

export default function Horizon({ mouseX, mouseY }) {
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

  // Parallax for the horizon
  const rotateZ = useTransform(mouseX, [-1, 1], [-2, 2]); // Tilty horizon
  const x = useTransform(mouseX, [-1, 1], ['-2%', '2%']); // Pan horizontally
  const y = useTransform(mouseY, [-1, 1], ['-2%', '2%']); // Shift slightly vertically

  return (
    <Motion.div
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: skyColor }}
    >
      {/* Invisible Horizon Line that tilts and pans */}
      <Motion.div
        className="absolute top-1/2 left-[-10%] right-[-10%] h-[200vh] bg-gradient-to-b from-transparent to-white/20 origin-top pointer-events-none"
        style={{
          rotate: rotateZ,
          x: x,
          y: y
        }}
      />

      {/* Distant Sea Line */}
      <Motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-pale-atlantic-blue opacity-50 blur-sm pointer-events-none"
        style={{ opacity: seaOpacity }}
      />
    </Motion.div>
  );
}
