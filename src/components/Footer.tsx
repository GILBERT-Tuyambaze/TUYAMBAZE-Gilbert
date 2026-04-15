import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';
import { VisitorCounter } from './VisitorCounter';

export default function Footer() {
  const { t } = useTranslation();
  useEffect(() => {
    const footerReveal = {
      origin: 'bottom',
      distance: '40px',
      duration: 900,
      reset: false,
      viewFactor: 0.25,
      viewOffset: { top: 90, right: 0, bottom: 0, left: 0 },
    };

    revealElements('.footer-content', {
      ...footerReveal,
      distance: '60px',
      delay: 200,
    });

    revealElements('.footer-social', {
      ...footerReveal,
      delay: 400,
      interval: 100,
    });

    revealElements('.footer-links', {
      ...footerReveal,
      delay: 600,
      interval: 50,
    });

    revealElements('.footer-bottom', {
      ...footerReveal,
      distance: '30px',
      delay: 800,
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/GILBERT-Tuyambaze/', label: t('footer.socialGithub', { defaultValue: 'GitHub' }) },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/gilbert-tuyambaze-02044a3bb', label: t('footer.socialLinkedIn', { defaultValue: 'LinkedIn' }) },
    { icon: Mail, href: 'mailto:tuyambazegilbert05@gmail.com', label: t('footer.socialEmail', { defaultValue: 'Email' }) },
  ];

  const quickLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  const rawSeoFaqs = t('footer.faq', { returnObjects: true });
  const seoFaqs = (Array.isArray(rawSeoFaqs) ? rawSeoFaqs : []) as Array<{
    question: string
    answer: string
  }>;

  const rawTrustSections = t('footer.legal', { returnObjects: true });
  const trustSections = (Array.isArray(rawTrustSections) ? rawTrustSections : []) as Array<{
    title: string
    content: string
  }>;

  const seoSummary = t('footer.popupSeoSummary');
  const searchHint = t('footer.popupSearchHint');

  const keywordGroups = [
    {
      titleKey: 'footer.keywordGroups.nameSearches',
      terms: [
        'Gilbert Tuyambaze',
        'Tuyambaze Gilbert',
        'Gilbert',
        'Tuyambaze',
        'Gilbert Tuyambaze portfolio',
        'Tuyambaze portfolio',
        'Gilbert Tuyambaze website',
        'Gilbert Rwanda developer',
        'Gilbert Kigali developer',
        'Gilbert web designer',
      ],
    },
    {
      titleKey: 'footer.keywordGroups.kigaliSearches',
      terms: [
        'Kigali web developer',
        'Kigali web designer',
        'Kigali Rwanda web design',
        'Kigali Rwanda web developer',
        'Rwanda frontend developer',
        'Rwanda web designer',
        'Rwanda website developer',
        'web designer in Kigali',
        'web developer in Kigali',
        'portfolio website developer Kigali',
        'small business website Kigali',
        'website designer Rwanda',
      ],
    },
    {
      titleKey: 'footer.keywordGroups.serviceSearches',
      terms: [
        'React developer Kigali',
        'Tailwind CSS developer Rwanda',
        'frontend engineer Kigali',
        'full-stack developer Rwanda',
        'landing page designer Kigali',
        'portfolio website designer Rwanda',
        'business website developer Kigali',
        'responsive web design Rwanda',
        'UI designer Kigali',
        'UI UX developer Rwanda',
        'modern website design Kigali',
        'creative developer Rwanda',
      ],
    },
    {
      titleKey: 'footer.keywordGroups.intentSearches',
      terms: [
        'hire web developer Kigali',
        'hire web designer Rwanda',
        'best portfolio developer Kigali',
        'custom website developer Rwanda',
        'freelance web developer Kigali',
        'freelance web designer Rwanda',
        'personal brand website Kigali',
        'startup website developer Kigali',
        'developer portfolio Rwanda',
        'web development services Kigali',
        'website redesign Rwanda',
        'frontend portfolio Kigali',
      ],
    },
  ];

  const keywordCloud = [
    'Gilbert Tuyambaze',
    'Tuyambaze Gilbert',
    'Kigali developer',
    'Kigali designer',
    'Rwanda web design',
    'Rwanda web developer',
    'React Kigali',
    'Tailwind Rwanda',
    'frontend Kigali',
    'portfolio developer',
    'business website Kigali',
    'landing page Rwanda',
    'creative developer Kigali',
    'UI designer Rwanda',
    'responsive websites Kigali',
    'custom websites Rwanda',
    'freelance developer Kigali',
    'freelance designer Rwanda',
    'modern frontend developer',
    'personal portfolio website',
    'startup website Kigali',
    'developer Kigali Rwanda',
    'web expert Kigali',
    'digital designer Rwanda',
    'web solutions Kigali',
    'Rwanda tech portfolio',
    'frontend engineer Rwanda',
    'web creator Kigali',
    'online portfolio Rwanda',
    'website builder Kigali',
    'brand website Rwanda',
    'UI development Kigali',
    'professional website Rwanda',
    'mobile-friendly website Kigali',
    'SEO-friendly portfolio Rwanda',
    'website redesign Kigali',
    'interactive portfolio Rwanda',
    'creative coding Kigali',
    'developer profile Rwanda',
    'portfolio design Kigali',
    'web consultant Kigali',
    'frontend specialist Rwanda',
    'React portfolio Rwanda',
    'Kigali startup websites',
    'Rwanda digital portfolio',
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="footer-content mb-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-2xl font-bold">
              Gilbert <span className="text-primary">Tuyambaze</span>
            </h3>
            <p className="max-w-md leading-relaxed text-muted-foreground">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="footer-social group rounded-full bg-background p-3 transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5 transition-transform group-hover:rotate-12" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('footer.quickLinks')}</h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="footer-links transform text-muted-foreground transition-colors duration-200 hover:translate-x-1 hover:text-primary"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{t('footer.getInTouch')}</h4>
            <div className="space-y-3 text-muted-foreground">
              <p className="footer-links cursor-pointer transition-colors hover:text-primary">
                tuyambazegilbert05@gmail.com
              </p>
              <p className="footer-links cursor-pointer transition-colors hover:text-primary">
                +250 (79) 343-8873
              </p>
              <p className="footer-links cursor-pointer transition-colors hover:text-primary">
                Kigali, Rwanda
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="footer-bottom flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <VisitorCounter className="rounded border border-border bg-background/90 px-4 py-2 text-sm font-medium text-foreground shadow-sm" />
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              {t('footer.copyright')} <Heart className="h-4 w-4 animate-pulse text-red-500" /> {t('footer.coffee')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hover:border-primary/50 hover:bg-primary/5">
                  {t('footer.faqButton')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('footer.faqTitle')}</DialogTitle>
                  <DialogDescription>
                    {t('footer.faqDescription')}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="seo" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="seo">{t('footer.tabs.faq')}</TabsTrigger>
                    <TabsTrigger value="legal">{t('footer.tabs.legal')}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="seo" className="space-y-5">
                    <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                      <p>{seoSummary}</p>
                      <p>{searchHint}</p>
                    </div>

                    <div className="space-y-4">
                      {keywordGroups.map((group) => (
                        <div key={group.titleKey} className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground">{t(group.titleKey)}</h4>
                          <p className="text-sm leading-7 text-muted-foreground">{group.terms.join(', ')}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 rounded-lg border border-primary/10 bg-muted/30 p-4">
                      <h4 className="text-sm font-semibold text-foreground">{t('footer.keywordCloudTitle')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {keywordCloud.map((term) => (
                          <span
                            key={term}
                            className="rounded-full border border-primary/15 bg-background/80 px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {seoFaqs.map((item, index) => {
                        const question = item.question || `FAQ ${index + 1}`;
                        return (
                        <AccordionItem key={`${question}-${index}`} value={`${question}-${index}`}>
                          <AccordionTrigger className="text-left">{question}</AccordionTrigger>
                          <AccordionContent className="text-sm leading-7 text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      )})}
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="legal" className="space-y-3 rounded-lg border border-border/60 bg-background/70 p-4">
                    <h4 className="text-sm font-semibold text-foreground">{t('footer.legalTitle')}</h4>
                    <div className="space-y-3">
                      {trustSections.map((section, index) => {
                        const title = section.title || `Section ${index + 1}`;
                        return (
                        <div key={`${title}-${index}`} className="space-y-1">
                          <h5 className="text-sm font-medium text-foreground">{title}</h5>
                          <p className="text-sm leading-7 text-muted-foreground">{section.content}</p>
                        </div>
                      )})}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="group hover:bg-primary/10"
            >
              <ArrowUp className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
              {t('footer.backToTop')}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
