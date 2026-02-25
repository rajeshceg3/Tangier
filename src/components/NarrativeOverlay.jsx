import { useRef } from 'react';
import { motion as Motion, useInView } from 'framer-motion';
import { narrative } from '../data/narrative';

const NarrativeItem = ({ item, isScrolling }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10% 0px -10% 0px" }); // Trigger when near center

  const style = {
    top: `${item.position * 100}%`,
    left: item.alignment === 'left' ? '15%' : item.alignment === 'right' ? '65%' : '50%',
    transform: item.alignment === 'center' ? 'translateX(-50%)' : 'none',
    textAlign: item.alignment === 'center' ? 'center' : 'left',
  };

  const textClasses =
    item.type === 'faint' ? 'text-sm text-pale-atlantic-blue tracking-widest uppercase' :
    item.type === 'marginalia' ? 'text-xs text-muted-indigo italic border-l border-soft-dusk-amber pl-4' :
    item.type === 'heading' ? 'text-2xl text-muted-indigo font-light tracking-[0.2em] uppercase' :
    item.type === 'emphasis' ? 'text-xl text-muted-indigo font-normal leading-relaxed' :
    'text-lg text-muted-indigo font-light leading-relaxed'; // body

  // Target opacity based on type (removed opacity classes from textClasses to control here)
  const targetOpacity = item.type === 'faint' ? 0.6 :
                        item.type === 'marginalia' ? 0.7 :
                        item.type === 'emphasis' ? 1 : 1;

  // Only show if in view AND not scrolling (lingering)
  const show = isInView && !isScrolling;

  return (
    <Motion.div
      ref={ref}
      className={`absolute max-w-xs ${textClasses}`}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: show ? targetOpacity : 0, y: show ? 0 : 20 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {item.text}
    </Motion.div>
  );
};

export default function NarrativeOverlay({ isScrolling }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      {narrative.map(item => (
        <NarrativeItem key={item.id} item={item} isScrolling={isScrolling} />
      ))}
    </div>
  );
}
