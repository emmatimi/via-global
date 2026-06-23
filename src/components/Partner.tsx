import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { publicDataStore } from '../publicDataStore';

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.11 17.21c-.27-.14-1.58-.78-1.83-.87-.24-.09-.42-.14-.6.14-.18.27-.69.87-.84 1.05-.16.18-.31.2-.58.07-.27-.14-1.12-.41-2.14-1.3-.79-.7-1.33-1.56-1.48-1.83-.16-.27-.02-.41.12-.55.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46-.16-.01-.34-.01-.52-.01-.18 0-.47.07-.72.34-.24.27-.94.92-.94 2.24 0 1.32.97 2.59 1.1 2.77.14.18 1.89 2.89 4.58 4.05.64.27 1.14.44 1.53.57.64.2 1.23.17 1.69.1.52-.08 1.58-.65 1.81-1.27.22-.63.22-1.16.16-1.27-.07-.11-.24-.18-.51-.32Z" />
      <path d="M16.03 3.2c-7.07 0-12.8 5.71-12.8 12.74 0 2.25.59 4.45 1.72 6.38L3.12 28.8l6.68-1.75a12.87 12.87 0 0 0 6.22 1.59h.01c7.06 0 12.8-5.71 12.8-12.75 0-3.41-1.33-6.61-3.76-9.01A12.72 12.72 0 0 0 16.03 3.2Zm0 23.29h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.96 1.04 1.06-3.85-.26-.4a10.56 10.56 0 0 1-1.64-5.67c0-5.88 4.82-10.66 10.73-10.66 2.87 0 5.56 1.11 7.58 3.13a10.57 10.57 0 0 1 3.14 7.54c0 5.88-4.82 10.66-10.8 10.66Z" />
    </svg>
  );
}

export function Partner() {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState(() => publicDataStore.getSettings());

  useEffect(() => {
    const handleUpdate = () => setSettings(publicDataStore.getSettings());
    window.addEventListener('lumina_store_updated', handleUpdate);
    return () => window.removeEventListener('lumina_store_updated', handleUpdate);
  }, []);

  const whatsappNumber = settings.supportPhone?.replace(/[^0-9]/g, '') || '18005555433';
  const bankName = settings.partnerBankName?.trim() || 'Opay';
  const accountName = settings.partnerAccountName?.trim() || 'VIA Global';
  const accountNumber = settings.partnerAccountNumber?.trim() || '1023456789';

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="partner" className="py-12 bg-transparent relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white/5 rounded-xl overflow-hidden shadow-xl border border-white/10 backdrop-blur-sm p-6 sm:p-10">
          <div className="items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold-500 block">
                Support the vision
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif italic text-soft-white">
                Partner with the <span className="text-gold-500">Vision</span>
              </h2>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                Your generosity fuels our mission to reach more people, host transformative gatherings, and create lasting impact in our generation.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-soft-white font-medium flex items-center gap-1.5 transition-all"
                >
                  {showBankDetails ? 'Hide Bank Details' : 'View Bank Transfer Details'}
                  {showBankDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="partner-whatsapp-button px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-xs text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-green-600/10"
                >
                  <WhatsAppIcon className="w-4 h-4" /> Reach Out on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showBankDetails && (
              <motion.div
                key="bank-details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="bg-black/20 rounded-xl p-4 sm:p-6 border border-white/5 max-w-xl">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" /> Direct Bank Transfer Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block">Bank Name</span>
                        <p className="text-soft-white font-medium font-serif italic">{bankName}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block">Account Name</span>
                        <p className="text-soft-white font-medium">{accountName}</p>
                      </div>
                      <div className="space-y-1 relative">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block">Account Number</span>
                        <div className="flex items-center gap-1.5">
                          <p className="text-gold-300 font-mono font-medium tracking-wider">{accountNumber}</p>
                          <button
                            onClick={handleCopy}
                            className="p-1 hover:bg-white/5 text-white/40 hover:text-gold-500 rounded transition-all"
                            title="Copy Account Number"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {copied && (
                          <span className="absolute -bottom-5 right-0 text-[9px] text-green-400 uppercase tracking-widest font-bold font-sans">Copied!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
