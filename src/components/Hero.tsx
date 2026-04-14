import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import TypingAnimation from './TypingAnimation';
import { initializeScrollReveal, revealElements } from '@/hooks/useScrollReveal';
import { useTheme } from './ThemeProvider';
import { useTranslation } from 'react-i18next';
import { VisitorCounter } from './VisitorCounter';

export default function Hero() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const priorityImageProps = { fetchpriority: 'high' } as Record<string, string>;

  useEffect(() => {
    initializeScrollReveal();

    revealElements('.hero-title', { 
      origin: 'top',
      distance: '80px', 
      duration: 1200, 
      delay: 200 
    });

    revealElements('.hero-subtitle', { 
      origin: 'top', 
      distance: '60px', 
      duration: 1000, 
      delay: 400 
    });

    revealElements('.hero-typing', { 
      origin: 'left', 
      distance: '100px', 
      duration: 1000, 
      delay: 600 
    });

    revealElements('.hero-description', { 
      origin: 'bottom', 
      distance: '40px', 
      duration: 800, 
      delay: 800 
    });

    revealElements('.hero-buttons', { 
      origin: 'bottom', 
      distance: '60px', 
      duration: 1000, 
      delay: 1000 
    });

    revealElements('.hero-social', { 
      origin: 'bottom', 
      distance: '40px', 
      duration: 800, 
      delay: 1200, 
      interval: 100 
    });

    revealElements('.hero-image', { 
      origin: 'right', 
      distance: '100px', 
      duration: 1200, 
      delay: 400, 
      scale: 0.8 
    });

    revealElements('.hero-scroll', {
      origin: 'bottom', 
      distance: '30px', 
      duration: 800, 
      delay: 1400 
    });
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const typingStrings = t('hero.roles', { returnObjects: true }) as string[];

  const heroImageSrc =
    theme === 'dark' ? '/images/gilbert-tuyambaze-dark.jpeg' : '/images/gilbert-tuyambaze-light.jpeg';

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="hero-title text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {t('hero.greeting')}{' '}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {t('hero.name')}
                </span>
              </h1>

              <div className="hero-subtitle flex flex-col gap-2 text-2xl font-semibold text-muted-foreground sm:text-3xl lg:text-4xl">
                <span className="break-words">{t('hero.location')}</span>
                <span className="hero-typing">
                  <TypingAnimation strings={typingStrings} />
                </span>
              </div>
            </div>

            <p className="hero-description text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="group relative overflow-hidden">
                <a href="/assets/Gilbert-TUYAMBAZE-CV1.pdf" download>
                  <span className="relative z-10 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    {t('hero.downloadCV')}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </a>
              </Button>

              <Button variant="outline" size="lg" onClick={scrollToAbout} className="group">
                <span className="flex items-center gap-2">
                  {t('hero.viewWork')}
                  <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
              </Button>
            </div>

            <div className="mt-6 flex justify-center lg:justify-start">
              <VisitorCounter className="rounded border border-border bg-background/90 px-4 py-2 text-sm font-medium text-foreground shadow-sm" />
            </div>

            <div className="flex gap-6 justify-center lg:justify-start">
              <a href="https://github.com/GILBERT-Tuyambaze/" className="hero-social p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110" target="_blank" rel="noopener noreferrer">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/gilbert-tuyambaze-02044a3bb/" className="hero-social p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:tuyambazegilbert05@gmail.com" className="hero-social p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110" target="_blank" rel="noopener noreferrer">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="hero-image relative">
              <div className="relative h-[min(78vw,20rem)] w-[min(78vw,20rem)] sm:h-[22rem] sm:w-[22rem] md:h-[24rem] md:w-[24rem] lg:h-[28rem] lg:w-[28rem]">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl">
                  <img
                    {...priorityImageProps}
                    src={heroImageSrc}
                    alt="Gilbert Tuyambaze"
                    decoding="async"
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 24rem, 28rem"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce md:block">
          <button onClick={scrollToAbout} className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
