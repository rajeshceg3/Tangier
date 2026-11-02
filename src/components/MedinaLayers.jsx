import { motion as Motion, useScroll, useTransform } from 'framer-motion';

export default function MedinaLayers({ mouseX, mouseY, lingerMs }) {
  const { scrollYProgress } = useScroll();

  // Parallax layers simulating descent through the city

  // Background (Far): Moves slowly up
  const y1 = useTransform(scrollYProgress, [0, 1], ['20%', '-10%']);
  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [0, 1]); // Fade in on arrival
  const mouseX1 = useTransform(mouseX, [-1, 1], ['-2%', '2%']);
  const mouseY1 = useTransform(mouseY, [-1, 1], ['-2%', '2%']);
  const scale1 = useTransform(mouseX, [-1, 1], [0.98, 1.02]);

  // Midground: Moves faster
  // The city must finish passing before the strait: exit fully by ~0.85
  const y2 = useTransform(scrollYProgress, [0.1, 0.85, 1], ['100%', '-350%', '-350%']);
  const mouseX2 = useTransform(mouseX, [-1, 1], ['-5%', '5%']);
  const mouseY2 = useTransform(mouseY, [-1, 1], ['-5%', '5%']);
  const scale2 = useTransform(mouseX, [-1, 1], [0.95, 1.05]);

  // Foreground: Moves fastest (passing by)
  const y3 = useTransform(scrollYProgress, [0.3, 0.85, 1], ['120%', '-190%', '-190%']);
  const mouseX3 = useTransform(mouseX, [-1, 1], ['-10%', '10%']);
  const mouseY3 = useTransform(mouseY, [-1, 1], ['-10%', '10%']);

  const lingerDustOpacity = Math.min(lingerMs / 9000, 1) * 0.35;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Distant Layer: Kasbah walls and a minaret, held in haze */}
      <Motion.div
        style={{ y: y1, x: mouseX1, translateY: mouseY1, opacity: opacity1, scale: scale1 }}
        className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-sandstone-beige/55 to-transparent blur-2xl"
      >
        <svg className="absolute bottom-[30%] left-[10%] w-[46%] h-[34%]" viewBox="0 0 220 100" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
          <g fill="rgba(30,54,81,0.4)">
            <rect x="0" y="62" width="220" height="38" />
            <rect x="18" y="48" width="34" height="14" />
            <rect x="62" y="54" width="28" height="8" />
            <rect x="104" y="44" width="40" height="18" />
            <rect x="168" y="18" width="13" height="44" />
            <rect x="164" y="10" width="21" height="9" rx="2" />
            <rect x="172" y="4" width="5" height="7" />
          </g>
        </svg>
      </Motion.div>

      {/* Mid Layer: Whitewashed walls with arched openings - the Medina reads as itself */}
      <Motion.div
        style={{ y: y2, x: mouseX2, translateY: mouseY2, scale: scale2 }}
        className="absolute left-10 right-10 bottom-0 h-[40vh] bg-gradient-to-b from-chalk-white/95 to-chalk-white backdrop-blur-sm shadow-[0_-20px_60px_-15px_rgba(30,54,81,0.15)] rounded-t-lg"
      >
          <div className="absolute top-8 left-[12%] w-9 h-14 bg-muted-indigo/15 rounded-t-full" />
          <div className="absolute top-14 left-[30%] w-7 h-11 bg-muted-indigo/10 rounded-t-full" />
          <div className="absolute top-10 right-[18%] w-10 h-16 bg-muted-indigo/15 rounded-t-full" />
          <div className="absolute top-24 right-[40%] w-6 h-10 bg-muted-indigo/10 rounded-t-full" />
          <div className="absolute bottom-0 left-[46%] w-12 h-24 bg-muted-indigo/15 rounded-t-full" />
      </Motion.div>

      {/* Foreground Layer: Passing walls - Softer edges, less heavy */}
      <Motion.div
        style={{ y: y3, x: mouseX3, translateY: mouseY3 }}
        className="absolute -left-10 bottom-0 w-1/3 h-[80vh] bg-gradient-to-r from-chalk-white to-chalk-white/90 backdrop-blur-md shadow-2xl skew-y-2 origin-bottom-left border-r border-white/50"
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-32 bg-muted-indigo/10 rounded-t-full" />
        <div className="absolute bottom-40 left-[30%] w-8 h-12 bg-muted-indigo/10 rounded-t-full" />
      </Motion.div>
      <Motion.div
        style={{ y: y3, x: mouseX3, translateY: mouseY3 }}
        className="absolute -right-10 bottom-0 w-1/4 h-[90vh] bg-gradient-to-l from-chalk-white to-chalk-white/90 backdrop-blur-md shadow-2xl -skew-y-1 origin-bottom-right border-l border-white/50"
      >
        <div className="absolute bottom-0 left-[30%] w-12 h-28 bg-muted-indigo/10 rounded-t-full" />
      </Motion.div>

      {/* Subtle atmospheric texture emerges when lingering in place */}
      <Motion.div
        className="absolute inset-0"
        animate={{ opacity: lingerDustOpacity }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{
          backgroundImage:
            'radial-gradient(rgba(30,54,81,0.1) 0.5px, transparent 0.5px), radial-gradient(rgba(255,159,67,0.1) 0.5px, transparent 0.5px)',
          backgroundPosition: '0 0, 12px 12px',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
