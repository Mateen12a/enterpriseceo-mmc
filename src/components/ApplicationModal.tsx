import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, CheckCircle, Calendar, ShieldCheck } from 'lucide-react';
import { useApplyModal } from '../context/ApplyModalContext';

export function ApplicationModal() {
  const { isOpen, closeApplyModal } = useApplyModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    jobTitle: '',
    organisation: '',
    orgType: '',
    email: '',
    phone: '+234',
    country: 'Nigeria',
    source: '',
    day3: 'yes',
    notes: '',
    consent: false,
  });

  const firstInputRef = useRef<HTMLInputElement>(null);

  // Body scroll locking and Escape key handler
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeApplyModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
      setIsSuccess(false);
    }
  }, [isOpen, closeApplyModal]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1400));

    // TODO: Connect this to your persistent storage (e.g. Firebase Firestore, POST /api/register, or webhook)
    console.log('Application submitted:', formData);

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeApplyModal}
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-navy-900/10 overflow-hidden my-auto max-h-[92vh] flex flex-col z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-navy-900 text-white px-6 py-5 flex items-start justify-between border-b-4 border-orange-500 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-orange-400">
                    EnterpriseCEO Masterclass
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-cream-50/80 font-medium">
                    <Calendar className="w-3 h-3 text-orange-400" />
                    21–22 October 2026
                  </span>
                </div>
                <h3 id="modal-title" className="text-2xl font-serif font-bold text-white">
                  Apply to Attend
                </h3>
                <p className="text-xs text-cream-50/70 mt-0.5">
                  By invitation and selective registration. Limited to 50 senior media executives.
                </p>
              </div>

              <button
                type="button"
                onClick={closeApplyModal}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              {isSuccess ? (
                <div className="py-8 text-center space-y-4" aria-live="polite">
                  <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-navy-900">
                    Application Received
                  </h4>
                  <p className="text-ink-900/80 max-w-md mx-auto text-base leading-relaxed">
                    Thank you for applying to the <strong>EnterpriseCEO Media Owners &amp; Executives Masterclass</strong>. Our admissions committee is reviewing your submission and will be in touch with the next steps shortly.
                  </p>
                  <div className="pt-6">
                    <button
                      onClick={closeApplyModal}
                      className="bg-navy-900 hover:bg-navy-800 text-white font-semibold px-8 py-3 rounded-md transition-colors shadow-md text-sm"
                    >
                      Return to Website
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="modal-fullName" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Full Name <span className="text-orange-600">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id="modal-fullName"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-grey-50 border border-grey-200 rounded-md focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-sm text-ink-900 placeholder:text-ink-900/40"
                        placeholder="Jane Doe"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="modal-jobTitle" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Job Title / Role <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="modal-jobTitle"
                        required
                        value={formData.jobTitle}
                        onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-grey-50 border border-grey-200 rounded-md focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-sm text-ink-900 placeholder:text-ink-900/40"
                        placeholder="CEO, Managing Director, Editor-in-Chief"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="modal-organisation" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Organisation / Media House <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="modal-organisation"
                        required
                        value={formData.organisation}
                        onChange={e => setFormData({ ...formData, organisation: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-grey-50 border border-grey-200 rounded-md focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-sm text-ink-900 placeholder:text-ink-900/40"
                        placeholder="e.g. Punch Newspapers, Indigo PR"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="modal-orgType" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Organisation Type <span className="text-orange-600">*</span>
                      </label>
                      <select
                        id="modal-orgType"
                        required
                        value={formData.orgType}
                        onChange={e => setFormData({ ...formData, orgType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-grey-50 border border-grey-200 rounded-md focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-sm text-ink-900"
                      >
                        <option value="">Select type...</option>
                        <option value="Broadcast">Broadcast</option>
                        <option value="Print">Print</option>
                        <option value="Digital/Online">Digital/Online</option>
                        <option value="Radio">Radio</option>
                        <option value="Production/Content Studio">Production/Content Studio</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="modal-email" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Work Email Address <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="email"
                        id="modal-email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-grey-50 border border-grey-200 rounded-md focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-sm text-ink-900 placeholder:text-ink-900/40"
                        placeholder="executive@organisation.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="modal-phone" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Phone Number <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="tel"
                        id="modal-phone"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-grey-50 border border-grey-200 rounded-md focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-sm text-ink-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="modal-country" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Country <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="modal-country"
                        required
                        value={formData.country}
                        onChange={e => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-grey-50 border border-grey-200 rounded-md focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-sm text-ink-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="modal-source" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        How did you hear about us?
                      </label>
                      <select
                        id="modal-source"
                        value={formData.source}
                        onChange={e => setFormData({ ...formData, source: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-grey-50 border border-grey-200 rounded-md focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-sm text-ink-900"
                      >
                        <option value="">Select source...</option>
                        <option value="Referral">Executive Referral</option>
                        <option value="EnterpriseCEO Website/Newsletter">EnterpriseCEO Newsletter / Website</option>
                        <option value="Social Media">LinkedIn / Social Media</option>
                        <option value="Email">Direct Email Invitation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Day 3 Tech Immersion toggle */}
                  <div className="p-4 bg-blue-50/60 border border-blue-500/20 rounded-md space-y-2">
                    <span className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                      Interested in the optional Day 3 Tech Immersion? <span className="text-orange-600">*</span>
                    </span>
                    <p className="text-xs text-ink-900/70">
                      Visit leading technology environments (such as Moniepoint, Google, or Meta).
                    </p>
                    <div className="flex items-center space-x-6 pt-1">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="modal-day3"
                          value="yes"
                          checked={formData.day3 === 'yes'}
                          onChange={() => setFormData({ ...formData, day3: 'yes' })}
                          className="w-4 h-4 text-navy-900 border-grey-300 focus:ring-navy-900"
                        />
                        <span className="text-sm font-medium text-navy-900">Yes, include Day 3</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="modal-day3"
                          value="no"
                          checked={formData.day3 === 'no'}
                          onChange={() => setFormData({ ...formData, day3: 'no' })}
                          className="w-4 h-4 text-navy-900 border-grey-300 focus:ring-navy-900"
                        />
                        <span className="text-sm font-medium text-navy-900">2-Day Masterclass Only</span>
                      </label>
                    </div>
                  </div>

                  {/* Additional notes */}
                  <div className="space-y-1.5">
                    <label htmlFor="modal-notes" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                      Additional Notes / Areas of Strategic Focus
                    </label>
                    <textarea
                      id="modal-notes"
                      rows={2}
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-grey-50 border border-grey-200 rounded-md focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-sm text-ink-900"
                      placeholder="Specific priorities or topics you wish to explore..."
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <label className="flex items-start gap-3 p-3.5 bg-grey-50 rounded-md border border-grey-200 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-navy-900 border-grey-300 focus:ring-navy-900 rounded"
                    />
                    <span className="text-xs text-ink-900 leading-relaxed">
                      I consent to EnterpriseCEO contacting me regarding this programme and reviewing my credentials for admission. <span className="text-orange-600">*</span>
                    </span>
                  </label>

                  {/* Modal Footer / Actions */}
                  <div className="pt-3 border-t border-grey-100 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={closeApplyModal}
                      className="text-xs font-semibold text-ink-900/70 hover:text-navy-900 py-2.5 px-4 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm px-7 py-3 rounded-md transition-all shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
