import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Palette, Music, Globe, Smartphone, Headphones, ArrowRight } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';

export default function Services() {
  const { t } = useTranslation();
  const structuredDataProjects = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'Featured Projects by Gilbert Tuyambaze',
  creator: {
    '@type': 'Person',
    name: 'Gilbert Tuyambaze'
  },
  url: 'https://tuyambaze-gilbert.vercel.app/#projects'
};


  useEffect(() => {
    // Services section animations
    revealElements('.services-title', { 
      origin: 'top', 
      distance: '60px', 
      duration: 1000,
      delay: 200 
    });
    
    revealElements('.services-description', { 
      origin: 'bottom', 
      distance: '40px', 
      duration: 800,
      delay: 400 
    });
    
    revealElements('.service-card', { 
      origin: 'bottom', 
      distance: '80px', 
      duration: 1000,
      delay: 200,
      interval: 200 
    });
    
    revealElements('.service-feature', { 
      origin: 'left', 
      distance: '40px', 
      duration: 600,
      delay: 600,
      interval: 100 
    });
  }, []);

  const [isOpen, setIsOpen] = useState(false);


  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const rawServicesData = t('services.serviceList', { returnObjects: true });
  const servicesData = (Array.isArray(rawServicesData) ? rawServicesData : []) as Array<{
    title: string;
    description: string;
    features?: string[];
  }>;

  const serviceDecorations = [
    { icon: Code, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
    { icon: Palette, color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
    { icon: Music, color: 'text-pink-500', bgColor: 'bg-pink-500/10', borderColor: 'border-pink-500/20' },
    { icon: Globe, color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' },
    { icon: Smartphone, color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
    { icon: Headphones, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/20' },
  ];

  const services = servicesData.map((service, index) => ({
    ...service,
    features: Array.isArray(service.features) ? service.features : [],
    ...serviceDecorations[index],
  }));

  return (
    <section id="services" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="services-title text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t('services.title')}
          </h2>
          <p className="services-description text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('services.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`service-card group hover:shadow-xl transition-all duration-500 hover:-translate-y-3 border-2 ${service.borderColor} hover:border-primary/50 bg-gradient-to-br from-background to-muted/20`}
            >
              <CardHeader className="pb-4">
                <div className={`inline-flex p-4 rounded-2xl ${service.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-8 h-8 ${service.color}`} />
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="service-feature flex items-center gap-3 text-sm"
                    >
                      <div className={`w-2 h-2 rounded-full ${service.color.replace('text-', 'bg-')}`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="group/btn w-full justify-between hover:bg-primary/10 hover:text-primary"
                >
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button size="lg" className="group relative overflow-hidden" 
          onClick={() => scrollToSection('#contact')}
          >
            <a>
            <span className="relative z-10 flex items-center gap-2">
              {t('services.reachOut')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
