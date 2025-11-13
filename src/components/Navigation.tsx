import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, User, Briefcase, FolderOpen, Mail } from 'lucide-react';
import { initializeScrollReveal, revealElements } from '@/hooks/useScrollReveal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from './ThemeProvider';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme(); // optional, to force update colors on theme change

  const navItems = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Services', href: '#services', icon: Briefcase },
    { name: 'Projects', href: '#projects', icon: FolderOpen },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    try {
      requestAnimationFrame(() => {
        initializeScrollReveal();

        revealElements('.nav-container', {
          origin: 'top',
          distance: '100px',
          duration: 1000,
          delay: 500,
          reset: false,
        });

        revealElements('.nav-logo', {
          origin: 'left',
          distance: '50px',
          duration: 800,
          delay: 700,
          reset: false,
        });

        revealElements('.nav-links', {
          origin: 'top',
          distance: '30px',
          duration: 600,
          delay: 800,
          interval: 100,
          reset: false,
        });

        revealElements('.nav-cta', {
          origin: 'right',
          distance: '50px',
          duration: 800,
          delay: 900,
          reset: false,
        });

        const navLinks = document.querySelectorAll('.nav-links');
        navLinks.forEach((el) => {
          el.classList.add('text-foreground', 'hover:text-primary');
        });
      });
    } catch (err) {
      console.error('ScrollReveal error in Navigation:', err);
    }
  }, [theme]); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroImageSrc =
    theme === 'dark' ? '/images/gilbert-tuyambaze-dark.jpeg' : '/images/gilbert-tuyambaze-light.jpeg';

  return (
    <nav
      className={`nav-container fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="nav-logo">
            <button
              onClick={() => scrollToSection('#home')}
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              <div className="w-12 h-full rounded-full overflow-hidden border-4 border-background shadow-2xlr">
                <img
                    src={heroImageSrc}
                    alt="Gilbert Tuyambaze"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="nav-links relative text-foreground hover:text-primary transition-colors duration-300 font-medium group"
              >
                <span className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </div>

          {/* CTA + Theme Toggle */}
          <div className="nav-cta hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button
              onClick={() => scrollToSection('#contact')}
              className="bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105"
            >
              Let's Talk
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-muted"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2 bg-background/95 backdrop-blur-md rounded-lg mt-2 border border-border">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted transition-colors rounded-md mx-2"
              >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
            <div className="px-4 pt-3 flex items-center justify-between">
              <ThemeToggle />
              <Button
                onClick={() => scrollToSection('#contact')}
                className="bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                Let's Talk
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
