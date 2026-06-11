import ministryLogo from '../../assets/via-ministry-logo-web.png';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Twitter, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { publicDataStore } from '../publicDataStore';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Teachings', href: '/teachings' },
  { name: 'Programs', href: '/programs' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

export function Footer() {
  const [settings, setSettings] = useState(() => publicDataStore.getSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(publicDataStore.getSettings());
    };

    window.addEventListener('lumina_store_updated', handleUpdate);
    return () => window.removeEventListener('lumina_store_updated', handleUpdate);
  }, []);

  return (
    <footer className="bg-transparent border-t border-white/5 text-soft-white pt-20 pb-10 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center group">
              <img 
                src={ministryLogo} 
                alt="Ministry Logo" 
                className="h-18 w-auto object-contain saturate-150 contrast-125 brightness-110 drop-shadow-[0_0_20px_rgba(245,120,24,0.16)]"
              />
            </Link>
            <p className="text-white/50 text-xs leading-relaxed max-w-sm font-medium">
              Raising light, faith, and purpose in this generation. Join us on this transformative journey of knowing Him and making Him known.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition-all text-white/50">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition-all text-white/50">
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition-all text-white/50">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition-all text-white/50">
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-gold-500 text-xs font-bold uppercase tracking-widest transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-6">Contact Us</h4>
             <ul className="space-y-4">
                <li className="flex items-start gap-3 text-xs font-semibold text-soft-white group">
                  <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span className="group-hover:text-gold-500 transition-colors">{settings.supportEmail}</span>
                </li>
                <li className="flex items-start gap-3 text-xs font-semibold text-soft-white group">
                  <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span className="group-hover:text-gold-500 transition-colors">{settings.supportPhone}</span>
                </li>
                <li className="flex items-start gap-3 text-xs font-semibold text-soft-white leading-relaxed">
                  <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span className="text-white/60 whitespace-pre-line">{settings.supportAddress}</span>
                </li>
             </ul>
          </div>

          <div>
            <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-white/50 text-xs mb-4">Subscribe to receive devotionals and updates directly to your inbox.</p>
            <form className="flex border border-white/10 rounded-sm overflow-hidden bg-white/5">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-transparent px-4 py-3 text-xs text-soft-white focus:outline-none placeholder:text-white/30"
              />
              <button 
                type="submit"
                className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-5 py-3 text-[10px] uppercase tracking-widest transition-colors"
              >
                Join
              </button>
            </form>
            <div className="mt-4 flex flex-col gap-2.5 items-start">
              <a 
                href="https://whatsapp.com/channel/0029VbB5Lil5vKABvmky3f2g" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-500/10" />
                Follow our WhatsApp Channel ↗
              </a>
              <a 
                href="https://t.me/viaglobalfire" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#0088cc] hover:text-white transition-colors"
              >
                <Send className="w-4 h-4" />
                Join our Telegram Group ↗
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="text-[10px] text-white/40 uppercase tracking-[0.4em] italic">
            Transforming Lives. Illuminating Purpose.
          </div>
          <div className="flex gap-6 text-[10px] text-white/40 font-bold uppercase tracking-widest">
             <Link to="/about" className="hover:text-gold-500 transition-colors">Privacy Policy</Link>
             <Link to="/about" className="hover:text-gold-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
