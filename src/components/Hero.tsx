import { ArrowUpRight, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { useApplyModal } from '../context/ApplyModalContext';
import { PageContainer } from './Layout';
import { motion } from 'motion/react';

export function Hero() {
  const { openApplyModal } = useApplyModal();

  return (
    <section className="bg-navy-900 text-white pt-32 pb-20 md:pb-24 relative overflow-hidden" id="overview">
      {/* Graphic motif placeholder */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M400 0L0 400H400V0Z" fill="currentColor"/>
          <path d="M400 100L100 400H400V100Z" fill="currentColor"/>
        </svg>
      </div>

      <PageContainer className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-orange-500 font-bold tracking-[0.15em] uppercase text-lg md:text-2xl mb-2 block">
            EnterpriseCEO
          </span>
          <h1 className="text-5xl md:text-7xl font-serif leading-[1.05] mb-6">
            Media Owners <span className="text-orange-500">&amp;</span><br />
            Executives Masterclass
          </h1>
          <p className="text-xl md:text-2xl text-cream-50/90 font-light mb-10 max-w-2xl">
            <em className="font-serif">Strategic Leadership, Growth &amp; Sustainability in Modern Media</em>
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
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
            {/* Flier-Matched ACCESS FEE 500k Badge */}
            <div className="inline-flex items-center gap-4 mb-2">
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
            <p className="text-xs text-cream-50/60 max-w-md">
              By invitation and selective registration. Limited to 30 carefully selected senior media executives.
            </p>
          </div>
          </div>
          
          {/* Right Column: Executive Cohort Dossier Card */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative bg-navy-950/85 backdrop-blur-md border border-white/10 rounded-xl p-6 lg:p-7 shadow-2xl overflow-hidden"
            >
              {/* Premium Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-blue-600 to-orange-500" />

              {/* Dossier Header */}
              <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cream-50/90 font-mono">
                    Cohort Brief &bull; 2026
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded">
                  Strictly 30 Seats
                </span>
              </div>

              {/* Programme Quick Facts */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-cream-50/60 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    <span>Programme Dates</span>
                  </div>
                  <div className="text-sm font-bold text-white">21–22 October 2026</div>
                  <div className="text-[10px] text-cream-50/50 mt-0.5">+ 1-on-1 Mentorship</div>
                </div>

                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-cream-50/60 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>Executive Venue</span>
                  </div>
                  <div className="text-sm font-bold text-white">Lagos, Nigeria</div>
                  <div className="text-[10px] text-cream-50/50 mt-0.5">Closed-Door Setting</div>
                </div>
              </div>

              {/* Faculty Preview Roster */}
              <div className="mb-5 p-3.5 bg-white/[0.03] border border-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cream-50/80">
                    Masterclass Faculty Preview
                  </span>
                  <a href="#faculty" className="text-[11px] text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                    View All 10 &rarr;
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden py-1">
                    {[
                      { name: 'Dr. Richard Ikiebe', img: '/speakers/richard-ikiebe-sq.png' },
                      { name: 'Tunde Lawanson', img: '/speakers/tunde-lawanson-sq.png' },
                      { name: 'Bolaji Abimbola', img: '/speakers/bolaji-abimbola-sq.png' },
                      { name: 'David Afolayan', img: '/speakers/david-afolayan-sq.png' },
                      { name: 'Dr. Bode Oguntoke', img: '/speakers/bode-oguntoke-sq.png' },
                      { name: 'Ezekiel Solesi', img: '/speakers/ezekiel-solesi-sq.png' },
                    ].map((f, i) => (
                      <img
                        key={i}
                        src={f.img}
                        alt={f.name}
                        title={f.name}
                        className="inline-block h-9 w-9 rounded-full ring-2 ring-navy-950 object-cover object-top bg-navy-800"
                      />
                    ))}
                  </div>
                  <div className="pl-2 border-l border-white/10 text-[11px] text-cream-50/70 leading-tight">
                    <strong className="text-white block font-semibold">10 Proven Leaders</strong>
                    <span>CEOs, Economists &amp; Media Proprietors</span>
                  </div>
                </div>
              </div>

              {/* Strategic Pillars List */}
              <div className="space-y-2 mb-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cream-50/50 block">
                  Core Strategic Pillars
                </span>
                <div className="space-y-1.5 text-xs text-cream-50/90">
                  {[
                    'Modern Media Economics & Sustainable Monetisation',
                    'AI Newsroom Automation & Workflow Architecture',
                    'Corporate Board Governance & Regulatory Compliance',
                    'Strategic Capital Access & Media Enterprise Valuation',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer with CTA */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cream-50/60 block">
                    Access Fee
                  </span>
                  <span className="text-sm font-bold text-white font-mono">
                    ₦500,000 / Delegate
                  </span>
                </div>
                <button
                  onClick={openApplyModal}
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded transition-all shadow-lg flex items-center gap-1.5"
                >
                  <span>Apply for Seat</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
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
