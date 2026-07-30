// File: /app/components/CelebrationOverlay.tsx v1.6.0
'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { PartyPopper, Sparkles } from 'lucide-react';

interface CelebrationOverlayProps {
  show: boolean;
  title: string;
  subtitle: string;
}

// A brief, tasteful "your book is ready" moment. Uses Lucide icons + amber
// sparkles (no emoji), never blocks interaction (pointer-events-none), and
// fully respects prefers-reduced-motion.
const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ show, title, subtitle }) => {
  const reduce = useReducedMotion();
  const sparkPositions = [
    { left: '18%', top: '12%' },
    { left: '82%', top: '18%' },
    { left: '30%', top: '82%' },
    { left: '72%', top: '76%' },
    { left: '50%', top: '6%' },
    { left: '10%', top: '60%' },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            initial={reduce ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative bg-card border border-border rounded-2xl shadow-xl px-10 py-8 text-center max-w-sm mx-4"
          >
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <PartyPopper className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

            {!reduce &&
              sparkPositions.map((pos, i) => (
                <motion.span
                  key={i}
                  className="absolute text-primary"
                  style={{ left: pos.left, top: pos.top }}
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.6], y: [0, -10, -22] }}
                  transition={{
                    duration: 1.4,
                    delay: 0.2 + i * 0.08,
                    repeat: Infinity,
                    repeatDelay: 0.6,
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.span>
              ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationOverlay;
