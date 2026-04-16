import { type RefObject, useEffect } from 'react';

type SpatialState = {
  scrollY: number;
  velocity: number;
  smoothVelocity: number;
  focusIndex: number;
  activeSection: string | null;
  userActive: boolean;
  lastInteraction: number;
};

type UseSpatialOSOptions = {
  rootRef: RefObject<HTMLElement | null>;
  selector?: string;
  deps?: readonly unknown[];
};

const spatialState: SpatialState = {
  scrollY: 0,
  velocity: 0,
  smoothVelocity: 0,
  focusIndex: -1,
  activeSection: null,
  userActive: true,
  lastInteraction: Date.now(),
};

const registeredElements = new Set<HTMLElement>();
let rafId: number | null = null;
let listenersBound = false;
let resetRequested = false;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const markActivity = () => {
  spatialState.userActive = true;
  spatialState.lastInteraction = Date.now();
};

const resetSpatialState = () => {
  spatialState.scrollY = window.scrollY;
  spatialState.velocity = 0;
  spatialState.smoothVelocity = 0;
  spatialState.focusIndex = -1;
  spatialState.activeSection = null;
};

const syncUserPresence = (active: boolean) => {
  const inactiveDuration = Date.now() - spatialState.lastInteraction;
  spatialState.userActive = active;

  if (active) {
    if (inactiveDuration > 2000) {
      resetRequested = true;
    }
    markActivity();
  }
};

const onScroll = () => {
  const currentScroll = window.scrollY;
  spatialState.velocity = currentScroll - spatialState.scrollY;
  spatialState.scrollY = currentScroll;
  markActivity();
};

const onVisibilityChange = () => {
  syncUserPresence(!document.hidden);
};

const onFocus = () => syncUserPresence(true);
const onBlur = () => syncUserPresence(false);

const ensureListeners = () => {
  if (listenersBound || typeof window === 'undefined') {
    return;
  }

  listenersBound = true;
  spatialState.scrollY = window.scrollY;

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('focus', onFocus);
  window.addEventListener('blur', onBlur);
  window.addEventListener('mousemove', markActivity, { passive: true });
  window.addEventListener('keydown', markActivity);
  window.addEventListener('touchstart', markActivity, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
};

const cleanupListeners = () => {
  if (!listenersBound || typeof window === 'undefined') {
    return;
  }

  listenersBound = false;
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('focus', onFocus);
  window.removeEventListener('blur', onBlur);
  window.removeEventListener('mousemove', markActivity);
  window.removeEventListener('keydown', markActivity);
  window.removeEventListener('touchstart', markActivity);
  document.removeEventListener('visibilitychange', onVisibilityChange);
};

const computeFocus = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;
  const viewportCenter = window.innerHeight / 2;
  const distance = (centerY - viewportCenter) / viewportCenter;
  const normalized = clamp(distance, -1, 1);
  return 1 - Math.abs(normalized);
};

const tick = () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (resetRequested) {
    resetSpatialState();
    resetRequested = false;
  }

  spatialState.smoothVelocity += (spatialState.velocity - spatialState.smoothVelocity) * 0.08;
  spatialState.velocity *= 0.72;

  const elements = Array.from(registeredElements).filter((element) => element.isConnected);
  let bestIndex = -1;
  let bestFocus = 0;

  elements.forEach((element, index) => {
    const focus = computeFocus(element);
    if (focus > bestFocus) {
      bestFocus = focus;
      bestIndex = index;
    }
  });

  spatialState.focusIndex = bestIndex;

  elements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const inViewport = rect.bottom > -rect.height * 0.25 && rect.top < window.innerHeight * 1.2;
    const focus = inViewport ? computeFocus(element) : 0;
    const intensity = parseNumber(element.dataset.spatialIntensity, 1);
    const depth = parseNumber(element.dataset.spatialDepth, index + 1) * 6;
    const velocityResponse = parseNumber(element.dataset.spatialVelocityResponse, 1);
    const tiltX = parseNumber(element.dataset.tiltX, 0);
    const tiltY = parseNumber(element.dataset.tiltY, 0);
    const velocityBoost = Math.min(Math.abs(spatialState.smoothVelocity) * 0.06 * velocityResponse, 12);
    const lift = focus * 36 * intensity - velocityBoost;
    const scale = 0.92 + focus * 0.08;
    const hoverScale = element.matches(':hover') ? 0.018 : 0;
    const opacity = 0.38 + focus * 0.62;
    const isFocused = index === bestIndex;
    const section = element.closest<HTMLElement>('section[id], footer[id], footer');

    if (isFocused && section) {
      spatialState.activeSection = section.id || 'footer';
    }

    element.dataset.focus = isFocused ? 'true' : 'false';
    element.style.transform = [
      'perspective(1600px)',
      `translate3d(0, ${lift.toFixed(2)}px, ${depth.toFixed(2)}px)`,
      `rotateX(${(tiltX + spatialState.smoothVelocity * 0.015).toFixed(2)}deg)`,
      `rotateY(${tiltY.toFixed(2)}deg)`,
      `scale(${(isFocused ? scale + 0.02 + hoverScale : scale + hoverScale).toFixed(3)})`,
    ].join(' ');
    element.style.opacity = opacity.toFixed(3);
    element.style.filter = 'none';
    element.style.zIndex = isFocused ? '12' : '1';
    element.style.willChange = 'transform, opacity, filter';
  });

  if (elements.length === 0) {
    spatialState.activeSection = null;
  }

  rafId = window.requestAnimationFrame(tick);
};

const ensureEngine = () => {
  ensureListeners();

  if (rafId !== null || typeof window === 'undefined') {
    return;
  }

  rafId = window.requestAnimationFrame(tick);
};

const stopEngineIfIdle = () => {
  if (registeredElements.size > 0 || typeof window === 'undefined') {
    return;
  }

  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }

  cleanupListeners();
};

export function useSpatialOS({ rootRef, selector = '[data-spatial]', deps = [] }: UseSpatialOSOptions) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));
    elements.forEach((element) => registeredElements.add(element));
    ensureEngine();

    return () => {
      elements.forEach((element) => {
        registeredElements.delete(element);
        element.style.removeProperty('transform');
        element.style.removeProperty('opacity');
        element.style.removeProperty('filter');
        element.style.removeProperty('z-index');
        element.style.removeProperty('will-change');
        delete element.dataset.focus;
      });
      stopEngineIfIdle();
    };
  }, [rootRef, selector, ...deps]);
}
