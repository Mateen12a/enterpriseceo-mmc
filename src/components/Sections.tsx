import React from 'react';
import { motion } from 'motion/react';
import { Award, Video, Users } from 'lucide-react';
import { PageContainer } from './Layout';

const scrollAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

// Reusable motif divider matching the brochure visual language
const MotifDivider = () => (
  <div className="flex space-x-1.5 mb-6" aria-hidden="true">
    <div className="w-8 h-2 bg-navy-900 skew-x-[-30deg]"></div>
    <div className="w-8 h-2 bg-orange-500 skew-x-[-30deg]"></div>
    <div className="w-8 h-2 bg-cream-50 skew-x-[-30deg]"></div>
  </div>
);

export function BackgroundRationale() {
  return (
    <section className="py-20 md:py-24 bg-cream-50 overflow-hidden border-b border-navy-900/5">
      <PageContainer>
        <motion.div {...scrollAnimation} className="w-full">
          <MotifDivider />
          <h2 className="text-3xl md:text-5xl font-serif text-navy-900 mb-8 leading-tight">
            Background &amp; Strategic Rationale
          </h2>
          <div className="space-y-6 text-lg text-ink-900 leading-relaxed font-light">
            <p className="text-left md:text-justify">
              The global media ecosystem is being fundamentally reshaped by rapid digital disruption, evolving audience consumption patterns, platform dominance, and new monetisation realities. Traditional business models are under pressure, while opportunities for innovation, scale, and influence have never been greater.
            </p>
            <div className="p-6 md:p-8 bg-white border-l-4 border-orange-500 shadow-sm my-8">
              <p className="font-bold text-xl md:text-2xl text-navy-900 font-serif">
                For media owners and senior executives, the imperative is clear: adapt, innovate, and lead with precision.
              </p>
            </div>
            <p className="text-left md:text-justify">
              The EnterpriseCEO Media Owners &amp; Executives Masterclass is a high-impact, executive-level programme designed to equip decision-makers with the strategic foresight, leadership capability, and practical tools required to navigate this transformation. It blends deep industry insights, peer intelligence, and exposure to leading technology ecosystems to help participants reposition their organisations for sustainable growth and long-term relevance.
            </p>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}

export function ProgrammeObjectives() {
  const blocks = [
    { color: 'bg-mustard-600', title: 'Strengthen Strategic Leadership Capacity', desc: 'Equip participants with advanced frameworks for navigating complexity, leading transformation, and building resilient organisations.' },
    { color: 'bg-teal-600', title: 'Accelerate Digital Transformation', desc: 'Provide practical insights into leveraging technology, data, and platforms to drive efficiency, innovation, and growth.' },
    { color: 'bg-blue-600', title: 'Unlock Sustainable Monetisation Models', desc: 'Explore diversified revenue streams and business models tailored to the modern media landscape.' },
    { color: 'bg-purple-700', title: 'Foster High-Value Peer Networks', desc: 'Build a trusted community of media leaders for collaboration, partnerships, and shared learning.' },
    { color: 'bg-maroon-700', title: 'Drive Immediate Business Impact', desc: 'Enable participants to translate insights into actionable, results-driven strategies within their organisations.' },
  ];

  return (
    <section className="py-20 md:py-24 bg-white overflow-hidden">
      <PageContainer>
        <motion.div {...scrollAnimation}>
          <h2 className="text-3xl md:text-5xl font-serif text-navy-900 mb-4 leading-tight">
            Programme Objectives
          </h2>
          <p className="text-lg md:text-xl text-ink-900/80 mb-10">
            The Masterclass is designed to:
          </p>
          
          <div className="space-y-4">
            {blocks.map((block, idx) => (
              <div key={idx} className={`${block.color} p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start text-white shadow-sm transition-transform hover:-translate-y-0.5`}>
                <span className="text-4xl md:text-5xl font-extrabold opacity-60 shrink-0 leading-none">{idx + 1}</span>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{block.title}</h3>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed font-light">{block.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}

export function TargetAudience() {
  const audiences = [
    {
      title: "Media Owners & Founders",
      desc: "Media owners, founders, and CEOs across broadcast, print, and digital platforms seeking sustainable scale and governance."
    },
    {
      title: "C-Suite & Functional Leaders",
      desc: "C-suite executives and senior leaders in strategy, content, operations, and digital transformation driving institutional change."
    },
    {
      title: "Growth Decision-Makers",
      desc: "Decision-makers responsible for commercial growth, platform innovation, and long-term organisational performance."
    }
  ];

  return (
    <section id="who-its-for" className="py-20 md:py-24 bg-grey-100 overflow-hidden border-t border-grey-200">
      <PageContainer>
        <motion.div {...scrollAnimation}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-navy-900 mb-3">Target Audience</h2>
            <p className="text-lg text-ink-900/80">This exclusive programme is curated for:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {audiences.map((aud, i) => (
              <div key={i} className="bg-white p-8 border-t-4 border-blue-600 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{aud.title}</h3>
                  <p className="text-base text-ink-900 leading-relaxed">{aud.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}

export function ProgrammeStructure() {
  return (
    <section id="structure" className="py-20 md:py-24 bg-white overflow-hidden">
      <PageContainer>
        <motion.div {...scrollAnimation}>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-5xl font-serif text-navy-900 mb-4">
              Programme Structure &amp; Experience
            </h2>
            <p className="text-base md:text-lg text-ink-900/80 italic">
              The Two-Day Executive Masterclass is designed as an intensive, high-impact learning experience for leaders, professionals, and decision-makers seeking practical knowledge and strategic insight.
            </p>
          </div>

          {/* Days 1 & 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-8 border border-navy-900/10 bg-cream-50/50 flex flex-col justify-between">
              <div>
                <div className="bg-navy-900 text-white px-4 py-2 inline-block font-bold text-sm uppercase tracking-wider mb-5">
                  Day 1: Strategy &amp; Foundations
                </div>
                <p className="text-ink-900 leading-relaxed text-base md:text-lg">
                  Participants will explore core concepts, industry trends, and proven frameworks. Sessions will focus on building a strong foundation, understanding the landscape, and identifying opportunities for growth and impact.
                </p>
              </div>
            </div>

            <div className="p-8 border border-blue-600/20 bg-cream-50/50 flex flex-col justify-between">
              <div>
                <div className="bg-blue-600 text-white px-4 py-2 inline-block font-bold text-sm uppercase tracking-wider mb-5">
                  Day 2: Execution &amp; Scaling
                </div>
                <p className="text-ink-900 leading-relaxed text-base md:text-lg">
                  The second day shifts to practical application, translating ideas into action. Participants will engage in case studies, interactive sessions, and implementation strategies designed to support scalability and long-term success.
                </p>
              </div>
            </div>
          </div>

          {/* Core Learning Inclusions */}
          <div className="bg-white p-8 md:p-10 border border-grey-200 shadow-sm mb-12">
            <h4 className="text-lg font-bold text-navy-900 mb-6 uppercase tracking-wider">
              Learning Experience Includes:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Expert-led sessions and keynote insights',
                'Interactive workshops and group discussions',
                'Real-world case studies and practical frameworks',
                'Networking and peer-to-peer learning opportunities',
                'Action planning for immediate implementation'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 bg-orange-500 mt-1.5 shrink-0 rotate-45"></span>
                  <span className="text-base text-ink-900 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mentorship Session Add-on */}
          <div className="border-2 border-blue-500/30 bg-blue-50/30 p-8 md:p-10 relative overflow-hidden mb-14">
            <h3 className="text-2xl md:text-3xl font-serif text-navy-900 mb-4">
              Mentorship Session
            </h3>
            <p className="text-base md:text-lg text-ink-900 leading-relaxed">
              Following the intensive 2-day core programme, participants will benefit from an exclusive mentorship session scheduled at a later date. This dedicated follow-up ensures executives have the opportunity to reflect on their strategic learnings and receive personalized guidance on implementing frameworks within their own organizations.
            </p>
          </div>

          {/* Integrated Post-Programme Deliverables Bar */}
          <div className="bg-navy-900 text-white p-8 md:p-10 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
                  Executive Deliverables
                </span>
                <h4 className="text-xl md:text-2xl font-serif">Post-Programme Benefits</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                <div className="bg-white/10 px-5 py-3.5 rounded flex items-center gap-3">
                  <Award className="w-5 h-5 text-orange-400 shrink-0" />
                  <span className="text-sm font-medium">Executive Toolkit</span>
                </div>
                <div className="bg-white/10 px-5 py-3.5 rounded flex items-center gap-3">
                  <Video className="w-5 h-5 text-orange-400 shrink-0" />
                  <span className="text-sm font-medium">Session Recordings</span>
                </div>
                <div className="bg-white/10 px-5 py-3.5 rounded flex items-center gap-3">
                  <Users className="w-5 h-5 text-orange-400 shrink-0" />
                  <span className="text-sm font-medium">Closed Peer Network</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}
