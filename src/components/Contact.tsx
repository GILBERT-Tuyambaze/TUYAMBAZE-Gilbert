import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';
import { submitStoredContactMessage } from '@/lib/portfolioData';

const web3FormsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

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

  useEffect(() => {
    // Contact section animations
    revealElements('.contact-title', { origin: 'top', distance: '60px', duration: 1000, delay: 200 });
    revealElements('.contact-description', { origin: 'bottom', distance: '40px', duration: 800, delay: 400 });
    revealElements('.contact-info', { origin: 'bottom', distance: '40px', duration: 800, delay: 400, interval: 100 });
    revealElements('.contact-form', { origin: 'bottom', distance: '40px', duration: 800, delay: 400 });
    revealElements('.form-field', { origin: 'bottom', distance: '30px', duration: 600, delay: 600, interval: 50 });
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
      const jobs: Promise<unknown>[] = [submitStoredContactMessage(trimmedData)];

      if (web3FormsAccessKey) {
        jobs.push(
          fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_key: web3FormsAccessKey,
              ...formData,
            }),
          }).then(async (response) => {
            const result = await response.json();
            if (!response.ok || !result.success) {
              throw new Error('Web3Forms submission failed');
            }
            return result;
          })
        );
      }

      const results = await Promise.allSettled(jobs);
      const hasSuccess = results.some((result) => result.status === 'fulfilled');

      if (hasSuccess) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 9000);
      } else {
        setSubmitError(t('contact.errorSubmit', { defaultValue: 'Your message could not be sent right now. Please try again in a moment.' }));
      }
    } catch {
      setSubmitError(t('contact.errorSubmit', { defaultValue: 'Your message could not be sent right now. Please try again in a moment.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.contactInfo.email.title'),
      value: 'tuyambazegilbert05@gmail.com',
      description: t('contact.contactInfo.email.description'),
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Phone,
      title: t('contact.contactInfo.phone.title'),
      value: '+250 (79) 343-8873',
      description: t('contact.contactInfo.phone.description'),
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: MapPin,
      title: t('contact.contactInfo.location.title'),
      value: 'Kigali, RWANDA',
      description: t('contact.contactInfo.location.description'),
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-muted overflow-x-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
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
                <Card key={index} className="contact-info group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`p-3 rounded-full ${info.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{info.title}</h4>
                      <p className="text-primary font-medium mb-1">{info.value}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="contact-form hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{t('contact.formTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
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

                  <Button type="submit" size="lg" className="w-full group relative overflow-hidden" disabled={isSubmitting}>
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
    </section>
  );
}
