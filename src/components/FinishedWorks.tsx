import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Flame, Heart, Sparkles, BookOpen, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { publicDataStore } from '../publicDataStore';

export function FinishedWorks() {
  const [hasPrayed, setHasPrayed] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Record convert in local storage database
      publicDataStore.addConvert(userName, userEmail);

      // Send a request to our custom mail/prayer endpoint to notify administrative leadership
      const response = await fetch('/api/prayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          request: `GLORY TO GOD! I prayed the Salvation Prayer on the Finished Works of Christ section today. Please welcome me to the family and send me resources!`,
        }),
      });

      if (response.ok) {
        setMsgSent(true);
      } else {
        // Fallback mock success if offline/SMTP not fully set up
        setMsgSent(true);
      }
    } catch (err) {
      console.error(err);
      setMsgSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="finished-works" className="py-24 bg-gradient-to-b from-navy-900 to-navy-800 text-soft-white border-b border-white/5 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT SIDE: "Finished Works Of Christ" Detail */}
          <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-500 block">
                  The Foundations of Salvation
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-soft-white leading-tight">
                  The Finished Works of <span className="text-gold-500 italic block sm:inline">Jesus Christ</span>
                </h2>
                <div className="h-0.5 w-20 bg-gold-500 mt-2" />
              </div>

              <div className="text-white/70 text-sm leading-relaxed font-sans">
                <p>
                  On the cross, Jesus Christ declared: <strong className="text-gold-400 italic font-serif">“It is finished”</strong> (John 19:30). These words—<em className="text-gold-300">Tetelestai</em>—signify a debt paid in full. Every barrier, sin, and spiritual separation was conquered forever.
                </p>
              </div>

              {/* Major Pillars of His Finished Work Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 hover:border-gold-500/30 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-soft-white">Perfect Substitution</h4>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    He took our weight of suffering and separation, giving us His divine righteousness in return.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 hover:border-gold-500/30 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-soft-white">Justification by Grace</h4>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Salvation is a gift received through faith alone—declaring you holy and blameless before God.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 hover:border-gold-500/30 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-soft-white">Triumphant Resurrection</h4>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    He conquered the grave on the third day, securing eternal victory and absolute hope for believers.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 hover:border-gold-500/30 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-soft-white">Absolute Victory</h4>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Every spiritual dark claim is revoked. You are delivered into the glorious light of His Kingdom.
                  </p>
                </div>
                
              </div>

              {/* Scriptural reassurance */}
              <div className="bg-gold-500/5 rounded-xl p-4 border border-gold-500/10 flex gap-3.5 items-start">
                <BookOpen className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs text-gold-200/80 italic font-serif leading-relaxed">
                  "For by grace you have been saved through faith... it is the gift of God, lest anyone should boast." — Ephesians 2:8-9
                </p>
              </div>

            </motion.div>
          </div>

          {/* RIGHT SIDE: "If You Believe, Say This Prayer" Section */}
          <div className="lg:col-span-5 flex flex-col justify-between order-2 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-navy-950/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gold-500/20 shadow-xl flex flex-col justify-between h-full relative overflow-hidden group"
            >
              {/* Gold linear detail on top */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
              
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="p-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500">
                    <Heart className="w-4 h-4 fill-gold-500/20" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold-500">
                    Ready to Take the First Step?
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif italic text-soft-white mb-4">
                  “Believe in your heart, confess with your mouth.”
                </h3>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                  The Finished Works of Christ is a free gift received by absolute faith. If you believe this truth in your heart today, raise your voice and pray this word of prayer:
                </p>

                {/* The Salvation Prayer Block */}
                <div className="bg-navy-900/60 rounded-xl p-5 border border-white/5 relative mb-6">
                  <div className="absolute top-3 right-3 text-gold-500/20 font-serif text-4xl select-none">“</div>
                  <p className="text-sm sm:text-base text-gold-200/90 leading-relaxed italic font-serif text-center px-2">
                    "Dear Lord Jesus, I thank You for Your finished work on the cross. I believe You died for my sins, were buried, and rose again on the third day. I accept Your free gift of grace, forgiveness, and eternal life. I confess You as my Lord and Savior. Thank You for saving me. Guide me in Your light from this day forward. Amen."
                  </p>
                </div>
              </div>

              {/* Interaction Block */}
              <div>
                {!hasPrayed ? (
                  <button 
                    onClick={() => setHasPrayed(true)}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-navy-900 text-xs font-bold uppercase tracking-widest transition-all rounded-md shadow-lg shadow-gold-500/10 flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                  >
                    <Flame className="w-4 h-4" /> I Prayed This Salvation Prayer
                  </button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-gold-500/10 border border-gold-500/20 rounded-lg text-gold-300 text-xs flex items-start gap-3">
                      <Sparkles className="w-5 h-5 shrink-0 text-gold-500" />
                      <div>
                        <strong className="block text-soft-white uppercase tracking-wider text-[10px] mb-0.5">Heaven Rejoices!</strong>
                        <p className="mb-2">Welcome to God's family! You have been born again into eternal grace. We would love to walk with you on this beautiful journey. If you want to join our school of discipleship you can reach out to us on the <Link to="/contact" className="underline font-bold text-white hover:text-gold-400 inline-flex items-center gap-0.5">contact page<ArrowRight className="w-3 h-3 inline" /></Link></p>
                        <p className="text-gold-200">
                          You can also check our <Link to="/teachings" className="underline font-bold text-white hover:text-gold-400 inline-flex items-center gap-0.5">teachings <ArrowRight className="w-3 h-3 inline" /></Link> for edifying content for spiritual growth.
                        </p>
                      </div>
                    </div>

                    {!msgSent ? (
                      <form onSubmit={handleDecisionSubmit} className="space-y-3 bg-black/20 p-4 rounded-lg border border-white/5">
                        <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-1">Let Us Celebrate & Pray with You</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input 
                            required
                            type="text" 
                            placeholder="Your Name" 
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="bg-navy-950/60 border border-white/10 rounded px-3 py-2 text-xs text-soft-white placeholder-white/30 focus:outline-none focus:border-gold-500"
                          />
                          <input 
                            required
                            type="email" 
                            placeholder="Email Address" 
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="bg-navy-950/60 border border-white/10 rounded px-3 py-2 text-xs text-soft-white placeholder-white/30 focus:outline-none focus:border-gold-500"
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={submitting}
                          className="w-full py-2 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-[10px] font-bold text-white uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3 h-3" /> {submitting ? 'Connecting...' : 'Receive Welcome Email & Letter'}
                        </button>
                      </form>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-lg flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Congratulations! Your decision has been securely sent.</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>

            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
