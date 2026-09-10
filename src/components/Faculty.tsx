import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  HelpCircle, 
  X, 
  ArrowUpRight, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { PageContainer } from './Layout';

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  organisation: string;
  category: string;
  domain: string;
  accentColor: string;
  image: string;
  isMystery?: boolean;
  mysteryHint?: string;
  mysteryRole?: string;
  bio: string;
  focusModule?: string;
  keyTopics?: string[];
  type: 'flier' | 'advisory';
}

const facultyMembers: FacultyMember[] = [
  // --- TOP ROW OF FLIER (Row 1) ---
  {
    id: "richard-ikiebe",
    name: "Dr. Richard Ikiebe",
    title: "Chairman, Board of Directors",
    organisation: "BusinessDay Nigeria & Pan-Atlantic University",
    category: "Media Governance",
    domain: "Editorial Leadership & Policy",
    accentColor: "from-blue-700 to-blue-900 border-blue-500",
    image: "/speakers/richard-ikiebe-portrait.png",
    bio: "Chairman of the Board at BusinessDay Nigeria and Senior Fellow & Director at the Centre for Leadership in Journalism (Pan-Atlantic University). A pioneer in media leadership and institutional governance with decades of executive counsel.",
    focusModule: "Module 1: The Modern Media Business Model & Institutional Governance",
    keyTopics: ["Boardroom Governance", "Editorial Independence", "Corporate Media Trust", "Policy & Regulation"],
    type: "flier"
  },
  {
    id: "tunde-lawanson",
    name: "Tunde Lawanson",
    title: "Head, Marketing & Corporate Communications",
    organisation: "First HoldCo Plc",
    category: "Corporate Comms",
    domain: "Brand Architecture & Influence",
    accentColor: "from-amber-600 to-amber-800 border-amber-500",
    image: "/speakers/tunde-lawanson-portrait.png",
    bio: "Head of Marketing & Corporate Communications at First HoldCo Plc. A distinguished brand strategist leading corporate narrative, enterprise stakeholder management, and reputation architecture for premier African financial institutions.",
    focusModule: "Module 3: Brand Positioning, Strategic Comms & Corporate Influence",
    keyTopics: ["Enterprise Brand Building", "Crisis Communications", "Corporate Partnerships", "Narrative Dominance"],
    type: "flier"
  },
  {
    id: "mystery-1",
    name: "Guess the speaker",
    mysteryRole: "Keynote Media Luminary",
    title: "Special Guest Keynote Speaker",
    organisation: "Leading Pan-African Multimedia Group",
    category: "Surprise Keynote",
    domain: "Continental Media Expansion",
    accentColor: "from-sky-600 to-sky-800 border-sky-400",
    image: "/speakers/mystery-1-portrait.png",
    isMystery: true,
    mysteryHint: "Founding visionary and chief executive behind one of West Africa's most influential media, tech, and entertainment conglomerates.",
    bio: "A headline media chief executive and industry pioneer whose identity will be unveiled exclusively to registered delegates prior to commencement.",
    focusModule: "Opening Keynote: The Next Frontier for African Media Empires",
    keyTopics: ["Visionary Leadership", "Cross-Border Scaling", "Mergers & Capital", "Disruption Defense"],
    type: "flier"
  },
  {
    id: "femi-ipadeola",
    name: "Femi Ipadeola",
    title: "Content Lead & Executive Coach",
    organisation: "Boom Africa Films & Television",
    category: "Content Strategy",
    domain: "Film, TV & Visual Intellectual Property",
    accentColor: "from-slate-600 to-slate-800 border-slate-400",
    image: "/speakers/femi-ipadeola-portrait.png",
    bio: "Content Lead at Boom Africa Films & Television, certified executive coach, and board director. Specialist in high-end video storytelling, audience monetization, production syndication, and scalable studio operations.",
    focusModule: "Module 2: Content Strategy, Film IP & Broadcast Innovation",
    keyTopics: ["Original IP Monetization", "Studio Production Models", "Streaming Economics", "Audience Retention"],
    type: "flier"
  },
  {
    id: "bode-oguntoke",
    name: "Dr. Bode Oguntoke",
    title: "Head of Internal Audit",
    organisation: "FBN Holdings Plc (First HoldCo)",
    category: "Enterprise Risk",
    domain: "Financial Governance & Compliance",
    accentColor: "from-orange-600 to-orange-800 border-orange-500",
    image: "/speakers/bode-oguntoke-portrait.png",
    bio: "Head of Internal Audit at FBN Holdings Plc. Veteran authority on financial integrity, audit committees, fraud prevention, compliance frameworks, and enterprise sustainability in highly scrutinized sectors.",
    focusModule: "Module 4: Financial Governance, Risk Mitigation & Audit Defense",
    keyTopics: ["Cash Flow Governance", "Audit Controls", "Enterprise Risk Management", "Fiscal Compliance"],
    type: "flier"
  },

  // --- BOTTOM ROW OF FLIER (Row 2) ---
  {
    id: "bolaji-abimbola",
    name: "Bolaji Abimbola",
    title: "Chief Executive Officer",
    organisation: "Integrated Indigo Limited (Indigo PR)",
    category: "Public Relations",
    domain: "Strategic Advocacy & Public Affairs",
    accentColor: "from-orange-600 to-orange-800 border-orange-500",
    image: "/speakers/bolaji-abimbola-portrait.png",
    bio: "Chief Executive Officer at Integrated Indigo Limited (Indigo PR), one of Nigeria's foremost strategic communication and public relations advisory firms, managing multi-billion Naira market narratives for top multinationals.",
    focusModule: "Module 5: Commercial PR, Advocacy & Media Monetization Models",
    keyTopics: ["Strategic PR Architecture", "Sponsorship & Advertising", "Government Relations", "Crisis Management"],
    type: "flier"
  },
  {
    id: "mystery-2",
    name: "Guess the speaker",
    mysteryRole: "Digital Media & AI Pioneer",
    title: "Executive Platform & Technology Leader",
    organisation: "Leading Pan-African Digital Media Network",
    category: "Platform Innovation",
    domain: "AI Workflows & Digital Scaling",
    accentColor: "from-slate-600 to-slate-800 border-slate-400",
    image: "/speakers/mystery-2-portrait.png",
    isMystery: true,
    mysteryHint: "Pioneering media executive and technologist celebrated for deploying AI-assisted newsroom architectures and high-growth digital subscription funnels.",
    bio: "A headline digital media executive and platform strategist whose identity will be unveiled exclusively to registered delegates prior to commencement.",
    focusModule: "Module 4: Digital Transformation & Growth Execution",
    keyTopics: ["Digital Disruption", "AI Newsrooms", "Talent Transformation", "Platform Scaling"],
    type: "flier"
  },
  {
    id: "david-afolayan",
    name: "David Afolayan",
    title: "Co-founder & Editor-in-Chief",
    organisation: "Technext",
    category: "Tech Journalism",
    domain: "Digital Native Media & Monetization",
    accentColor: "from-sky-600 to-sky-800 border-sky-400",
    image: "/speakers/david-afolayan-portrait.png",
    bio: "Co-founder and Editor-in-Chief at Technext, one of Africa's fastest-growing tech and business media publications. Expert in data journalism, digital newsroom efficiency, newsletter growth, and community monetisation.",
    focusModule: "Module 6: Digital-First Newsrooms, Tech Platforms & Audience Scaling",
    keyTopics: ["Traffic Monetization", "Digital Productization", "Data Journalism", "Creator Economies"],
    type: "flier"
  },
  {
    id: "ezekiel-solesi",
    name: "Ezekiel Solesi",
    title: "Founder & Chief Executive Officer",
    organisation: "LIMBsimple",
    category: "Business Architecture",
    domain: "Enterprise Scale & Revenue Engineering",
    accentColor: "from-amber-600 to-amber-800 border-amber-500",
    image: "/speakers/ezekiel-solesi-portrait.png",
    bio: "Founder & CEO of LIMBsimple, serial entrepreneur, author, and respected business model strategist. Has architected commercial scaling models for over 2,500 businesses across media, technology, and consumer services.",
    focusModule: "Module 7: Business Model Innovation & Revenue Engineering for Media",
    keyTopics: ["Multi-Stream Monetization", "Margin Optimization", "Operational Systems", "Scale Execution"],
    type: "flier"
  },
  {
    id: "mystery-3",
    name: "Guess the speaker",
    mysteryRole: "Broadcasting & Commercial Authority",
    title: "Managing Director & Commercial Chief",
    organisation: "Premier African Broadcast & Media Conglomerate",
    category: "Commercial Scale",
    domain: "Broadcast P&L & Syndicated Distribution",
    accentColor: "from-blue-700 to-blue-900 border-blue-500",
    image: "/speakers/mystery-3-portrait.png",
    isMystery: true,
    mysteryHint: "High-ranking media proprietor and broadcast managing director with an illustrious track record of commercial syndication, multi-network expansion, and advertising dominance.",
    bio: "A prominent broadcast enterprise chief executive with decades of leadership across television, radio syndication, and digital streaming.",
    focusModule: "Module 8: Monetisation Models for Modern Media",
    keyTopics: ["Broadcast Economics", "Syndicated Distribution", "Subscription Design", "Media Valuation"],
    type: "flier"
  },

  // --- ACADEMIC & ADVISORY COUNCIL (Supporting Faculty) ---
  {
    id: "tolulope-olorundero",
    name: "Tolulope Olorundero",
    title: "Founder & Principal Consultant",
    organisation: "Mosron Communications & PR Primus",
    category: "Strategic Communications",
    domain: "Corporate Reputation & Executive Visibility",
    accentColor: "from-navy-800 to-navy-950 border-orange-500",
    image: "/logos/mosron.png",
    bio: "Founder of Mosron Communications and PR Primus. Leading consultant in executive thought leadership, crisis communications, and corporate branding across telecommunications, real estate, and FMCG sectors.",
    focusModule: "Executive Workshop: Elevating CEO Visibility & Institutional Authority",
    keyTopics: ["CEO Positioning", "Crisis Playbooks", "Media Relations", "Reputation Valuation"],
    type: "advisory"
  }
];

