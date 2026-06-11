import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote as QuoteIcon, MessageSquare, Send, User, CheckCircle, Sparkles } from 'lucide-react';
import { dataStore } from '../dataStore';
import { Testimonial } from '../types';

export function TestimoniesPage() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTestimonials = () => {
      const all = dataStore.getTestimonials();
      setList(all.filter(t => t.approved));
    };
    fetchTestimonials();
    window.addEventListener('lumina_store_updated', fetchTestimonials);
    return () => window.removeEventListener('lumina_store_updated', fetchTestimonials);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    setIsSubmitting(true);

    const testimonialData = {
      name: name.trim(),
      role: role.trim() || 'Community Member',
      quote: quote.trim(),
      avatar: '',
      approved: false // explicitly false so admin can review
    };

    // Store the testimonial
    dataStore.addTestimonial(testimonialData);

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset Form
    setName('');
    setRole('');
    setQuote('');

    // Clear success banner after 5 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 6000);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <span className="px-3 py-1 border border-gold-500/30 text-[10px] font-bold tracking-[0.25em] text-gold-400 uppercase bg-gold-500/5 rounded-full">
              Community Voices & Witness
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-serif italic text-soft-white leading-tight"
          >
            Testimony Chambers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-sm md:text-base leading-relaxed"
          >
            "And they overcame him by the blood of the Lamb, and by the word of their testimony..." — Revelation 12:11. Share what God is doing in your life.
          </motion.p>
        </div>

        {/* SUBMISSION & MAIN PERSPECTIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SIDE: FEED OF TESTIMONIES */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-b border-white/10 pb-4 flex justify-between items-center">
              <h2 className="text-xl font-serif italic text-soft-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-500" /> Community Witness ({list.length})
              </h2>
            </div>

            {list.length === 0 ? (
              <div className="p-16 border border-dashed border-white/10 rounded-2xl text-center text-xs text-white/30 italic">
                No shared testimonies yet. Be the first to share your glorious witness!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-lg relative hover:bg-white/10 transition-all flex flex-col justify-between"
                  >
                    <QuoteIcon className="absolute top-4 right-4 w-8 h-8 text-white/5 pointer-events-none" />
                    
                    <div className="space-y-4 relative z-10 flex flex-col h-full justify-between">
                      <p className="text-white/75 leading-relaxed font-serif italic text-xs md:text-[13px] whitespace-pre-line">
                        "{item.quote}"
                      </p>
                      
                      <div className="flex items-center gap-3 pt-3 border-t border-white/5 mt-auto">
                        <div className="min-w-0">
                          <h4 className="font-bold text-soft-white text-xs tracking-wide truncate">{item.name}</h4>
                          <p className="text-[9px] text-white/50 uppercase tracking-widest mt-0.5 truncate">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: SUBMISSION FORM */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-28 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6"
            >
              <div>
                <h3 className="text-lg font-serif italic text-soft-white font-medium">Share Your Testimony</h3>
                <p className="text-xs text-white/40 mt-1">If you don't want your Testimony to be published, kindly write "private" at the beginning of your testimony. </p>
              </div>

              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded text-xs leading-relaxed flex gap-2.5 items-start"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Praise God!</span>
                      Your testimony has been submitted successfully and is pending administrative review. Thank you for sharing your glorious witness!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Full Name / Initials</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sister Grace O."
                    className="w-full bg-black/20 border border-white/15 px-3.5 py-2.5 rounded text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-white/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Your Calling / Subheading</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Partner, Visitor, Believer (optional)"
                    className="w-full bg-black/20 border border-white/15 px-3.5 py-2.5 rounded text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-white/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 block">Your Testimony</label>
                  <textarea
                    required
                    rows={6}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Describe how the finished works of Christ, a program, or a particular teaching transformed your state..."
                    className="w-full bg-black/20 border border-white/15 px-3.5 py-2.5 rounded text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-white/20 font-serif italic"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> {isSubmitting ? 'Submitting Testimony...' : 'Publish Testimony'}
                </button>
              </form>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}
