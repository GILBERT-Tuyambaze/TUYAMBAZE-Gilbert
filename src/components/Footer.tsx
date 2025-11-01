import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';

export default function Footer() {
  useEffect(() => {
    // Footer animations
    revealElements('.footer-content', { 
      origin: 'bottom', 
      distance: '60px', 
      duration: 1000,
      reset: true,
      delay: 200 
    });
    
    revealElements('.footer-social', { 
      origin: 'bottom', 
      distance: '40px', 
      duration: 800,
      delay: 400,
      reset: true,
      interval: 100 
    });
    
    revealElements('.footer-links', { 
      origin: 'bottom', 
      distance: '40px', 
      duration: 800,
      delay: 600,
      reset: true,
      interval: 50 
    });
    
    revealElements('.footer-bottom', { 
      origin: 'bottom', 
      distance: '30px', 
      duration: 600,
      reset: true,
      delay: 800 
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/GILBERT-Tuyambaze/', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/gilbert-tuyambaze-6927ba336/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:tuyambazegilbert05@gmail.com', label: 'Email' }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="footer-content grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold">
              Gilbert <span className="text-primary">Tuyambaze</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Passionate developer and creative professional dedicated to crafting exceptional 
              digital experiences through innovative web development, stunning design, and creative content.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="footer-social p-3 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 group"
                  aria-label={social.label}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="footer-links text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Get In Touch</h4>
            <div className="space-y-3 text-muted-foreground">
              <p className="footer-links hover:text-primary transition-colors cursor-pointer">
                tuyambazegilbert@gmail.com
              </p>
              <p className="footer-links hover:text-primary transition-colors cursor-pointer">
                +250 (79) 343-8873
              </p>
              <p className="footer-links hover:text-primary transition-colors cursor-pointer">
                Kigali, RWANDA
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="footer-bottom flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            © 2025 Gilbert Tuyambaze. Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> and lots of coffee.
          </p>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="group hover:bg-primary/10"
          >
            <ArrowUp className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
            Back to Top
          </Button>
        </div>
      </div>
    </footer>
  );
}