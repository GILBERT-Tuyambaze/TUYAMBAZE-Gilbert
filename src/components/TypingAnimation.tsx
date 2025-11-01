import { useEffect, useRef, useState } from 'react';

interface TypingAnimationProps {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  backDelay?: number;
  loop?: boolean;
  className?: string;
  'aria-label'?: string;
}

export default function TypingAnimation({
  strings,
  typeSpeed = 100,
  backSpeed = 100,
  backDelay = 1000,
  loop = true,
  className = '',
  'aria-label': ariaLabel
}: TypingAnimationProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Typing animation logic
  useEffect(() => {
    if (!isVisible || strings.length === 0) return;

    let timeout: NodeJS.Timeout;
    const currentString = strings[currentIndex];

    if (isTyping) {
      // Typing forward
      if (currentText.length < currentString.length) {
        timeout = setTimeout(() => {
          setCurrentText(currentString.slice(0, currentText.length + 1));
        }, typeSpeed);
      } else {
        // Finished typing, wait then start backspacing
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, backDelay);
      }
    } else {
      // Backspacing
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, backSpeed);
      } else {
        // Finished backspacing, move to next string
        const nextIndex = (currentIndex + 1) % strings.length;
        
        if (!loop && nextIndex === 0 && currentIndex !== 0) {
          // If not looping and we've completed all strings, stop
          return;
        }
        
        setCurrentIndex(nextIndex);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isTyping, isVisible, strings, typeSpeed, backSpeed, backDelay, loop]);

  // Screen reader announcement for accessibility
  const [announcedText, setAnnouncedText] = useState('');
  
  useEffect(() => {
    if (isTyping && currentText === strings[currentIndex]) {
      // Announce the complete text to screen readers
      setAnnouncedText(currentText);
    }
  }, [currentText, isTyping, strings, currentIndex]);

  return (
    <span className="relative inline-block">
      <span
        ref={elementRef}
        className={`${className}`}
        aria-live="polite"
        aria-label={ariaLabel || `Rotating text showing: ${announcedText || strings[0]}`}
      >
        {currentText}
        <span 
          className="animate-pulse ml-1 text-blue-400 dark:text-blue-300"
          aria-hidden="true"
        >
          |
        </span>
      </span>
      
      {/* Hidden text for screen readers */}
      <span className="sr-only" aria-live="polite">
        {announcedText && `Current role: ${announcedText}`}
      </span>
    </span>
  );
}