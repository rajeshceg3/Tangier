import { motion as Motion } from 'framer-motion';
import { narrative } from '../data/narrative';

const NarrativeItem = ({ item }) => {
  const style = {
    top: `${item.position * 100}%`,
    left: item.alignment === 'left' ? '15%' : item.alignment === 'right' ? '65%' : '50%',
    transform: item.alignment === 'center' ? 'translateX(-50%)' : 'none',
    textAlign: item.alignment === 'center' ? 'center' : 'left',
  };

  const textClasses =
    item.type === 'faint' ? 'text-sm text-pale-atlantic-blue tracking-widest uppercase opacity-60' :
    item.type === 'marginalia' ? 'text-xs text-muted-indigo italic opacity-70 border-l border-soft-dusk-amber pl-4' :
    item.type === 'heading' ? 'text-2xl text-muted-indigo font-light tracking-[0.2em] uppercase' :
    'text-lg text-muted-indigo font-light leading-relaxed'; // body

  return (
    <Motion.div
      className={`absolute max-w-xs ${textClasses}`}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-10% 0px -10% 0px" }} // Trigger when near center
      transition={{ duration: 2.0, ease: "easeOut" }}
    >
      {item.text}
    </Motion.div>
  );
};

export default function NarrativeOverlay() {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      {narrative.map(item => (
        <NarrativeItem key={item.id} item={item} />
      ))}
    </div>
  );
}
