import { useEffect } from 'react';
import { motion as Motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

export default function MedinaLayers() {
  const { scrollYProgress } = useScroll();

  // Mouse tracking for subtle parallax
  const mouseX = useMotionValue(0.5); // Center normalized 0-1
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 50, stiffness: 100, mass: 2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Lateral parallax transforms based on mouse (opposing movement)
  // Deeper layers move less.
  const x1 = useTransform(smoothMouseX, [0, 1], ['2%', '-2%']);
  const x2 = useTransform(smoothMouseX, [0, 1], ['5%', '-5%']);
  const x3 = useTransform(smoothMouseX, [0, 1], ['10%', '-10%']);

  const mY1 = useTransform(smoothMouseY, [0, 1], ['1%', '-1%']);
  const mY2 = useTransform(smoothMouseY, [0, 1], ['3%', '-3%']);
  const mY3 = useTransform(smoothMouseY, [0, 1], ['5%', '-5%']);


  // Parallax layers simulating descent through the city

  // Background (Far): Moves slowly up
  const y1 = useTransform(scrollYProgress, [0, 1], ['20%', '-10%']);
  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [0, 1]); // Fade in on arrival

  // Midground: Moves faster
  const y2 = useTransform(scrollYProgress, [0.1, 1], ['100%', '-50%']);

  // Foreground: Moves fastest (passing by)
  const y3 = useTransform(scrollYProgress, [0.3, 1], ['120%', '-100%']);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Distant Layer: Silhouette against the sky - Soft gradient */}
      <Motion.div
        style={{ y: y1, x: x1, opacity: opacity1 }}
        className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-sandstone-beige/40 to-transparent blur-2xl"
      >
        <Motion.div style={{ y: mY1 }} className="w-full h-full" />
      </Motion.div>

      {/* Mid Layer: Building blocks - Frosted glass effect */}
      <Motion.div
        style={{ y: y2, x: x2 }}
        className="absolute left-10 right-10 bottom-0 h-[40vh] bg-gradient-to-b from-chalk-white/95 to-chalk-white backdrop-blur-sm shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)] rounded-t-lg"
      >
          {/* Simple architectural suggestion - soft panels */}
          <Motion.div style={{ y: mY2 }} className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-32 bg-muted-indigo/5 rounded-sm blur-[2px]"></div>
            <div className="absolute top-20 right-20 w-32 h-40 bg-muted-indigo/5 rounded-sm blur-[2px]"></div>
          </Motion.div>
      </Motion.div>

      {/* Foreground Layer: Passing walls - Softer edges, less heavy */}
      <Motion.div
        style={{ y: y3, x: x3 }}
        className="absolute -left-10 bottom-0 w-1/3 h-[80vh] bg-chalk-white/90 backdrop-blur-md shadow-2xl skew-y-2 origin-bottom-left border-r border-white/50"
      >
        <Motion.div style={{ y: mY3 }} className="w-full h-full" />
      </Motion.div>
      <Motion.div
        style={{ y: y3, x: x3 }}
        className="absolute -right-10 bottom-0 w-1/4 h-[90vh] bg-chalk-white/90 backdrop-blur-md shadow-2xl -skew-y-1 origin-bottom-right border-l border-white/50"
      >
        <Motion.div style={{ y: mY3 }} className="w-full h-full" />
      </Motion.div>
    </div>
  );
}
