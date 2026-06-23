import ministryLogo from '../../assets/via-ministry-logo-web.png';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Twitter, Send } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { publicDataStore } from '../publicDataStore';

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.11 17.21c-.27-.14-1.58-.78-1.83-.87-.24-.09-.42-.14-.6.14-.18.27-.69.87-.84 1.05-.16.18-.31.2-.58.07-.27-.14-1.12-.41-2.14-1.3-.79-.7-1.33-1.56-1.48-1.83-.16-.27-.02-.41.12-.55.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46-.16-.01-.34-.01-.52-.01-.18 0-.47.07-.72.34-.24.27-.94.92-.94 2.24 0 1.32.97 2.59 1.1 2.77.14.18 1.89 2.89 4.58 4.05.64.27 1.14.44 1.53.57.64.2 1.23.17 1.69.1.52-.08 1.58-.65 1.81-1.27.22-.63.22-1.16.16-1.27-.07-.11-.24-.18-.51-.32Z" />
      <path d="M16.03 3.2c-7.07 0-12.8 5.71-12.8 12.74 0 2.25.59 4.45 1.72 6.38L3.12 28.8l6.68-1.75a12.87 12.87 0 0 0 6.22 1.59h.01c7.06 0 12.8-5.71 12.8-12.75 0-3.41-1.33-6.61-3.76-9.01A12.72 12.72 0 0 0 16.03 3.2Zm0 23.29h-.01a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.96 1.04 1.06-3.85-.26-.4a10.56 10.56 0 0 1-1.64-5.67c0-5.88 4.82-10.66 10.73-10.66 2.87 0 5.56 1.11 7.58 3.13a10.57 10.57 0 0 1 3.14 7.54c0 5.88-4.82 10.66-10.8 10.66Z" />
    </svg>
  );
}

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
  const location = useLocation();
  const isActiveLink = (href: string) => href === '/' ? location.pathname === '/' : location.pathname === href || location.pathname.startsWith(href + '/');

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
              <a href="https://www.instagram.com/viaglobal/" target="_blank" rel="noopener noreferrer" className="footer-social-link w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition-all text-white/50">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="https://youtube.com/@viaglobaltv?si=cr8NgUSxaVP_-l3n" target="_blank" rel="noopener noreferrer" className="footer-social-link w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition-all text-white/50">
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.facebook.com/VIAglobal01" target="_blank" rel="noopener noreferrer" className="footer-social-link w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition-all text-white/50">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://twitter.com/viaglobal" target="_blank" rel="noopener noreferrer" className="footer-social-link w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition-all text-white/50">
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className={`footer-quick-link text-xs font-bold uppercase tracking-widest transition-colors ${isActiveLink(link.href) ? 'text-gold-500 footer-link-active' : 'text-white/60 hover:text-gold-500'}`}>
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
                className="footer-whatsapp-link inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:text-white transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Follow our WhatsApp Channel ↗
              </a>
              <a 
                href="https://t.me/viaglobalfire" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-telegram-link inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#0088cc] hover:text-white transition-colors"
              >
                <Send className="w-4 h-4" />
                Join our Telegram Group ↗
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="text-[10px] text-white/40 uppercase tracking-[0.4em] italic">
            In this light many will see light...
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

