import { useState, useEffect } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import ministryLogo from '../../assets/via-ministry-logo-web.png';
import { useTheme } from '../theme';

const links = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Teachings', href: '/teachings' },
  { name: 'Programs', href: '/programs' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Testimonies', href: '/testimonies' },
  { name: 'Contact', href: '/contact' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [logoClicks, setLogoClicks] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const isActiveLink = (href: string) => href === '/' ? location.pathname === '/' : location.pathname === href || location.pathname.startsWith(href + '/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Secret Door Key combination listener (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.pathname = '/admin'; // Deep stealth redirect
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        window.location.pathname = '/admin';
        return 0;
      }
      return next;
    });

    // Reset click tick after 2.5 seconds of inactivity
    const timer = setTimeout(() => {
      setLogoClicks(0);
    }, 2500);
    return () => clearTimeout(timer);
  };

  return (
    <header
      className={`site-nav ${isScrolled ? 'is-scrolled' : 'is-over-hero'} fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled ? 'bg-navy-900/90 backdrop-blur-md border-white/10 py-4' : 'bg-transparent border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div onClick={handleLogoClick} className="flex-shrink-0 flex items-center group cursor-pointer select-none">
          <img 
            src={ministryLogo} 
            alt="Ministry Logo" 
            className="h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(245,120,24,0.18)] saturate-150 contrast-125 brightness-110"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                isActiveLink(link.href) ? 'nav-link-active text-gold-500' : 'text-white/60 hover:text-gold-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/ask"
            className={`got-question-link px-6 py-2 border border-gold-500 text-gold-500 text-xs font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-navy-900 transition-colors ${isActiveLink('/ask') ? 'nav-link-active bg-gold-500 text-navy-900' : ''}`}
          >
            GOT A QUESTION
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-gold-500/40 hover:text-gold-500"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className="p-2 rounded-md focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="text-white" />
            ) : (
              <Menu className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-nav-panel lg:hidden bg-navy-900/95 backdrop-blur-lg border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-4 text-xs font-medium uppercase tracking-[0.2em] rounded-sm ${
                    isActiveLink(link.href) ? 'nav-link-active text-gold-500 bg-white/5' : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-3">
                <Link
                  to="/ask"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`got-question-link w-full flex justify-center py-3 px-4 border border-gold-500 text-gold-500 text-xs font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-navy-900 transition-colors ${isActiveLink('/ask') ? 'nav-link-active bg-gold-500 text-navy-900' : ''}`}
                >
                  GOT A QUESTION
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}



