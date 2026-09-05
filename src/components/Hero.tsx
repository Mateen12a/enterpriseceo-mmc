import { ArrowUpRight } from 'lucide-react';
import { useApplyModal } from '../context/ApplyModalContext';

export function Hero() {
  const { openApplyModal } = useApplyModal();

  return (
    <section className="bg-navy-900 text-white pt-32 pb-24 px-6 md:px-12 relative overflow-hidden" id="overview">
      {/* Graphic motif placeholder */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M400 0L0 400H400V0Z" fill="currentColor"/>
          <path d="M400 100L100 400H400V100Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-4 block">
          EnterpriseCEO
        </span>
        <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-6">
          Media Owners <span className="text-orange-500">&amp;</span><br />
          Executives Masterclass
        </h1>
        <p className="text-xl md:text-2xl text-cream-50/90 font-light mb-10 max-w-2xl">
          <em className="font-serif">Strategic Leadership, Growth &amp; Sustainability in Modern Media</em>
        </p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
          <div className="bg-blue-600 px-6 py-4 border-l-4 border-orange-500">
            <p className="font-bold text-xl">21–22 October 2026</p>
          </div>
          <div className="max-w-md">
            <p className="text-sm text-cream-50/80 leading-relaxed">
              Two-day core executive programme, plus an optional third-day Executive Media &amp; Tech Immersion Experience
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
          <p className="text-xs text-cream-50/60 max-w-md">
            By invitation and selective registration. Limited to 50 carefully selected senior media executives.
          </p>
        </div>
      </div>
    </section>
  );
}
