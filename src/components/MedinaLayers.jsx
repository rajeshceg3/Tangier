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
  const y2 = useTransform(scrollYProgress, [0.1, 1], ['100%', '-50%']);
  const mouseX2 = useTransform(mouseX, [-1, 1], ['-5%', '5%']);
  const mouseY2 = useTransform(mouseY, [-1, 1], ['-5%', '5%']);
  const scale2 = useTransform(mouseX, [-1, 1], [0.95, 1.05]);

  // Foreground: Moves fastest (passing by)
  const y3 = useTransform(scrollYProgress, [0.3, 1], ['120%', '-100%']);
  const mouseX3 = useTransform(mouseX, [-1, 1], ['-10%', '10%']);
  const mouseY3 = useTransform(mouseY, [-1, 1], ['-10%', '10%']);

  const lingerDustOpacity = Math.min(lingerMs / 9000, 1) * 0.35;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Distant Layer: Silhouette against the sky - Soft gradient */}
      <Motion.div
        style={{ y: y1, x: mouseX1, translateY: mouseY1, opacity: opacity1, scale: scale1 }}
        className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-sandstone-beige/40 to-transparent blur-2xl"
      />

      {/* Mid Layer: Building blocks - Frosted glass effect */}
      <Motion.div
        style={{ y: y2, x: mouseX2, translateY: mouseY2, scale: scale2 }}
        className="absolute left-10 right-10 bottom-0 h-[40vh] bg-gradient-to-b from-chalk-white/95 to-chalk-white backdrop-blur-sm shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)] rounded-t-lg"
      >
          {/* Simple architectural suggestion - soft panels */}
          <div className="absolute top-10 left-10 w-20 h-32 bg-muted-indigo/5 rounded-sm blur-[2px]" />
          <div className="absolute top-20 right-20 w-32 h-40 bg-muted-indigo/5 rounded-sm blur-[2px]" />
      </Motion.div>

      {/* Foreground Layer: Passing walls - Softer edges, less heavy */}
      <Motion.div
        style={{ y: y3, x: mouseX3, translateY: mouseY3 }}
        className="absolute -left-10 bottom-0 w-1/3 h-[80vh] bg-gradient-to-r from-chalk-white to-chalk-white/90 backdrop-blur-md shadow-2xl skew-y-2 origin-bottom-left border-r border-white/50"
      />
      <Motion.div
        style={{ y: y3, x: mouseX3, translateY: mouseY3 }}
        className="absolute -right-10 bottom-0 w-1/4 h-[90vh] bg-gradient-to-l from-chalk-white to-chalk-white/90 backdrop-blur-md shadow-2xl -skew-y-1 origin-bottom-right border-l border-white/50"
      />

      {/* Subtle atmospheric texture emerges when lingering in place */}
      <Motion.div
        className="absolute inset-0"
        animate={{ opacity: lingerDustOpacity }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{
          backgroundImage:
            'radial-gradient(rgba(59,77,97,0.08) 0.5px, transparent 0.5px), radial-gradient(rgba(220,191,166,0.07) 0.5px, transparent 0.5px)',
          backgroundPosition: '0 0, 12px 12px',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
