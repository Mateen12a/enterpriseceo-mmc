import { useState } from 'react';
import { ArrowUpRight, Shield, Users2 } from 'lucide-react';
import { useApplyModal } from '../context/ApplyModalContext';
import { PageContainer } from './Layout';
import { motion } from 'motion/react';

const atmospherePhotos = [
  {
    src: '/p-event/photo-1.jpg',
    label: 'Boardroom',
    subtitle: 'Executive Session',
    caption: 'High-level media proprietors & C-suite executives engaged in strategic closed-door deliberations.'
  },
  {
    src: '/p-event/photo-3.jpg',
    label: 'Strategy',
    subtitle: 'Peer Intelligence',
    caption: 'Direct Chatham House exchange exploring resilient monetization frameworks and media governance.'
  },
  {
    src: '/p-event/photo-4.jpg',
    label: 'Exchange',
    subtitle: 'Leadership Network',
    caption: 'Curated peer networking connecting publishers, broadcasters, and institutional leaders in Lagos.'
  }
];

export function MasterclassIntro() {
  const { openApplyModal } = useApplyModal();
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <section className="bg-navy-900 text-white pt-16 pb-20 md:pb-24 relative overflow-hidden -mt-px" id="overview">
      <PageContainer className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: programme identity at flier scale */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="text-sm md:text-base font-bold tracking-[0.15em] uppercase text-orange-500 mb-3 block">
                EnterpriseCEO
              </span>
              <h1 className="text-2xl md:text-4xl font-serif leading-tight mb-5">
                Media Owners <span className="text-orange-500">&amp;</span> Executives Masterclass
              </h1>
              <p className="text-base md:text-lg text-cream-50/90 font-light mb-10 max-w-2xl">
                <em className="font-serif">High-level media proprietors &amp; C-suite executives engaged in strategic closed-door deliberations</em>
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
                <div className="bg-blue-600 px-6 py-4 border-l-4 border-orange-500">
                  <p className="font-bold text-xl whitespace-nowrap">21–22 October 2026</p>
                </div>
                <div className="max-w-md">
                  <p className="text-sm text-cream-50/80 leading-relaxed">
                    Two-day core executive programme, with an exclusive mentorship session to follow at a later date.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <button
                    onClick={openApplyModal}
                    className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold px-8 py-4 rounded-md transition-all shadow-lg flex items-center gap-2"
                  >
                    Apply to Attend
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                  <a
                    href="#curriculum"
                    className="text-white/90 hover:text-white border-b border-white/30 hover:border-white pb-1 transition-colors text-base font-medium"
                  >
                    View the Curriculum
                  </a>
                </div>

                {/* ACCESS FEE badge */}
                <div className="inline-flex items-center gap-4">
                  <div className="bg-blue-600 -skew-x-12 px-6 py-2.5 shadow-xl border-l-4 border-orange-500 rounded-sm">
                    <div className="skew-x-12 text-left">
                      <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-white/95 leading-tight">
                        ACCESS FEE
                      </span>
                      <span className="block text-2xl md:text-3xl font-black text-white leading-none tracking-tight mt-0.5">
                        500k
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-cream-50/70 border-l border-white/20 pl-3.5 py-0.5">
                    <span className="font-semibold text-white block">Full Executive Access</span>
                    <span className="text-cream-50/60 font-mono text-[11px]">₦500,000 per delegate</span>
                  </div>
                </div>

                <p className="text-xs text-cream-50/60 max-w-md">
                  By invitation and selective registration. Limited to 30 carefully selected senior media executives.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Executive Atmosphere & Authenticity Stage */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="relative bg-navy-950/90 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl overflow-hidden"
            >
              {/* Subtle Luxury Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-blue-600 to-orange-500" />

              {/* Stage Header */}
              <div className="flex items-center gap-2 pb-3 mb-3.5 border-b border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cream-50/90 font-mono">
                  Executive Masterclass Atmosphere
                </span>
              </div>

              {/* Primary Photography Stage */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-navy-900 border border-white/10 group shadow-md">
                <img
                  src={atmospherePhotos[activePhoto].src}
                  alt={atmospherePhotos[activePhoto].label}
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Dedicated High-Contrast Caption Container */}
              <div className="mt-3 px-3.5 py-2.5 bg-navy-900/95 border border-white/10 rounded-lg shadow-inner">
                <p className="text-xs text-cream-50/95 font-normal leading-relaxed">
                  {atmospherePhotos[activePhoto].caption}
                </p>
              </div>

              {/* Interactive Atmosphere Switcher */}
              <div className="grid grid-cols-3 gap-2 mt-3.5">
                {atmospherePhotos.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`text-left p-2 rounded-lg border transition-all ${
                      activePhoto === idx
                        ? 'bg-white/10 border-orange-500 shadow-md ring-1 ring-orange-500/50'
                        : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/20 text-cream-50/60'
                    }`}
                  >
                    <span className={`block text-[10px] font-bold uppercase tracking-wider ${activePhoto === idx ? 'text-orange-400' : 'text-cream-50/70'}`}>
                      {p.label}
                    </span>
                    <span className="block text-[11px] text-white/90 font-medium truncate mt-0.5">
                      {p.subtitle}
                    </span>
                  </button>
                ))}
              </div>

              {/* Complementary Executive Hallmarks */}
              <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-2 gap-3 text-left">
                <div className="flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-white uppercase tracking-wider">Chatham House Rule</span>
                    <span className="block text-[11px] text-cream-50/60 leading-tight mt-0.5">Candid, confidential boardroom deliberations</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Users2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-white uppercase tracking-wider">Proprietors &amp; CEOs</span>
                    <span className="block text-[11px] text-cream-50/60 leading-tight mt-0.5">Curated seniority for maximum network value</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ambient Background Glows */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/20 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-orange-500/15 rounded-full blur-[90px] pointer-events-none" />
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
