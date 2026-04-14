import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function useAnimatedCounter(value: number | null, duration = 1200) {
  const [displayValue, setDisplayValue] = useState<number>(value ?? 0);
  const animationRef = useRef<number | null>(null);
  const lastValueRef = useRef<number>(value ?? 0);

  useEffect(() => {
    const target = value ?? 0;
    const startValue = lastValueRef.current;
    if (target === startValue) {
      return;
    }

    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      const nextValue = Math.round(startValue + (target - startValue) * eased);
      setDisplayValue(nextValue);

      if (progress < 1) {
        animationRef.current = window.requestAnimationFrame(animate);
      } else {
        lastValueRef.current = target;
        animationRef.current = null;
      }
    };

    animationRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return displayValue;
}
