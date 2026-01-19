/**
 * Gradient System - Zenly-Inspired Vibrant Gradients
 * 
 * This file defines 8+ vibrant gradients for the Gen-Z aesthetic.
 * All gradients use oklch() for perceptually uniform color space.
 */

export const gradients = {
  sunset: {
    name: 'Sunset',
    description: 'Warm sunset vibes: orange → pink → purple',
    css: 'linear-gradient(135deg, oklch(0.7 0.18 50) 0%, oklch(0.65 0.25 350) 50%, oklch(0.65 0.25 300) 100%)',
    darkCss: 'linear-gradient(135deg, oklch(0.75 0.16 50) 0%, oklch(0.72 0.22 350) 50%, oklch(0.72 0.22 300) 100%)',
    foreground: 'oklch(0.98 0 0)',
    usage: 'Warm, energetic content, featured sections',
  },
  ocean: {
    name: 'Ocean',
    description: 'Deep ocean waves: electric-blue → cyan → teal',
    css: 'linear-gradient(135deg, oklch(0.6 0.2 240) 0%, oklch(0.7 0.15 200) 50%, oklch(0.65 0.18 180) 100%)',
    darkCss: 'linear-gradient(135deg, oklch(0.68 0.18 240) 0%, oklch(0.75 0.13 200) 50%, oklch(0.7 0.16 180) 100%)',
    foreground: 'oklch(0.98 0 0)',
    usage: 'Cool, calm sections, information displays',
  },
  forest: {
    name: 'Forest',
    description: 'Fresh forest greens: lime → emerald → green',
    css: 'linear-gradient(135deg, oklch(0.75 0.2 130) 0%, oklch(0.65 0.18 160) 50%, oklch(0.55 0.15 150) 100%)',
    darkCss: 'linear-gradient(135deg, oklch(0.8 0.18 130) 0%, oklch(0.7 0.16 160) 50%, oklch(0.6 0.13 150) 100%)',
    foreground: 'oklch(0.98 0 0)',
    usage: 'Success states, growth indicators, eco-friendly content',
  },
  candy: {
    name: 'Candy',
    description: 'Sweet candy pop: neon-pink → purple → electric-blue',
    css: 'linear-gradient(135deg, oklch(0.65 0.25 350) 0%, oklch(0.65 0.25 300) 50%, oklch(0.6 0.2 240) 100%)',
    darkCss: 'linear-gradient(135deg, oklch(0.72 0.22 350) 0%, oklch(0.72 0.22 300) 50%, oklch(0.68 0.18 240) 100%)',
    foreground: 'oklch(0.98 0 0)',
    usage: 'Playful content, fun features, social elements',
  },
  electric: {
    name: 'Electric',
    description: 'Electric energy: electric-blue → purple',
    css: 'linear-gradient(135deg, oklch(0.6 0.2 240) 0%, oklch(0.65 0.25 300) 100%)',
    darkCss: 'linear-gradient(135deg, oklch(0.68 0.18 240) 0%, oklch(0.72 0.22 300) 100%)',
    foreground: 'oklch(0.98 0 0)',
    usage: 'Primary CTAs, interactive elements, focus states',
  },
  neon: {
    name: 'Neon',
    description: 'Neon lights: neon-pink → sunset-orange',
    css: 'linear-gradient(135deg, oklch(0.65 0.25 350) 0%, oklch(0.7 0.18 50) 100%)',
    darkCss: 'linear-gradient(135deg, oklch(0.72 0.22 350) 0%, oklch(0.75 0.16 50) 100%)',
    foreground: 'oklch(0.98 0 0)',
    usage: 'Attention-grabbing elements, notifications, badges',
  },
  cosmic: {
    name: 'Cosmic',
    description: 'Cosmic space: purple → electric-blue → neon-pink',
    css: 'linear-gradient(135deg, oklch(0.65 0.25 300) 0%, oklch(0.6 0.2 240) 50%, oklch(0.65 0.25 350) 100%)',
    darkCss: 'linear-gradient(135deg, oklch(0.72 0.22 300) 0%, oklch(0.68 0.18 240) 50%, oklch(0.72 0.22 350) 100%)',
    foreground: 'oklch(0.98 0 0)',
    usage: 'Premium features, creative tools, special events',
  },
  tropical: {
    name: 'Tropical',
    description: 'Tropical paradise: lime → sunset-orange → neon-pink',
    css: 'linear-gradient(135deg, oklch(0.75 0.2 130) 0%, oklch(0.7 0.18 50) 50%, oklch(0.65 0.25 350) 100%)',
    darkCss: 'linear-gradient(135deg, oklch(0.8 0.18 130) 0%, oklch(0.75 0.16 50) 50%, oklch(0.72 0.22 350) 100%)',
    foreground: 'oklch(0.98 0 0)',
    usage: 'Vibrant content, summer themes, energetic sections',
  },
  fire: {
    name: 'Fire',
    description: 'Blazing fire: sunset-orange → neon-pink → purple',
    css: 'linear-gradient(135deg, oklch(0.7 0.18 50) 0%, oklch(0.65 0.25 350) 50%, oklch(0.65 0.25 300) 100%)',
    darkCss: 'linear-gradient(135deg, oklch(0.75 0.16 50) 0%, oklch(0.72 0.22 350) 50%, oklch(0.72 0.22 300) 100%)',
    foreground: 'oklch(0.98 0 0)',
    usage: 'Hot topics, trending content, urgent actions',
  },
  aurora: {
    name: 'Aurora',
    description: 'Northern lights: electric-blue → lime → neon-pink',
    css: 'linear-gradient(135deg, oklch(0.6 0.2 240) 0%, oklch(0.75 0.2 130) 50%, oklch(0.65 0.25 350) 100%)',
    darkCss: 'linear-gradient(135deg, oklch(0.68 0.18 240) 0%, oklch(0.8 0.18 130) 50%, oklch(0.72 0.22 350) 100%)',
    foreground: 'oklch(0.98 0 0)',
    usage: 'Magical moments, special features, highlights',
  },
} as const;

export type GradientVariant = keyof typeof gradients;

export const getGradient = (
  variant: GradientVariant,
  mode: 'light' | 'dark' = 'light'
): string => {
  return mode === 'dark' ? gradients[variant].darkCss : gradients[variant].css;
};

export const getGradientForeground = (variant: GradientVariant): string => {
  return gradients[variant].foreground;
};

export const gradientVariants = Object.keys(gradients) as GradientVariant[];
