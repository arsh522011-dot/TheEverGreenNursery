import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Send, CheckCircle2, Leaf, Phone, User, Mail, Clock, Loader2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Plant, Service } from '../../types';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { StorageService } from '../../services/storage';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlant?: Plant | null;
  selectedService?: Service | null;
  whatsAppNumber: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  selectedPlant,
  selectedService,
  whatsAppNumber,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredTime: 'Morning (8am - 12pm)',
    message: '',
  });
  const [lastSubmittedName, setLastSubmittedName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    contact?: string;
  }>({});

  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Lock background body scrolling when Enquiry Modal is active
  useBodyScrollLock(isOpen);

  const clearTimers = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
    }
  };

  const getInitialMessage = (plant?: Plant | null, service?: Service | null) => {
    if (plant) {
      return `Hello The Ever Green Nursery, I am interested in acquiring or learning more about the "${plant.name}" (${plant.scientificName}). Please share details regarding current availability, height, and specimen care.`;
    } else if (service) {
      return `Hello The Ever Green Nursery, I would like to schedule a consultation regarding your "${service.title}" service for my property.`;
    } else {
      return 'Hello The Ever Green Nursery, I would like to inquire about plant availability, landscape design, or nursery visits.';
    }
  };

  const resetFormState = (plant = selectedPlant, service = selectedService) => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      preferredTime: 'Morning (8am - 12pm)',
      message: getInitialMessage(plant, service),
    });
    setValidationErrors({});
    setErrorMessage(null);
  };

  useEffect(() => {
    if (isOpen) {
      clearTimers();
      setSubmitted(false);
      setIsFadingOut(false);
      setIsSubmitting(false);
      resetFormState(selectedPlant, selectedService);
    } else {
      clearTimers();
      setIsFadingOut(false);
      setSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen, selectedPlant, selectedService]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const handleCloseModal = () => {
    clearTimers();
    setIsFadingOut(false);
    setSubmitted(false);
    setIsSubmitting(false);
    resetFormState(selectedPlant, selectedService);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  if (!isOpen) return null;

  const validateForm = () => {
    const errors: { name?: string; contact?: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.';
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      errors.contact = 'Please enter a phone number or email address.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submission

    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate realistic submission delay for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 500));

      const submittedName = formData.name.trim();

      StorageService.addInquiry({
        type: selectedPlant ? 'plant_enquiry' : 'contact',
        name: submittedName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        plantName: selectedPlant ? selectedPlant.name : undefined,
        subject: selectedPlant
          ? `Inquiry for ${selectedPlant.name}`
          : selectedService
          ? `Inquiry for ${selectedService.title}`
          : 'General Nursery Consultation',
        message: `${formData.message.trim()}\nPreferred Time: ${formData.preferredTime}`,
      });

      setLastSubmittedName(submittedName);

      // Reset form completely immediately after successful submission
      resetFormState(selectedPlant, selectedService);

      // Show Success Modal
      setSubmitted(true);
      setIsSubmitting(false);

      // Launch celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#155e43', '#d4af37', '#ffffff'],
        });
      } catch (err) {
        console.log('Confetti effect:', err);
      }

      // Auto close after 4 seconds (fade out at 3.5s)
      clearTimers();
      fadeOutTimerRef.current = setTimeout(() => {
        setIsFadingOut(true);
      }, 3500);

      autoCloseTimerRef.current = setTimeout(() => {
        handleCloseModal();
      }, 4000);

    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(
        err?.message || 'Failed to submit inquiry. Please try again.'
      );
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = `*New Nursery Enquiry*\n\n*Name:* ${formData.name || lastSubmittedName}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Preferred Time:* ${formData.preferredTime}\n\n*Details:* ${formData.message}`;
    const url = `https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    handleCloseModal();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-backdrop-overlay transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-fadeIn'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto overscroll-contain modal-scroll-content bg-[#062319] border border-emerald-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-white transition-all duration-300"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-emerald-900/80 border border-emerald-400/30 text-emerald-400">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-light text-emerald-100">
                  {selectedPlant ? `Enquire About ${selectedPlant.name}` : selectedService ? `Request ${selectedService.title}` : 'Contact Nursery Concierge'}
                </h3>
                <p className="text-xs text-emerald-400 font-mono tracking-wider uppercase">
                  No Online Payment Required • Direct Horticultural Guidance
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 font-sans animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-emerald-300 mb-1">Your Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (validationErrors.name) setValidationErrors({ ...validationErrors, name: undefined });
                      }}
                      placeholder="e.g. Eleanor Vance"
                      className={`w-full bg-emerald-950/80 border ${
                        validationErrors.name ? 'border-red-500' : 'border-emerald-800/80'
                      } rounded-xl pl-10 pr-4 py-2.5 text-sm text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-emerald-400`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="text-[11px] text-red-400 mt-1 font-mono">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-300 mb-1">Phone / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (validationErrors.contact) setValidationErrors({ ...validationErrors, contact: undefined });
                      }}
                      placeholder="e.g. +1 (555) 019-2834"
                      className={`w-full bg-emerald-950/80 border ${
                        validationErrors.contact ? 'border-red-500' : 'border-emerald-800/80'
                      } rounded-xl pl-10 pr-4 py-2.5 text-sm text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-emerald-400`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-emerald-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (validationErrors.contact) setValidationErrors({ ...validationErrors, contact: undefined });
                      }}
                      placeholder="e.g. eleanor@estate.com"
                      className={`w-full bg-emerald-950/80 border ${
                        validationErrors.contact ? 'border-red-500' : 'border-emerald-800/80'
                      } rounded-xl pl-10 pr-4 py-2.5 text-sm text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-emerald-400`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-emerald-300 mb-1">Preferred Callback Window</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-500" />
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full bg-emerald-950/80 border border-emerald-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-emerald-100 focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="Morning (8am - 12pm)">Morning (8am - 12pm)</option>
                      <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
                      <option value="Evening (4pm - 7pm)">Evening (4pm - 7pm)</option>
                    </select>
                  </div>
                </div>
              </div>

              {validationErrors.contact && (
                <p className="text-[11px] text-red-400 font-mono">{validationErrors.contact}</p>
              )}

              <div>
                <label className="block text-xs font-mono text-emerald-300 mb-1">Enquiry Note / Plant Requirements</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-emerald-950/80 border border-emerald-800/80 rounded-xl p-3 text-sm text-emerald-100 placeholder-emerald-700 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-emerald-950/80 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Enquiry Form</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="py-3.5 px-5 rounded-xl bg-emerald-900 border border-emerald-500/40 text-emerald-200 hover:text-white hover:bg-emerald-800 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-900/90 border border-emerald-400/50 flex items-center justify-center text-emerald-400 mx-auto shadow-2xl animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-3xl font-light text-emerald-100">
              Enquiry Received
            </h3>

            <p className="text-emerald-300/80 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-emerald-200 font-semibold">{lastSubmittedName || 'Valued Guest'}</span>! Our horticultural team at The Ever Green Nursery will review your request and connect with you shortly.
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleWhatsAppRedirect}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Instant WhatsApp Chat</span>
              </button>

              <button
                onClick={handleCloseModal}
                className="px-5 py-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-medium uppercase tracking-wider hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

