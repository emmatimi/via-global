import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HandHeart, TrendingUp, ChevronDown, ChevronUp, Copy, Check, MessageCircle } from 'lucide-react';
import { publicDataStore } from '../publicDataStore';

export function Partner() {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const settings = publicDataStore.getSettings();
  const whatsappNumber = settings?.supportPhone?.replace(/[^0-9]/g, '') || '18005555433';

  const bankName = "Opay";
  const accountName = "VIA Global";
  const accountNumber = "1023456789";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="partner" className="py-12 bg-transparent relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white/5 rounded-xl overflow-hidden shadow-xl border border-white/10 backdrop-blur-sm p-6 sm:p-10">
          <div className=" items-center">
            
            {/* CONTENT COLUMN */}
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
                {/* Bank details drop down toggle */}
                <button 
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-soft-white font-medium flex items-center gap-1.5 transition-all"
                >
                  {showBankDetails ? 'Hide Bank Details' : 'View Bank Transfer Details'}
                  {showBankDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {/* WhatsApp button link */}
                <a 
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-xs text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-green-600/10"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white/10" /> Reach Out on WhatsApp
                </a>
              </div>
            </div>

          </div>

          {/* BANK DETAILS SLIDEOUT / DROPDOWN */}
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
