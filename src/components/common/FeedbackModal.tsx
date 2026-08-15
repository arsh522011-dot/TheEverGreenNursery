import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { X, Star, Send, CheckCircle2, MessageSquare, Heart, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmitted }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleOrLocation: '',
    content: '',
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.content) return;

    // Save as testimonial (pending approval for home screen)
    StorageService.addTestimonial({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.roleOrLocation || 'Valued Customer',
      location: formData.roleOrLocation || '',
      content: formData.content,
      rating: rating,
      showOnHome: false, // Admin can toggle this in admin panel!
      status: 'pending',
    });

    // Save as customer inquiry
    StorageService.addInquiry({
      type: 'feedback',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: `Website Feedback & ${rating}★ Review from ${formData.name}`,
      message: formData.content,
      rating: rating,
    });

    setSubmitted(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#047857', '#065f46', '#34d399'],
      });
    } catch {
      // ignore
    }

    if (onSubmitted) {
      onSubmitted();
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      roleOrLocation: '',
      content: '',
    });
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden relative my-8">
        {/* Header */}
        <div className="bg-[#062319] text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Heart className="w-4 h-4 fill-emerald-400 text-emerald-400" />
            <span>Share Your Experience</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-100">
            Submit Feedback & Review
          </h3>
          <p className="text-xs text-emerald-200/80 mt-1">
            Your honest feedback helps us nurture healthier plants and deliver exceptional service.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 max-h-[80vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-2xl text-[#062319] font-bold">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Your review has been submitted to the nursery team. Once reviewed by our admin, it will be highlighted on our homepage!
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 rounded-xl bg-[#062319] text-emerald-300 font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-all shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-emerald-900/10 space-y-2 text-center">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-900">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 fill-gray-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-mono text-emerald-800 font-medium">
                  {rating === 5 && '⭐⭐⭐⭐⭐ Outstanding / Exceptional'}
                  {rating === 4 && '⭐⭐⭐⭐ Very Good Experience'}
                  {rating === 3 && '⭐⭐⭐ Average Service'}
                  {rating === 2 && '⭐⭐ Below Expectations'}
                  {rating === 1 && '⭐ Poor Experience'}
                </p>
              </div>

              {/* Name & Role/Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-emerald-950 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-emerald-950 mb-1">
                    Role / City <span className="text-gray-400 text-[10px] font-sans">(e.g. Plant Enthusiast, Delhi)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Interior Designer, New Delhi"
                    value={formData.roleOrLocation}
                    onChange={(e) => setFormData({ ...formData, roleOrLocation: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-semibold text-emerald-950 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-emerald-950 mb-1">
                    Phone / WhatsApp <span className="text-gray-400 text-[10px] font-sans">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Review Message */}
              <div>
                <label className="block text-xs font-mono font-semibold text-emerald-950 mb-1">
                  Your Feedback & Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about plant quality, packaging, delivery speed, or staff consultation..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-600 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your privacy is protected. Submissions are reviewed before featuring on homepage.</span>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
