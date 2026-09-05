import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const modules = [
  {
    num: 1,
    title: "Personal Branding for Media Executives",
    faculty: "Bolaji Abimbola, MD/CEO, Indigo PR",
    overview: "This module explores how media executives build influence beyond their organisations by developing a strong, credible, and monetisable personal brand.",
    areas: "Executive identity and thought leadership positioning; building authority in the media ecosystem; reputation architecture for media CEOs; digital presence, visibility strategy & influence scaling; personal brand as a business development tool.",
    impact: "Participants will learn how to become recognisable industry authorities that attract opportunities, partnerships, and influence."
  },
  {
    num: 2,
    title: "Building Resilient Media Institutions",
    faculty: "Richard Ikiebe, Senior Fellow and Director, Centre for Leadership in Journalism, Pan-Atlantic University",
    overview: "Focuses on how media organisations survive disruption, economic shocks, and digital competition while maintaining relevance and profitability.",
    areas: "Media resilience in volatile environments; sustainable newsroom models; institutional culture and adaptability; risk-proofing media organisations; leadership continuity systems.",
    impact: "Participants will be equipped to build media organisations that withstand disruption and remain competitive."
  },
  {
    num: 3,
    title: "Build to Last — Structure, Power & Governance for Media Enterprise",
    faculty: "Dr. Bode Oguntoke, Head of Internal Audit at First HoldCo Plc",
    overview: "Examines governance frameworks and organisational structures that ensure long-term stability and accountability.",
    areas: "Corporate governance in media enterprises; ownership structures and board dynamics; editorial independence vs commercial control; decision-making architecture; institutional power balance.",
    impact: "Participants will design governance systems that ensure transparency, growth, and sustainability."
  },
  {
    num: 4,
    title: "Digital Transformation & Growth Execution",
    faculty: "Prof. Yinka David-West, Dean, Lagos Business School (LBS)",
    overview: "This module focuses on digital adaptation, innovation, and execution strategies for scaling media businesses.",
    areas: "Digital-first media transformation; AI, automation & newsroom innovation; platform strategy (web, social, streaming, mobile); data-driven decision making; growth execution frameworks.",
    impact: "Participants will learn how to transition traditional media into scalable digital ecosystems."
  },
  {
    num: 5,
    title: "Advertising, Corporate Sponsorship & PR Monetisation",
    faculty: "Tunde Lawanson, Head, Marketing & Corporate Communications at First HoldCo",
    overview: "Explores revenue generation through advertising, partnerships, sponsorships, and strategic communications.",
    areas: "Advertising ecosystem dynamics; corporate sponsorship acquisition strategies; integrated PR and brand partnerships; media sales strategy & negotiation; value packaging for advertisers.",
    impact: "Participants will strengthen revenue pipelines through structured commercial partnerships."
  },
  {
    num: 6,
    title: "Economic Outlook for Media CEOs",
    faculty: "Dr. Biodun Adedipe, Founder & Chief Economist, B. Adedipe Associates",
    overview: "Provides macroeconomic insight into how global and local economies affect media operations and decision-making.",
    areas: "Macroeconomic trends affecting media; inflation, currency shifts & media profitability; investment climate & funding access; consumer behaviour and media spending patterns; strategic forecasting for media CEOs.",
    impact: "Participants will make informed financial and strategic decisions based on economic intelligence."
  },
  {
    num: 7,
    title: "Leadership, People & Organisational Management",
    faculty: "Joseph Adeyeye, Managing Director and Editor-in-Chief of Punch Newspapers",
    overview: "Focuses on building high-performance media teams and leading creative talent effectively.",
    areas: "Executive leadership styles in media; talent acquisition and retention; organisational culture development; performance management systems; leading creative and editorial teams.",
    impact: "Participants will build motivated, high-performing, and aligned media teams."
  },
  {
    num: 8,
    title: "Monetisation Models for Modern Media",
    faculty: "David Afolayan",
    overview: "Covers modern revenue models that are reshaping global media businesses.",
    areas: "Subscription and membership models; advertising vs audience-supported models; event-driven media revenue systems; platform monetisation strategies; hybrid revenue ecosystem design.",
    impact: "Participants will diversify income streams and reduce dependence on traditional advertising."
  },
  {
    num: 9,
    title: "Crisis Communication & Strategic Risk Management",
    faculty: "Tolulope Olorundero, Mosron Communications",
    overview: "Equips media executives with tools to manage crises, reputation risks, and public perception challenges.",
    areas: "Crisis communication frameworks; reputation damage control strategies; real-time media response systems; stakeholder communication during crises; risk anticipation and mitigation planning.",
    impact: "Participants will be able to manage reputational risks and protect institutional credibility."
  },
  {
    num: 10,
    title: "Engaging Brands, Governments & Institutions for Strategic Communication and Public Influence",
    faculty: "Femi Ipadeola, Organisation Thought Leader, Executive Coach and Board Member, BTV Africa",
    overview: "A strategic course designed to equip leaders with the skills to shape narratives, manage perception, and drive influence across brands, governments, and institutions through effective communication.",
    areas: "Strategic communication foundations; narrative design & influence building; media relations & public engagement; government, policy & institutional communication; digital influence & reputation management.",
    impact: "Participants will be able to design and execute strategic communication that shapes perception, builds trust, and drives influence across brands, governments, and institutions."
  },
  {
    num: 11,
    title: "Entrepreneurship in the Media Economy",
    faculty: "To be announced",
    overview: "A strategic course that explores how media ecosystems drive entrepreneurial opportunities, enabling participants to build, scale, and sustain innovative ventures within the evolving media and digital economy.",
    areas: "Media economy fundamentals; digital media business models; content monetisation strategies; media innovation & technology disruption; scaling media-driven enterprises.",
    impact: "Participants will be able to identify, develop, and scale entrepreneurial ventures within the media economy using sustainable, innovation-driven business models."
  },
  {
    num: 12,
    title: "Securing Grants and Sponsorships for Media Projects",
    faculty: "To be announced",
    overview: "A practical course designed to help media professionals, storytellers, digital creators, journalists, podcasters, publishers, and media startups understand and access local and international funding opportunities. Equips participants with the knowledge and strategies to identify grants and sponsorships, develop compelling proposals, understand donor expectations, and build sustainable funding models for media projects.",
    areas: "Identifying and accessing relevant grant opportunities for media projects; developing strong and competitive grant proposals; understanding donor expectations and funding criteria; creating sponsorship strategies that attract corporate partners; building sustainable funding models for media ventures.",
    impact: "Participants will leave with practical tools, strategic insights, and actionable frameworks to improve their chances of securing grants, sponsorships, partnerships, and funding support for media and creative projects."
  }
];

