import { motion } from 'motion/react';

export function About() {
  return (
    <section id="about" className="py-24 bg-transparent overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-sm overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="https://ik.imagekit.io/4lndq5ke52/val.jpg" 
                alt="Community gathering in fellowship"
                className="w-full h-auto block"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                <p className="font-serif italic text-xl border-l border-gold-500 pl-4 py-1">
                  In this light many will see light...
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-gold-500 mb-4">Our Story</div>
              <h2 className="mt-2 text-4xl font-serif italic text-soft-white leading-tight">Raising a generation of Light, <br/>Impact and Influence</h2>
            </div>
            
            <p className="text-white/60 leading-relaxed text-sm">
              Our ministry was founded with a singular focus: Accurately discipling God's people to becoming all of God's intentions in our day and time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-3">
                <h3 className="font-serif italic text-lg text-soft-white">Our Vision</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  To see Christ accurately revealed in a generation through the power of the Gospel and the efficacy of the Word.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-3">
                <h3 className="font-serif italic text-lg text-soft-white">Our Mission</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                 To preach and practice the Gospel by raising disciples who know Christ, live His Word, and influence their generation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
