import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ShieldCheck, Mail } from 'lucide-react';
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
                <ul className="space-y-4 mb-8">
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

              <a 
                href="mailto:hello@enterpriseceo.africa?subject=Sponsorship%20Enquiry%20-%20Media%20Owners%20%26%20Executives%20Masterclass"
                className="w-full text-center bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm px-6 py-3.5 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-orange-400" />
                Enquire About Sponsorship
              </a>
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
