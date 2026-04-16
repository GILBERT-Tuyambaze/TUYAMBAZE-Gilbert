import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { revealElements } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';
import { submitStoredContactMessage } from '@/lib/portfolioData';

const web3FormsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
const WEB3FORMS_TIMEOUT_MS = 8000;

const submitToWeb3Forms = async (payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  if (!web3FormsAccessKey) {
    return {
      ok: false,
      configured: false,
    };
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), WEB3FORMS_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: web3FormsAccessKey,
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        from_name: payload.name,
        replyto: payload.email,
        botcheck: '',
      }),
    });

    const result = await response.json().catch(() => null);

    return {
      ok: response.ok && Boolean(result?.success),
      configured: true,
    };
  } catch {
    return {
      ok: false,
      configured: true,
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showMobileBar, setShowMobileBar] = useState(true);

  useEffect(() => {
    const baseReveal = {
      distance: '50px',
      duration: 900,
      easing: 'cubic-bezier(0.5, 0, 0, 1)',
      opacity: 0,
      scale: 0.98,
      reset: true,
      viewFactor: 0.2,
      viewOffset: { top: 80, right: 0, bottom: 0, left: 0 },
    } as const;

    revealElements('.contact-title', {
      ...baseReveal,
      origin: 'top',
      distance: '60px',
      duration: 1000,
      delay: 100,
    });

    revealElements('.contact-description', {
      ...baseReveal,
      origin: 'bottom',
      distance: '30px',
      delay: 200,
    });

    revealElements('.contact-info', {
      origin: 'bottom',
      distance: '60px',
      duration: 900,
      delay: 200,
      interval: 120,
      reset: true,
      viewFactor: 0.2,
    });

    revealElements('.contact-form', {
      ...baseReveal,
      origin: 'right',
      distance: '70px',
      delay: 400,
    });

    revealElements('.form-field', {
      ...baseReveal,
      origin: 'bottom',
      distance: '20px',
      duration: 600,
      delay: 500,
      interval: 80,
    });

  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowMobileBar(false);
      } else {
        setShowMobileBar(true);
      }
      lastScrollY = window.scrollY;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const elements = document.querySelectorAll(
          '.contact-title, .contact-description, .contact-info, .contact-form, .form-field'
        );

        elements.forEach((el) => {
          el.classList.remove('sr-animate');
          void (el as HTMLElement).offsetWidth;
          el.classList.add('sr-animate');
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (submitError) {
      setSubmitError('');
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const trimmedData = {
      name: formData.name.trim().slice(0, 120),
      email: formData.email.trim().slice(0, 160),
      subject: formData.subject.trim().slice(0, 180),
      message: formData.message.trim().slice(0, 5000),
    };

    if (
      trimmedData.name.length < 2 ||
      trimmedData.subject.length < 2 ||
      trimmedData.message.length < 5 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedData.email)
    ) {
      setSubmitError(t('contact.errorSubmit', { defaultValue: 'Your message could not be sent right now. Please review your details and try again.' }));
      setIsSubmitting(false);
      return;
    }

    try {
      const [firebaseResult, emailResult] = await Promise.allSettled([
        submitStoredContactMessage(trimmedData),
        submitToWeb3Forms(trimmedData),
      ]);

      const savedToDashboard = firebaseResult.status === 'fulfilled';
      const emailDelivered = emailResult.status === 'fulfilled' && emailResult.value.ok;
      const emailConfigured = emailResult.status === 'fulfilled' && emailResult.value.configured;

      if (savedToDashboard && emailDelivered) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 9000);
        return;
      }

      if (savedToDashboard && !emailConfigured) {
        setSubmitError(
          t('contact.errorSubmit', {
            defaultValue: 'Your message was saved to my dashboard, but email delivery is not configured yet.',
          })
        );
        return;
      }

      if (savedToDashboard && !emailDelivered) {
        setSubmitError(
          t('contact.errorSubmit', {
            defaultValue: 'Your message was saved to my dashboard, but email delivery failed. Please try again or contact me directly.',
          })
        );
        return;
      }

      if (!savedToDashboard && emailDelivered) {
        setSubmitError(
          t('contact.errorSubmit', {
            defaultValue: 'Your email was sent, but saving it to the dashboard failed. Please try again in a moment.',
          })
        );
        return;
      }

      throw new Error('Both contact delivery paths failed.');
    } catch {
      setSubmitError(t('contact.errorSubmit', { defaultValue: 'Your message could not be sent right now. Please try again in a moment.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactLinks = {
    web: 'https://wa.me/250793438873?text=Hello%20Gilbert%2C%20I%20saw%20your%20portfolio%20and%20I%20would%20like%20to%20discussion%20about%20potential%20opportunities%20or%20collaboration.',
    phone: 'tel:+250793438873',
    email: 'mailto:tuyambazegilbert05@gmail.com',
    map: 'https://www.google.com/maps/search/?api=1&query=Kigali+Rwanda',
  };

  const getLinkProps = (link: string) => {
    const isExternal = link.startsWith('http');

    return {
      href: link,
      target: isExternal ? '_blank' : undefined,
      rel: isExternal ? 'noopener noreferrer' : undefined,
    };
  };

  const contactInfo = [
      {
        icon: Mail,
        title: t('contact.contactInfo.email.title'),
        value: 'tuyambazegilbert05@gmail.com',
        description: t('contact.contactInfo.email.description'),
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        linkType: 'email' as const,
      },
      {
        icon: Phone,
        title: t('contact.contactInfo.phone.title'),
        value: '+250 (79) 343-8873',
        description: t('contact.contactInfo.phone.description'),
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        linkType: 'phone' as const,
      },
      {
        icon: MapPin,
        title: t('contact.contactInfo.location.title'),
        value: 'Kigali, RWANDA',
        description: t('contact.contactInfo.location.description'),
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        linkType: 'map' as const,
      },
      {
        icon: FaWhatsapp,
        title: 'WhatsApp',
        value: '+250793438873',
        description: 'Chat with me instantly on WhatsApp',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        linkType: 'web' as const,
      },
    ];

  const getContactLink = (info: { linkType: 'web' | 'phone' | 'email' | 'map' }) => contactLinks[info.linkType];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted overflow-x-hidden scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-14 px-2 sm:mb-16 sm:px-0">
          <h2 className="contact-title text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t('contact.title')}
          </h2>
          <p className="contact-description text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="contact-title text-2xl font-bold mb-8">{t('contact.connectTitle')}</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t('contact.connectDescription')}
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    {...getLinkProps(getContactLink(info))}
                    className="group block relative"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                      <div className="bg-black text-white text-xs px-3 py-1 rounded-lg shadow-lg">
                        Click to open {info.title.toLowerCase()}
                      </div>
                    </div>
                    <div className="absolute -top-10 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                      <div className="bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg">
                        Click to {info.title.toLowerCase()}
                      </div>
                    </div>

                    <Card
                      className={`
                        contact-info group relative
                        transition-all duration-300
                        hover:-translate-y-2 hover:scale-[1.03]
                        hover:shadow-2xl
                        cursor-pointer
                        ${info.linkType === 'phone' ? 'hover:shadow-blue-500/30' : ''}
                        ${info.linkType === 'email' ? 'hover:shadow-red-500/30' : ''}
                        ${info.linkType === 'map' ? 'hover:shadow-purple-500/30' : ''}
                        ${info.linkType === 'web' ? 'hover:shadow-green-500/30' : ''}
                      `}
                    >
                      <CardContent className="p-6 flex flex-col sm:flex-row items-start gap-4">

                        {/* ICON GLOW */}
                        <div
                          className={`
                            p-3 rounded-full ${info.bgColor}
                            transition-all duration-300
                            group-hover:scale-110
                            group-hover:shadow-lg
                            ${info.linkType === 'phone' ? 'group-hover:shadow-blue-500/40' : ''}
                            ${info.linkType === 'email' ? 'group-hover:shadow-red-500/40' : ''}
                            ${info.linkType === 'map' ? 'group-hover:shadow-purple-500/40' : ''}
                            ${info.linkType === 'web' ? 'group-hover:shadow-green-500/40' : ''}
                          `}
                        >
                          <info.icon className={`w-6 h-6 ${info.color}`} />
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{info.title}</h4>
                          <p className="text-primary font-medium mb-1">{info.value}</p>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                        </div>

                      </CardContent>
                    </Card>
                  </a>
                ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="pt-4 sm:pt-0">
            <Card className="contact-form hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('contact.formTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t('contact.sentTitle')}</h3>
                  <p className="text-muted-foreground">{t('contact.sentDescription')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-field space-y-2">
                      <Label htmlFor="name">{t('contact.fields.name')}</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('contact.placeholders.name')}
                        required
                        maxLength={120}
                        autoComplete="name"
                        className="focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="form-field space-y-2">
                      <Label htmlFor="email">{t('contact.fields.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('contact.placeholders.email')}
                        required
                        maxLength={160}
                        autoComplete="email"
                        className="focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="subject">{t('contact.fields.subject')}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder={t('contact.placeholders.subject')}
                      required
                      maxLength={180}
                      className="focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="message">{t('contact.fields.message')}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t('contact.placeholders.message')}
                      rows={6}
                      required
                      maxLength={5000}
                      className="focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full group relative overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]" disabled={isSubmitting}>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      {isSubmitting ? t('contact.sending') : t('contact.sendMessage')}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </Button>
                  <p aria-live="polite" className="min-h-[1.25rem] text-sm text-destructive">
                    {submitError}
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
        {/* MOBILE CONTACT BAR */}
        {showMobileBar && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-3 md:hidden transition-all duration-300">
            <a
              {...getLinkProps(contactLinks.web)}
              className="group relative bg-green-500 text-white p-3 rounded-full shadow-lg active:scale-95 transition"
            >
              <FaWhatsapp className="w-5 h-5" />
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                WhatsApp
              </span>
            </a>

            <a
              {...getLinkProps(contactLinks.phone)}
              className="group relative bg-blue-500 text-white p-3 rounded-full shadow-lg active:scale-95 transition"
            >
              <Phone className="w-5 h-5" />
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                Call
              </span>
            </a>

            <a
              {...getLinkProps(contactLinks.email)}
              className="group relative bg-red-500 text-white p-3 rounded-full shadow-lg active:scale-95 transition"
            >
              <Mail className="w-5 h-5" />
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
                Email
              </span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
