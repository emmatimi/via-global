import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { dataStore } from '../dataStore';

export function ContactPage() {
  const [settings, setSettings] = useState(() => dataStore.getSettings());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(dataStore.getSettings());
    };

    window.addEventListener('lumina_store_updated', handleUpdate);
    return () => window.removeEventListener('lumina_store_updated', handleUpdate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          contactEmail: formData.email
        })
      });
      if (response.ok) {
        setStatus("success");
        setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };
  return (
    <section className="py-24 pt-32 bg-transparent relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-gold-500 mb-4">Get In Touch</div>
              <h2 className="text-4xl font-serif italic text-soft-white leading-tight">Reach out to us</h2>
              <p className="mt-4 text-white/60 text-sm leading-relaxed max-w-md">
                We'd love to hear from you. Please fill out the form or reach out using the contact details below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-soft-white text-sm">Email</h4>
                  <p className="text-white/50 text-xs mt-1">{settings.supportEmail}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-soft-white text-sm">Phone</h4>
                  <p className="text-white/50 text-xs mt-1">{settings.supportPhone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-soft-white text-sm">Address</h4>
                  <p className="text-white/50 text-xs mt-1 leading-relaxed whitespace-pre-line">{settings.supportAddress}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="bg-white/5 backdrop-blur-md p-8 sm:p-10 rounded-xl border border-white/10"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-[10px] uppercase font-bold tracking-widest text-white/50">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-[10px] uppercase font-bold tracking-widest text-white/50">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
                    placeholder="Doe"
                  />
                </div>
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
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-[10px] uppercase font-bold tracking-widest text-white/50">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-sm bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] uppercase font-bold tracking-widest text-white/50">Message</label>
                <textarea 
                  id="message" 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-sm bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none text-sm"
                  placeholder="Type your message here..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 text-navy-900 font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-gold-500/10 rounded-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
              
              {status === "success" && (
                <p className="text-green-400 text-xs text-center mt-4">Your message has been sent successfully!</p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-xs text-center mt-4">Failed to send message. Please try again.</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
