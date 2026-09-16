import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, Calendar, Users } from 'lucide-react';
import { useApplyModal } from '../context/ApplyModalContext';
import { ApplicationModal } from './ApplicationModal';

/**
 * Shared page-level container to enforce strict horizontal alignment
 * across all sections on large screens (1280px max-width, identical padding).
 */
export function PageContainer({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Layout({ children, onOpenAdmin }: { children: React.ReactNode; onOpenAdmin?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const { openApplyModal } = useApplyModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setIsPastHero(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hide sticky bar when footer is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px 0px -10px 0px',
        threshold: 0,
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleApplyClick = () => {
    setMobileMenuOpen(false);
    openApplyModal();
  };

  const showFloatingBar = isPastHero && !isFooterVisible;

  const navLinks = [
    { name: 'Overview', href: '#overview' },
    { name: 'Who It\'s For', href: '#who-its-for' },
    { name: 'Programme Structure', href: '#structure' },
    { name: 'Curriculum', href: '#curriculum' },
    { name: 'Faculty', href: '#faculty' },
    { name: 'Logistics', href: '#logistics' },
    { name: 'Sponsorship', href: '#sponsorship' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-ink-900 scroll-smooth">
      {/* Sticky Top Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-navy-900/95 backdrop-blur-md shadow-md py-3' : 'bg-navy-900 py-4 sm:py-5'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 text-white group focus:outline-none">
            {/* Authentic Brand Geometric Mark */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-navy-900 flex items-center justify-center">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Left panel */}
                <polygon points="7,0 50,0 50,50" fill="white" />
                <polygon points="7,100 50,100 50,50" fill="white" />
                <circle cx="20" cy="50" r="15.5" fill="white" />
                {/* Right panel */}
                <polygon points="53,0 100,0 100,50" fill="white" />
                <polygon points="53,100 100,100 100,50" fill="white" />
              </svg>
            </div>

            {/* Brand Text Lockup matching source art */}
            <div className="flex flex-col text-left font-sans">
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.16em] uppercase text-white/80 leading-tight">
                EnterpriseCEO
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight">
                Media Owners &amp; Executives
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-tight text-orange-400 leading-tight">
                Masterclass
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium text-cream-50/90">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="hover:text-white transition-colors">
                {link.name}
              </a>
            ))}
            <button 
              onClick={handleApplyClick}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              Apply to Attend
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={handleApplyClick}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-md font-bold text-xs transition-colors shadow-sm"
            >
              Apply
            </button>
            <button 
              className="text-white p-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <nav className="lg:hidden bg-navy-900 border-t border-white/10 p-6 flex flex-col space-y-4 shadow-2xl">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-white text-base font-medium py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={handleApplyClick}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-md text-center mt-2 shadow-md transition-colors"
            >
              Apply to Attend
            </button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-16 sm:pb-0">
        {children}
      </main>

      {/* Floating Sticky "Apply" Bar (appears once scrolled past Hero, hides when footer is reached) */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-navy-900/95 backdrop-blur-md border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] py-3 sm:py-3.5 transition-all duration-300 transform ${
          showFloatingBar ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Desktop / Tablet Event Indicator - Lagos removed per user request */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-cream-50/80">
              <span className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded font-semibold text-xs">
                <Calendar className="w-3.5 h-3.5" />
                21–22 October 2026
              </span>
              <span className="text-white/40">•</span>
              <span className="inline-flex items-center gap-1 text-cream-50/90 truncate">
                <Users className="w-3.5 h-3.5 text-orange-400" />
                Limited to 30 Senior Media Leaders
              </span>
            </div>

            {/* Mobile Event Indicator */}
            <div className="sm:hidden flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">Media Owners Masterclass</span>
              <span className="text-[11px] text-orange-400 font-medium">21–22 Oct 2026 • 30 Seats</span>
            </div>
          </div>

          <button
            onClick={handleApplyClick}
            className="shrink-0 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 sm:px-7 py-2.5 rounded-md shadow-lg transition-all flex items-center gap-1.5"
          >
            Apply to Attend
            <ArrowUpRight className="w-4 h-4 hidden sm:inline" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer ref={footerRef} className="bg-navy-900 text-white py-16 border-t-[16px] border-orange-500">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 shrink-0 bg-navy-900 flex items-center justify-center">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <polygon points="7,0 50,0 50,50" fill="white" />
                  <polygon points="7,100 50,100 50,50" fill="white" />
                  <circle cx="20" cy="50" r="15.5" fill="white" />
                  <polygon points="53,0 100,0 100,50" fill="white" />
                  <polygon points="53,100 100,100 100,50" fill="white" />
                </svg>
              </div>
              <div className="flex flex-col text-left font-sans">
                <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/80">
                  EnterpriseCEO
                </span>
                <span className="text-sm font-bold tracking-tight text-white leading-tight">
                  Media Owners &amp; Executives
                </span>
                <span className="text-sm font-bold tracking-tight text-orange-400 leading-tight">
                  Masterclass
                </span>
              </div>
            </div>
            <p className="font-medium">
              <a 
                href="https://enterpriseceo.africa" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cream-50/90 hover:text-orange-400 transition-colors"
              >
                EnterpriseCEO Media Company
              </a>
            </p>
            <p className="text-cream-50/80 max-w-sm">
              1 Emina Crescent, off Toyin Street, Ikeja, Lagos, Nigeria
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-base text-orange-400 mb-4 tracking-wide uppercase text-xs">Sponsorships &amp; Enquiries</h4>
            <div className="text-xs space-y-3">
              <div>
                <p className="font-bold text-white text-xs">Tumilara</p>
                <p><a href="mailto:tumilara.amosu@enterpriseceo.africa" className="text-cream-50/80 hover:text-white transition-colors">tumilara.amosu@enterpriseceo.africa</a></p>
                <p className="text-cream-50/70 text-[11px]">+234 (0) 706 173 7282 | +234 (0) 805 754 4695</p>
              </div>
              <div>
                <p className="font-bold text-white text-xs">Aaron</p>
                <p><a href="mailto:aaron.abumere@enterpriseceo.africa" className="text-cream-50/80 hover:text-white transition-colors">aaron.abumere@enterpriseceo.africa</a></p>
                <p className="text-cream-50/70 text-[11px]">+234 (0) 906 791 5609 | +234 (0) 805 754 4695</p>
              </div>
            </div>
            <p className="pt-1"><a href="https://enterpriseceo.africa" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-4 text-xs">enterpriseceo.africa</a></p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-base text-orange-400 mb-4 tracking-wide uppercase text-xs">Connect</h4>
            <ul className="space-y-3">
              <li><a href="https://linkedin.com/company/enterpriseceo" target="_blank" rel="noopener noreferrer" className="text-cream-50/80 hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="https://x.com/enterpriseceo" target="_blank" rel="noopener noreferrer" className="text-cream-50/80 hover:text-white transition-colors">X/Twitter</a></li>
              <li><a href="https://instagram.com/enterpriseceo" target="_blank" rel="noopener noreferrer" className="text-cream-50/80 hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://web.facebook.com/EntrepriseCEO" target="_blank" rel="noopener noreferrer" className="text-cream-50/80 hover:text-white transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/10 text-cream-50/50 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p>
              © 2026{' '}
              <a 
                href="https://enterpriseceo.africa" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cream-50/90 hover:text-orange-400 underline underline-offset-4 transition-colors font-medium"
              >
                EnterpriseCEO
              </a>
              . All rights reserved.
            </p>
            <span className="text-white/30">•</span>
            <span className="text-xs text-cream-50/50">
              Powered by MDEV Collective
            </span>
          </div>
          <p className="text-xs text-cream-50/40">Media Owners &amp; Executives Masterclass • 21–22 October 2026</p>
        </div>
      </footer>

      {/* Executive Application Modal */}
      <ApplicationModal />
    </div>
  );
}
