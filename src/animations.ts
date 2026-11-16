/**
 * Animation Configuration System
 * 
 * Centralized animation timing constants, easing functions, and reusable
 * animation configurations for consistent motion design across the portfolio.
 */

// ============================================================================
// TIMING CONSTANTS
// ============================================================================

/**
 * Standard animation durations in seconds
 */
export const DURATIONS = {
  /** Quick interactions (0.2s) */
  fast: 0.2,
  /** Standard transitions (0.3s) */
  normal: 0.3,
  /** Deliberate animations (0.5s) */
  slow: 0.5,
  /** Modal transitions (0.4s) */
  modal: 0.4,
  /** Cat animations (variable) */
  cat: {
    blink: 0.3,
    tailSway: 2,
    hop: 0.5,
    sleep: 4,
    stretch: 1.5,
    pawWave: 0.8,
    headTilt: 0.6,
    capeFlutter: 1.2,
  },
} as const;

/**
 * Animation delays for staggered effects
 */
export const DELAYS = {
  /** Base delay for first element */
  base: 0,
  /** Increment between staggered items */
  stagger: {
    fast: 0.08,
    normal: 0.1,
    slow: 0.15,
  },
  /** Hero section sequential delays */
  hero: {
    heading: 0,
    body: 0.15,
    cta: 0.3,
  },
} as const;

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

/**
 * Cubic bezier easing functions for smooth, premium animations
 */
export const EASINGS = {
  /** Standard smooth easing - recommended for most transitions */
  standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Bouncy, playful easing - use for hover effects and cat animations */
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  /** Smooth in-out - use for continuous animations */
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Linear - rarely used, for constant-speed animations */
  linear: 'linear',
  /** Ease in-out - standard CSS easing */
  easeInOut: 'ease-in-out',
  /** Custom exit easing for modals */
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// ============================================================================
// DISTANCE & TRANSFORM VALUES
// ============================================================================

/**
 * Transform distances for translate animations
 */
export const DISTANCES = {
  /** Slide distance for reveal animations */
  slideUp: 30,
  /** Lift distance for hover effects */
  hoverLift: 4,
  /** Float distance for floating animations */
  float: 10,
} as const;

/**
 * Scale values for zoom animations
 */
export const SCALES = {
  /** Subtle hover scale */
  hoverSmall: 1.02,
  /** Standard hover scale */
  hover: 1.05,
  /** Dramatic hover scale */
  hoverLarge: 1.1,
  /** Active/pressed scale */
  active: 0.95,
  /** Pressed button scale */
  pressed: 0.98,
} as const;

// ============================================================================
// ENTRANCE ANIMATIONS
// ============================================================================

/**
 * Fade + slide up entrance animation (scroll-triggered)
 */
export const fadeSlideUp = {
  initial: {
    opacity: 0,
    transform: `translateY(${DISTANCES.slideUp}px)`,
  },
  animate: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  transition: {
    duration: DURATIONS.slow,
    easing: EASINGS.standard,
  },
} as const;

/**
 * Simple fade-in animation
 */
export const fadeIn = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    duration: DURATIONS.normal,
    easing: EASINGS.standard,
  },
} as const;

/**
 * Scale + fade entrance animation
 */
export const scaleIn = {
  initial: {
    opacity: 0,
    transform: 'scale(0.9)',
  },
  animate: {
    opacity: 1,
    transform: 'scale(1)',
  },
  transition: {
    duration: DURATIONS.slow,
    easing: EASINGS.bounce,
  },
} as const;

// ============================================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================================

/**
 * CSS classes for scroll-triggered reveal animations
 * Apply `.fade-slide-up` class and add `.is-visible` when element is in view
 */
export const scrollRevealClasses = {
  /** Base class for fade + slide up */
  fadeSlideUp: 'fade-slide-up',
  /** Class to add when element is visible */
  visible: 'is-visible',
  /** Base class for fade in */
  fadeIn: 'fade-in',
  /** Base class for scale in */
  scaleIn: 'scale-in',
} as const;

/**
 * CSS keyframe definitions for scroll reveals
 */
