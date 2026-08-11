import React from 'react';
import { SiteSettings } from '../../types';

interface WhatsAppButtonProps {
  settings?: SiteSettings;
  whatsAppNumber?: string;
  defaultMessage?: string;
  onOpenEnquiryModal?: () => void;
}

// Official WhatsApp SVG Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.757-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  settings,
  whatsAppNumber: directNum,
  defaultMessage: customMsg,
  onOpenEnquiryModal,
}) => {
  // Respect master enable/disable setting from Admin
  const isEnabled = settings?.whatsAppEnabled ?? true;
  if (!isEnabled) return null;

  const targetNumber = directNum || settings?.whatsAppNumber || '18004587336';
  const targetMessage = customMsg || settings?.whatsAppDefaultMessage || 'Hello! I am visiting your nursery website and would like to inquire about your plant collection and services.';
  const positionClass = settings?.whatsAppPosition === 'bottom-left' 
    ? 'bottom-5 left-5 sm:bottom-6 sm:left-6' 
    : 'bottom-5 right-5 sm:bottom-6 sm:right-6';

  const buttonLabel = settings?.whatsAppButtonLabel || 'Chat on WhatsApp';
  const subLabel = settings?.whatsAppSubLabel || 'Instant Response';
  const tooltipText = settings?.whatsAppTooltipText || 'Chat directly on WhatsApp';

  const handleClick = () => {
    const cleanNum = targetNumber ? targetNumber.replace(/[^0-9]/g, '') : '';
    if (cleanNum && cleanNum.length >= 8) {
      const encodedMsg = encodeURIComponent(targetMessage);
      window.open(`https://wa.me/${cleanNum}?text=${encodedMsg}`, '_blank');
    } else if (onOpenEnquiryModal) {
      onOpenEnquiryModal();
    }
  };

  const isLeft = settings?.whatsAppPosition === 'bottom-left';

  return (
    <div className={`fixed ${positionClass} z-40 group select-none`}>
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center p-3.5 sm:px-4 sm:py-3 rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-950/80 border-2 border-white/40 hover:bg-[#20ba59] active:scale-95 transition-all duration-300 hover:shadow-emerald-500/50"
        title={tooltipText}
        aria-label="Direct WhatsApp Enquiry"
      >
        {/* Animated Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        {/* Online Status Indicator Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-white" />
        </span>

        {/* WhatsApp Icon */}
        <WhatsAppIcon className="w-7 h-7 sm:w-6 sm:h-6 text-white shrink-0 drop-shadow-sm" />

        {/* Text Label - Shown on tablet/desktop */}
        <div className="hidden sm:flex flex-col text-left pl-2 pr-1">
          <span className="text-xs font-bold tracking-wide leading-tight font-sans">
            {buttonLabel}
          </span>
          <span className="text-[9px] text-emerald-100 font-mono tracking-wider uppercase opacity-90">
            {subLabel}
          </span>
        </div>

        {/* Desktop Hover Tooltip */}
        <span className={`absolute ${isLeft ? 'left-full ml-3' : 'right-full mr-3'} top-1/2 -translate-y-1/2 bg-[#062319] text-emerald-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-emerald-500/30 shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none font-mono hidden md:block`}>
          {tooltipText}
        </span>
      </button>
    </div>
  );
};

