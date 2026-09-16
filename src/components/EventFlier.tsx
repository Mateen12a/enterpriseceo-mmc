import { useState } from 'react';
import { motion } from 'motion/react';
import { PageContainer } from './Layout';

export function EventFlier() {
  const [flierError, setFlierError] = useState(false);

  return (
    <section className="bg-navy-950 py-20 md:py-24 border-t-4 border-orange-500 overflow-hidden" id="flier">
      <PageContainer>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">

          {/* Brand motif divider */}
          <div className="flex space-x-1.5 mb-7" aria-hidden="true">
            <div className="w-8 h-2 bg-orange-500 skew-x-[-30deg]"></div>
            <div className="w-8 h-2 bg-cream-50/70 skew-x-[-30deg]"></div>
            <div className="w-8 h-2 bg-blue-600 skew-x-[-30deg]"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight mb-3">
              Official Event Flier
            </h2>

            <p className="text-sm md:text-base text-cream-50/70 font-light mb-12">
              The full programme, executive modules, and schedule — on one page.
            </p>

            {/* The Flier — printed-mat presentation */}
            <div className="w-full max-w-xl relative group">
              <div className="bg-white p-2.5 md:p-3 rounded-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover:-translate-y-1">
                <div className="aspect-[4/5] bg-navy-900 rounded-md overflow-hidden relative flex items-center justify-center">
                  {flierError ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center border-2 border-dashed border-white/15 m-3 rounded-md">
                      <svg className="w-10 h-10 text-white/25 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-semibold text-white/80 text-sm">Official flier coming soon</p>
                      <p className="text-xs text-white/50 mt-1">The full programme flier will appear here.</p>
                    </div>
                  ) : (
                    <img
                      src="/flier.jpg"
                      alt="EnterpriseCEO Media Owners & Executives Masterclass 2026 — Official Event Flier"
                      className="w-full h-full object-contain"
                      onError={() => setFlierError(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  );
}