export const scrollRevealStyles = `
  .fade-slide-up {
    opacity: 0;
    transform: translateY(${DISTANCES.slideUp}px);
    transition: 
      opacity ${DURATIONS.slow}s ${EASINGS.standard},
      transform ${DURATIONS.slow}s ${EASINGS.standard};
  }

  .fade-slide-up.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .fade-in {
    opacity: 0;
    transition: opacity ${DURATIONS.normal}s ${EASINGS.standard};
  }

  .fade-in.is-visible {
    opacity: 1;
  }

  .scale-in {
    opacity: 0;
    transform: scale(0.95);
    transition: 
      opacity ${DURATIONS.slow}s ${EASINGS.standard},
      transform ${DURATIONS.slow}s ${EASINGS.bounce};
  }

  .scale-in.is-visible {
    opacity: 1;
    transform: scale(1);
  }
`;

// ============================================================================
// HOVER EFFECTS
// ============================================================================

/**
 * Lift effect for cards and interactive elements
 */
export const hoverLift = {
  transition: `transform ${DURATIONS.fast}s ${EASINGS.standard}, box-shadow ${DURATIONS.fast}s ${EASINGS.standard}`,
  hover: {
    transform: `translateY(-${DISTANCES.hoverLift}px) scale(${SCALES.hoverSmall})`,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  },
  active: {
    transform: `translateY(-2px) scale(${SCALES.pressed})`,
  },
} as const;

/**
 * Scale effect for buttons and icons
 */
export const hoverScale = {
  transition: `transform ${DURATIONS.fast}s ${EASINGS.bounce}`,
  hover: {
    transform: `scale(${SCALES.hover})`,
  },
  active: {
    transform: `scale(${SCALES.active})`,
  },
} as const;

/**
 * Rotate effect for playful interactions
 */
export const hoverRotate = {
  transition: `transform ${DURATIONS.fast}s ${EASINGS.bounce}`,
  hover: {
    transform: `scale(${SCALES.hoverLarge}) rotate(5deg)`,
  },
} as const;

/**
 * Navigation pill hover effect
 */
export const navPillHover = {
  transition: `all ${DURATIONS.fast}s ${EASINGS.standard}`,
  hover: {
    transform: `scale(${SCALES.hover})`,
    color: 'var(--cobalt)',
  },
  active: {
    transform: `scale(${SCALES.pressed})`,
  },
} as const;

// ============================================================================
// MODAL ANIMATIONS
// ============================================================================

/**
 * Modal entrance from bottom
 */
export const modalSlideUp = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: '100%',
    opacity: 0,
  },
  transition: {
    enter: {
      duration: DURATIONS.modal,
      ease: EASINGS.standard,
    },
    exit: {
      duration: DURATIONS.normal,
      ease: EASINGS.exit,
    },
  },
} as const;

/**
 * Modal backdrop fade
 */
export const modalBackdrop = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
  transition: {
    duration: DURATIONS.normal,
  },
} as const;

// ============================================================================
// CAT ANIMATION VARIANTS
// ============================================================================

/**
 * Configuration for cat animation variations
 * Used by the dynamic animation rotation system
 */
export type CatAnimationType = 
  | 'blink'
  | 'tail-sway'
  | 'hop'
  | 'sleep'
  | 'stretch'
  | 'paw-wave'
  | 'head-tilt'
  | 'cape-flutter';

export interface CatAnimationConfig {
  name: CatAnimationType;
  duration: number;
  easing: string;
  /** Probability for random selection (0-1) */
  probability: number;
}

/**
 * Cat animation configurations
 * These will be expanded in task 10.1
 */
export const CAT_ANIMATIONS: CatAnimationConfig[] = [
  {
    name: 'blink',
    duration: DURATIONS.cat.blink,
    easing: EASINGS.easeInOut,
    probability: 0.3,
  },
  {
    name: 'tail-sway',
    duration: DURATIONS.cat.tailSway,
    easing: EASINGS.smooth,
    probability: 0.25,
  },
  {
    name: 'hop',
    duration: DURATIONS.cat.hop,
    easing: EASINGS.bounce,
    probability: 0.15,
  },
  {
    name: 'sleep',
    duration: DURATIONS.cat.sleep,
    easing: EASINGS.easeInOut,
    probability: 0.1,
  },
  {
    name: 'stretch',
    duration: DURATIONS.cat.stretch,
    easing: EASINGS.bounce,
    probability: 0.15,
  },
  {
    name: 'paw-wave',
    duration: DURATIONS.cat.pawWave,
    easing: EASINGS.bounce,
    probability: 0.15,
  },
  {
    name: 'head-tilt',
    duration: DURATIONS.cat.headTilt,
    easing: EASINGS.standard,
    probability: 0.05,
  },
  {
    name: 'cape-flutter',
    duration: DURATIONS.cat.capeFlutter,
    easing: EASINGS.smooth,
    probability: 0.2,
  },
];

