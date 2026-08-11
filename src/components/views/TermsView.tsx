import React from 'react';
import { SiteSettings } from '../../types';
import { Scale, FileText, CheckCircle2, Truck, AlertTriangle, Building2, PhoneCall, Mail, MapPin, ArrowLeft, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface TermsViewProps {
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ settings, onNavigate }) => {
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
            Terms of Service
          </span>
        </div>

        {/* Hero Header */}
        <div className="bg-[#062319] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl border border-emerald-500/20 space-y-4">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono uppercase tracking-widest border border-emerald-500/30">
              <Scale className="w-3.5 h-3.5" />
              Terms & Conditions
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-emerald-50 font-light leading-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
              Welcome to <strong className="text-emerald-300 font-semibold">{nurseryName}</strong>. Please review the following terms and conditions governing the purchase of live plants, planters, landscape services, and website usage.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400/90 flex flex-wrap gap-4">
              <span>Last Revised: August 2026</span>
              <span>•</span>
              <span>GSTIN: {gstNumber}</span>
              <span>•</span>
              <span>Headquarters: {settings.city || 'India'}</span>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-3xl border border-emerald-900/10 shadow-md p-6 sm:p-10 space-y-8 font-sans">
          
          {/* 1. Acceptance */}
          <section className="space-y-3 border-b border-emerald-900/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#062319]">1. Agreement to Terms</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              By accessing our website, inquiring about plants, submitting WhatsApp orders, or booking landscaping services provided by <strong className="text-emerald-900">{nurseryName}</strong> (operated from {fullAddress}), you agree to be bound by these Terms & Conditions.
            </p>
          </section>

          {/* 2. Nature of Live Plants Disclaimer */}
          <section className="space-y-3 border-b border-emerald-900/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#062319]">2. Live Plant Product Disclaimers</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              Live plants are living organisms. Therefore:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-emerald-900/10 text-xs text-emerald-900 space-y-1">
                <span className="font-bold text-emerald-950 block">Natural Variations:</span>
                <span>Individual plant height, leaf count, variegation, and floral status may vary naturally from photographic illustrations depending on the season.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-emerald-900/10 text-xs text-emerald-900 space-y-1">
                <span className="font-bold text-emerald-950 block">Pot & Nursery Container:</span>
                <span>Unless specified as delivered in a ceramic/designer pot, plants are delivered in nursery growth pots designed for safe transport.</span>
              </div>
            </div>
          </section>

          {/* 3. Orders, Inquiries & Pricing */}
          <section className="space-y-3 border-b border-emerald-900/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#062319]">3. Orders, GST & Payments</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              All prices listed on our catalogue are in INR (₹). Inquiries submitted through our forms or WhatsApp constitute a request for product availability and delivery estimate.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-950/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Tax Invoices:</strong> Official tax invoices bearing GSTIN <code className="bg-emerald-50 text-emerald-800 px-1 py-0.5 rounded font-mono">{gstNumber}</code> will be provided for all finalized sales.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Bulk & Wholesale Terms:</strong> Bulk quotes remain valid for 15 calendar days from the date of issuance.</span>
              </li>
            </ul>
          </section>

          {/* 4. Transit & Replacement Policy */}
          <section className="space-y-3 border-b border-emerald-900/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#062319]">4. Packaging Guarantee & Transit Damage</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              We take extreme pride in our custom-engineered ventilated packaging that protects live flora during shipping pan India ({settings.deliveryBadge || 'Pan India Delivery'}).
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="block text-amber-950 font-bold">Transit Damage Claim Policy:</strong>
              <p>
                In the rare event that a plant arrives severely damaged or dead, please notify our team within <strong>24 to 48 hours of delivery</strong> with unboxing photos/videos sent to <span className="underline font-semibold">{phone}</span> or <span className="underline font-semibold">{email}</span>. We will gladly arrange a free replacement or store credit.
              </p>
            </div>
          </section>

          {/* 5. Intellectual Property */}
          <section className="space-y-3 border-b border-emerald-900/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#062319]">5. Intellectual Property Rights</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              All photographs, project portfolio images, catalogue descriptions, and branding elements appearing on this website are the exclusive property of <strong className="text-emerald-900">{nurseryName}</strong>. Unauthorized reproduction is strictly prohibited.
            </p>
          </section>

          {/* 6. Contact Information */}
          <section className="space-y-4 pt-2">
            <h2 className="font-serif text-xl font-bold text-[#062319]">6. Contact & Legal Notices</h2>
            <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
              For any legal notices, inquiries regarding these terms, or custom service contracts, please contact our nursery management:
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
                  <span>Official Email</span>
                </div>
                <p className="text-xs text-emerald-950 font-medium">{email}</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#062319] hover:bg-emerald-950 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <span>Contact Nursery Desk</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
