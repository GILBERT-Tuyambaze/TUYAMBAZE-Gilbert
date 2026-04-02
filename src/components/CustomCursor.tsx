import { useEffect, useMemo, useRef, useState } from 'react';
import { useCyberMode } from '@/hooks/useCyberMode';

const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount;

export default function CustomCursor() {
  const { isCyberMode, cursorEnabled } = useCyberMode();
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const targetPosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const trailPosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const cursorStateRef = useRef<'default' | 'hover' | 'project' | 'active'>('default');
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'project' | 'active'>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [supportsCustomCursor, setSupportsCustomCursor] = useState(false);

  const normalizedLabel = useMemo(() => {
    if (!cursorEnabled || !supportsCustomCursor) {
      return '';
    }

    if (cursorState === 'project') {
      return isCyberMode ? 'open_file' : 'View Project';
    }

    if (cursorState === 'active') {
      return isCyberMode ? 'executing' : 'Click';
    }

    if (cursorState === 'hover') {
      return isCyberMode ? 'execute' : 'View';
    }

    return '';
  }, [cursorEnabled, cursorState, isCyberMode, supportsCustomCursor]);

  useEffect(() => {
    setCursorLabel(normalizedLabel);
  }, [normalizedLabel]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateSupport = () => setSupportsCustomCursor(mediaQuery.matches);

    updateSupport();
    mediaQuery.addEventListener('change', updateSupport);

    return () => mediaQuery.removeEventListener('change', updateSupport);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('custom-cursor-enabled', cursorEnabled && supportsCustomCursor);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, [cursorEnabled, supportsCustomCursor]);

  useEffect(() => {
    cursorStateRef.current = cursorState;
  }, [cursorState]);

  useEffect(() => {
    if (!cursorEnabled || !supportsCustomCursor) {
      setIsVisible(false);
      setCursorState('default');
      return;
    }

    const resolveCursorState = (element: HTMLElement | null) => {
      const project = element?.closest(
        '.project-card, .project-image, .gallery-card, .gallery-image, .hero-image, [data-cursor="project"]'
      );
      const interactive = element?.closest(
        [
          'a',
          'button',
          'input',
          'textarea',
          'select',
          'summary',
          '[role="button"]',
          '[role="link"]',
          '[tabindex]',
          '.nav-links',
          '.footer-links',
          '.hero-social',
          '.contact-info',
          '.contact-form',
          '.cursor-pointer',
          '[onclick]',
          '[data-cursor="hover"]',
        ].join(',')
      );

      if (project) {
        return 'project';
      }
      if (interactive) {
        return 'hover';
      }
      return 'default';
    };

    const handleMove = (event: PointerEvent) => {
      targetPosition.current = { x: event.clientX, y: event.clientY };
      setIsVisible(true);

      if (cursorRef.current) {
        cursorRef.current.style.left = `${event.clientX}px`;
        cursorRef.current.style.top = `${event.clientY}px`;
      }
      if (labelRef.current) {
        labelRef.current.style.left = `${event.clientX}px`;
        labelRef.current.style.top = `${event.clientY - 38}px`;
      }

      if (cursorStateRef.current === 'active') {
        return;
      }

      const element =
        event.target instanceof HTMLElement
          ? event.target
          : (document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null);
      setCursorState(resolveCursorState(element));
    };

    const handlePointerDown = () => {
      setCursorState('active');
    };

    const handlePointerUp = (event: PointerEvent) => {
      const element =
        event.target instanceof HTMLElement
          ? event.target
          : (document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null);
      setCursorState(resolveCursorState(element));
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
      setCursorState('default');
    };

    const handleWindowBlur = () => {
      setIsVisible(false);
      setCursorState('default');
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [cursorEnabled, supportsCustomCursor]);

  useEffect(() => {
    if (!cursorEnabled || !supportsCustomCursor) {
      return;
    }

    let frameId = 0;

    const animate = () => {
      trailPosition.current.x = lerp(trailPosition.current.x, targetPosition.current.x, 0.16);
      trailPosition.current.y = lerp(trailPosition.current.y, targetPosition.current.y, 0.16);

      if (trailRef.current) {
        trailRef.current.style.left = `${trailPosition.current.x}px`;
        trailRef.current.style.top = `${trailPosition.current.y}px`;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    animate();
    return () => window.cancelAnimationFrame(frameId);
  }, [cursorEnabled, supportsCustomCursor]);

  if (!cursorEnabled || !supportsCustomCursor) {
    return null;
  }

  return (
    <>
      <div
        ref={trailRef}
        className={`custom-cursor-trail fixed left-0 top-0 z-[9998] rounded-full custom-cursor--cyber ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        ref={cursorRef}
        className={`custom-cursor fixed left-0 top-0 z-[9999] pointer-events-none rounded-full ${
          cursorState === 'active'
            ? 'custom-cursor--active'
            : cursorState === 'hover'
              ? 'custom-cursor--hover'
              : cursorState === 'project'
                ? 'custom-cursor--project'
                : 'custom-cursor--default'
        } custom-cursor--cyber ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />
      {cursorLabel && (
        <div
          ref={labelRef}
          className={`custom-cursor-label fixed left-0 top-0 z-[9999] pointer-events-none select-none text-[11px] uppercase tracking-[0.3em] text-[#00ff9f] opacity-90 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {cursorLabel}
        </div>
      )}
    </>
  );
}
