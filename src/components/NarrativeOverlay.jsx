import { useRef, useState } from 'react';
import { motion as Motion, useInView, AnimatePresence } from 'framer-motion';
import { narrative } from '../data/narrative';

const NarrativeItem = ({ item, isScrolling }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10% 0px -10% 0px" }); // Trigger when near center
  const [isHovered, setIsHovered] = useState(false);

  const style = {
    top: `${item.position * 100}%`,
    left: item.alignment === 'left' ? '15%' : item.alignment === 'right' ? '65%' : '50%',
    transform: item.alignment === 'center' ? 'translateX(-50%)' : 'none',
    textAlign: item.alignment === 'center' ? 'center' : 'left',
  };

  const hasAnnotation = !!item.annotation;

  const baseClasses =
    item.type === 'faint' ? 'text-sm text-pale-atlantic-blue tracking-widest uppercase' :
    item.type === 'marginalia' ? 'text-xs text-muted-indigo italic border-l border-soft-dusk-amber pl-4' :
    item.type === 'heading' ? 'text-2xl text-muted-indigo font-light tracking-[0.2em] uppercase' :
    item.type === 'emphasis' ? 'text-xl text-muted-indigo font-normal leading-relaxed' :
    'text-lg text-muted-indigo font-light leading-relaxed'; // body

  // Target opacity based on type (removed opacity classes from baseClasses to control here)
  const targetOpacity = item.type === 'faint' ? 0.6 :
                        item.type === 'marginalia' ? 0.7 :
                        item.type === 'emphasis' ? 1 : 1;

  // Only show if in view AND not scrolling (lingering)
  const show = isInView && !isScrolling;

  return (
    <Motion.div
      ref={ref}
      className={`absolute max-w-xs ${hasAnnotation ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'}`}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: show ? targetOpacity : 0, y: show ? 0 : 20 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      onMouseEnter={() => hasAnnotation && setIsHovered(true)}
      onMouseLeave={() => hasAnnotation && setIsHovered(false)}
    >
      <div className={`relative ${baseClasses}`}>
        {hasAnnotation ? (
          <span className="relative inline-block group">
            <span className="relative z-10 transition-colors duration-500 group-hover:text-muted-indigo">
              {item.text}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-soft-dusk-amber/50 opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
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
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-0 mt-3 p-3 text-xs italic font-light leading-relaxed text-muted-indigo bg-chalk-white/80 backdrop-blur-md rounded-sm border border-sandstone-beige/50 shadow-sm z-20 w-48 pointer-events-none"
            >
              {item.annotation}
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </Motion.div>
  );
};

export default function NarrativeOverlay({ isScrolling }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" style={{ pointerEvents: 'none' }}>
      {/* We set pointerEvents: 'none' on the container, but allow 'auto' on specific interactive items */}
      {narrative.map(item => (
        <NarrativeItem key={item.id} item={item} isScrolling={isScrolling} />
      ))}
    </div>
  );
}
