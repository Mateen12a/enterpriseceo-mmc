import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2, 
  X, 
  CheckCircle, 
  Calendar, 
  ShieldCheck, 
  CreditCard, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  MailCheck,
  Send
} from 'lucide-react';
import { useApplyModal } from '../context/ApplyModalContext';
import { AddToCalendar } from './AddToCalendar';

declare global {
  interface Window {
    FlutterwaveCheckout?: (options: any) => { close?: () => void } | undefined;
  }
}

// Known disposable email domains to block upfront
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'sharklasers.com', 'yopmail.com', 'trashmail.com', 'dispostable.com',
  'fake.com', 'test.com', 'example.com', 'throwaway.com', 'burnermail.io',
  'getairmail.com', 'maildrop.cc', 'inboxkitten.com', 'crazymailing.com',
  'fakemailgenerator.com', 'dropmail.me', 'temp-mail.org', 'nada.ltd',
  'mytemp.email', 'disposablemail.com', 'mohmal.com', 'tempmailaddress.com'
]);

type ModalStep = 'form' | 'payment' | 'paid_success';

export function ApplicationModal() {
  const { isOpen, closeApplyModal, openApplyModal } = useApplyModal();
  
  // Step flow: 'form' -> 'payment' -> 'paid_success' | 'offline_success'
  const [currentStep, setCurrentStep] = useState<ModalStep>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
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

  // Email Verification State
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [sandboxOtp, setSandboxOtp] = useState<string | null>(null);

  // Post-submission registration data
  const [registeredParticipant, setRegisteredParticipant] = useState<{
    id: string;
    fullName: string;
    email: string;
    organisation?: string;
  } | null>(null);

  // Flutterwave config & status
  const [paymentConfig, setPaymentConfig] = useState<{
    publicKey: string;
    amount: number;
    formattedAmount: string;
  }>({
    publicKey: '',
    amount: 500000,
    formattedAmount: '₦500,000',
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);
  const flwHandlerRef = useRef<{ close?: () => void } | null>(null);
  const flwReturnHandledRef = useRef(false);
  const [redirectReference, setRedirectReference] = useState<string | null>(null);

  // Load Flutterwave config on mount
  useEffect(() => {
    fetch('/api/flutterwave/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPaymentConfig({
            publicKey: data.publicKey || '',
            amount: data.amount || 500000,
            formattedAmount: data.formattedAmount || '₦500,000',
          });
        }
      })
      .catch(err => console.warn('Could not load Flutterwave config:', err));
  }, []);

  // Return from the hosted (redirect) checkout: verify the transaction and
  // re-open the modal on the confirmation screen. Runs once on page load.
  useEffect(() => {
    if (flwReturnHandledRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') !== 'return') return;
    flwReturnHandledRef.current = true;

    const txRef = params.get('tx_ref') || redirectReference || '';
    const transactionId = params.get('transaction_id') || undefined;
    const status = params.get('status');

    // Clean the URL so refreshes don't re-trigger verification.
    window.history.replaceState({}, '', window.location.pathname);

    if (status && status !== 'successful' && status !== 'completed') {
      return; // cancelled or failed at the gateway — nothing to confirm
    }
    if (!txRef) return;

    // tx_ref format: MMC26-<participantId>-<timestamp>
    const parts = txRef.split('-');
    const participantId = parts.length >= 3 ? parts.slice(1, -1).join('-') : null;
    if (!participantId) return;

    (async () => {
      try {
        const verifyRes = await fetch('/api/flutterwave/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: txRef, transactionId, participantId }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success && verifyData.participant) {
          setRegisteredParticipant({
            id: verifyData.participant.id,
            fullName: verifyData.participant.fullName,
            email: verifyData.participant.email,
            organisation: verifyData.participant.organisation,
          });
          setCurrentStep('paid_success');
          openApplyModal();
        }
        // On failure we stay silent here; the delegate can reach the
        // admissions office, and the payment remains visible in admin records.
      } catch (err) {
        console.warn('Payment return verification failed:', err);
      }
    })();
  }, [redirectReference, openApplyModal]);

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
      // Reset state on close
      setCurrentStep('form');
      setRegisteredParticipant(null);
      setErrorMessage(null);
      setOtpError(null);
      setOtpSent(false);
      setOtpCode('');
      setSandboxOtp(null);
    }
  }, [isOpen, closeApplyModal]);
  // Handle email changes (reset verification if email changes)
  const handleEmailChange = (newEmail: string) => {
    setFormData(prev => ({ ...prev, email: newEmail }));
    if (emailVerified) setEmailVerified(false);
    if (otpSent) setOtpSent(false);
    setOtpError(null);
    setOtpSuccessMessage(null);
    setSandboxOtp(null);
  };

  // Validate email domain
  const isDisposableEmail = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase().trim();
    return domain && DISPOSABLE_EMAIL_DOMAINS.has(domain);
  };

  // Send OTP
  const handleSendVerificationCode = async () => {
    const email = formData.email.trim().toLowerCase();
    setOtpError(null);
    setOtpSuccessMessage(null);

    if (!email || !email.includes('@') || !email.includes('.')) {
      setOtpError('Please enter a valid email address first.');
      return;
    }

    if (isDisposableEmail(email)) {
      setOtpError('Disposable or temporary email domains are not accepted. Please use your official corporate or professional email.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/verify-email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      setOtpSent(true);
      setOtpSuccessMessage(data.message || 'Verification code sent to your email.');
      if (data.sandboxCode) {
        setSandboxOtp(data.sandboxCode);
      }
    } catch (err: any) {
      setOtpError(err.message || 'Could not send verification code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Confirm OTP
  const handleConfirmVerificationCode = async () => {
    const email = formData.email.trim().toLowerCase();
    const code = otpCode.trim();

    if (!code || code.length !== 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const res = await fetch('/api/verify-email/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      setEmailVerified(true);
      setOtpSent(false);
      setOtpSuccessMessage('Email verified successfully!');
    } catch (err: any) {
      setOtpError(err.message || 'Incorrect verification code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 1: Submit Application Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const email = formData.email.trim().toLowerCase();

    // Prevent submission with disposable email
    if (isDisposableEmail(email)) {
      setErrorMessage('Disposable or temporary email domains are not permitted for this executive masterclass. Please use your corporate or official email address.');
      setIsSubmitting(false);
      return;
    }

    const resolvedCategory = formData.category === 'Other' 
      ? (formData.otherCategory.trim() || 'Other') 
      : formData.category;

    const payload = {
      fullName: formData.fullName.trim(),
      email,
      emailVerified,
      phone: formData.phone.trim(),
      organisation: formData.organisation.trim(),
      position: formData.position.trim(),
      jobTitle: formData.position.trim(),
      category: resolvedCategory,
      otherCategory: formData.category === 'Other' ? formData.otherCategory.trim() : undefined,
      yearsExperience: formData.yearsExperience,
      goals: formData.goals.trim(),
      paidEventConsent: formData.paidEventConsent,
      organisationType: resolvedCategory,
      notes: formData.goals.trim(),
      consent: formData.paidEventConsent,
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application. Please check your details and try again.');
      }

      const participant = data.participant || {
        id: data.participantId,
        fullName: formData.fullName.trim(),
        email,
        organisation: formData.organisation.trim(),
      };

      setRegisteredParticipant(participant);
      // Immediately transition to the Payment Prompt step
      setCurrentStep('payment');
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Pay Online — Flutterwave inline checkout with automatic fallback
  // to the hosted (redirect) checkout when the inline iframe cannot open
  // (popup blockers, sandboxed preview iframes, some mobile browsers).
  const handlePayOnlineWithFlutterwave = () => {
    if (!registeredParticipant) return;
    setIsProcessingPayment(true);
    setErrorMessage(null);

    const email = registeredParticipant.email;
    const participantId = registeredParticipant.id;
    const reference = `MMC26-${participantId}-${Date.now()}`;

    if (typeof window.FlutterwaveCheckout === 'function' && paymentConfig.publicKey) {
      try {
      const handler = window.FlutterwaveCheckout({
        public_key: paymentConfig.publicKey,
        tx_ref: reference,
        amount: paymentConfig.amount,
        currency: 'NGN',
        payment_options: 'card,banktransfer,ussd',
        customer: {
          email,
          name: registeredParticipant.fullName,
          // phone: registeredParticipant.phone,
        },
        customizations: {
          title: 'Media Owners & Executives Masterclass 2026',
          description: 'Executive masterclass registration fee',
        },
        meta: {
          participantId,
          cohort: 'EnterpriseCEO Masterclass 2026',
        },
        callback: async function (data: any) {
          try {
            // Server verifies the transaction against the Flutterwave API
            // before the seat is confirmed.
            const verifyRes = await fetch('/api/flutterwave/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference,
                transactionId: data.transaction_id ? String(data.transaction_id) : undefined,
                participantId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setCurrentStep('paid_success');
            } else {
              setErrorMessage(verifyData.error || 'Payment was received but status verification failed. Please contact the admissions office.');
            }
          } catch (err) {
            console.error('Flutterwave verification error:', err);
            setErrorMessage('Network error while recording payment. Our secretariat will verify your transaction reference.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        onclose: function () {
          setIsProcessingPayment(false);
        },
        });

        // Flutterwave v3 inline opens itself; keep a handle so we can close it.
        flwHandlerRef.current = handler;
      } catch (openErr) {
        // Inline checkout failed to open (blocked iframe / popup blocker) —
        // fall back to the hosted redirect checkout automatically.
        console.warn('Flutterwave inline checkout failed to open, falling back to hosted checkout:', openErr);
        void startHostedCheckout();
      }
    } else {
      // Gateway script unavailable (blocked or missing) — use the hosted
      // checkout, which is created server-side and does not need the script.
      void startHostedCheckout();
    }
  };

  // Hosted (redirect) checkout: server creates a Standard payment session and
  // the browser is redirected to Flutterwave's full-page checkout. After
  // payment the delegate lands back on the site with ?payment=return and the
  // modal re-opens to verify and confirm their seat.
  const startHostedCheckout = async () => {
    if (!registeredParticipant) return;
    try {
      const res = await fetch('/api/flutterwave/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: registeredParticipant.id,
          fullName: registeredParticipant.fullName,
          email: registeredParticipant.email,
          phone: formData.phone,
        }),
      });
      const data = await res.json();
      if (data.success && data.paymentLink) {
        setRedirectReference(data.reference);
        window.location.href = data.paymentLink;
        return; // navigation proceeds
      }
      setErrorMessage(data.error || 'Could not start the payment session. Please try again.');
    } catch (err) {
      console.error('Hosted checkout error:', err);
      setErrorMessage('Could not reach the payment gateway. Please check your connection and try again.');
    } finally {
      setIsProcessingPayment(false);
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
                  {currentStep === 'form' && "Apply to Attend"}
                  {currentStep === 'payment' && "Application Received • Secure Your Seat"}
                  {currentStep === 'paid_success' && "Seat Confirmed • Welcome to the Masterclass"}
                </h3>
                <p className="text-[11px] sm:text-xs text-cream-50/75 mt-1 leading-snug">
                  {currentStep === 'form' && "By invitation and selective registration. Media owners, publishers, and senior executives."}
                  {currentStep === 'payment' && "Your registration has been saved. Complete payment securely online via Flutterwave to confirm your seat."}
                  {currentStep === 'paid_success' && "2026 Executive Cohort Admissions • Confirmation Notice"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeApplyModal}
                className="text-white/70 hover:text-white p-1.5 -mr-1 -mt-1 sm:mr-0 sm:mt-0 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-5 sm:space-y-6">
              <AnimatePresence mode="wait">
                
                {/* ------------------------------------------------------------- */}
                {/* STEP 1: APPLICATION REGISTRATION FORM                         */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 'form' && (
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
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold">Error: </span>
                          <span>{errorMessage}</span>
                        </div>
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

                      {/* Email Address with Executive Verification */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label htmlFor="modal-email" className="block text-xs font-bold tracking-wider uppercase text-navy-900">
                            Email Address <span className="text-orange-600">*</span>
                          </label>
                          {emailVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" />
                              Verified
                            </span>
                          ) : (
                            <span className="text-[10px] text-grey-500">Corporate email preferred</span>
                          )}
                        </div>

                        <div className="relative">
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
                            onChange={e => handleEmailChange(e.target.value)}
                            className={`w-full px-3.5 py-3 sm:py-2.5 min-h-[46px] sm:min-h-[42px] bg-grey-50 border rounded-lg focus:bg-white focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all text-base sm:text-sm text-ink-900 placeholder:text-ink-900/40 ${
                              emailVerified ? 'border-emerald-500 bg-emerald-50/20 pr-10' : 'border-grey-200'
                            }`}
                            placeholder="executive@organisation.com"
                          />
                          {emailVerified && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                          )}
                        </div>

                        {/* Email Verification Action Bar */}
                        {!emailVerified && formData.email.includes('@') && !otpSent && (
                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[11px] text-grey-500">Verify to ensure authentic executive credentials:</span>
                            <button
                              type="button"
                              onClick={handleSendVerificationCode}
                              disabled={isSendingOtp}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {isSendingOtp ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Sending Code...
                                </>
                              ) : (
                                <>
                                  <MailCheck className="w-3 h-3" />
                                  Verify Email
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* OTP Verification Prompt */}
                        {otpSent && !emailVerified && (
                          <div className="mt-2 p-3 bg-navy-50 rounded-lg border border-navy-200/80 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-navy-900 flex items-center gap-1">
                                <Send className="w-3 h-3 text-orange-500" />
                                Enter 6-digit Code sent to your email:
                              </span>
                              <button
                                type="button"
                                onClick={handleSendVerificationCode}
                                disabled={isSendingOtp}
                                className="text-[10px] text-orange-600 hover:underline cursor-pointer"
                              >
                                Resend Code
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                maxLength={6}
                                value={otpCode}
                                onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="123456"
                                className="w-32 tracking-[0.25em] font-mono text-center text-sm py-1.5 px-2 bg-white border border-navy-300 rounded font-bold text-navy-900 focus:outline-none focus:border-orange-500"
                              />
                              <button
                                type="button"
                                onClick={handleConfirmVerificationCode}
                                disabled={isVerifyingOtp || otpCode.length !== 6}
                                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs rounded transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                {isVerifyingOtp ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                              </button>
                            </div>

                            {sandboxOtp && (
                              <p className="text-[11px] text-navy-700 bg-white/80 p-1.5 rounded border border-navy-200">
                                <strong>Preview Demo Code:</strong>{' '}
                                <button
                                  type="button"
                                  onClick={() => setOtpCode(sandboxOtp)}
                                  className="underline text-orange-600 font-mono font-bold"
                                >
                                  {sandboxOtp} (click to fill)
                                </button>
                              </p>
                            )}

                            {otpError && (
                              <p className="text-[11px] text-red-600 font-medium">{otpError}</p>
                            )}
                            {otpSuccessMessage && !otpError && (
                              <p className="text-[11px] text-emerald-700 font-medium">{otpSuccessMessage}</p>
                            )}
                          </div>
                        )}
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
                          I understand that this is a paid executive masterclass. Upon submission, I will complete payment securely online via Flutterwave to confirm my seat.
                        </span>{" "}
                        <span className="text-orange-600 font-bold">*</span>
                      </div>
                    </label>

                    {/* Modal Footer / Actions */}
                    <div className="pt-4 border-t border-grey-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-navy-900 px-3.5 py-1.5 rounded shadow-sm border-l-2 border-orange-500">
                          <span className="block text-[9px] font-bold tracking-[0.15em] uppercase text-orange-400 leading-tight">
                            DELEGATE FEE
                          </span>
                          <span className="block text-base font-black text-white leading-none mt-0.5">
                            {paymentConfig.formattedAmount}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-semibold text-navy-900 block">Pay online</span>
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
                          className="w-full sm:w-auto justify-center min-h-[48px] px-8 py-3.5 sm:py-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-sm rounded-lg transition-all shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting Application...
                            </>
                          ) : (
                            <>
                              <span>Submit Application</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 2: PAYMENT PROMPT (APPLICATION ALREADY SUBMITTED!)       */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 'payment' && registeredParticipant && (
                  <motion.div
                    key="payment-prompt"
                    initial={{ opacity: 0, scale: 0.98, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Database Confirmation Banner */}
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-emerald-900 flex-1">
                        <p className="font-bold text-sm">
                          Application Successfully Received &amp; Saved
                        </p>
                        <p className="text-emerald-800 mt-0.5">
                          Applicant: <strong>{registeredParticipant.fullName}</strong> ({registeredParticipant.email}) &bull; Dossier ID: <span className="font-mono font-bold">#{registeredParticipant.id.slice(-6).toUpperCase()}</span>
                        </p>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium">
                        {errorMessage}
                      </div>
                    )}

                    {/* Payment Instruction & Pricing Card */}
                    <div className="bg-grey-50 rounded-xl border border-grey-200 p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-grey-200 pb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-2 py-0.5 rounded">
                            2-Day Executive Access
                          </span>
                          <h4 className="text-lg font-bold text-navy-900 mt-1">
                            Media Owners &amp; Senior Executives Masterclass 2026
                          </h4>
                          <p className="text-xs text-grey-600">
                            Includes Pan-Atlantic University Executive Certificate, full course dossiers, networking breakfast &amp; executive luncheon.
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-2xl font-black text-navy-900 block leading-tight">
                            {paymentConfig.formattedAmount}
                          </span>
                          <span className="text-[11px] text-grey-500 font-medium">Per Delegate (NGN)</span>
                        </div>
                      </div>

                      {/* Single Path: Secure Online Payment */}
                      <div className="grid grid-cols-1 gap-4 pt-1">
                        {/* Option 1: Pay Online via Flutterwave */}
                        <div className="bg-white p-4 rounded-lg border-2 border-orange-500/80 shadow-sm flex flex-col justify-between space-y-4 relative">
                          <div className="absolute -top-2.5 right-3 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Recommended
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-navy-900 font-bold text-sm">
                              <CreditCard className="w-4 h-4 text-orange-500" />
                              <span>Pay Online (Flutterwave)</span>
                            </div>
                            <p className="text-xs text-grey-600 mt-1.5 leading-relaxed">
                              Pay securely with Nigerian debit cards, USSD, or bank transfer via Flutterwave. Your admission moves automatically to <strong>Invited &amp; Confirmed</strong>.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handlePayOnlineWithFlutterwave}
                            disabled={isProcessingPayment}
                            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                          >
                            {isProcessingPayment ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Opening secure checkout...
                              </>
                            ) : (
                              <>
                                <span>Pay {paymentConfig.formattedAmount} via Flutterwave</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Navigation */}
                    <div className="flex items-center justify-between pt-2 border-t border-grey-100 text-xs text-grey-500">
                      <span>Our admissions desk is also available at hello@enterpriseceo.africa</span>
                      <button
                        type="button"
                        onClick={closeApplyModal}
                        className="font-semibold text-navy-900 hover:underline cursor-pointer"
                      >
                        Finish &amp; Close
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 3: PAID ONLINE SUCCESS                                    */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 'paid_success' && (
                  <motion.div
                    key="paid-success-screen"
                    initial={{ opacity: 0, scale: 0.95, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="py-6 text-center space-y-5"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 border border-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle className="w-9 h-9" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                        Payment Confirmed &bull; Seat Reserved
                      </span>
                      <h4 className="text-2xl font-serif font-bold text-navy-900">
                        Welcome to the 2026 Executive Cohort
                      </h4>
                      <p className="text-ink-900/80 max-w-md mx-auto text-sm leading-relaxed">
                        Your registration fee has been successfully verified via Flutterwave. Your admission status is now <strong>Invited &amp; Confirmed</strong>.
                      </p>
                    </div>

                    <div className="bg-cream-50/70 border border-navy-900/10 rounded-lg p-5 max-w-md mx-auto text-left space-y-2.5 text-xs">
                      <div className="flex items-center justify-between border-b border-navy-900/10 pb-2">
                        <span className="text-grey-500">Applicant:</span>
                        <span className="font-bold text-navy-900">{registeredParticipant?.fullName}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-navy-900/10 pb-2">
                        <span className="text-grey-500">Receipt Email:</span>
                        <span className="font-medium text-navy-900">{registeredParticipant?.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-grey-500">Admission Status:</span>
                        <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded text-[10px] uppercase">
                          Invited (Paid)
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <AddToCalendar />
                      <button
                        type="button"
                        onClick={closeApplyModal}
                        className="bg-navy-900 hover:bg-navy-800 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-md transition-all shadow-md text-sm cursor-pointer"
                      >
                        Return to Programme
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
