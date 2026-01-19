# AGENTS

## Design Philosophy - Zenly-Inspired Aesthetic

Goongoom embraces a vibrant, playful, Gen-Z aesthetic inspired by Zenly's popping visual style:
- **Popping Colors**: Vibrant electric blue, neon pink, lime, sunset orange, purple
- **Smooth Animations**: 60fps micro-interactions with GPU acceleration
- **Playful UI**: Emoji integration, decorative elements, delightful feedback
- **Mobile-First**: Touch-friendly interactions (44px minimum targets), responsive layouts, gesture support
- **NOT Map-Centric**: Unlike Zenly, we focus on vibrant UI elements, not map-based navigation

## Direct Server Render Strategy (RSC + PPR)
- Default to Server Components. `use client` is allowed in `components/ui` and other leaf components that require client interactivity.
- Keep it simple: no `loading.tsx`, no `<Suspense>`. Let pages render directly.
- Use server actions + `<form action={...}>` for all mutations; avoid client form libraries.
- Deduplicate shared reads with `cache()` and parallelize independent fetches with `Promise.all`.

## Color System

Use semantic vibrant colors for maximum impact:
- **Electric Blue** (`bg-electric-blue`, `text-electric-blue`): Primary CTAs, interactive links, focus states, clickable elements
- **Neon Pink** (`bg-neon-pink`, `text-neon-pink`): Playful accents, badges, attention-grabbing elements, notifications
- **Lime** (`bg-lime`, `text-lime`): Success states, positive actions, growth indicators, confirmations
- **Sunset Orange** (`bg-sunset-orange`, `text-sunset-orange`): Warm accents, trending content, hot topics, energy indicators
- **Purple** (`bg-purple`, `text-purple`): Creative features, premium content, special events, artistic elements

All colors support dark mode with optimized contrast (AA/AAA compliant).

**Foreground Text**: Use `-foreground` variants for text on colored backgrounds:
- `text-electric-blue-foreground` (white on electric blue)
- `text-neon-pink-foreground` (white on neon pink)
- `text-lime-foreground` (dark on lime)
- `text-sunset-orange-foreground` (white on sunset orange)
- `text-purple-foreground` (white on purple)

**Color Pairing Recommendations**:
- Electric Blue + Neon Pink: Playful, energetic combinations
- Lime + Electric Blue: Fresh, modern tech feel
- Purple + Sunset Orange: Creative, warm combinations
- Neon Pink + Purple: Bold, artistic pairings

## Gradient System

10 vibrant gradients available for cards, buttons, and backgrounds:

**Available Gradients**:
- `sunset`: Warm sunset vibes (orange → pink → purple) - Featured sections, warm content
- `ocean`: Deep ocean waves (electric-blue → cyan → teal) - Cool, calm sections
- `forest`: Fresh forest greens (lime → emerald → green) - Success states, growth
- `candy`: Sweet candy pop (neon-pink → purple → electric-blue) - Playful, social elements
- `electric`: Electric energy (electric-blue → purple) - Primary CTAs, interactive elements
- `neon`: Neon lights (neon-pink → sunset-orange) - Attention-grabbing, notifications
- `cosmic`: Cosmic space (purple → electric-blue → neon-pink) - Premium features, creative tools
- `tropical`: Tropical paradise (lime → sunset-orange → neon-pink) - Vibrant, energetic content
- `fire`: Blazing fire (sunset-orange → neon-pink → purple) - Hot topics, trending content
- `aurora`: Northern lights (electric-blue → lime → neon-pink) - Magical moments, highlights

**Usage Examples**:
```tsx
import { GradientCard } from "@/components/ui/gradient-card";
import { GradientButton } from "@/components/ui/gradient-button";

<GradientCard variant="sunset">
  <h2>Featured Content</h2>
</GradientCard>

<GradientButton variant="electric">
  Click Me
</GradientButton>
```

**Best Practices**:
- Use gradients sparingly for emphasis (1-2 per screen)
- Prefer solid colors for text-heavy content
- Gradients auto-adjust for dark mode

