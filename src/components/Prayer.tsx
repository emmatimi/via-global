import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HeartHandshake, CheckCircle2, AlertTriangle } from 'lucide-react';

export function Prayer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<'question' | 'prayer'>('question');
  const [request, setRequest] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/prayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, requestType, request }),
      });
      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setRequestType('question');
        setRequest('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="prayer" className="py-24 bg-transparent border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 mx-auto border border-white/10 bg-white/5 text-gold-500 rounded-sm flex items-center justify-center mb-6">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-4xl font-serif italic text-soft-white mb-4">Have a Question or Prayer Request?</h2>
          <p className="text-white/60 text-sm max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you have a question, need guidance, or would like us to pray with you, our pastoral team is here to listen and support you. Share what is on your heart, and we will respond with care and confidentiality.
          </p>

          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-white/10 text-left space-y-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] uppercase font-bold tracking-widest text-white/50">Name (Optional)</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-white/50">Email (Optional)</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
                  placeholder="For follow-up"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="requestType" className="text-[10px] uppercase font-bold tracking-widest text-white/50">How Can We Help?</label>
              <select
                id="requestType"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as 'question' | 'prayer')}
                className="w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors text-sm"
              >
                <option value="question" className="bg-navy-900">I have a question</option>
                <option value="prayer" className="bg-navy-900">I have a prayer request</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="request" className="text-[10px] uppercase font-bold tracking-widest text-white/50">Question or Prayer Request</label>
              <textarea 
                id="request" 
                rows={4}
                required
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                className="w-full px-4 py-3 rounded-sm bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none text-sm"
                placeholder="Share your question or prayer request securely..."
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-navy-900 font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-gold-500/10 rounded-sm flex items-center justify-center gap-2"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Securely'}
            </button>

            {status === 'success' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Your question or prayer request has been securely sent to our pastoral team.</span>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Could not submit your question or prayer request. Please check your connection and try again.</span>
              </motion.div>
            )}

            <p className="text-center text-[10px] uppercase tracking-wider text-white/40 mt-4">
              All questions and prayer requests are kept strictly confidential by our pastoral team.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
