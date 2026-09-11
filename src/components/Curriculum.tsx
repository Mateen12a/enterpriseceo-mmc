import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { PageContainer } from './Layout';

const modules = [
  {
    num: 1,
    title: "Personal Branding for Media Executives",
    overview: "This module explores how media executives build influence beyond their organisations by developing a strong, credible, and monetisable personal brand.",
    areas: "Executive identity and thought leadership positioning; building authority in the media ecosystem; reputation architecture for media CEOs; digital presence, visibility strategy & influence scaling; personal brand as a business development tool.",
    impact: "Participants will learn how to become recognisable industry authorities that attract opportunities, partnerships, and influence."
  },
  {
    num: 2,
    title: "Building Resilient Media Institutions",
    overview: "Focuses on how media organisations survive disruption, economic shocks, and digital competition while maintaining relevance and profitability.",
    areas: "Media resilience in volatile environments; sustainable newsroom models; institutional culture and adaptability; risk-proofing media organisations; leadership continuity systems.",
    impact: "Participants will be equipped to build media organisations that withstand disruption and remain competitive."
  },
  {
    num: 3,
    title: "Build to Last — Structure, Power & Governance for Media Enterprise",
    overview: "Examines governance frameworks and organisational structures that ensure long-term stability and accountability.",
    areas: "Corporate governance in media enterprises; ownership structures and board dynamics; editorial independence vs commercial control; decision-making architecture; institutional power balance.",
    impact: "Participants will design governance systems that ensure transparency, growth, and sustainability."
  },
  {
    num: 4,
    title: "Digital Transformation & Growth Execution",
    overview: "This module focuses on digital adaptation, innovation, and execution strategies for scaling media businesses.",
    areas: "Digital-first media transformation; AI, automation & newsroom innovation; platform strategy (web, social, streaming, mobile); data-driven decision making; growth execution frameworks.",
    impact: "Participants will learn how to transition traditional media into scalable digital ecosystems."
  },
  {
    num: 5,
    title: "Advertising, Corporate Sponsorship & PR Monetisation",
    overview: "Explores revenue generation through advertising, partnerships, sponsorships, and strategic communications.",
    areas: "Advertising ecosystem dynamics; corporate sponsorship acquisition strategies; integrated PR and brand partnerships; media sales strategy & negotiation; value packaging for advertisers.",
    impact: "Participants will strengthen revenue pipelines through structured commercial partnerships."
  },
  {
    num: 6,
    title: "Economic Outlook for Media CEOs",
    overview: "Provides macroeconomic insight into how global and local economies affect media operations and decision-making.",
    areas: "Macroeconomic trends affecting media; inflation, currency shifts & media profitability; investment climate & funding access; consumer behaviour and media spending patterns; strategic forecasting for media CEOs.",
    impact: "Participants will make informed financial and strategic decisions based on economic intelligence."
  },
  {
    num: 7,
    title: "Leadership, People & Organisational Management",
    overview: "Focuses on building high-performance media teams and leading creative talent effectively.",
    areas: "Executive leadership styles in media; talent acquisition and retention; organisational culture development; performance management systems; leading creative and editorial teams.",
    impact: "Participants will build motivated, high-performing, and aligned media teams."
  },
  {
    num: 8,
    title: "Monetisation Models for Modern Media",
    overview: "Covers modern revenue models that are reshaping global media businesses.",
    areas: "Subscription and membership models; advertising vs audience-supported models; event-driven media revenue systems; platform monetisation strategies; hybrid revenue ecosystem design.",
    impact: "Participants will diversify income streams and reduce dependence on traditional advertising."
  },
  {
    num: 9,
    title: "Crisis Communication & Strategic Risk Management",
    overview: "Equips media executives with tools to manage crises, reputation risks, and public perception challenges.",
    areas: "Crisis communication frameworks; reputation damage control strategies; real-time media response systems; stakeholder communication during crises; risk anticipation and mitigation planning.",
    impact: "Participants will be able to manage reputational risks and protect institutional credibility."
  },
  {
    num: 10,
    title: "Engaging Brands, Governments & Institutions for Strategic Communication and Public Influence",
    overview: "A strategic course designed to equip leaders with the skills to shape narratives, manage perception, and drive influence across brands, governments, and institutions through effective communication.",
    areas: "Strategic communication foundations; narrative design & influence building; media relations & public engagement; government, policy & institutional communication; digital influence & reputation management.",
    impact: "Participants will be able to design and execute strategic communication that shapes perception, builds trust, and drives influence across brands, governments, and institutions."
  }
];

