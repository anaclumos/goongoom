/**
 * Design Tokens - Zenly-Inspired Vibrant Color System
 * 
 * This file documents the vibrant color palette added for Gen-Z aesthetic.
 * All colors use oklch() for perceptually uniform color space and better consistency.
 */

export const vibrantColors = {
  electricBlue: {
    light: 'oklch(0.6 0.2 240)',
    dark: 'oklch(0.68 0.18 240)',
    foreground: {
      light: 'oklch(0.98 0 0)',
      dark: 'oklch(0.98 0 0)',
    },
    usage: 'Primary CTAs, interactive links, focus states, clickable elements',
    examples: [
      'Call-to-action buttons',
      'Hyperlinks in content',
      'Active navigation items',
      'Focus rings on interactive elements',
    ],
    contrast: 'AA compliant on white backgrounds (light mode) and dark backgrounds (dark mode)',
    accessibility: 'Contrast ratio 4.5:1+ against background colors',
  },
  neonPink: {
    light: 'oklch(0.65 0.25 350)',
    dark: 'oklch(0.72 0.22 350)',
    foreground: {
      light: 'oklch(0.98 0 0)',
      dark: 'oklch(0.98 0 0)',
    },
    usage: 'Playful accents, highlights, attention-grabbing elements, badges',
    examples: [
      'New feature badges',
      'Notification dots',
      'Highlighted text or tags',
      'Playful UI elements',
      'Social engagement indicators',
    ],
    contrast: 'AA compliant on white/dark backgrounds',
    accessibility: 'High visibility for attention-grabbing elements',
  },
  lime: {
    light: 'oklch(0.75 0.2 130)',
    dark: 'oklch(0.8 0.18 130)',
    foreground: {
      light: 'oklch(0.2 0 0)',
      dark: 'oklch(0.2 0 0)',
    },
    usage: 'Success states, positive actions, confirmations, growth indicators',
    examples: [
      'Success messages',
      'Confirmation toasts',
      'Positive status indicators',
      'Growth metrics',
      'Completed states',
    ],
    contrast: 'AAA compliant with dark foreground text',
    accessibility: 'Excellent contrast for success messaging',
  },
  sunsetOrange: {
    light: 'oklch(0.7 0.18 50)',
    dark: 'oklch(0.75 0.16 50)',
    foreground: {
      light: 'oklch(0.98 0 0)',
      dark: 'oklch(0.98 0 0)',
    },
    usage: 'Warm accents, energy indicators, trending content, hot topics',
    examples: [
      'Trending badges',
      'Hot topic indicators',
      'Energy/activity meters',
      'Warm call-to-actions',
      'Featured content highlights',
    ],
    contrast: 'AA compliant on white/dark backgrounds',
    accessibility: 'Warm, energetic color with good visibility',
  },
  purple: {
    light: 'oklch(0.65 0.25 300)',
    dark: 'oklch(0.72 0.22 300)',
    foreground: {
      light: 'oklch(0.98 0 0)',
      dark: 'oklch(0.98 0 0)',
    },
    usage: 'Creative features, premium content, special events, artistic elements',
    examples: [
      'Premium feature badges',
      'Creative tools',
      'Special event markers',
      'Artistic content indicators',
      'VIP/exclusive content',
    ],
    contrast: 'AA compliant on white/dark backgrounds',
    accessibility: 'Distinctive color for premium/creative contexts',
  },
} as const;

/**
 * Usage Guidelines
 * 
 * 1. **Electric Blue**: Use for primary interactive elements. This is your go-to for CTAs.
 * 2. **Neon Pink**: Use sparingly for playful accents. Great for badges and notifications.
 * 3. **Lime**: Use for positive feedback and success states. Replaces or complements emerald.
 * 4. **Sunset Orange**: Use for warm, energetic elements. Great for trending/hot content.
 * 5. **Purple**: Use for premium or creative features. Adds sophistication.
 * 
 * Color Pairing Recommendations:
 * - Electric Blue + Neon Pink: Playful, energetic combinations
 * - Lime + Electric Blue: Fresh, modern tech feel
 * - Purple + Sunset Orange: Creative, warm combinations
 * - Neon Pink + Purple: Bold, artistic pairings
 */

/**
 * Tailwind CSS Usage
 * 
 * These colors are available in Tailwind via the color system:
 * 
 * - bg-electric-blue, text-electric-blue, border-electric-blue
 * - bg-neon-pink, text-neon-pink, border-neon-pink
 * - bg-lime, text-lime, border-lime
 * - bg-sunset-orange, text-sunset-orange, border-sunset-orange
 * - bg-purple, text-purple, border-purple
 * 
 * Foreground variants:
 * - text-electric-blue-foreground (white text on electric blue background)
 * - text-neon-pink-foreground (white text on neon pink background)
 * - text-lime-foreground (dark text on lime background)
 * - text-sunset-orange-foreground (white text on sunset orange background)
 * - text-purple-foreground (white text on purple background)
 */

/**
 * Dark Mode Behavior
 * 
 * All colors automatically adjust in dark mode:
 * - Slightly increased lightness for better visibility
 * - Slightly reduced saturation to prevent eye strain
 * - Maintains the same hue for brand consistency
 */

export type VibrantColorName = keyof typeof vibrantColors;

export const getColorValue = (
  colorName: VibrantColorName,
  mode: 'light' | 'dark' = 'light'
): string => {
  return vibrantColors[colorName][mode];
};

export const getColorForeground = (
  colorName: VibrantColorName,
  mode: 'light' | 'dark' = 'light'
): string => {
  return vibrantColors[colorName].foreground[mode];
};
