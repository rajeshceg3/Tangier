import { motion as Motion, useScroll, useTransform } from 'framer-motion';

const STAR_PATHS = [
  'M18 24L36 15L54 24L45 38L27 38Z',
  'M88 42L103 35L118 42L111 54L95 54Z',
  'M142 20L156 13L170 20L164 31L148 31Z',
  'M214 46L229 39L244 46L238 58L220 58Z',
  'M286 28L301 20L316 28L309 40L293 40Z',
  'M354 50L367 43L380 50L375 60L359 60Z'
];

const RIDGE_PATHS = [
  'M0 125C65 92 122 150 196 118C274 84 332 138 420 110V190H0Z',
  'M0 138C58 111 118 157 197 131C279 102 341 151 420 126V190H0Z',
  'M0 152C73 126 130 168 210 143C288 119 347 163 420 141V190H0Z'
];

export default function Horizon({ mouseX, mouseY, lingerMs }) {
  const { scrollYProgress } = useScroll();

  const skyColor = useTransform(scrollYProgress, [0, 0.45, 1], ['#fffaf0', '#f3b56e', '#4f8fd2']);
  const skySaturation = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.1, 1.25]);
  const hazeOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.65, 0.35, 0.2]);
  const seaOpacity = useTransform(scrollYProgress, [0.62, 1], [0, 0.95]);
  const seaShift = useTransform(scrollYProgress, [0, 1], ['16%', '0%']);
  const celestialOpacity = useTransform(scrollYProgress, [0, 0.28, 1], [0.85, 0.45, 0.08]);

  const rotateZ = useTransform(mouseX, [-1, 1], [-2.8, 2.8]);
  const x = useTransform(mouseX, [-1, 1], ['-2.5%', '2.5%']);
  const y = useTransform(mouseY, [-1, 1], ['-2%', '2%']);

  const shimmerTravel = useTransform(scrollYProgress, [0, 1], ['-8%', '10%']);
  const ridgeParallax = useTransform(scrollYProgress, [0, 1], ['-2%', '4%']);

  const lingerStrength = Math.min(lingerMs / 9000, 1);
  const glowOpacity = 0.2 + lingerStrength * 0.45;
  const gridOpacity = 0.05 + lingerStrength * 0.14;

  return (
    <Motion.div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: skyColor }}>
      {/* Dynamic sky texture: soft grain + aurora-style light sweeps */}
      <Motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 420 220"
        preserveAspectRatio="none"
        style={{ opacity: hazeOpacity, filter: skySaturation.to((v) => `saturate(${v})`) }}
      >
        <defs>
          <radialGradient id="dawn-bloom" cx="52%" cy="38%" r="58%">
            <stop offset="0%" stopColor="rgba(255,236,205,0.9)" />
            <stop offset="40%" stopColor="rgba(255,178,102,0.42)" />
            <stop offset="100%" stopColor="rgba(76,138,206,0.08)" />
          </radialGradient>
          <linearGradient id="solar-sweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,246,214,0)" />
            <stop offset="45%" stopColor="rgba(255,223,166,0.35)" />
            <stop offset="100%" stopColor="rgba(138,191,246,0)" />
          </linearGradient>
          <filter id="grain-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.12" />
            </feComponentTransfer>
          </filter>
        </defs>
        <rect width="420" height="220" fill="url(#dawn-bloom)" />
        <Motion.rect
          x="-70"
          y="-60"
          width="520"
          height="170"
          fill="url(#solar-sweep)"
          style={{ x: shimmerTravel }}
          animate={{ rotate: [0, 2.5, -1.5, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <rect width="420" height="220" filter="url(#grain-filter)" opacity="0.75" />
      </Motion.svg>

      {/* Celestial geometry to amplify the SVG backdrop in upper scroll sections */}
      <Motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 420 220"
        preserveAspectRatio="none"
        style={{ opacity: celestialOpacity }}
      >
        <defs>
          <linearGradient id="star-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="rgba(255,203,132,0.16)" />
          </linearGradient>
        </defs>
        {STAR_PATHS.map((path, index) => (
          <Motion.path
            key={path}
            d={path}
            fill="url(#star-fill)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.5"
            animate={{ opacity: [0.25, 0.65, 0.25], y: [0, -1.2, 0] }}
            transition={{ duration: 3.5 + index * 0.55, delay: index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </Motion.svg>

      {/* Perspective guidance grid: gives the SVG background depth while staying subtle */}
      <Motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 420 220"
        preserveAspectRatio="none"
        style={{ opacity: gridOpacity }}
      >
        {[...Array(9)].map((_, idx) => (
          <line
            key={`h-${idx}`}
            x1="0"
            y1={130 + idx * 11}
            x2="420"
            y2={130 + idx * 11}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="0.55"
          />
        ))}
        {[...Array(11)].map((_, idx) => (
          <line
            key={`v-${idx}`}
            x1={idx * 42}
            y1="130"
            x2={210 + (idx - 5) * 14}
            y2="220"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.5"
          />
        ))}
      </Motion.svg>

      {/* Tilted horizon with extra depth */}
      <Motion.div
        className="absolute top-[44%] left-[-10%] right-[-10%] h-[210vh] bg-gradient-to-b from-transparent via-white/20 to-white/45 origin-top pointer-events-none"
        style={{ rotate: rotateZ, x, y }}
      />

      {/* Layered mountain silhouettes rendered as SVG for stronger atmosphere */}
      <Motion.svg
        className="absolute bottom-[19%] left-[-4%] w-[108%] h-[38%] pointer-events-none"
        viewBox="0 0 420 190"
        preserveAspectRatio="none"
        style={{ x: ridgeParallax }}
      >
        <defs>
          <linearGradient id="ridge-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(75,94,140,0.28)" />
            <stop offset="100%" stopColor="rgba(52,66,105,0.58)" />
          </linearGradient>
          <linearGradient id="ridge-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(60,80,124,0.36)" />
            <stop offset="100%" stopColor="rgba(40,52,87,0.64)" />
          </linearGradient>
          <linearGradient id="ridge-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(49,70,112,0.44)" />
            <stop offset="100%" stopColor="rgba(28,39,67,0.7)" />
          </linearGradient>
        </defs>
        <path d={RIDGE_PATHS[0]} fill="url(#ridge-back)" />
        <path d={RIDGE_PATHS[1]} fill="url(#ridge-mid)" />
        <path d={RIDGE_PATHS[2]} fill="url(#ridge-front)" />
      </Motion.svg>

      {/* Linger glow intensifies if the viewer pauses */}
      <Motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: glowOpacity }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ background: 'radial-gradient(circle at 50% 41%, rgba(255,166,86,0.45), rgba(255,195,130,0.16) 38%, transparent 70%)' }}
      />

      {/* Sea body with reflective stripes */}
      <Motion.div
        className="absolute bottom-0 left-0 right-0 h-[39%] pointer-events-none"
        style={{ opacity: seaOpacity, y: seaShift }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#8cc8ef]/55 via-[#4f9dd3]/70 to-[#1f568a]/82" />
        <Motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sea-glint" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.28)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          {[...Array(6)].map((_, idx) => (
            <Motion.rect
              key={`wave-${idx}`}
              x="-100"
              y={10 + idx * 18}
              width="640"
              height="3"
              fill="url(#sea-glint)"
              animate={{ x: ['-120', '-10', '-120'] }}
              transition={{ duration: 10 + idx * 1.2, delay: idx * 0.35, repeat: Infinity, ease: 'linear' }}
              opacity={0.22 + idx * 0.06}
            />
          ))}
        </Motion.svg>
      </Motion.div>
    </Motion.div>
  );
}
