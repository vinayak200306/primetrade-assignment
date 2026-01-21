import { motion } from 'framer-motion';

const AmbientBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-slate-300/30 blur-3xl"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full bg-indigo-300/20 blur-3xl"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default AmbientBackground;
