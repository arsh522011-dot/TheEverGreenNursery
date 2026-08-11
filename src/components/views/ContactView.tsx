import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { StorageService } from '../../services/storage';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, Leaf, FileText, ShieldCheck, Copy, Check, Navigation, ExternalLink, Car, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactViewProps {
  settings: SiteSettings;
  onOpenEnquiry: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings, onOpenEnquiry }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    companyGst: '',
    subject: 'Nursery Visit / Plant Availability',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [copiedGst, setCopiedGst] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const gstNumber = settings.gstNumber || '07AAACG1234M1Z5';
  const fullAddress = `${settings.address}, ${settings.city}`;
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  const handleCopyGst = () => {
    navigator.clipboard.writeText(gstNumber);
    setCopiedGst(true);
    setTimeout(() => setCopiedGst(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      StorageService.addInquiry({
        type: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        companyGst: formData.companyGst,
        subject: formData.subject || 'Nursery Visit / Plant Inquiry',
        message: formData.message,
      });
    }
    setSubmitted(true);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        colors: ['#22c55e', '#155e43', '#d4af37'],
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-700 block">
            NURSERY CONCIERGE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#062319] font-light">
            Visit Us or Get in Touch
          </h1>
          <p className="text-sm text-emerald-900/70 leading-relaxed">
            Our 15-acre botanical nursery is open 7 days a week. Visit us in person or reach our horticultural team directly via WhatsApp or contact form.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details & Hours Card (Left) */}
          <div className="lg:col-span-5 bg-[#062319] text-white p-8 rounded-3xl space-y-8 shadow-xl border border-emerald-500/20">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">LOCATION & HOURS</span>
              <h2 className="font-serif text-2xl text-emerald-100 mt-1">{settings.nurseryName}</h2>
            </div>

            <ul className="space-y-6 text-sm text-emerald-200/90">
              <li className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-900 text-emerald-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs uppercase text-emerald-400 block font-semibold">Physical Nursery Address</span>
                  <p className="mt-0.5 text-white font-medium">{settings.address}</p>
                  <p className="text-xs text-emerald-300/80">{settings.city}</p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-medium border border-emerald-600/40 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Get Directions</span>
                      <ExternalLink className="w-3 h-3 text-emerald-300" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-medium border border-emerald-700/50 transition-colors cursor-pointer"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Address Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-900 text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase text-emerald-400 block font-semibold">Telephone Concierge</span>
                  <a href={`tel:${settings.phone}`} className="mt-0.5 block hover:text-white font-serif text-base">
                    {settings.phone}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-900 text-emerald-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase text-emerald-400 block font-semibold">Direct Email</span>
                  <a href={`mailto:${settings.email}`} className="mt-0.5 block hover:text-white font-mono text-xs">
                    {settings.email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-900 text-emerald-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase text-emerald-400 block font-semibold">Nursery Opening Hours</span>
                  <p className="mt-0.5">{settings.openingHours}</p>
                </div>
              </li>

              {/* GSTIN / Tax Registration Item */}
              <li className="flex items-start gap-4 pt-1 border-t border-emerald-800/40">
                <div className="p-3 rounded-2xl bg-emerald-900/90 text-emerald-300 border border-emerald-500/30 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase text-emerald-400 font-semibold">GSTIN / Tax ID</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Verified
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2 bg-emerald-950/80 border border-emerald-800/80 rounded-xl px-3 py-1.5">
                    <span className="font-mono text-sm font-semibold tracking-wider text-emerald-100 select-all">
                      {gstNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyGst}
                      className="p-1 rounded-md bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 transition-colors cursor-pointer shrink-0"
                      title="Copy GSTIN"
                    >
                      {copiedGst ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-300/70 mt-1">
                    GST Tax Credit Invoice provided for all B2B and retail orders.
                  </p>
                </div>
              </li>
            </ul>

            <div className="pt-4 border-t border-emerald-800/60">
              <button
                onClick={onOpenEnquiry}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-[#062319] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch WhatsApp Concierge</span>
              </button>
            </div>
          </div>

          {/* Interactive Form & Map (Right) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Optimized Map & Directions Section */}
            <div className="bg-white rounded-3xl border border-emerald-900/10 shadow-lg p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/10 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    Interactive Map Location
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#062319] mt-1">
                    {settings.nurseryName}
                  </h3>
                  <p className="text-xs text-emerald-900/70 font-sans mt-0.5">
                    {settings.address}, {settings.city}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#062319] hover:bg-emerald-950 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </a>
                </div>
              </div>

              {/* Map Iframe with Overlay Badge */}
              <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-emerald-900/15 shadow-inner group">
                <iframe
                  title="Nursery Map Location"
                  src={settings.mapEmbedUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />

                {/* Glassmorphism Floating Tag */}
                <div className="absolute top-3 left-3 z-10 bg-[#062319]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs font-mono flex items-center gap-2 shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-medium text-emerald-100">Live Nursery Coordinates</span>
                </div>

                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-sm text-[#062319] hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-900/20 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Open Full Google Maps</span>
                </a>
              </div>

              {/* Visitor Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#faf8f5] border border-emerald-900/10">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-950">Free Parking</span>
                    <span className="block text-[10px] text-gray-500">Dedicated visitor lot</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#faf8f5] border border-emerald-900/10">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-950">15-Acre Grounds</span>
                    <span className="block text-[10px] text-gray-500">Glasshouses & fields</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#faf8f5] border border-emerald-900/10">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-950">Open 7 Days</span>
                    <span className="block text-[10px] text-gray-500">{settings.openingHours?.split('|')[0] || 'Mon - Sun'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white p-8 rounded-3xl border border-emerald-900/10 shadow-lg space-y-6">
              <h2 className="font-serif text-2xl text-[#062319]">Send a Message to Our Horticulturists</h2>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-emerald-900 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Eleanor Vance"
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-emerald-900 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-emerald-900 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="eleanor@estate.com"
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-emerald-900 mb-1">
                        Company / Your GSTIN <span className="text-gray-400 font-sans text-[11px]">(Optional for Tax Invoice)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyGst}
                        onChange={(e) => setFormData({ ...formData, companyGst: e.target.value })}
                        placeholder="e.g. 07AABCU9603R1ZM"
                        className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-emerald-600 uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-emerald-900 mb-1">Message Detail</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe the plant species or landscape service you are searching for..."
                      className="w-full bg-[#faf8f5] border border-emerald-900/10 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#062319] text-emerald-200 hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Send Message to Nursery</span>
                  </button>
                </form>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-2xl text-[#062319]">Message Dispatched</h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Thank you! Our nursery team will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#062319] text-emerald-300 text-xs font-mono uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
