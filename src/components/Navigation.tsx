import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Images, User, Briefcase, FolderOpen, Mail, Cpu, MousePointer } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from './ThemeProvider';
import { useCyberMode } from '@/hooks/useCyberMode';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const { isCyberMode, toggleCyberMode, cursorEnabled, toggleCursorEnabled } = useCyberMode();

  const navItems = [
    { name: 'Home', href: '#home', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Services', href: '#services', icon: Briefcase },
    { name: 'Projects', href: '#projects', icon: FolderOpen },
    { name: 'Gallery', href: '#gallery', icon: Images},
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
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          {/* Logo */}
          <div className="nav-logo shrink-0">
            <button
              onClick={() => scrollToSection('#home')}
              className="block transition-transform hover:scale-105"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-border shadow-lg transition-transform duration-300 hover:scale-105">
                <img
                    src={heroImageSrc}
                    alt="Gilbert Tuyambaze"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
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
          <div className="nav-cta hidden items-center gap-4 md:flex">
            <Button
              variant={isCyberMode ? 'secondary' : 'outline'}
              size="sm"
              onClick={toggleCyberMode}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#00ff9f]/20 bg-black/10 text-[#00ff9f] hover:bg-[#00ff9f]/10"
            >
              <Cpu className="w-4 h-4" />
              {isCyberMode ? 'Cyber On' : 'Cyber Mode'}
            </Button>
            <Button
              variant={cursorEnabled ? 'secondary' : 'outline'}
              size="sm"
              onClick={toggleCursorEnabled}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#00ff9f]/20 bg-black/10 text-[#00ff9f] hover:bg-[#00ff9f]/10"
            >
              <MousePointer className="w-4 h-4" />
              {cursorEnabled ? 'Cursor On' : 'Cursor Off'}
            </Button>
            <ThemeToggle />
            <Button
              onClick={() => scrollToSection('#contact')}
              className="hidden md:block bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105"
            >
              Let's Talk
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="shrink-0 md:hidden">
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
            isOpen ? 'max-h-[75vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-2 space-y-2 rounded-lg border border-border bg-background/95 py-4 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
            <div className="px-4 pt-3 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant={isCyberMode ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={toggleCyberMode}
                  className="items-center gap-2 rounded-full border border-[#00ff9f]/20 bg-black/10 text-[#00ff9f] hover:bg-[#00ff9f]/10"
                >
                  <Cpu className="w-4 h-4" />
                  {isCyberMode ? 'Cyber On' : 'Cyber Mode'}
                </Button>
                <Button
                  variant={cursorEnabled ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={toggleCursorEnabled}
                  className="items-center gap-2 rounded-full border border-[#00ff9f]/20 bg-black/10 text-[#00ff9f] hover:bg-[#00ff9f]/10"
                >
                  <MousePointer className="w-4 h-4" />
                  {cursorEnabled ? 'Cursor On' : 'Cursor Off'}
                </Button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <ThemeToggle />
                <Button
                  onClick={() => scrollToSection('#contact')}
                  className="shrink-0 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 hover:from-purple-500 hover:to-pink-500"
                >
                  Let's Talk
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
