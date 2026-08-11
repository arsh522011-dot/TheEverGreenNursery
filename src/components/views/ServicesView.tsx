import React from 'react';
import { Service } from '../../types';
import { CheckCircle2, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServicesViewProps {
  services: Service[];
  onOpenEnquiry: (plant?: undefined, service?: Service) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ services, onOpenEnquiry }) => {
  return (
    <div className="bg-[#faf8f5] text-[#1a2e26] min-h-screen pt-20 sm:pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-700 block">
            HORTICULTURAL ARCHITECTURE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#062319] font-light">
            Our Landscape & Botanical Services
          </h1>
          <p className="text-sm text-emerald-900/70 leading-relaxed">
            From estate master planning to luxury indoor greening, our senior horticulturalists and landscape architects engineer living works of art.
          </p>
        </div>

        <div className="space-y-12">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className={`bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-6 h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md">
                <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
              </div>

              <div className="lg:col-span-6 space-y-4">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono uppercase tracking-wider">
                  {srv.badge || 'Horticultural Service'}
                </span>

                <h2 className="font-serif text-2xl sm:text-4xl text-[#062319] font-light">
                  {srv.title}
                </h2>

                <p className="text-sm text-emerald-950/80 leading-relaxed">
                  {srv.fullDesc}
                </p>

                <div className="space-y-2 pt-2 border-t border-emerald-900/10">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-900 font-semibold block">Key Service Deliverables:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
                    {srv.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => onOpenEnquiry(undefined, srv)}
                    className="py-3.5 px-6 rounded-xl bg-[#062319] text-emerald-200 hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Request Service Consultation</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
