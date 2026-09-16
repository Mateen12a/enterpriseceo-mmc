import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ShieldCheck, Mail, Phone } from 'lucide-react';
import { useApplyModal } from '../context/ApplyModalContext';
import { PageContainer } from './Layout';

const scrollAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function LogisticsParticipation() {
  const { openApplyModal } = useApplyModal();

  return (
    <section id="logistics" className="py-20 md:py-24 bg-blue-600 text-white relative overflow-hidden">
      <PageContainer>
        <motion.div {...scrollAnimation}>
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-orange-300 uppercase tracking-widest block mb-2">
              Executive Briefing
            </span>
            <h2 className="text-3xl md:text-5xl font-serif">Logistics &amp; Participation</h2>
          </div>
          
          <div className="space-y-4 max-w-2xl mx-auto mb-12">
            {[
              { label: 'Location', value: 'To be announced' },
              { label: 'Duration', value: '2-day core programme, plus a follow-up mentorship session' },
              { label: 'Participants', value: '30 carefully selected senior media executives' },
              { label: 'Access', value: 'By invitation and selective registration via EnterpriseCEO' }
            ].map((item, i) => (
              <div key={i} className="bg-white text-navy-900 p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between shadow-md border-l-4 border-orange-500 transform transition-transform hover:-translate-y-0.5">
                <span className="text-orange-600 font-bold uppercase tracking-wider text-xs md:w-36 shrink-0 mb-1 md:mb-0 block">
                  {item.label}:
                </span>
                <span className="text-base md:text-lg font-medium text-navy-900">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={openApplyModal}
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-base px-8 py-4 rounded-md shadow-xl transition-all inline-flex items-center gap-2"
            >
              Apply for Invitation
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-white/80 mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              Strictly capped at 30 seats. Applications closing soon.
            </p>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}

export function Sponsorship() {
  return (
    <section id="sponsorship" className="bg-white">
      <div className="bg-orange-600 text-white py-16 md:py-20 text-center relative overflow-hidden">
        <PageContainer>
          <motion.div {...scrollAnimation} className="max-w-4xl mx-auto relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-white/80 block mb-2">
              Partnership &amp; Brand Equity
            </span>
            <h2 className="text-3xl md:text-5xl font-serif mb-6">Sponsorship Opportunities</h2>
            <p className="text-base md:text-xl text-white/95 leading-relaxed font-light">
              The EnterpriseCEO Media Owners &amp; Executives Masterclass offers a unique platform for leading organisations to engage directly with top-tier media decision-makers and industry influencers. Sponsorship provides unmatched visibility, strategic positioning, and access to a highly curated audience of executives shaping the future of media.
            </p>
          </motion.div>
        </PageContainer>
      </div>
      
      <div className="py-16 md:py-20">
        <PageContainer>
          <motion.div {...scrollAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-grey-100/50 p-8 border border-grey-200">
              <h3 className="text-2xl font-serif text-navy-900 mb-6">Sponsorship Objectives</h3>
              <ul className="space-y-4">
                {[
                  'Position sponsors as thought leaders in media, technology, and innovation',
                  'Enable direct engagement with senior decision-makers and industry leaders',
                  'Showcase products, solutions, and capabilities to a high-value audience',
                  'Strengthen brand equity within the African and global media ecosystem'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-orange-500 mt-2 shrink-0 rounded-full"></span>
                    <span className="text-sm md:text-base text-ink-900 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-grey-100/50 p-8 border border-grey-200 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif text-navy-900 mb-6">Sponsor Benefits</h3>
                <ul className="space-y-4">
                  {[
                    'Direct access to 30+ senior media executives and decision-makers',
                    'Strategic brand positioning within a premium, invitation-only environment',
                    'Thought leadership through speaking and content opportunities',
                    'Media exposure across EnterpriseCEO platforms and partner channels',
                    'Long-term relationship building within the media and technology ecosystem'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-blue-600 mt-2 shrink-0 rotate-45"></span>
                      <span className="text-sm md:text-base text-ink-900 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Direct Partnership Liaisons */}
          <motion.div {...scrollAnimation} className="mt-10 bg-navy-900 text-white p-8 md:p-10 border-t-4 border-orange-500 shadow-xl">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400 block mb-1">
                Direct Partnership Liaisons
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
                Speak to Our Team
              </h3>
              <p className="text-sm md:text-base text-cream-50/80 leading-relaxed font-light">
                To discuss bespoke sponsorship tiers, brand integration, or strategic partnerships, connect directly with our masterclass directors:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tumilara */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-orange-500/60 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-sm">
                    T
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">Tumilara</h4>
                    <span className="text-xs text-cream-50/60 font-medium">Sponsorships &amp; Enquiries</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-cream-50/90 pt-2 border-t border-white/10">
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-cream-50/50 uppercase block font-bold tracking-wider">Email</span>
                      <a 
                        href="mailto:tumilara.amosu@enterpriseceo.africa?subject=Sponsorship%20%26%20Enquiries%20-%20EnterpriseCEO%20Masterclass"
                        className="text-white hover:text-orange-400 underline underline-offset-2 transition-colors font-medium break-all"
                      >
                        tumilara.amosu@enterpriseceo.africa
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <Phone className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-cream-50/50 uppercase block font-bold tracking-wider">Phone</span>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <a href="tel:+2347061737282" className="text-cream-50/90 hover:text-orange-400 transition-colors font-medium">
                          +234 (0) 706 173 7282
                        </a>
                        <span className="text-white/30">|</span>
                        <a href="tel:+2348057544695" className="text-cream-50/90 hover:text-orange-400 transition-colors font-medium">
                          +234 (0) 805 754 4695
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aaron */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-orange-500/60 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">Aaron</h4>
                    <span className="text-xs text-cream-50/60 font-medium">Partnerships &amp; Enquiries</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-cream-50/90 pt-2 border-t border-white/10">
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-cream-50/50 uppercase block font-bold tracking-wider">Email</span>
                      <a 
                        href="mailto:aaron.abumere@enterpriseceo.africa?subject=Sponsorship%20%26%20Enquiries%20-%20EnterpriseCEO%20Masterclass"
                        className="text-white hover:text-orange-400 underline underline-offset-2 transition-colors font-medium break-all"
                      >
                        aaron.abumere@enterpriseceo.africa
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <Phone className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-cream-50/50 uppercase block font-bold tracking-wider">Phone</span>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <a href="tel:+2349067915609" className="text-cream-50/90 hover:text-orange-400 transition-colors font-medium">
                          +234 (0) 906 791 5609
                        </a>
                        <span className="text-white/30">|</span>
                        <a href="tel:+2348057544695" className="text-cream-50/90 hover:text-orange-400 transition-colors font-medium">
                          +234 (0) 805 754 4695
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </PageContainer>
      </div>
    </section>
  );
}

export function Conclusion() {
  const { openApplyModal } = useApplyModal();

  return (
    <section className="py-24 md:py-28 bg-navy-900 text-center relative overflow-hidden border-t border-white/10">
      <PageContainer>
        <motion.div {...scrollAnimation} className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif text-orange-400 mb-8">Conclusion</h2>
          <div className="space-y-6 text-lg md:text-xl text-cream-50/90 leading-relaxed font-light max-w-3xl mx-auto mb-12">
            <p>
              The EnterpriseCEO Media Owners &amp; Executives Masterclass is more than a learning programme, it is a strategic intervention for media leadership in a time of disruption.
            </p>
            <p>
              By bringing together influential decision-makers, cutting-edge insights, and real-world exposure to innovation ecosystems, the Masterclass empowers participants to lead with confidence, innovate with clarity, and drive measurable business outcomes in an increasingly competitive and fast-evolving media landscape.
            </p>
          </div>

          {/* Final Conversion Call */}
          <div className="max-w-xl mx-auto p-8 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-serif text-white mb-2">
              Secure Your Seat in the 2026 Executive Class
            </h3>
            <p className="text-sm text-cream-50/70 mb-6">
              21–22 October 2026 • Strictly capped at 30 seats. Applications closing soon.
            </p>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 -skew-x-12 px-5 py-2 shadow-xl border-l-4 border-orange-500 rounded-sm">
                  <div className="skew-x-12 text-center">
                    <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/95 leading-tight">
                      ACCESS FEE
                    </span>
                    <span className="block text-2xl md:text-3xl font-black text-white leading-none tracking-tight mt-0.5">
                      500k
                    </span>
                  </div>
                </div>
                <div className="text-left text-xs text-cream-50/70 border-l border-white/20 pl-3">
                  <span className="font-semibold text-white block">Full Executive Access</span>
                  <span className="text-cream-50/60 font-mono text-[11px]">₦500,000 per delegate</span>
                </div>
              </div>
              <button
                onClick={openApplyModal}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-base px-8 py-4 rounded-md shadow-xl transition-all inline-flex items-center gap-2"
              >
                Apply to Attend
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}
