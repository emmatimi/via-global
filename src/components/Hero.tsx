import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { ArrowRight, PlayCircle, Quote as QuoteIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { publicDataStore, Quote } from '../publicDataStore';

export function Hero() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left

  // Load quotes and establish listener
  useEffect(() => {
    const loadQuotes = () => {
      const q = publicDataStore.getQuotes();
      setQuotes(q);
      // Reset index if out of bounds
      if (currentIndex >= q.length) {
        setCurrentIndex(0);
      }
    };
    loadQuotes();

    window.addEventListener('lumina_store_updated', loadQuotes);
    return () => {
      window.removeEventListener('lumina_store_updated', loadQuotes);
    };
  }, [currentIndex]);

  // Auto-cycle slice every 6.5 seconds
  useEffect(() => {
    if (quotes.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [quotes]);

  const handleNext = () => {
    if (quotes.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePrev = () => {
    if (quotes.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  // Variants for custom transition animation
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    })
  };

  const currentQuote = quotes[currentIndex];

  return (
    <section className="site-hero relative min-h-screen flex items-center overflow-hidden bg-navy-950">
      {/* Background Image & Overlays */}
      <div 
        className="site-hero-bg absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-overlay"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
      >
        <div className="site-hero-tint absolute inset-0 bg-navy-950/80" />
        <div className="site-hero-gradient absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Title & Action Items */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-gold-500 text-[10px] uppercase tracking-[0.3em] font-semibold mb-6">
                A Troop of God's Army
              </div>
              <h1 className="text-3xl sm:text-3xl md:text-6xl font-serif italic text-soft-white leading-[1.1] mb-8 font-medium">
                Raising a generation of light, impact and <span className="text-gold-500">influence.</span>
              </h1>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg mb-10 font-sans">
                We are a ministry platform dedicated to building spiritual foundations and empowering modern leaders to carry the message of hope across the globe.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a 
                  href="/about" 
                  className="bg-gold-500 text-navy-950 hover:bg-gold-400 px-8 py-4 font-bold text-xs uppercase tracking-widest text-center transition-all shadow-md shadow-gold-500/15"
                >
                  About Us
                </a>
                <a 
                  href="#programs" 
                  className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white px-8 py-4 font-bold text-xs uppercase tracking-widest text-white/90 text-center transition-all"
                >
                  See Programs
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Interactive Slide-transition quotes */}
          <div className="lg:col-span-5 w-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative py-2 flex flex-col justify-between min-h-[180px] overflow-hidden"
            >
              {/* Slider Space with Animating Quotes */}
              <div className="relative flex-1 flex flex-col justify-center min-h-[100px] cursor-default">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  {currentQuote ? (
                    <motion.div
                      key={currentQuote.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-5"
                    >
                      <p className="hero-quote-text text-xs sm:text-sm md:text-base text-gold-200/80 italic font-serif leading-relaxed">
                        “{currentQuote.text}”
                      </p>
                      <p className="hero-quote-author text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                        — {currentQuote.author}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="text-xs text-white/30 italic">No quotes configured.</div>
                  )}
                </AnimatePresence>
              </div>

              {/* Slider Navigation Controls */}
              {quotes.length > 1 && (
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5">
                  <div className="flex gap-1.5">
                    {quotes.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDirection(idx > currentIndex ? 1 : -1);
                          setCurrentIndex(idx);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === currentIndex ? 'bg-gold-500 w-4' : 'bg-white/10 hover:bg-white/30'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={handlePrev}
                      className="p-1 px-2 hover:bg-white/5 border border-white/10 hover:border-white/20 rounded text-white/40 hover:text-white transition-all"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-1 px-2 hover:bg-white/5 border border-white/10 hover:border-white/20 rounded text-white/40 hover:text-white transition-all"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}


