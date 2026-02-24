import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";

const PHONE_NUMBER = "+992000000000";
const TELEGRAM_LINK = "https://t.me/atg_tj";
const WHATSAPP_LINK = `https://wa.me/${PHONE_NUMBER.replace(/\+/g, "")}`;
const PHONE_LINK = `tel:${PHONE_NUMBER}`;

export function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2 sm:gap-3" data-testid="floating-contact">
      {open && (
        <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 sm:gap-3 bg-white dark:bg-zinc-800 rounded-full pl-3 pr-4 sm:pl-4 sm:pr-5 py-2 sm:py-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
            data-testid="link-telegram"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#229ED9] flex items-center justify-center shrink-0">
              <SiTelegram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Telegram</span>
          </a>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 sm:gap-3 bg-white dark:bg-zinc-800 rounded-full pl-3 pr-4 sm:pl-4 sm:pr-5 py-2 sm:py-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
            data-testid="link-whatsapp"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <SiWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">WhatsApp</span>
          </a>

          <a
            href={PHONE_LINK}
            className="flex items-center gap-2.5 sm:gap-3 bg-white dark:bg-zinc-800 rounded-full pl-3 pr-4 sm:pl-4 sm:pr-5 py-2 sm:py-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
            data-testid="link-phone"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Позвонить</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
          open
            ? "bg-zinc-700 hover:bg-zinc-600 rotate-0"
            : "bg-primary hover:bg-primary/90 animate-pulse"
        }`}
        data-testid="button-floating-contact"
      >
        {open ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        ) : (
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        )}
      </button>
    </div>
  );
}