function InitialsBadge({ name }: { name: string }) {
  if (name === "To be announced" || !name) return null;
  const initials = name.split(',')[0].split(' ').filter(n => n.length > 0 && n.toLowerCase() !== 'dr.' && n.toLowerCase() !== 'prof.').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  return (
    <div className="w-10 h-10 shrink-0 bg-blue-600 flex items-center justify-center text-white font-serif font-bold text-sm">
      {initials}
    </div>
  );
}

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
    <section id="curriculum" className="py-24 px-6 md:px-12 bg-white overflow-hidden">
      <motion.div {...scrollAnimation} className="max-w-4xl mx-auto">
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
                      <h3 className="text-lg font-bold text-navy-900 mb-1 pr-6">{module.title}</h3>
                      {module.faculty !== "To be announced" && (
                        <p className="text-sm text-ink-900/70">{module.faculty}</p>
                      )}
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
                          <InitialsBadge name={module.faculty} />
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

        <div className="mt-12 p-8 bg-cream-50 border-t border-navy-900/10">
          <p className="text-lg text-navy-900 leading-relaxed font-serif">
            At the end of this masterclass, participants will be able to build scalable and resilient media enterprises, develop strong personal and institutional brands, design sustainable revenue systems, lead high-performance media organisations, navigate economic and digital disruptions, and influence audiences through strategic storytelling.
          </p>
        </div>

        <div className="mt-16 pt-10 border-t border-grey-100 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-50">
          <span className="font-bold text-sm tracking-wider uppercase text-navy-900">First HoldCo</span>
          <span className="font-bold text-sm tracking-wider uppercase text-navy-900">Punch Newspapers</span>
          <span className="font-bold text-sm tracking-wider uppercase text-navy-900">Lagos Business School</span>
          <span className="font-bold text-sm tracking-wider uppercase text-navy-900">Indigo PR</span>
          <span className="font-bold text-sm tracking-wider uppercase text-navy-900">Pan-Atlantic University</span>
          <span className="font-bold text-sm tracking-wider uppercase text-navy-900">BTV Africa</span>
          <span className="font-bold text-sm tracking-wider uppercase text-navy-900">Mosron Communications</span>
          <span className="font-bold text-sm tracking-wider uppercase text-navy-900">B. Adedipe Associates</span>
        </div>
      </motion.div>
    </section>
  );
}
