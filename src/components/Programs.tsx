import { motion } from 'motion/react';
import { BookOpen, Flame, Globe, Shield, Users, Video } from 'lucide-react';

const focusAreas = [
  {
    id: 'discipleship',
    title: 'Discipleship',
    description: "If you just gave your life to Christ or you've done that before and you're willing to be discipled at School of Discipleship (SOD), send a message to us via our email.",
    icon: 'BookOpen',
  },
  {
    id: 'prayer-gatherings',
    title: 'Prayer Gatherings',
    description: 'We meet via our Telegram page every first Thursday of the month for Prophetic Push.',
    icon: 'Flame',
  },
  {
    id: 'outreach-initiatives',
    title: 'Outreach Initiatives',
    description: 'Taking the message of hope and practical love to our communities.',
    icon: 'Globe',
  },
  {
    id: 'leadership-development',
    title: 'Leadership Development',
    description: 'Equipping the next generation of Kingdom builders and visionaries.',
    icon: 'Shield',
  },
  {
    id: 'media-ministry',
    title: 'Media Ministry',
    description: 'Spreading light through digital content, teaching, and creative arts.',
    icon: 'Video',
  },
  {
    id: 'youth-community',
    title: 'Youth Community',
    description: 'A vibrant space for young adults to discover purpose and connect.',
    icon: 'Users',
  },
] as const;

const iconMap = {
  BookOpen,
  Flame,
  Globe,
  Shield,
  Video,
  Users,
} as const;

export function Programs() {
  return (
    <section id="programs" className="py-24 bg-transparent text-white relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
          <div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] uppercase tracking-widest font-bold text-gold-500 mb-4"
            >
              What We Do
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-serif italic text-soft-white leading-tight"
            >
              Empowering the Next Generation
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:max-w-md text-white/60 text-sm"
          >
            Engage with our core focus areas designed to disciple, build, and send out resilient leaders.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusAreas.map((program, index) => {
            const Icon = iconMap[program.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3 hover:bg-white/10 transition-colors cursor-default"
              >
                <div className="w-10 h-10 rounded-full border border-gold-500/40 text-gold-500 flex items-center justify-center mb-4 group-hover:bg-gold-500/10 transition-colors">
                  {Icon && <Icon className="w-5 h-5" />}
                </div>
                <h4 className="font-serif italic text-lg text-soft-white">{program.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  {program.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
