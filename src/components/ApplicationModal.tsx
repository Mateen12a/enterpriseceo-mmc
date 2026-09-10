import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, CheckCircle, Calendar, ShieldCheck } from 'lucide-react';
import { useApplyModal } from '../context/ApplyModalContext';
import { AddToCalendar } from './AddToCalendar';

export function ApplicationModal() {
  const { isOpen, closeApplyModal } = useApplyModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '+234',
    organisation: '',
    position: '',
    category: '',
    otherCategory: '',
    yearsExperience: '',
    goals: '',
    paidEventConsent: false,
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
    setErrorMessage(null);

    const resolvedCategory = formData.category === 'Other' 
      ? (formData.otherCategory.trim() || 'Other') 
      : formData.category;

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      organisation: formData.organisation.trim(),
      position: formData.position.trim(),
      jobTitle: formData.position.trim(),
      category: resolvedCategory,
      otherCategory: formData.category === 'Other' ? formData.otherCategory.trim() : undefined,
      yearsExperience: formData.yearsExperience,
      goals: formData.goals.trim(),
      paidEventConsent: formData.paidEventConsent,
      // Compatibility aliases
      organisationType: resolvedCategory,
      notes: formData.goals.trim(),
      consent: formData.paidEventConsent,
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application. Please check your details and try again.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage(err.message || 'An unexpected network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="bg-navy-900 text-white px-4 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-3 border-b-4 border-orange-500 shrink-0">
              <div className="min-w-0 flex-1">
                {/* Meta Header / Eyebrow & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-orange-400">
                    EnterpriseCEO Masterclass
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-cream-50/90 font-medium bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 w-fit shrink-0">
                    <Calendar className="w-3 h-3 text-orange-400 shrink-0" />
                    <span>21–22 October 2026</span>
                  </div>
                </div>

                <h3 id="modal-title" className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                  {isSuccess ? "Application Received" : "Apply to Attend"}
                </h3>
                <p className="text-[11px] sm:text-xs text-cream-50/75 mt-1 leading-snug">
                  {isSuccess 
                    ? "2026 Executive Cohort Admissions • Confirmation Notice" 
                    : "By invitation and selective registration. Limited to 50 senior media executives."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeApplyModal}
                className="text-white/70 hover:text-white p-1.5 -mr-1 -mt-1 sm:mr-0 sm:mt-0 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-5 sm:space-y-6">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className="py-6 text-center space-y-5"
                    aria-live="polite"
                  >
                    {/* Animated Checkmark Circle */}
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 280, 
                        damping: 18, 
                        delay: 0.1 
                      }}
                      className="w-16 h-16 bg-orange-500/10 text-orange-500 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner"
                    >
                      <CheckCircle className="w-9 h-9" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.18 }}
                      className="space-y-2"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-block">
                        Submission Confirmed
                      </span>
                      <h4 className="text-2xl font-serif font-bold text-navy-900">
                        Application Received
                      </h4>
                      <p className="text-ink-900/80 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                        Thank you for applying to the <strong>EnterpriseCEO Media Owners &amp; Executives Masterclass</strong>.
                      </p>
                    </motion.div>

                    {/* Next Steps Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 }}
                      className="bg-cream-50/70 border border-navy-900/10 rounded-lg p-5 max-w-md mx-auto text-left space-y-3 shadow-sm"
                    >
                      <h5 className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-orange-500" />
                        What Happens Next:
                      </h5>
                      <ul className="text-xs text-ink-900/80 space-y-2 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                          <span>The admissions committee reviews executive profile credentials against the 50-seat cohort criteria.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                          <span>Our secretariat will contact you via <strong>{formData.email || 'your email'}</strong> within 48 hours regarding registration status.</span>
                        </li>
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.32 }}
                      className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                      <AddToCalendar />
                      <button
                        type="button"
                        onClick={closeApplyModal}
                        className="bg-navy-900 hover:bg-navy-800 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-md transition-all shadow-md text-sm"
                      >
                        Return to Programme
                      </button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="application-form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {errorMessage && (
                      <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium flex items-start gap-2">
                        <span className="font-bold">Error:</span>
                        <span>{errorMessage}</span>
                      </div>
                    )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-fullName" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Full Name <span className="text-orange-600">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id="modal-fullName"
                        name="fullName"
                        autoComplete="name"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] bg-grey-50 border border-grey-200 rounded-lg focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-base sm:text-sm text-ink-900 placeholder:text-ink-900/40"
                        placeholder="e.g. Olumide Adewunmi"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-email" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Email Address <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="email"
                        id="modal-email"
                        name="email"
                        inputMode="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] bg-grey-50 border border-grey-200 rounded-lg focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-base sm:text-sm text-ink-900 placeholder:text-ink-900/40"
                        placeholder="executive@organisation.com"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-phone" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Phone Number <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="tel"
                        id="modal-phone"
                        name="phone"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] bg-grey-50 border border-grey-200 rounded-lg focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-base sm:text-sm text-ink-900 placeholder:text-ink-900/40"
                        placeholder="e.g. +234 803 000 0000"
                      />
                    </div>

                    {/* Organization / Media House */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-organisation" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Organization / Media House
                      </label>
                      <input
                        type="text"
                        id="modal-organisation"
                        name="organisation"
                        autoComplete="organization"
                        value={formData.organisation}
                        onChange={e => setFormData({ ...formData, organisation: e.target.value })}
                        className="w-full px-3.5 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] bg-grey-50 border border-grey-200 rounded-lg focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-base sm:text-sm text-ink-900 placeholder:text-ink-900/40"
                        placeholder="e.g. Channels Television, BusinessDay..."
                      />
                    </div>

                    {/* Current Position / Designation */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-position" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Current Position / Designation
                      </label>
                      <input
                        type="text"
                        id="modal-position"
                        name="position"
                        autoComplete="organization-title"
                        value={formData.position}
                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-3.5 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] bg-grey-50 border border-grey-200 rounded-lg focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-base sm:text-sm text-ink-900 placeholder:text-ink-900/40"
                        placeholder="e.g. Chief Executive Officer, Managing Director..."
                      />
                    </div>

                    {/* Which Category Best Describes You */}
                    <div className="space-y-1.5">
                      <label htmlFor="modal-category" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        Which Category Best Describes You <span className="text-orange-600">*</span>
                      </label>
                      <select
                        id="modal-category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] bg-grey-50 border border-grey-200 rounded-lg focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-base sm:text-sm text-ink-900"
                      >
                        <option value="">Select category...</option>
                        <option value="Media Owner">Media Owner</option>
                        <option value="CEO/ Managing Director">CEO/ Managing Director</option>
                        <option value="Publisher">Publisher</option>
                        <option value="Editor">Editor</option>
                        <option value="Broadcaster">Broadcaster</option>
                        <option value="Media Entrepreneur">Media Entrepreneur</option>
                        <option value="Communications Executive">Communications Executive</option>
                        <option value="Other">Other</option>
                      </select>

                      {formData.category === 'Other' && (
                        <div className="pt-1.5">
                          <label htmlFor="modal-otherCategory" className="block text-[11px] font-bold uppercase tracking-wider text-orange-600 mb-1">
                            Specify Category <span className="text-orange-600">*</span>
                          </label>
                          <input
                            type="text"
                            id="modal-otherCategory"
                            name="otherCategory"
                            required
                            value={formData.otherCategory}
                            onChange={e => setFormData({ ...formData, otherCategory: e.target.value })}
                            className="w-full px-3.5 py-3 sm:py-2 min-h-[46px] sm:min-h-[40px] bg-white border-2 border-orange-400 rounded-lg focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-base sm:text-sm text-ink-900 placeholder:text-ink-900/40 shadow-sm"
                            placeholder="Specify your category..."
                            autoFocus
                          />
                        </div>
                      )}
                    </div>

                    {/* How many years of experience do you have in the Media industry? */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor="modal-yearsExperience" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                        How many years of experience do you have in the Media industry? <span className="text-orange-600">*</span>
                      </label>
                      <select
                        id="modal-yearsExperience"
                        name="yearsExperience"
                        required
                        value={formData.yearsExperience}
                        onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })}
                        className="w-full px-3.5 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] bg-grey-50 border border-grey-200 rounded-lg focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-base sm:text-sm text-ink-900"
                      >
                        <option value="">Select years of experience...</option>
                        <option value="Less than 5 Years">Less than 5 Years</option>
                        <option value="5-10 Years">5-10 Years</option>
                        <option value="11-20 Years">11-20 Years</option>
                        <option value="Over 20 Years">Over 20 Years</option>
                      </select>
                    </div>
                  </div>

                  {/* What do you hope to gain from attending this Masterclass? */}
                  <div className="space-y-1.5">
                    <label htmlFor="modal-goals" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                      What do you hope to gain from attending this Masterclass? <span className="text-orange-600">*</span>
                    </label>
                    <textarea
                      id="modal-goals"
                      name="goals"
                      required
                      rows={3}
                      value={formData.goals}
                      onChange={e => setFormData({ ...formData, goals: e.target.value })}
                      className="w-full px-3.5 py-3 sm:py-2.5 min-h-[80px] bg-grey-50 border border-grey-200 rounded-lg focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-base sm:text-sm text-ink-900 placeholder:text-ink-900/40"
                      placeholder="Share your primary expectations, leadership objectives, or institutional priorities..."
                    />
                  </div>

                  {/* Paid Event Understanding Checkbox */}
                  <label className="flex items-start gap-3.5 p-4 bg-orange-50/40 hover:bg-orange-50/70 rounded-lg border border-orange-200/80 cursor-pointer select-none transition-colors">
                    <input
                      type="checkbox"
                      id="modal-paidEventConsent"
                      name="paidEventConsent"
                      required
                      checked={formData.paidEventConsent}
                      onChange={e => setFormData({ ...formData, paidEventConsent: e.target.checked })}
                      className="mt-0.5 w-5 h-5 accent-orange-500 text-navy-900 border-grey-300 focus:ring-orange-500 rounded shrink-0 cursor-pointer"
                    />
                    <div className="text-xs text-ink-900 leading-relaxed">
                      <span className="font-semibold text-navy-900">
                        I understand that this is a paid event and that further participation details, including payment information, will be communicated after registration.
                      </span>{" "}
                      <span className="text-orange-600 font-bold">*</span>
                      <div className="text-[11px] text-orange-700/80 mt-1 font-medium flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        Tick "Yes" to acknowledge and confirm before submitting.
                      </div>
                    </div>
                  </label>

                  {/* Modal Footer / Actions */}
                  <div className="pt-4 border-t border-grey-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 -skew-x-12 px-3.5 py-1.5 rounded-sm shadow-sm border-l-2 border-orange-500">
                        <div className="skew-x-12 text-left">
                          <span className="block text-[9px] font-bold tracking-[0.15em] uppercase text-white/95 leading-tight">
                            ACCESS FEE
                          </span>
                          <span className="block text-base font-black text-white leading-none mt-0.5">
                            500k
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-bold text-navy-900 block">₦500,000</span>
                        <span className="text-[10px] text-grey-500">Per delegate</span>
                      </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={closeApplyModal}
                        className="w-full sm:w-auto text-center py-3 sm:py-2.5 px-4 text-xs font-semibold text-ink-900/70 hover:text-navy-900 rounded-lg hover:bg-grey-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto justify-center min-h-[48px] px-8 py-3.5 sm:py-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-sm rounded-lg transition-all shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                  </div>
                </motion.form>
              )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
