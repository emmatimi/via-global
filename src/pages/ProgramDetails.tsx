import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Calendar, Clock3, LoaderCircle, MapPin } from 'lucide-react';
import { dataStore, type FlagshipProgram } from '../dataStore';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function ProgramDetails() {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<FlagshipProgram | null>(null);
  const [programState, setProgramState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    if (!id) {
      setProgramState("missing");
      return;
    }

    setProgramState("loading");

    const unsubscribe = onSnapshot(
      doc(db, 'programs', id),
      (snapshot) => {
        if (snapshot.exists()) {
          setProgram(snapshot.data() as FlagshipProgram);
          setProgramState("ready");
        } else {
          setProgram(null);
          setProgramState("missing");
        }
      },
      (error) => {
        console.error("Failed to load program details", error);
        setProgram(null);
        setProgramState("missing");
      }
    );

    return () => unsubscribe();
  }, [id]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: ""
  });

  // Handle anchor link scrolling on load
  useEffect(() => {
    if (window.location.hash === '#registration') {
      setTimeout(() => {
        const element = document.getElementById('registration');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  if (programState === "loading") {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center flex-col text-center">
        <LoaderCircle className="w-8 h-8 animate-spin text-gold-500 mb-4" />
        <p className="text-white/60 text-sm">Loading program details...</p>
      </div>
    );
  }

  if (!program || programState === "missing") {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center flex-col text-center">
        <h2 className="text-2xl font-serif italic text-soft-white mb-4">Program Not Found</h2>
        <Link to="/programs" className="text-gold-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
          Back to Programs
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Save locally first to ensure robust local functionality
      if (id) {
        dataStore.addRegistration({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          programId: id
        });
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          programId: id,
          programTitle: program.title,
          programVenue: program.venue,
          programDate: program.date,
          programTime: program.time
        })
      });

      if (!response.ok) {
        throw new Error("Registration request failed");
      }

      setStatus("success");
      setFormData({ fullName: "", email: "", phone: "", location: "" });
    } catch (error) {
      console.error("Registration email dispatch failed", error);
      setStatus("error");
    }
  };


  return (
    <section className="py-24 pt-32 bg-transparent relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/programs" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to programs
        </Link>

        {/* Program Title Header Section */}
        <div className="mb-12 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-gold-500 bg-gold-500/5 px-3 py-1.5 rounded-sm border border-gold-500/10">
              {program.subtitle || 'Meeting'}
            </span>
            <span className="text-white/20">•</span>
            <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-white/50 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>{program.date}</span>
            </div>
            {program.time && (
              <>
                <span className="text-white/20">•</span>
                <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-white/50 flex items-center gap-1.5">
                  <Clock3 className="w-4 h-4 text-gold-400" />
                  <span>{program.time}</span>
                </div>
              </>
            )}
            {program.venue && (
              <>
                <span className="text-white/20">•</span>
                <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-white/50 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <span>{program.venue}</span>
                </div>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-serif italic text-soft-white tracking-tight leading-tight">
            {program.title}
          </h1>
        </div>

        {/* Split Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 space-y-8 lg:sticky lg:top-32"
          >
            {/* Portrait Flyer  */}
            <div className="w-full flex items-center justify-center rounded-xl overflow-hidden border border-white/10 bg-navy-950/60 p-6 md:p-8 shadow-2xl">
              <img 
                src={program.image || ''} 
                alt={program.title} 
                className="w-full h-auto max-h-[800px] object-contain shadow-2xl rounded-sm transition-transform duration-500 hover:scale-[1.01]" 
              />
            </div>
            
            <div className="hidden lg:block">
              <h2 className="text-xl font-serif italic text-soft-white mb-4">About this gathering</h2>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                {program.description}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            id="registration" 
            className="lg:col-span-6 bg-white/5 p-6 sm:p-10 rounded-xl border border-white/10 scroll-mt-24 shadow-2xl"
          >
            <div className="lg:hidden mb-10 pb-8 border-b border-white/10">
              <h2 className="text-2xl font-serif italic text-soft-white mb-4">About this gathering</h2>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                {program.description}
              </p>
            </div>

            <div className="mb-8 border-b border-white/10 pb-8">
              <div className="text-[10px] uppercase tracking-widest font-bold text-gold-500 mb-3">Registration</div>
              <h2 className="text-3xl font-serif italic text-soft-white mb-4">Join this Gathering</h2>
              <p className="text-white/50 text-xs">
                 Complete the form below and we will receive your registration. An email confirmation will be sent to you automatically.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-[10px] uppercase font-bold tracking-widest text-white/50">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-white/50">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[10px] uppercase font-bold tracking-widest text-white/50">Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-[10px] uppercase font-bold tracking-widest text-white/50">Your Location</label>
                  <input 
                    type="text" 
                    id="location" 
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
                    placeholder="City, State / Country"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 text-navy-900 font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-gold-500/10 rounded-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {status === "loading" ? "Registering..." : "Submit Registration"}
              </button>

              {status === "success" && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-sm">
                  <p className="text-green-400 text-xs font-medium text-center">Registration complete! We've sent a confirmation to your email.</p>
                </div>
              )}
              {status === "error" && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm">
                  <p className="text-red-400 text-xs font-medium text-center">Failed to complete registration. Please try again.</p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
