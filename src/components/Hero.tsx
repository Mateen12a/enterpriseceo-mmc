import { useMemo } from 'react';
import { motion } from 'motion/react';

/**
 * Cinematic opening: the past-event film IS the hero.
 * No copy competes with the footage — all programme content
 * lives in the MasterclassIntro section directly below.
 */
export function Hero() {
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  return (
    <section
      className="relative h-[100svh] bg-navy-900 overflow-hidden"
      aria-label="Scenes from the EnterpriseCEO Media Owners & Executives Masterclass"
    >
      {prefersReducedMotion ? (
        <img
          src="/p-event/photo-1.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/bg-video/highlight-2022.mp4"
          poster="/p-event/photo-1.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      )}

      {/* Cinematic vignettes — gentle depth without hiding the footage */}
      <div className="absolute inset-0 z-0 bg-navy-900/20" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-28 z-0 bg-gradient-to-b from-navy-900/70 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-44 z-0 bg-gradient-to-t from-navy-900/85 to-transparent" aria-hidden="true" />

      {/* Quiet scroll cue — the only element over the film */}
      <motion.a
        href="#overview"
        aria-label="Scroll to programme overview"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 text-white/75 hover:text-white transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.9, ease: 'easeOut' }}
      >
        <motion.span
          className="block"
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.span>
      </motion.a>
    </section>
  );
}
