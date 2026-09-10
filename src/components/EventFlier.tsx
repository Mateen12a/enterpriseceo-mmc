import { PageContainer } from './Layout';
import { motion } from 'motion/react';

export function EventFlier() {
  return (
    <section className="bg-navy-900 py-16 border-t border-white/10" id="flier">
      <PageContainer>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Official Event Flier</h2>
            <p className="text-cream-50/80 text-lg">
              Official masterclass details, executive modules, and schedule overview.
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="w-full bg-white/5 border border-white/10 p-2 md:p-4 rounded-xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            {/* The user should upload their image named "flier.jpg" into the public folder for this to work natively. */}
            <div className="aspect-[4/5] bg-navy-800 flex flex-col items-center justify-center text-white/50 rounded-lg overflow-hidden relative">
              <img 
                src="/flier.jpg" 
                alt="EnterpriseCEO Masterclass 2026 Flier" 
                className="w-full h-full object-contain bg-navy-900 relative z-10"
                onError={(e) => {
                  // Fallback if the image isn't found
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex flex-col items-center justify-center p-8 text-center h-full border-2 border-dashed border-white/20 rounded-lg">
                        <svg class="w-12 h-12 text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p class="font-medium text-white mb-2">Image Not Found</p>
                        <p class="text-sm text-white/60">Upload your flier as <code class="bg-white/10 px-1 py-0.5 rounded">flier.jpg</code> to the public folder.</p>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  );
}
