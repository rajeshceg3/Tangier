import { useRef, useState } from 'react';
import { motion as Motion, useInView, AnimatePresence } from 'framer-motion';
import { narrative } from '../data/narrative';

const NarrativeItem = ({ item, isScrolling, lingerMs, onHoverChange }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-10% 0px -10% 0px' }); // Trigger when near center
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (hasAnnotation) {
      setIsHovered(true);
      if (onHoverChange) onHoverChange(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasAnnotation) {
      setIsHovered(false);
      if (onHoverChange) onHoverChange(false);
    }
  };
  const handleFocus = handleMouseEnter;
  const handleBlur = handleMouseLeave;

  // Phones get the full measure of the line; the desktop keeps its
  // left/right composition. Alignment lives in classes so it can respond.
  const alignClasses =
    item.alignment === 'left' ? 'left-[8%] w-[84%] md:left-[15%] md:w-auto md:max-w-xs' :
    item.alignment === 'right' ? 'left-[8%] w-[84%] md:left-[65%] md:w-auto md:max-w-xs' :
    // Centered by margin, not transform: framer-motion owns the inline transform.
    'left-0 right-0 mx-auto w-[84%] md:w-fit md:max-w-xs';

  const style = {
    top: `${item.position * 100}%`,
    textAlign: item.alignment === 'center' ? 'center' : 'left',
    // A breath of paper behind the ink, so the poem reads over water or sky.
    textShadow: '0 0 16px rgba(255,252,244,0.9), 0 0 4px rgba(255,252,244,0.95)',
  };

  const hasAnnotation = !!item.annotation;

  const baseClasses =
    item.type === 'faint' ? 'text-sm text-[#123a5c] tracking-widest uppercase font-medium' :
    item.type === 'marginalia' ? 'text-xs text-muted-indigo italic border-l-2 border-soft-dusk-amber pl-4' :
    item.type === 'heading' ? 'text-2xl text-muted-indigo font-medium tracking-[0.2em] uppercase' :
    item.type === 'emphasis' ? 'text-xl text-muted-indigo font-semibold leading-relaxed' :
    'text-lg text-muted-indigo font-normal leading-relaxed'; // body

  // Target opacity based on type (removed opacity classes from baseClasses to control here)
  const targetOpacity = item.type === 'faint' ? 0.6 :
                        item.type === 'marginalia' ? 0.7 :
                        item.type === 'emphasis' ? 1 : 1;

  const lingerBoost = Math.min(lingerMs / 9000, 1) * 0.12;

  // Only show if in view AND not scrolling (lingering)
  const show = isInView && !isScrolling;

  return (
    <Motion.div
      ref={ref}
      className={`absolute ${alignClasses} ${hasAnnotation ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'}`}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: show ? Math.min(targetOpacity + lingerBoost, 1) : 0, y: show ? 0 : 20 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`relative ${baseClasses}`}>
        {hasAnnotation ? (
          <span
            className="relative inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-dusk-amber/60 rounded-[2px]"
            role="button"
            tabIndex={0}
            aria-label={`${item.text} — reveal historical annotation`}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-[#0f2940] border-b-2 border-soft-dusk-amber/70 animate-pulse group-hover:animate-none group-hover:border-soft-dusk-amber">
              {item.text}
            </span>
            <Motion.span
              animate={{ opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-0 left-0 w-full h-[1px] bg-soft-dusk-amber/80 group-hover:opacity-100 transition-opacity duration-500"
            />
          </span>
        ) : (
          item.text
        )}

        <AnimatePresence>
          {isHovered && hasAnnotation && (
            <Motion.div
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 5, filter: 'blur(2px)' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute left-0 mt-3 p-3 text-xs italic font-normal leading-relaxed text-muted-indigo bg-chalk-white/95 backdrop-blur-md rounded-sm border border-sandstone-beige/80 shadow-sm z-20 w-48 pointer-events-none"
            >
              {item.annotation}
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </Motion.div>
  );
};

export default function NarrativeOverlay({ isScrolling, lingerMs }) {
  const [isAnyHovered, setIsAnyHovered] = useState(false);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" style={{ pointerEvents: 'none' }}>
      <AnimatePresence>
        {isAnyHovered && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 bg-chalk-white/20 backdrop-blur-[2px] pointer-events-none"
          />
        )}
      </AnimatePresence>
      {/* We set pointerEvents: 'none' on the container, but allow 'auto' on specific interactive items */}
      {narrative.map(item => (
        <NarrativeItem
          key={item.id}
          item={item}
          isScrolling={isScrolling}
          lingerMs={lingerMs}
          onHoverChange={setIsAnyHovered}
        />
      ))}
    </div>
  );
}
