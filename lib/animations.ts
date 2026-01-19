export type AnimationVariant =
  | "fadeIn"
  | "fadeOut"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "scaleOut"
  | "bounce"
  | "pulse"
  | "shimmer"
  | "wiggle"
  | "pop"
  | "slideUpFade"
  | "slideDownFade";

export type AnimationDuration = "fast" | "normal" | "slow";
export type AnimationEasing = "ease-out" | "ease-in-out" | "spring";

export interface AnimationConfig {
  variant: AnimationVariant;
  duration?: AnimationDuration;
  easing?: AnimationEasing;
  delay?: number;
}

export const ANIMATION_DURATIONS: Record<AnimationDuration, number> = {
  fast: 150,
  normal: 250,
  slow: 400,
};

export const ANIMATION_EASINGS: Record<AnimationEasing, string> = {
  "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
  "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

export function getAnimationClass(
  variant: AnimationVariant,
  duration: AnimationDuration = "normal",
  easing: AnimationEasing = "ease-out"
): string {
  const durationClass = duration !== "normal" ? `-${duration}` : "";
  const easingClass = easing !== "ease-out" ? `-${easing}` : "";
  return `animate-${variant}${durationClass}${easingClass}`;
}

export const ANIMATION_PRESETS = {
  fadeIn: {
    variant: "fadeIn" as const,
    duration: "normal" as const,
    easing: "ease-out" as const,
  },
  slideUp: {
    variant: "slideUp" as const,
    duration: "normal" as const,
    easing: "ease-out" as const,
  },
  slideUpFade: {
    variant: "slideUpFade" as const,
    duration: "normal" as const,
    easing: "ease-out" as const,
  },
  scaleIn: {
    variant: "scaleIn" as const,
    duration: "normal" as const,
    easing: "spring" as const,
  },
  pop: {
    variant: "pop" as const,
    duration: "normal" as const,
    easing: "spring" as const,
  },
  fadeOut: {
    variant: "fadeOut" as const,
    duration: "fast" as const,
    easing: "ease-in-out" as const,
  },
  scaleOut: {
    variant: "scaleOut" as const,
    duration: "fast" as const,
    easing: "ease-in-out" as const,
  },
  bounce: {
    variant: "bounce" as const,
    duration: "normal" as const,
    easing: "spring" as const,
  },
  wiggle: {
    variant: "wiggle" as const,
    duration: "fast" as const,
    easing: "ease-in-out" as const,
  },
  pulse: {
    variant: "pulse" as const,
    duration: "slow" as const,
    easing: "ease-in-out" as const,
  },
  shimmer: {
    variant: "shimmer" as const,
    duration: "slow" as const,
    easing: "ease-in-out" as const,
  },
} as const;

export function getStaggerDelay(index: number, baseDelay = 50): number {
  return index * baseDelay;
}

export const ANIMATION_STATES = {
  initial: "opacity-0",
  animate: "opacity-100",
  exit: "opacity-0",
};
