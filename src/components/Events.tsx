import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { publicDataStore } from '../publicDataStore';
import { Event as MinistryEvent } from '../types';

export function Events() {
  const [events, setEvents] = useState<MinistryEvent[]>([]);

  useEffect(() => {
    const fetchEvents = () => {
      setEvents(publicDataStore.getEvents());
    };
    fetchEvents();
    window.addEventListener('lumina_store_updated', fetchEvents);
    return () => window.removeEventListener('lumina_store_updated', fetchEvents);
  }, []);

  return (
    <section id="events" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-gold-500 text-[10px] uppercase tracking-[0.3em] font-semibold mb-6">
              Save the Date
            </div>
            <h2 className="text-4xl font-serif italic text-soft-white leading-tight">Gatherings & Events</h2>
            <p className="text-white/60 text-sm leading-relaxed font-sans">
              We gather to seek His face, build community, and equip ourselves for the journey ahead. Find an upcoming event and join the movement.
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            {events.length === 0 ? (
              <div className="p-12 border border-dashed border-white/10 rounded-xl text-center text-xs text-white/30 italic">
                No events currently scheduled. Check back soon!
              </div>
            ) : (
              events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                >
                  <div className="flex-shrink-0 bg-navy-900/50 w-20 h-20 rounded-sm flex flex-col items-center justify-center border border-white/10">
                    <span className="text-gold-500 font-bold text-xl leading-none">
                      {event.date.split(' ')[0] || event.date.substring(0, 3)}
                    </span>
                    <span className="text-white/40 text-[10px] uppercase tracking-widest mt-1">
                      {event.date.split(' ')[1] || 'Day'}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border text-gold-500 ${event.type === 'Online' ? 'border-white/10 bg-white/5' : 'border-gold-500/30 bg-gold-500/10'}`}>
                        {event.type}
                      </span>
                    </div>
                    <h4 className="text-lg font-serif italic text-soft-white group-hover:text-gold-500 transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/50 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5 border-r border-white/10 pr-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{event.location || 'Online / Virtual'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
                    {event.joinLink ? (
                      <a 
                        href={event.joinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-6 py-3 border border-gold-500/30 bg-gold-500/10 hover:bg-gold-500 text-gold-400 hover:text-navy-950 font-bold text-xs uppercase tracking-widest shadow-sm transition-all"
                      >
                        {event.joinLink.toLowerCase().includes('telegram') ? 'Join Telegram' : event.joinLink.toLowerCase().includes('whatsapp') || event.joinLink.toLowerCase().includes('wa.me') ? 'Join WhatsApp' : 'Join Event'}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button 
                        disabled
                        className="w-full sm:w-auto px-6 py-3 border border-white/10 bg-transparent text-white/30 text-xs font-bold uppercase tracking-widest cursor-not-allowed"
                      >
                        Join Event
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
