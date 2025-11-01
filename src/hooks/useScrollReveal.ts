import { useEffect, useRef } from 'react';
import ScrollReveal from 'scrollreveal';

interface ScrollRevealOptions {
  origin?: 'top' | 'bottom' | 'left' | 'right';
  distance?: string;
  duration?: number;
  delay?: number;
  easing?: string;
  scale?: number;
  opacity?: number;
  reset?: boolean;
  interval?: number;
}

export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      const defaultOptions: ScrollRevealOptions = {
        reset: true,
        distance: '60px',
        duration: 1000,
        easing: 'ease-out',
        opacity: 0,
        scale: 0.9,
        ...options,
      };

      ScrollReveal().reveal(ref.current, defaultOptions);
    }
  }, [options]);

  return ref;
};

export const initializeScrollReveal = () => {
  ScrollReveal({
    reset: true,
    distance: '60px',
    duration: 1000,
    easing: 'ease-out',
    viewFactor: 0.2,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  });
};

export const revealElements = (selector: string, options: ScrollRevealOptions = {}) => {
  const defaultOptions: ScrollRevealOptions = {
    reset: true,
    distance: '60px',
    duration: 1000,
    easing: 'ease-out',
    opacity: 0,
    scale: 0.9,
    ...options,
  };

  ScrollReveal().reveal(selector, defaultOptions);
};