export function Faculty() {
  const [selectedMember, setSelectedMember] = useState<FacultyMember | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'flier' | 'advisory'>('all');

  const filteredMembers = facultyMembers.filter(member => {
    if (activeTab === 'all') return true;
    return member.type === activeTab;
  });

  const scrollAnimation = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <section id="faculty" className="py-24 bg-navy-900 text-white relative overflow-hidden border-t border-white/10">
      {/* Subtle blueprint grid overlay mirroring official flier aesthetic */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <PageContainer>
        <motion.div {...scrollAnimation} className="relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-sm mb-4">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400">
                  Academic &amp; Industry Governance
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
                Distinguished Faculty &amp; Session Leaders
              </h2>
              <p className="text-base md:text-lg text-cream-50/80 mt-4 leading-relaxed max-w-2xl font-light">
                Learn directly from proven boardroom chairs, leading economists, media CEOs, and digital disruptors steering Africa&apos;s foremost news, television, and communications institutions.
              </p>
            </div>

            {/* Filter Selector */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-lg shrink-0 self-start md:self-end">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-2 text-xs font-semibold rounded transition-all ${
                  activeTab === 'all' 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-cream-50/70 hover:text-white hover:bg-white/5'
                }`}
              >
                All Faculty ({facultyMembers.length})
              </button>
              <button
                onClick={() => setActiveTab('flier')}
                className={`px-3.5 py-2 text-xs font-semibold rounded transition-all ${
                  activeTab === 'flier' 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-cream-50/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Masterclass Faculty ({facultyMembers.filter(m => m.type === 'flier').length})
              </button>
              <button
                onClick={() => setActiveTab('advisory')}
                className={`px-3.5 py-2 text-xs font-semibold rounded transition-all ${
                  activeTab === 'advisory' 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-cream-50/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Advisory Council ({facultyMembers.filter(m => m.type === 'advisory').length})
              </button>
            </div>
          </div>

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {filteredMembers.map((member) => {
              const isMystery = member.isMystery;

              return (
                <motion.div
                  key={member.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedMember(member)}
                  className={`group relative bg-navy-800/80 rounded-lg overflow-hidden border border-white/10 hover:border-orange-500/70 shadow-lg hover:shadow-2xl transition-all flex flex-col cursor-pointer ${
                    isMystery ? 'ring-1 ring-white/10 hover:ring-orange-400/50' : ''
                  }`}
                >
                  {/* Portrait Stage */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-navy-950 flex items-center justify-center">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-80 z-10" />

                    {member.type === 'advisory' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white/5 group-hover:bg-white/10 transition-colors">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="max-h-20 w-auto max-w-[80%] object-contain filter brightness-110 drop-shadow-md group-hover:scale-105 transition-transform" 
                        />
                        <span className="mt-4 text-[10px] uppercase tracking-widest font-bold text-orange-400/90 text-center">
                          Advisory Fellow
                        </span>
                      </div>
                    ) : (
                      <img
                        src={member.image}
                        alt={member.name}
                        className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                          isMystery ? 'scale-95 group-hover:scale-100 opacity-90' : 'group-hover:scale-105'
                        }`}
                        loading="lazy"
                      />
                    )}

                    {/* Mystery Overlay Clue Badge */}
                    {isMystery && (
                      <div className="absolute top-2.5 right-2.5 z-20">
                        <span className="inline-flex items-center gap-1 bg-sky-500/90 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                          <HelpCircle className="w-3 h-3" />
                          Reveal
                        </span>
                      </div>
                    )}

                    {/* Domain Pill Tag */}
                    <div className="absolute top-2.5 left-2.5 z-20">
                      <span className="inline-block bg-navy-900/85 backdrop-blur-sm text-cream-50 font-semibold text-[10px] tracking-wide px-2 py-0.5 rounded border border-white/10">
                        {member.category}
                      </span>
                    </div>

                    {/* Hover Prompt */}
                    <div className="absolute inset-0 z-20 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-orange-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                        {isMystery ? 'View Clue' : 'View Profile'}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Institutional Affiliation */}
                  <div className="p-4 flex-1 flex flex-col justify-between bg-navy-800/90 border-t border-white/5">
                    <div>
                      <h3 className={`text-base font-bold text-white group-hover:text-orange-400 transition-colors tracking-tight leading-snug ${
                        isMystery ? 'font-serif italic text-cream-100' : ''
                      }`}>
                        {member.name}
                      </h3>

                      {isMystery && member.mysteryRole && (
                        <p className="text-[11px] font-semibold text-orange-400 mt-0.5">
                          {member.mysteryRole}
                        </p>
                      )}

                      <p className="text-xs text-cream-50/80 font-medium line-clamp-2 mt-1 leading-snug">
                        {member.title}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-cream-50/60 font-light">
                      <span className="truncate pr-1">{member.organisation}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-orange-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Footnote & Advisory Summary */}
          <div className="mt-14 p-6 bg-white/[0.03] border border-white/10 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                  Rigorous Peer-Level Dialogue • Strictly Chatham House Rule
                </h4>
                <p className="text-xs text-cream-50/70 mt-0.5">
                  Sessions are designed exclusively for owners, managing directors, and C-suite leaders to dissect confidential business strategies without press cameras.
                </p>
              </div>
            </div>

            <a
              href="#apply"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="shrink-0 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-2.5 rounded-md border border-white/20 transition-colors"
            >
              Reserve an Executive Seat
              <ArrowUpRight className="w-4 h-4 text-orange-400" />
            </a>
          </div>
        </motion.div>
      </PageContainer>

      {/* Interactive Executive Dossier / Clue Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-navy-950/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-navy-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden z-10 my-8 text-white max-h-[90vh] flex flex-col"
            >
              {/* Top Accent Strip */}
              <div className="h-1.5 bg-gradient-to-r from-blue-600 via-orange-500 to-amber-500 shrink-0" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-navy-950/60 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                {/* Header & Portrait */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-white/10">
                  <div className="w-28 h-36 shrink-0 rounded-lg overflow-hidden bg-navy-950 border border-white/20 shadow-md">
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="text-center sm:text-left flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2">
                      {selectedMember.category}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-serif text-white font-bold tracking-tight">
                      {selectedMember.name}
                    </h3>

                    {selectedMember.isMystery && selectedMember.mysteryRole && (
                      <p className="text-sm font-semibold text-orange-400 mt-1">
                        {selectedMember.mysteryRole}
                      </p>
                    )}

                    <p className="text-sm text-cream-50/90 font-medium mt-1 leading-relaxed">
                      {selectedMember.title}
                    </p>

                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-cream-50/60 mt-2">
                      <Building2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span>{selectedMember.organisation}</span>
                    </div>
                  </div>
                </div>

                {/* Mystery Hint Box or Bio */}
                {selectedMember.isMystery ? (
                  <div className="bg-sky-950/40 border border-sky-500/30 p-5 rounded-lg">
                    <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase tracking-wider mb-2">
                      <HelpCircle className="w-4 h-4 text-sky-400" />
                      Executive Teaser Clue
                    </div>
                    <p className="text-sm text-cream-50/90 italic leading-relaxed">
                      &ldquo;{selectedMember.mysteryHint}&rdquo;
                    </p>
                    <p className="text-xs text-cream-50/60 mt-3">
                      This surprise keynote will be revealed in the final briefing pack sent to accepted delegates.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-orange-400 mb-2">
                      Executive Background &amp; Profile
                    </h4>
                    <p className="text-sm text-cream-50/80 leading-relaxed font-light">
                      {selectedMember.bio}
                    </p>
                  </div>
                )}

                {/* Focus Module / Session */}
                {selectedMember.focusModule && (
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cream-100 mb-1">
                      <BookOpen className="w-4 h-4 text-orange-400" />
                      Masterclass Session Engagement
                    </div>
                    <p className="text-sm font-semibold text-orange-400/90">
                      {selectedMember.focusModule}
                    </p>
                  </div>
                )}

                {/* Key Discussion Topics */}
                {selectedMember.keyTopics && (
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-cream-50/70 mb-3 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-orange-400" />
                      Core Discussion Themes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.keyTopics.map((topic, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs bg-white/5 border border-white/10 px-3 py-1 rounded text-cream-50/90 font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-orange-400" />
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Footer */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-cream-50/60 text-center sm:text-left">
                    Limited to 30 senior executives • 21–22 Oct 2026
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMember(null);
                      // Trigger apply modal
                      const btn = document.querySelector('[data-apply-trigger]') as HTMLButtonElement;
                      if (btn) btn.click();
                      else {
                        const heroBtn = document.querySelector('#hero button') as HTMLButtonElement;
                        if (heroBtn) heroBtn.click();
                        else {
                          window.location.hash = 'apply';
                        }
                      }
                    }}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-md shadow-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    Apply to Attend Masterclass
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

