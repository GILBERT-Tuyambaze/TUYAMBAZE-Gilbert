import { useTranslation } from 'react-i18next';
import { useVisitorCount } from '@/hooks/useVisitorCount';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface VisitorCounterProps {
  className?: string;
}

export function VisitorCounter({ className = '' }: VisitorCounterProps) {
  const { t, i18n } = useTranslation();
  const { count, loading, error } = useVisitorCount();
  const animatedCount = useAnimatedCounter(count, 1200);
  const formattedCount = new Intl.NumberFormat(i18n.language).format(animatedCount);

  const bodyText = loading
    ? t('visitor.loading')
    : error
    ? t('visitor.error')
    : t('visitor.message', { count: formattedCount });

  return (
    <div
      className={`inline-flex w-full min-w-0 max-w-full items-center justify-between gap-3 rounded border border-border bg-background/90 px-4 py-3 text-left text-sm shadow-sm sm:min-w-[12rem] sm:px-5 ${className}`}
      aria-label={t('visitor.label')}
    >
      <div className="min-w-0 flex-1">
        <span className="block truncate text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {t('visitor.label')}
        </span>
        <span className="block truncate font-semibold text-foreground">
          {bodyText}
        </span>
      </div>
    </div>
  );
}
