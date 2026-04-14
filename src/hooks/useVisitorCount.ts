import { useEffect, useState } from 'react';
import { isFirebaseConfigured } from '@/lib/firebase';
import { getVisitorCountValue, incrementVisitorCountValue } from '@/lib/portfolioData';

const SESSION_STORAGE_KEY = 'visitor-count';
const SESSION_INCREMENT_KEY = 'visitor-count-incremented';
let visitorCountPromise: Promise<number | null> | null = null;

const getCachedVisitorCount = (): number | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const cachedValue = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (cachedValue === null) {
    return null;
  }

  const parsed = Number(cachedValue);
  return Number.isNaN(parsed) ? null : parsed;
};

const fetchVisitorCountOnce = async (): Promise<number | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  const cachedCount = getCachedVisitorCount();

  if (visitorCountPromise) {
    return visitorCountPromise;
  }

  if (!isFirebaseConfigured) {
    return cachedCount;
  }

  visitorCountPromise = (async () => {
    const hasIncrementedThisSession =
      window.sessionStorage.getItem(SESSION_INCREMENT_KEY) === 'true';

    const value = hasIncrementedThisSession
      ? await getVisitorCountValue()
      : await incrementVisitorCountValue();

    if (!hasIncrementedThisSession) {
      window.sessionStorage.setItem(SESSION_INCREMENT_KEY, 'true');
    }

    window.sessionStorage.setItem(SESSION_STORAGE_KEY, String(value));
    return value;
  })().catch(() => {
    visitorCountPromise = null;
    return cachedCount;
  });

  return visitorCountPromise;
};

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    void fetchVisitorCountOnce().then((value) => {
      if (!active) return;
      if (value === null) {
        setError(true);
      } else {
        setCount(value);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return { count, loading, error };
}
