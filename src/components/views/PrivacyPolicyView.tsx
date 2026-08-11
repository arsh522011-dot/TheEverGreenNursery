import React from 'react';
import { SiteSettings } from '../../types';
import { ShieldCheck, Lock, Eye, Server, PhoneCall, Mail, MapPin, ArrowLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyViewProps {
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ settings, onNavigate }) => {
  const nurseryName = settings.nurseryName || 'The Ever green Nursery';
  const fullAddress = `${settings.address || '742 Evergreen Valley Way'}, ${settings.city || 'Botanical Ridge'}`;
  const email = settings.email || 'contact@evergreennursery.com';
  const phone = settings.phone || '+91 98765 43210';
  const gstNumber = settings.gstNumber || '07AAACG1234M1Z5';

  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-900/10 text-emerald-900 hover:bg-emerald-50 text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700" />
            <span>Back to Home</span>
          </button>
          <span className="text-xs font-mono text-emerald-800/60 uppercase tracking-widest font-semibold">
            Legal & Data Protection
          </span>
        </div>

        {/* Hero Header */}
        <div className="bg-[#062319] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl border border-emerald-500/20 space-y-4">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono uppercase tracking-widest border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Official Policy Document
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-emerald-50 font-light leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
              At <strong className="text-emerald-300 font-semibold">{nurseryName}</strong>, we are committed to safeguarding the privacy and security of our visitors, plant lovers, and bulk clientele across India.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400/90 flex flex-wrap gap-4">
              <span>Effective Date: August 2026</span>
              <span>•</span>
              <span>GSTIN: {gstNumber}</span>
              <span>•</span>
              <span>Location: {settings.city || 'Pan India'}</span>
            </div>
          </div>
        </div>

        {/* Detailed Sections Container */}
        <div className="bg-white rounded-3xl border border-emerald-900/10 shadow-md p-6 sm:p-10 space-y-8 font-sans">
          
          {/* Section 1 */}
          <section className="space-y-3 border-b border-emerald-900/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#062319]">1. Information We Collect</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              We collect minimal personal details required to process plant orders, provide botanical care consultations, and handle delivery logistics. This information includes:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <li className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#faf8f5] border border-emerald-900/10 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Contact Details:</strong> Your name, phone number, and email address provided during inquiries.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#faf8f5] border border-emerald-900/10 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Delivery Address:</strong> Physical address and city details for live plant shipments.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#faf8f5] border border-emerald-900/10 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Inquiry Details:</strong> Specific plant species requested, pot preferences, or bulk order quantities.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#faf8f5] border border-emerald-900/10 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Communication Logs:</strong> Messages exchanged via WhatsApp or web forms with our horticulturists.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-b border-emerald-900/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#062319]">2. How We Use Your Information</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              Your data is strictly utilized to operate <strong className="text-emerald-900">{nurseryName}</strong> and fulfill your nursery requests. Specifically:
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-emerald-950/80">
              <p>• <strong>Order Processing & Transit:</strong> To prepare, pack, and ship healthy plants, pots, and fertilizers directly to your doorstep.</p>
              <p>• <strong>Customer Support:</strong> To answer plant care questions, provide watering advice, and issue order confirmations via phone or WhatsApp.</p>
              <p>• <strong>Tax & Invoicing:</strong> To issue official GST compliant tax invoices bearing GSTIN <code className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-mono">{gstNumber}</code>.</p>
              <p>• <strong>Bulk & Landscaping Quotations:</strong> To generate custom estimates for corporate offices, commercial sites, and residential gardens.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-b border-emerald-900/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#062319]">3. Data Security & Storage</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              We employ strict organizational and technical measures to protect customer records against unauthorized access, loss, or disclosure. We do <strong>NOT</strong> rent, sell, or trade customer contact lists to third-party marketing brokers under any circumstances.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-b border-emerald-900/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#062319]">4. WhatsApp & Direct Communication</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              When you click &quot;Order via WhatsApp&quot; or request custom plant photos, you initiate direct communication with our nursery team. You may opt-out of promotional updates at any time by simply messaging &quot;STOP&quot; on WhatsApp.
            </p>
          </section>

          {/* Section 5: Contact Info */}
          <section className="space-y-4 pt-2">
            <h2 className="font-serif text-xl font-bold text-[#062319]">5. Privacy Inquiries & Data Removal</h2>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              If you have questions regarding this Privacy Policy or wish to request deletion of your contact records, please reach out to our official nursery office:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-emerald-900/10 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold font-mono uppercase">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Nursery Address</span>
                </div>
                <p className="text-xs text-emerald-950 font-medium">{fullAddress}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-emerald-900/10 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold font-mono uppercase">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Phone / WhatsApp</span>
                </div>
                <p className="text-xs text-emerald-950 font-medium">{phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-emerald-900/10 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold font-mono uppercase">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Support Email</span>
                </div>
                <p className="text-xs text-emerald-950 font-medium">{email}</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#062319] hover:bg-emerald-950 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <span>Visit Contact Us Page</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