## Animation System

15 animation variants for smooth, delightful micro-interactions:

**Available Animations**:
- `fadeIn`, `fadeOut`: Opacity transitions
- `slideUp`, `slideDown`, `slideLeft`, `slideRight`: Directional slides
- `slideUpFade`, `slideDownFade`: Combined slide + fade
- `scaleIn`, `scaleOut`: Scale transitions
- `bounce`: Bouncy spring effect
- `pulse`: Subtle pulsing
- `shimmer`: Loading shimmer effect
- `wiggle`: Playful shake
- `pop`: Energetic pop-in

**Durations**: `fast` (150ms), `normal` (250ms), `slow` (400ms)
**Easings**: `ease-out`, `ease-in-out`, `spring` (bouncy)

**Usage Examples**:
```tsx
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";

<AnimatedButton animation="pop" duration="normal" easing="spring">
  Click Me
</AnimatedButton>

<AnimatedCard animation="slideUpFade" delay={100}>
  <p>Content</p>
</AnimatedCard>
```

**Performance Guidelines**:
- All animations are GPU-accelerated (transform, opacity only)
- Respects `prefers-reduced-motion` for accessibility
- Use staggered delays for list animations: `delay={index * 50}`
- Target 60fps for smooth interactions

## Component Guidelines

**Vibrant Components**:
- `<GradientCard>`: Cards with gradient backgrounds (10 variants)
- `<GradientButton>`: Buttons with gradient backgrounds (10 variants)
- `<AnimatedButton>`: Buttons with entrance animations (15 variants)
- `<AnimatedCard>`: Cards with entrance animations (15 variants)
- `<VibrantBadge>`: Badges with vibrant colors (5 colors)

**When to Use Animated Components**:
- Use for primary CTAs and important interactive elements
- Apply to cards in lists/grids for staggered reveals
- Add to modals/dialogs for smooth entrances
- Avoid on static content or text-heavy sections

**Touch Target Sizing**:
- Minimum 44px × 44px for all interactive elements
- Use `min-h-11` (44px) for buttons
- Add padding to increase touch area: `p-3` or `p-4`

**Mobile-First Responsive Design**:
- Design for mobile (375px) first, then scale up
- Use responsive utilities: `text-sm md:text-base lg:text-lg`
- Stack on mobile, grid on desktop: `flex flex-col md:grid md:grid-cols-2`

## Development Principles

**Layout & Sizing**:
- Use `h-full` and `flex-1` for full-height layouts
- NEVER use `h-screen`, `100vh`, `100dvh`, or `min-h-screen`
- Root layout stays minimal, children use `flex-1` as needed
- This ensures proper behavior with iOS safe areas and dynamic viewports

**Tailwind Primitives Only**:
- Use Tailwind utility classes exclusively
- NO arbitrary values: Avoid `[#ff0000]`, `[32px]`, `[1.5rem]`
- Use design tokens: `bg-electric-blue`, `text-neon-pink`, `rounded-lg`
- If you need a custom value, add it to `tailwind.config.ts`

**Server Components Default**:
- Default to Server Components for all pages and layouts
- Use `"use client"` only for interactive components (buttons, forms, animations)
- Keep client components small and focused (leaf components)

**Granular Suspense Boundaries**:
- Wrap each async data fetch in `<Suspense>` with a matching skeleton
- Avoid single giant `loading.tsx` fallback
- Compose `loading.tsx` from section skeletons only
- Example:
  ```tsx
  <Suspense fallback={<UserProfileSkeleton />}>
    <UserProfile userId={userId} />
  </Suspense>
  ```

**Performance Best Practices**:
- Deduplicate shared reads with `cache()` from React
- Parallelize independent fetches with `Promise.all()`
- Use server actions for mutations: `<form action={serverAction}>`
- Avoid client-side form libraries (React Hook Form, Formik)

## UI Kit Usage
- Prefer `components/ui` primitives for surfaces, fields, alerts, empty states, and skeletons.

## Avatars
- User avatars must come from Clerk `imageUrl`. Only use dicebear for anonymous users.
