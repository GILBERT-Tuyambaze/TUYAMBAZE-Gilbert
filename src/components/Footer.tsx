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

export default function Footer() {
  useEffect(() => {
    revealElements('.footer-content', {
      origin: 'bottom',
      distance: '60px',
      duration: 1000,
      reset: true,
      delay: 200,
    });

    revealElements('.footer-social', {
      origin: 'bottom',
      distance: '40px',
      duration: 800,
      delay: 400,
      reset: true,
      interval: 100,
    });

    revealElements('.footer-links', {
      origin: 'bottom',
      distance: '40px',
      duration: 800,
      delay: 600,
      reset: true,
      interval: 50,
    });

    revealElements('.footer-bottom', {
      origin: 'bottom',
      distance: '30px',
      duration: 600,
      reset: true,
      delay: 800,
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/GILBERT-Tuyambaze/', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/gilbert-tuyambaze-02044a3bb', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:tuyambazegilbert05@gmail.com', label: 'Email' },
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const seoFaqs = [
    {
      question: 'Who is Gilbert Tuyambaze?',
      answer:
        'Gilbert Tuyambaze is a Kigali, Rwanda web developer and web designer who builds responsive portfolio sites, business websites, polished UI systems, and modern frontend experiences.',
    },
    {
      question: 'What services does this Kigali portfolio highlight?',
      answer:
        'This portfolio focuses on web design in Kigali, Rwanda, frontend development, landing pages, portfolio websites, business websites, UI refinement, and full-stack implementation support.',
    },
    {
      question: 'What searches should lead people here?',
      answer:
        'Useful search phrases include Gilbert Tuyambaze, Tuyambaze Gilbert, Kigali web developer, Kigali Rwanda web design, Rwanda frontend developer, and web designer in Kigali.',
    },
    {
      question: 'Why keep this content in a popup?',
      answer:
        'It keeps the footer compact for users while still adding strong Kigali, Rwanda, web design, and web development context in a place you can open only when needed.',
    },
  ];

  const trustSections = [
    {
      title: 'Copyright Notice',
      content:
        'All original portfolio content on this website, including text, interface ideas, project descriptions, branding, custom visuals, code samples shared for presentation, and layout presentation, is the intellectual property of Gilbert Tuyambaze unless stated otherwise. Unauthorized copying, resale, or redistribution of original content without permission is not allowed.',
    },
    {
      title: 'Terms And Conditions',
      content:
        'This portfolio is provided for professional presentation, portfolio review, hiring discussions, and service inquiries. Visitors may browse, share the site link, and contact Gilbert Tuyambaze for collaboration or project work. Misuse, impersonation, scraping for harmful purposes, or reproduction of protected material without consent is prohibited.',
    },
    {
      title: 'Privacy And Contact Data',
      content:
        'If you contact Gilbert Tuyambaze through the portfolio, shared details such as your name, email address, subject, and message are used only for communication, project discussion, and client follow-up. Personal information is not intentionally sold or shared for unrelated marketing purposes.',
    },
    {
      title: 'Security And Responsible Use',
      content:
        'Reasonable efforts are made to keep this portfolio secure, responsive, and safe to use across modern devices. Visitors should avoid attempting unauthorized access, automated abuse, spam, or disruptive actions. Any third-party links, social platforms, or external services remain subject to their own security and privacy practices.',
    },
  ];

  const keywordGroups = [
    {
      title: 'Name Searches',
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
      title: 'Kigali And Rwanda Searches',
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
      title: 'Service Searches',
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
      title: 'Intent Searches',
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
              Passionate developer and creative professional dedicated to crafting exceptional
              digital experiences through innovative web development, strong design, and creative content.
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
            <h4 className="text-lg font-semibold">Quick Links</h4>
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
            <h4 className="text-lg font-semibold">Get In Touch</h4>
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
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            © 2025 Gilbert Tuyambaze. Made with <Heart className="h-4 w-4 animate-pulse text-red-500" /> and lots of coffee.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hover:border-primary/50 hover:bg-primary/5">
                  FAQ & LEGAL
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Gilbert Tuyambaze FAQ</DialogTitle>
                  <DialogDescription>
                    Extra search-friendly content for people looking for a Kigali, Rwanda web developer or web designer.
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="seo" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="seo">FAQ</TabsTrigger>
                    <TabsTrigger value="legal">Legal</TabsTrigger>
                  </TabsList>

                  <TabsContent value="seo" className="space-y-5">
                    <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                      <p>
                        Gilbert Tuyambaze creates responsive websites, portfolio experiences, and business-focused web
                        interfaces for clients searching for a web developer in Kigali, Rwanda. This popup adds stronger
                        location and service context without taking permanent space in the footer.
                      </p>
                      <p>
                        If someone searches for Tuyambaze, Gilbert, Kigali design, Kigali Rwanda web design, Rwanda
                        frontend developer, portfolio website developer Kigali, website designer in Rwanda, or frontend
                        engineer in Kigali, this section helps connect those terms to the work, skills, and contact
                        information shown across the site.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {keywordGroups.map((group) => (
                        <div key={group.title} className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground">{group.title}</h4>
                          <p className="text-sm leading-7 text-muted-foreground">{group.terms.join(', ')}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 rounded-lg border border-primary/10 bg-muted/30 p-4">
                      <h4 className="text-sm font-semibold text-foreground">Keyword Cloud</h4>
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
                      {seoFaqs.map((item) => (
                        <AccordionItem key={item.question} value={item.question}>
                          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                          <AccordionContent className="text-sm leading-7 text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="legal" className="space-y-3 rounded-lg border border-border/60 bg-background/70 p-4">
                    <h4 className="text-sm font-semibold text-foreground">Copyright, Terms, And Security</h4>
                    <div className="space-y-3">
                      {trustSections.map((section) => (
                        <div key={section.title} className="space-y-1">
                          <h5 className="text-sm font-medium text-foreground">{section.title}</h5>
                          <p className="text-sm leading-7 text-muted-foreground">{section.content}</p>
                        </div>
                      ))}
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
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
