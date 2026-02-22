import { motion as Motion, useScroll, useTransform } from 'framer-motion';

export default function MedinaLayers() {
  const { scrollYProgress } = useScroll();

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
      {/* Distant Layer: Silhouette against the sky */}
      <Motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-sandstone-beige to-transparent opacity-50"
      >
      </Motion.div>

      {/* Mid Layer: Building blocks */}
      <Motion.div
        style={{ y: y2 }}
        className="absolute left-10 right-10 bottom-0 h-[40vh] bg-chalk-white shadow-xl rounded-t-lg opacity-90"
      >
          {/* Simple architectural suggestion */}
          <div className="absolute top-10 left-10 w-20 h-32 bg-muted-indigo opacity-10 rounded-sm"></div>
          <div className="absolute top-20 right-20 w-32 h-40 bg-muted-indigo opacity-10 rounded-sm"></div>
      </Motion.div>

      {/* Foreground Layer: Passing walls */}
      <Motion.div
        style={{ y: y3 }}
        className="absolute -left-10 bottom-0 w-1/3 h-[80vh] bg-chalk-white shadow-2xl skew-y-3 origin-bottom-left"
      >
      </Motion.div>
      <Motion.div
        style={{ y: y3 }}
        className="absolute -right-10 bottom-0 w-1/4 h-[90vh] bg-chalk-white shadow-2xl -skew-y-2 origin-bottom-right"
      >
      </Motion.div>
    </div>
  );
}
