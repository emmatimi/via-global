import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, ArrowRight, FileText } from 'lucide-react';
import { dataStore } from '../dataStore';
import { Link } from 'react-router-dom';

export function Messages() {
  const [messagesList, setMessagesList] = useState(() => dataStore.getMessages());

  useEffect(() => {
    const handleUpdate = () => {
      setMessagesList(dataStore.getMessages());
    };
    window.addEventListener('lumina_store_updated', handleUpdate);
    return () => window.removeEventListener('lumina_store_updated', handleUpdate);
  }, []);

  return (
    <section id="messages" className="py-24 bg-transparent border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="text-[10px] uppercase tracking-widest font-bold text-gold-500 mb-4">Media Vault</div>
            <h2 className="text-4xl font-serif italic text-soft-white leading-tight">Recent Teachings</h2>
            <p className="mt-4 text-white/60 text-sm leading-relaxed max-w-md">
              Explore our library of timely, faith-building messages designed to strengthen your walk.
            </p>
          </div>
          <a href="#" className="hidden md:inline-flex px-6 py-2 border border-white/20 text-soft-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
            View All Series
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {messagesList.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex flex-col h-full bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors overflow-hidden"
            >
              <Link to={`/teachings/${message.id}`} className="block h-full flex flex-col p-4 relative">
              <div className="relative rounded-sm overflow-hidden aspect-video shadow-md mb-4 bg-navy-900 border border-white/5">
                <img 
                  src={message.thumbnail} 
                  alt={message.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center text-white scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all bg-white/10">
                    {message.type === 'video' ? (
                      <Play className="w-5 h-5 ml-1" fill="currentColor" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                </div>
                {message.duration && (
                  <div className="absolute bottom-3 right-3 bg-navy-900/80 border border-white/10 px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest text-white uppercase">
                    {message.duration}
                  </div>
                )}
                {message.type === 'article' && (
                  <div className="absolute top-3 right-3 bg-gold-500 text-navy-900 px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase shadow-md">
                    Article
                  </div>
                )}
              </div>
              <div className="flex-1 px-2 pb-2 flex flex-col h-full">
                <div className="flex items-center gap-3 text-xs text-white/50 mb-2 font-medium tracking-wide">
                  <span className="text-gold-500 uppercase">{message.speaker}</span>
                  <span>•</span>
                  <span>{message.date}</span>
                </div>
                <h4 className="text-lg font-serif italic text-soft-white group-hover:text-gold-500 transition-colors mb-4 line-clamp-2">
                  {message.title}
                </h4>
                {message.type === 'article' && (
                  <div className="mt-auto pt-4 flex items-center gap-2 text-gold-500 text-[10px] font-bold uppercase tracking-widest">
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 md:hidden flex justify-center">
          <a href="#" className="inline-flex px-6 py-2 border border-white/20 text-soft-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
            View All Series
          </a>
        </div>
      </div>
    </section>
  );
}
