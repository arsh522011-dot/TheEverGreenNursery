import React, { useEffect, useState, useRef } from 'react';
import { Sprout, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PageLoaderProps {
  nurseryName?: string;
  onComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ nurseryName = 'The Evergreen Nursery', onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'seed' | 'sprout' | 'bloom'>('seed');
  const [isHiding, setIsHiding] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const displayName = nurseryName || 'The Evergreen Nursery';

  useEffect(() => {
    let isMounted = true;
    let finishTriggered = false;

    const triggerFinish = () => {
      if (finishTriggered) return;
      finishTriggered = true;
      if (isMounted) {
        setIsHiding(true);
        setTimeout(() => {
          if (isMounted) {
            onCompleteRef.current();
          }
        }, 400);
      }
    };

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          triggerFinish();
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 14) + 8;
        if (next > 30 && next <= 75) setStage('sprout');
        if (next > 75) setStage('bloom');
        if (next >= 100) {
          clearInterval(timer);
          triggerFinish();
          return 100;
        }
        return next;
      });
    }, 60);

    // Hard fallback safety timer (maximum 1.2s) so mobile refresh never stalls
    const maxSafetyTimer = setTimeout(() => {
      if (!finishTriggered) {
        clearInterval(timer);
        setProgress(100);
        setStage('bloom');
        triggerFinish();
      }
    }, 1200);

    return () => {
      isMounted = false;
      clearInterval(timer);
      clearTimeout(maxSafetyTimer);
    };
  }, []);

  // Container motion variant for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.045,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 120,
      },
    },
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#062319] text-white transition-all duration-700 ease-in-out will-change-transform select-none ${
        isHiding ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute w-[550px] h-[550px] bg-emerald-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Animated Botanical Emblem */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative mb-6 flex items-center justify-center"
      >
        <div className="relative z-10 p-5 sm:p-6 rounded-full bg-emerald-950/90 border border-emerald-500/40 shadow-2xl shadow-emerald-950/80">
          <Sprout
            className={`w-14 h-14 sm:w-16 sm:h-16 text-emerald-400 transition-all duration-500 ${
              stage === 'seed'
                ? 'scale-85 opacity-80'
                : stage === 'sprout'
                ? 'scale-100 -rotate-3 text-emerald-400'
                : 'scale-110 text-emerald-300 drop-shadow-[0_0_22px_rgba(52,211,153,0.9)]'
            }`}
          />
        </div>
        <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping opacity-30" />
      </motion.div>

      {/* High Quality Animated Title */}
      <div className="text-center mb-7 px-4 max-w-xl space-y-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-x-1.5 sm:gap-x-2 py-1"
        >
          {displayName.split(' ').map((word, wordIdx) => (
            <span key={wordIdx} className="inline-flex overflow-hidden py-1">
              {Array.from(word).map((char, charIdx) => (
                <motion.span
                  key={charIdx}
                  variants={letterVariants}
                  className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wider uppercase inline-block bg-gradient-to-b from-[#ffffff] via-[#ecfdf5] to-[#a7f3d0] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(16,185,129,0.35)]"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}

          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: displayName.length * 0.045 + 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block ml-1"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
          </motion.div>
        </motion.div>

        {/* Subtitle Stage Animated Text */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.35 }}
              className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-emerald-300/90 font-mono font-medium"
            >
              {stage === 'seed' && '✦ Nurturing Soil & Seeds...'}
              {stage === 'sprout' && '✦ Cultivating Living Collections...'}
              {stage === 'bloom' && `✦ Welcome to ${displayName}...`}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar & Percentage */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-64 sm:w-80 space-y-2.5 px-4"
      >
        <div className="h-2 w-full bg-emerald-950 rounded-full overflow-hidden border border-emerald-800/50 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-green-300 transition-all duration-200 ease-out rounded-full shadow-[0_0_14px_rgba(52,211,153,0.9)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-emerald-300/90 font-mono tracking-wider font-semibold">
          <span>BOTANICAL SANCTUARY</span>
          <span>{progress}%</span>
        </div>
      </motion.div>
    </div>
  );
};
