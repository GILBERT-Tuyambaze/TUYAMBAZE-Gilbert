import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MessageSquareText, Quote, Send, Star } from 'lucide-react';
import { revealElements } from '@/hooks/useScrollReveal';
import {
  submitPortfolioSocialProof,
  watchVisibleSocialProof,
  type SocialProofKind,
  type Testimonial,
} from '@/lib/portfolioData';

const initialForm = {
  kind: 'testimonial' as SocialProofKind,
  name: '',
  role: '',
  company: '',
  message: '',
  rating: 5,
};

export default function Testimonials() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    revealElements('.testimonials-title', { origin: 'top', distance: '48px', duration: 900, delay: 180 });
    revealElements('.testimonial-card', { origin: 'bottom', distance: '32px', duration: 800, delay: 260, interval: 80 });

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = watchVisibleSocialProof((nextItems) => {
        setItems(nextItems);
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }

    return () => unsubscribe?.();
  }, []);

  const averageRating = useMemo(() => {
    if (items.length === 0) {
      return 0;
    }

    return items.reduce((total, item) => total + item.rating, 0) / items.length;
  }, [items]);

  const kindCounts = useMemo(
    () => ({
      testimonial: items.filter((item) => item.kind === 'testimonial').length,
      feedback: items.filter((item) => item.kind === 'feedback').length,
    }),
    [items]
  );

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (submitState !== 'idle') {
      setSubmitState('idle');
    }
    setFormData((current) => ({
      ...current,
      [name]:
        name === 'rating'
          ? Number(value)
          : name === 'kind'
          ? (value as SocialProofKind)
          : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitState('submitting');

    const trimmedData = {
      kind: formData.kind,
      name: formData.name.trim().slice(0, 120),
      role: formData.role.trim().slice(0, 120),
      company: formData.company.trim().slice(0, 120),
      message: formData.message.trim().slice(0, 3000),
      rating: Math.min(5, Math.max(1, Math.round(formData.rating))),
    };

    if (trimmedData.name.length < 2 || trimmedData.role.length < 2 || trimmedData.message.length < 10) {
      setSubmitState('error');
      return;
    }

    try {
      await submitPortfolioSocialProof(trimmedData);
      setFormData(initialForm);
      setSubmitState('success');
    } catch {
      setSubmitState('error');
    }
  };

  return (
    <section id="testimonials" className="relative overflow-hidden bg-background px-4 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_28%)]" />
      <div className="container relative mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
              {t('socialProof.badge')}
            </Badge>
            <h2 className="testimonials-title text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {t('socialProof.title')}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t('socialProof.description')}
            </p>
          </div>

          <Card className="w-full max-w-md border-primary/20 bg-background/90 shadow-xl">
            <CardContent className="grid grid-cols-3 gap-4 p-6 text-center">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t('socialProof.stats.total')}</p>
                <p className="mt-2 text-3xl font-bold">{items.length}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t('socialProof.kinds.testimonial')}</p>
                <p className="mt-2 text-3xl font-bold">{kindCounts.testimonial}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{t('socialProof.stats.rating')}</p>
                <p className="mt-2 text-3xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-6 md:grid-cols-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="testimonial-card min-h-[230px] animate-pulse border-border/70 bg-muted/40" />
              ))
            ) : items.length > 0 ? (
              items.map((item) => (
                <Card key={item.id} className="testimonial-card border-border/70 bg-background/90 shadow-lg">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <Badge variant={item.kind === 'testimonial' ? 'default' : 'secondary'}>
                            {item.kind === 'testimonial'
                              ? t('socialProof.kinds.testimonial')
                              : t('socialProof.kinds.feedback')}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{item.name}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {[item.role, item.company].filter(Boolean).join(' at ')}
                        </p>
                      </div>
                      {item.kind === 'testimonial' ? (
                        <Quote className="h-8 w-8 text-primary/60" />
                      ) : (
                        <MessageSquareText className="h-8 w-8 text-sky-500/70" />
                      )}
                    </div>
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-4 w-4 ${starIndex < item.rating ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-7 text-muted-foreground">"{item.message}"</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="testimonial-card border-dashed border-primary/30 bg-primary/5 md:col-span-2">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-semibold">{t('socialProof.emptyTitle')}</h3>
                  <p className="mt-3 text-muted-foreground">
                    {t('socialProof.emptyDescription')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="border-primary/20 bg-background/95 shadow-2xl">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">{t('socialProof.form.badge')}</Badge>
              <CardTitle className="text-2xl">{t('socialProof.form.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="social-kind">{t('socialProof.form.kind')}</Label>
                  <select
                    id="social-kind"
                    name="kind"
                    value={formData.kind}
                    onChange={handleFieldChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="testimonial">{t('socialProof.kinds.testimonial')}</option>
                    <option value="feedback">{t('socialProof.kinds.feedback')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonial-name">{t('socialProof.form.name')}</Label>
                  <Input id="testimonial-name" name="name" value={formData.name} onChange={handleFieldChange} maxLength={120} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-role">{t('socialProof.form.role')}</Label>
                    <Input id="testimonial-role" name="role" value={formData.role} onChange={handleFieldChange} maxLength={120} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testimonial-company">{t('socialProof.form.company')}</Label>
                    <Input id="testimonial-company" name="company" value={formData.company} onChange={handleFieldChange} maxLength={120} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonial-rating">{t('socialProof.form.rating')}</Label>
                  <Input
                    id="testimonial-rating"
                    name="rating"
                    type="number"
                    min={1}
                    max={5}
                    value={formData.rating}
                    onChange={handleFieldChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonial-message">{t('socialProof.form.message')}</Label>
                  <Textarea
                    id="testimonial-message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleFieldChange}
                    placeholder={t('socialProof.form.placeholder')}
                    maxLength={3000}
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={submitState === 'submitting'}>
                  <Send className="h-4 w-4" />
                  {submitState === 'submitting'
                    ? t('socialProof.form.submitting')
                    : t('socialProof.form.submit')}
                </Button>
                {submitState === 'success' ? (
                  <p aria-live="polite" className="text-sm text-emerald-500">{t('socialProof.form.success')}</p>
                ) : null}
                {submitState === 'error' ? (
                  <p aria-live="polite" className="text-sm text-destructive">{t('socialProof.form.error')}</p>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