const partnerLogos = [
  {
    name: 'First HoldCo',
    src: '/logos/first-holdco.png',
    className: 'h-8 md:h-10 w-auto max-w-[150px] object-contain',
  },
  {
    name: 'Punch Newspapers',
    src: '/logos/punch.svg',
    className: 'h-7 md:h-8 w-auto max-w-[130px] object-contain',
  },
  {
    name: 'Lagos Business School',
    src: '/logos/lbs.png',
    className: 'h-8 md:h-10 w-auto max-w-[150px] object-contain',
  },
  {
    name: 'Indigo PR',
    src: '/logos/indigo-pr.png',
    className: 'h-7 md:h-8 w-auto max-w-[140px] object-contain',
  },
  {
    name: 'Pan-Atlantic University',
    src: '/logos/pau.png',
    className: 'h-8 md:h-9 w-auto max-w-[140px] object-contain',
  },
  {
    name: 'BTV Africa',
    src: '/logos/btv-africa.png',
    showName: true,
    className: 'h-7 md:h-8 w-auto max-w-[90px] object-contain rounded',
  },
  {
    name: 'Mosron Communications',
    src: '/logos/mosron.png',
    className: 'h-7 md:h-8 w-auto max-w-[130px] object-contain',
  },
];

export function Curriculum() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const scrollAnimation = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <section id="curriculum" className="py-24 bg-white overflow-hidden">
      <PageContainer>
        <motion.div {...scrollAnimation}>
          <h2 className="text-4xl font-serif text-navy-900 mb-12">Full Curriculum</h2>
          
          <div className="space-y-4">
            {modules.map((module, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="border border-grey-100">
                  <button 
                    onClick={() => toggle(idx)}
                    className="w-full text-left p-6 flex flex-col sm:flex-row sm:items-center justify-between bg-white hover:bg-cream-50 transition-colors gap-4"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <span className="text-xl font-serif text-blue-600 font-bold shrink-0 w-8">{module.num}</span>
                      <div>
                        <h3 className="text-lg font-bold text-navy-900 pr-6">{module.title}</h3>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-navy-900 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 sm:pl-20 border-t border-grey-100/50 bg-white">
                          <div className="flex items-start gap-4 mb-6 mt-6">
                            <div className="space-y-4 text-sm text-ink-900">
                              <p><strong className="text-navy-900">Overview:</strong> {module.overview}</p>
                              <p><strong className="text-navy-900">Key Learning Areas:</strong> {module.areas}</p>
                            </div>
                          </div>
                          <blockquote className="pl-4 py-1 border-l-4 border-orange-500 italic text-ink-900 font-serif text-lg">
                            {module.impact}
                          </blockquote>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-8 bg-cream-50 border border-navy-900/10 rounded-lg shadow-sm">
            <p className="text-base md:text-lg text-navy-900 leading-relaxed font-medium">
              At the end of this masterclass, participants will be able to build scalable and resilient media enterprises, develop strong personal and institutional brands, design sustainable revenue systems, lead high-performance media organisations, navigate economic and digital disruptions, and influence audiences through strategic storytelling.
            </p>
          </div>

          <div className="mt-16 pt-10 border-t border-grey-100 flex flex-col items-center">
            <p className="text-center text-xs uppercase tracking-widest text-navy-900/60 font-semibold mb-8">
              Executive Leadership & Faculty Representation Across Leading Institutions
            </p>

            <div className="w-full relative overflow-hidden flex items-center">
              {/* Gradient masks for smooth fade at edges */}
              <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              
              <motion.div 
                className="flex w-max gap-14 md:gap-16 whitespace-nowrap items-center py-2"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              >
                {[...Array(2)].map((_, groupIdx) => (
                  <div key={groupIdx} className="flex gap-14 md:gap-16 items-center shrink-0">
                    {partnerLogos.map((logo, idx) => (
                      <div 
                        key={`${groupIdx}-${idx}`}
                        className="flex items-center gap-3 shrink-0 opacity-80 hover:opacity-100 transition-all duration-300 filter grayscale hover:grayscale-0 cursor-default"
                      >
                        <img 
                          src={logo.src} 
                          alt={logo.name} 
                          title={logo.name}
                          className={`${logo.className} mix-blend-multiply`} 
                        />
                        {logo.showName && (
                          <span className="font-bold text-sm tracking-tight text-navy-900">
                            {logo.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}
