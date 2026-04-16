import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { createVisitSession, updateVisitSession } from '@/lib/portfolioData';
import { isFirebaseConfigured } from '@/lib/firebase';

const SESSION_ID_KEY = 'portfolio-visit-session-id';
const isPermissionError = (error: unknown) =>
  error instanceof Error && /permission|insufficient/i.test(error.message);

const getSessionId = () => {
  const existing = window.sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) {
    return existing;
  }

  const nextId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  window.sessionStorage.setItem(SESSION_ID_KEY, nextId);
  return nextId;
};

export default function PortfolioAnalyticsTracker() {
  const location = useLocation();
  const sessionIdRef = useRef<string | null>(null);
  const sessionStartedAtRef = useRef<number>(Date.now());
  const isCreatedRef = useRef(false);
  const hasTrackedInitialPageRef = useRef(false);
  const trackingDisabledRef = useRef(false);

  useEffect(() => {
    if (!isFirebaseConfigured || typeof window === 'undefined') {
      return;
    }

    if (!sessionIdRef.current) {
      sessionIdRef.current = getSessionId();
      sessionStartedAtRef.current = Date.now();
    }

  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || typeof window === 'undefined' || !sessionIdRef.current || trackingDisabledRef.current) {
      return;
    }

    const sessionId = sessionIdRef.current;
    const locale = navigator.language || 'unknown';
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
    const currentPath = `${location.pathname}${location.search}${location.hash}`;

    const syncSession = async (isActive: boolean, incrementPageView = false) => {
      const durationSeconds = Math.max(0, Math.round((Date.now() - sessionStartedAtRef.current) / 1000));
      try {
        await updateVisitSession({
          sessionId,
          currentPath,
          exitPath: currentPath,
          durationSeconds,
          isActive,
          incrementPageView,
        });
      } catch (error) {
        if (isPermissionError(error)) {
          trackingDisabledRef.current = true;
          return;
        }
        console.error('Visit session update failed:', error);
      }
    };

    const initialize = async () => {
      try {
        if (!isCreatedRef.current) {
          await createVisitSession({
            sessionId,
            entryPath: currentPath,
            currentPath,
            locale,
            timeZone,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent || 'unknown',
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
          });
          isCreatedRef.current = true;
          hasTrackedInitialPageRef.current = true;
          return;
        }

        await syncSession(true, hasTrackedInitialPageRef.current);
        hasTrackedInitialPageRef.current = true;
      } catch (error) {
        if (isPermissionError(error)) {
          trackingDisabledRef.current = true;
          return;
        }
        console.error('Visit session initialization failed:', error);
      }
    };

    void initialize();
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    if (!isFirebaseConfigured || typeof window === 'undefined' || !sessionIdRef.current || trackingDisabledRef.current) {
      return;
    }

    const sessionId = sessionIdRef.current;

    const syncCurrentSession = async (isActive: boolean) => {
      const durationSeconds = Math.max(0, Math.round((Date.now() - sessionStartedAtRef.current) / 1000));
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      try {
        await updateVisitSession({
          sessionId,
          currentPath,
          exitPath: currentPath,
          durationSeconds,
          isActive,
        });
      } catch (error) {
        if (isPermissionError(error)) {
          trackingDisabledRef.current = true;
          window.clearInterval(heartbeatId);
          return;
        }
        console.error('Visit session heartbeat failed:', error);
      }
    };

    const heartbeatId = window.setInterval(() => {
      if (trackingDisabledRef.current) {
        window.clearInterval(heartbeatId);
        return;
      }
      void syncCurrentSession(document.visibilityState === 'visible');
    }, 15000);

    const handleVisibility = () => {
      void syncCurrentSession(document.visibilityState === 'visible');
    };

    const handleBeforeUnload = () => {
      void syncCurrentSession(false);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.clearInterval(heartbeatId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      void syncCurrentSession(false);
    };
  }, []);

  return null;
}
