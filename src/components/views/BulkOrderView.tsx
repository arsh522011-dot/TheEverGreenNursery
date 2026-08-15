import React, { useState } from 'react';
import { Package, Building2, Send, CheckCircle2, Phone, Mail, MapPin, Truck, ShieldCheck, Sparkles, HelpCircle, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SiteSettings } from '../../types';
import { StorageService } from '../../services/storage';

interface BulkOrderViewProps {
  settings: SiteSettings;
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const BulkOrderView: React.FC<BulkOrderViewProps> = ({ settings, onNavigate }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyGst: '',
    contactName: '',
    email: '',
    phone: '',
    purpose: 'Corporate Gifting',
    plantCategory: 'Indoor Plants',
    estimatedQuantity: '100 - 500 Units',
    cityLocation: '',
    targetDate: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.contactName && (formData.email || formData.phone)) {
      StorageService.addInquiry({
        type: 'bulk_order',
        name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        companyGst: formData.companyGst,
        subject: `Bulk Order Inquiry: ${formData.estimatedQuantity} items (${formData.plantCategory})`,
        message: `Purpose: ${formData.purpose}\nEstimated Qty: ${formData.estimatedQuantity}\nPlant Category: ${formData.plantCategory}\nLocation: ${formData.cityLocation || 'N/A'}\nTarget Date: ${formData.targetDate || 'N/A'}\nNotes: ${formData.notes || 'None'}`,
      });
    }
    setSubmitted(true);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b'],
      });
    } catch (err) {
      console.log('Confetti effect:', err);
    }
  };

  const handleWhatsAppInquiry = () => {
    const text = `*BULK ORDER INQUIRY*\n\n` +
      `*Company/Client:* ${formData.companyName || 'N/A'}\n` +
      `*Business GSTIN:* ${formData.companyGst || 'Not provided'}\n` +
      `*Contact Person:* ${formData.contactName}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Email:* ${formData.email}\n` +
      `*Purpose:* ${formData.purpose}\n` +
      `*Plant Variety:* ${formData.plantCategory}\n` +
      `*Estimated Quantity:* ${formData.estimatedQuantity}\n` +
      `*Location/City:* ${formData.cityLocation || 'N/A'}\n` +
      `*Target Date:* ${formData.targetDate || 'As soon as possible'}\n` +
      `*Additional Details:* ${formData.notes || 'None'}`;

    const cleanNumber = (settings.whatsAppNumber || '+91 98765 43210').replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-[#f8faf8] min-h-screen text-[#132e1f] pt-[60px] sm:pt-[70px]">
      {/* HERO BANNER */}
      <section className="relative bg-[#0d2818] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://res.cloudinary.com/dpxoxrnrd/image/upload/v1785834025/ChatGPT_Image_Aug_4_2026_02_27_52_PM_ufv2ja.png"
            alt="Nursery Background"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#062319]/70 via-[#0d2818]/60 to-[#062319]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-medium tracking-wide">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>B2B & Wholesale Nursery Supply</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
            Bulk Order & Wholesale Plant Inquiries
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Looking for 50 to 10,000+ healthy plants for corporate gifting, resort landscaping, office greening, or retail resale? Request a tailored quote below with no payment required upfront.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs text-emerald-200 font-mono">
            <span className="bg-emerald-900/60 border border-emerald-700/50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct Nursery Tier Pricing
            </span>
            <span className="bg-emerald-900/60 border border-emerald-700/50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              Pan-India Safe Logistics
            </span>
            <span className="bg-emerald-900/60 border border-emerald-700/50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Custom Branding & Pots Available
            </span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT FORM COLUMN (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl relative">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold block mb-1">
                Inquiry Only • No Payment Required
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#132e1f]">
                Submit Bulk Order Request
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Our horticultural specialists will review your requirements and respond within 2-4 business hours with custom pricing & availability.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-5 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#132e1f]">
                  Bulk Inquiry Received!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out, <strong className="text-emerald-900">{formData.contactName}</strong>. Our bulk sales team is preparing your custom quote for <span className="font-semibold">{formData.estimatedQuantity}</span> ({formData.plantCategory}).
                </p>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left max-w-md mx-auto text-xs space-y-1.5 text-emerald-900">
                  <div className="font-bold border-b border-emerald-200 pb-1 text-emerald-800">Inquiry Summary:</div>
                  <div><strong>Company:</strong> {formData.companyName || 'Individual / Personal'}</div>
                  <div><strong>Purpose:</strong> {formData.purpose}</div>
                  <div><strong>Category:</strong> {formData.plantCategory}</div>
                  <div><strong>Quantity:</strong> {formData.estimatedQuantity}</div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send via WhatsApp for Immediate Quote</span>
                  </button>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp / Event Studio"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Business GSTIN <span className="text-gray-400 font-normal text-[11px]">(Optional for Tax Credit Invoice)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 07AABCU9603R1ZM"
                      value={formData.companyGst}
                      onChange={(e) => setFormData({ ...formData, companyGst: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900 font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Contact Person Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Phone / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900"
                    />
                  </div>
                </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900"
                    />
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Purpose of Inquiry
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => e.target.value && setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900 bg-white"
                    >
                      <option value="Commercial Landscaping & Contracting">Commercial Landscaping & Contractors</option>
                      <option value="Builders & Real Estate Projects">Builders & Real Estate Residential/Commercial Projects</option>
                      <option value="Hotels, Resorts & Cafes">Hotels, Resorts & Hospitality Landscaping</option>
                      <option value="Offices & Corporate Campus">Offices & Corporate Greening / Gifting</option>
                      <option value="Educational Institutions & Hospitals">Schools, Universities & Hospital Campuses</option>
                      <option value="Retail Reseller / Garden Center">Reseller Nursery / Garden Center Supply</option>
                      <option value="Farmhouse & Private Estate">Farmhouse & Private Estate Development</option>
                      <option value="Other Bulk Requirement">Other Custom Bulk Requirement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Plant Category Preferred
                    </label>
                    <select
                      value={formData.plantCategory}
                      onChange={(e) => setFormData({ ...formData, plantCategory: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900 bg-white"
                    >
                      <option value="Indoor Plants">Indoor Plants</option>
                      <option value="Outdoor Plants">Outdoor Plants</option>
                      <option value="Pots">Pots & Planters</option>
                      <option value="Custom Mixed Selection">Custom Mixed Selection</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Estimated Quantity
                    </label>
                    <select
                      value={formData.estimatedQuantity}
                      onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900 bg-white"
                    >
                      <option value="25 - 50 Units">25 - 50 Units</option>
                      <option value="50 - 100 Units">50 - 100 Units</option>
                      <option value="100 - 500 Units">100 - 500 Units</option>
                      <option value="500 - 2000 Units">500 - 2,000 Units</option>
                      <option value="2000+ Units">2,000+ Units (Large Scale)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      City / Delivery Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai, Bangalore, Delhi"
                      value={formData.cityLocation}
                      onChange={(e) => setFormData({ ...formData, cityLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Target Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Additional Requirements or Plant Specifics
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention specific plant species, custom pot color requirements, logo branding on pots, care cards, or special packing requests..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs text-gray-900 resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#0f3822] hover:bg-[#165232] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Submit Bulk Inquiry Form</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppInquiry}
                    className="py-3.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT INFO / FAQ COLUMN (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#132e1f] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <span>Why Partner With Us?</span>
              </h3>

              <div className="space-y-3.5 text-xs text-gray-700">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-200/70 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#132e1f]">Nursery Direct Tier Pricing</h4>
                    <p className="text-gray-600 mt-0.5">Substantial volume discounts directly from our propagation nurseries without middleman markups.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-200/70 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#132e1f]">Uniformity & Quality Guarantee</h4>
                    <p className="text-gray-600 mt-0.5">Every specimen in a bulk shipment is hand-selected for identical height, foliage density, and vigor.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-200/70 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-[#132e1f]">Custom Pot Branding & Gifting</h4>
                    <p className="text-gray-600 mt-0.5">Add custom corporate logos, company sleeve bands, ceramic planters, and care instruction cards.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-200/70 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-[#132e1f]">Damage-Protected Freight</h4>
                    <p className="text-gray-600 mt-0.5">Special wooden crating and moist-root potting media to ensure zero transit shock across India.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DIRECT CONTACT CARD */}
            <div className="bg-[#0f3822] text-white rounded-3xl p-6 shadow-md space-y-3">
              <h4 className="font-serif text-lg font-bold text-emerald-100">
                Direct Bulk Desk Contact
              </h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Prefer to discuss directly with our Bulk Logistics Manager?
              </p>

              <div className="space-y-2 pt-1 text-xs font-mono text-emerald-100">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{settings.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{settings.email || 'bulk@theevergreennursary.com'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{settings.address || 'Central Nursery Hub, India'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
