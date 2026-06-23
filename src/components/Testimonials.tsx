import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicDataStore } from '../publicDataStore';
import { Testimonial } from '../types';

export function Testimonials() {
  const [list, setList] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = () => {
      const all = publicDataStore.getTestimonials();
      setList(all.filter(t => t.approved));
    };
    fetchTestimonials();
    window.addEventListener('lumina_store_updated', fetchTestimonials);
    return () => window.removeEventListener('lumina_store_updated', fetchTestimonials);
  }, []);

  return (
    <section className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
           <div className="text-[10px] uppercase tracking-widest font-bold text-gold-500 mb-4">Transformed Lives</div>
           <h2 className="community-title text-3xl font-serif italic text-soft-white leading-tight">Voices of the Community</h2>
        </div>

        {list.length === 0 ? (
          <div className="p-12 border border-dashed border-white/10 rounded-xl text-center text-xs text-white/30 italic">
            No community voices shared yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {list.map((testimonial, index) => (
               <motion.div
                 key={testimonial.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: index * 0.1 }}
                 className="testimonial-card bg-white/5 p-5 rounded-lg border border-white/10 relative overflow-hidden hover:bg-white/10 transition-colors flex flex-col justify-between items-center text-center"
               >
                 <Quote className="testimonial-quote-icon pointer-events-none absolute top-4 right-5 z-0 w-8 h-8 text-gold-500/15" />
                 <p className="community-quote-text text-white/70 leading-relaxed mb-6 relative z-10 font-serif italic text-xs md:text-[13px]">
                   "{testimonial.quote}"
                 </p>
                 <div className="flex items-center justify-center gap-3 mt-auto pt-2 border-t border-white/5 w-full">
                   <div className="min-w-0 text-center">
                     <h4 className="font-bold text-soft-white text-xs tracking-wide truncate">{testimonial.name}</h4>
                     <p className="text-[9px] text-white/50 uppercase tracking-widest mt-0.5 truncate">{testimonial.role}</p>
                   </div>
                 </div>
               </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Link
            to="/testimonies"
            className="px-8 py-3.5 border border-gold-500/40 text-gold-400 hover:text-black hover:bg-gold-500 text-xs font-bold uppercase tracking-widest rounded transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Share & Read More Testimonies ↗
          </Link>
        </div>
      </div>
    </section>
  );
}