/**
 * Floating animation for Supercat button
 */
export const floatingAnimation = {
  name: 'bob',
  keyframes: `
    @keyframes bob {
      0%, 100% { 
        transform: translateY(0); 
      }
      50% { 
        transform: translateY(-${DISTANCES.float}px); 
      }
    }
  `,
  css: `
    animation: bob 3s ${EASINGS.easeInOut} infinite;
  `,
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate stagger delay for sequential animations
 * @param index - Index of the element in the sequence
 * @param baseDelay - Initial delay before first element (default: 0)
 * @param increment - Time between each element (default: 0.1s)
 * @returns Delay value in seconds
 */
export function getStaggerDelay(
  index: number,
  baseDelay: number = DELAYS.base,
  increment: number = DELAYS.stagger.normal
): number {
  return baseDelay + index * increment;
}

/**
 * Generate inline style object for staggered animation
 * @param index - Index of the element
 * @param baseDelay - Initial delay
 * @param increment - Increment between items
 * @returns CSS style object with animation-delay
 */
export function getStaggerStyle(
  index: number,
  baseDelay?: number,
  increment?: number
): React.CSSProperties {
  return {
    animationDelay: `${getStaggerDelay(index, baseDelay, increment)}s`,
  };
}

/**
 * Generate transition-delay style for staggered reveals
 * @param index - Index of the element
 * @param baseDelay - Initial delay
 * @param increment - Increment between items
 * @returns CSS style object with transition-delay
 */
export function getStaggerTransitionStyle(
  index: number,
  baseDelay?: number,
  increment?: number
): React.CSSProperties {
  return {
    transitionDelay: `${getStaggerDelay(index, baseDelay, increment)}s`,
  };
}

// ============================================================================
// ACCESSIBILITY & PERFORMANCE
// ============================================================================

/**
 * CSS for respecting prefers-reduced-motion
 * Include this in your global styles
 */
export const reducedMotionStyles = `
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

/**
 * Check if user prefers reduced motion
 * @returns true if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration respecting user preferences
 * @param duration - Desired duration in seconds
 * @returns Duration in seconds (0.01 if reduced motion preferred)
 */
export function getAccessibleDuration(duration: number): number {
  return prefersReducedMotion() ? 0.01 : duration;
}

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

/**
 * Complete preset configurations for common animation patterns
 */
export const ANIMATION_PRESETS = {
  /** Hero section sequential entrance */
  heroEntrance: {
    heading: {
      ...fadeSlideUp,
      transition: {
        ...fadeSlideUp.transition,
        delay: DELAYS.hero.heading,
      },
    },
    body: {
      ...fadeSlideUp,
      transition: {
        ...fadeSlideUp.transition,
        delay: DELAYS.hero.body,
      },
    },
    cta: {
      ...fadeSlideUp,
      transition: {
        ...fadeSlideUp.transition,
        delay: DELAYS.hero.cta,
      },
    },
  },
  
  /** Card grid with staggered reveal */
  cardGrid: {
    container: fadeSlideUp,
    item: (index: number) => ({
      ...fadeSlideUp,
      transition: {
        ...fadeSlideUp.transition,
        delay: getStaggerDelay(index, 0, DELAYS.stagger.slow),
      },
    }),
  },
  
  /** Modal with backdrop */
  modal: {
    backdrop: modalBackdrop,
    content: modalSlideUp,
  },
  
  /** Interactive button */
  button: {
    base: {
      transition: `all ${DURATIONS.fast}s ${EASINGS.standard}`,
    },
    hover: hoverScale.hover,
    active: hoverScale.active,
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AnimationConfig = typeof fadeSlideUp | typeof fadeIn | typeof scaleIn;
export type HoverConfig = typeof hoverLift | typeof hoverScale | typeof hoverRotate;
export type ModalAnimationConfig = typeof modalSlideUp | typeof modalBackdrop;
