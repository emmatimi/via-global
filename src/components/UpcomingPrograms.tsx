import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { publicDataStore } from '../publicDataStore';

export function UpcomingPrograms() {
  const [upcomingPrograms, setUpcomingPrograms] = useState(() => publicDataStore.getFlagshipPrograms());

  useEffect(() => {
    const handleUpdate = () => {
      setUpcomingPrograms(publicDataStore.getFlagshipPrograms());
    };
    window.addEventListener('lumina_store_updated', handleUpdate);
    return () => window.removeEventListener('lumina_store_updated', handleUpdate);
  }, []);

  return (
    <section className="py-24 bg-transparent text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">

          <div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] uppercase tracking-widest font-bold text-gold-500 mb-4"
            >
              Join Us
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-serif italic text-soft-white leading-tight"
            >
              Upcoming Programs
            </motion.h2>
          </div>
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
          >
            <Link 
                to="/programs" 
                className="px-6 py-3 border border-white/20 text-soft-white text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-white/5"
            >
                View All Programs
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {upcomingPrograms.map((program, index) => (
            <motion.div 
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col shadow-2xl hover:shadow-gold-500/5 duration-300 w-full"
            >
              <div className="aspect-square w-full overflow-hidden relative border-b border-white/10">
                <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-gold-500">{program.subtitle}</div>
                  <span className="text-white/20">•</span>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{program.date}</span>
                  </div>
                  {program.venue && (
                    <>
                      <span className="text-white/20">•</span>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-white/44 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gold-400/80" />
                        <span>{program.venue}</span>
                      </div>
                    </>
                  )}
                </div>
                <h3 className="text-xl font-serif italic text-soft-white mb-6 group-hover:text-gold-400 transition-colors line-clamp-2">{program.title}</h3>
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <Link 
                    to={`/programs/${program.id}#registration`}
                    className="flex-1 px-4 py-3 bg-gradient-to-tr from-gold-500 to-gold-400 hover:to-gold-500 text-navy-900 text-[10px] uppercase font-bold tracking-widest transition-colors rounded-sm shadow-lg shadow-gold-500/10 text-center"
                  >
                    Register Now
                  </Link>
                  <Link 
                    to={`/programs/${program.id}`}
                    className="flex-1 px-4 py-3 border border-white/20 text-soft-white text-[10px] uppercase font-bold tracking-widest transition-colors hover:bg-white/5 rounded-sm text-center"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
