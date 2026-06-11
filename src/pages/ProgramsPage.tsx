import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, Clock3, MapPin } from 'lucide-react';
import { dataStore } from '../dataStore';

export function ProgramsPage() {
  const [programsList, setProgramsList] = useState(() => dataStore.getFlagshipPrograms().filter(p => !p.isDone));

  useEffect(() => {
    const handleUpdate = () => {
      setProgramsList(dataStore.getFlagshipPrograms().filter(p => !p.isDone));
    };
    window.addEventListener('lumina_store_updated', handleUpdate);
    return () => window.removeEventListener('lumina_store_updated', handleUpdate);
  }, []);

  return (
    <section className="py-24 pt-32 bg-transparent relative min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif italic text-soft-white mb-6">Programs, conferences, and meetings designed to build men in truth.</h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-2xl mx-auto">
            Join teachings, meetings, conferences, crusades, and training platforms designed to bring men into the light of God's truth and raise them for kingdom purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {programsList.map((program, index) => (

            <motion.div 
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col shadow-2xl hover:shadow-gold-500/5 duration-300"
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
                  {program.time && (
                    <>
                      <span className="text-white/20">•</span>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-white/44 flex items-center gap-1">
                        <Clock3 className="w-3 h-3 text-gold-400/80" />
                        <span>{program.time}</span>
                      </div>
                    </>
                  )}
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

        {/* Register Interest Section */}
        <div className="mt-24 p-10 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h3 className="text-2xl font-serif italic text-soft-white mb-4">Stay connected for upcoming ministry gatherings</h3>
            <p className="text-white/50 text-sm">
              Share your details below and we will keep you informed about future meetings, teachings, conferences, and programs.
            </p>
          </div>
          <form className="w-full md:w-auto flex flex-col sm:flex-row flex-1 max-w-md gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full bg-black/20 border border-white/20 px-5 py-3 text-sm text-soft-white focus:outline-none focus:border-gold-500 rounded-sm placeholder:text-white/30"
              required
            />
            <button className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-3 text-[10px] uppercase tracking-widest transition-colors rounded-sm whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
