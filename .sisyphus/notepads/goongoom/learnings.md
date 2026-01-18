# Phase 1: Project Setup Learnings

## Date: 2026-01-18

### Dependencies Installed

**Core Framework:**
- next@16.1.3 - Latest Next.js with App Router
- react@19.2.3 - React 19
- react-dom@19.2.3
- typescript@^5

**Authentication:**
- @clerk/nextjs@^6.36.8 - Clerk authentication with middleware support

**Database:**
- drizzle-orm@^0.45.1 - TypeScript-first ORM
- @planetscale/database@^1.19.0 - PlanetScale serverless driver
- drizzle-kit@^0.31.8 (dev) - Drizzle migration tools

**UI/Styling:**
- tailwindcss@^4 - Tailwind CSS v4
- @tailwindcss/postcss@^4
- pretendard@^1.3.9 - Korean font (Pretendard)
- shadcn/ui components (via CLI):
  - class-variance-authority@^0.7.1
  - clsx@^2.1.1
  - tailwind-merge@^3.4.0
  - lucide-react@^0.562.0
  - tw-animate-css@^1.4.0

**Dev Tools:**
- dotenv-cli@^11.0.0 - Environment variable management
- eslint@^9 + eslint-config-next@16.1.3

### Configurations Made

1. **TypeScript Strict Mode:**
   - Enabled `"strict": true`
   - Added `"noUncheckedIndexedAccess": true` for safer array/object access

2. **Tailwind CSS:**
   - Configured Tailwind v4 with CSS variables
   - Set up Pretendard font family as default sans-serif
   - Installed Pretendard font files (Regular, Medium, SemiBold, Bold) in `public/fonts/`

3. **Clerk Authentication:**
   - Created `middleware.ts` with public route matcher
   - Wrapped app in `<ClerkProvider>` in root layout
   - Public routes: `/`, `/sign-in`, `/sign-up`, `/@*` (user profiles)

4. **Drizzle ORM:**
   - Created `drizzle.config.ts` with MySQL dialect
   - Set up database connection in `lib/db/index.ts`
   - Created initial schema in `db/schema.ts` (users, questions, answers)
   - Added npm scripts: `db:generate`, `db:migrate`, `db:push`, `db:studio`

5. **Environment Variables:**
   - Created `.env.local` with placeholders
   - Created `.env.example` for reference
   - Required vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL`

6. **Project Structure:**
   ```
   app/
   ├── layout.tsx (ClerkProvider + Pretendard font)
   ├── page.tsx (home)
   ├── more/page.tsx (더보기)
   └── @[username]/page.tsx (user profiles)
   
   components/
   ├── ui/ (shadcn components)
   ├── layout/
   ├── questions/
   └── profile/
   
   lib/
   ├── db/index.ts (database connection)
   └── utils.ts (shadcn utils)
   
   db/
   ├── schema.ts (Drizzle schema)
   └── migrations/
   ```

### Issues Encountered & Solutions

1. **create-next-app conflict with .sisyphus directory:**
   - Solution: Created project in temp directory, then copied files over

2. **Pretendard font download from CDN failed:**
   - Solution: Installed `pretendard` npm package, copied font files from `node_modules/`

3. **TypeScript non-null assertion in drizzle.config.ts:**
   - Solution: Changed `process.env.DATABASE_URL!` to `process.env.DATABASE_URL ?? ""`

4. **React Compiler prompt during create-next-app:**
   - Solution: Selected "No" (not needed for this project)

### Next Steps (Phase 2)

- Set up actual Clerk application and get API keys
- Set up PlanetScale database and get connection string
- Run `npm run db:push` to create database tables
- Test authentication flow
- Build out UI components (QuestionBubble, AnswerBubble, etc.)

## Date: 2026-01-18 (Update)

### Drizzle ORM Migration: MySQL to PostgreSQL with Schema Isolation

**Context:**
Migrated from PlanetScale MySQL to PostgreSQL with schema isolation to support multiple projects in a single database.

**Key Changes:**

1. **Schema Isolation Pattern:**
   - Used `pgSchema('my_project')` instead of default `public` schema
   - All tables created under `my_project` schema namespace
   - Prevents table name conflicts when multiple projects share one database

2. **Database Driver Change:**
   - FROM: `drizzle-orm/planetscale-serverless` + `@planetscale/database`
   - TO: `drizzle-orm/node-postgres` + `pg`
   - Installed: `pg` and `@types/pg`

3. **Schema Definition (`src/db/schema.ts`):**
   - Imported from `drizzle-orm/pg-core` instead of `mysql-core`
   - Changed column types:
     - `varchar()` → `text()`
     - `int().autoincrement()` → `integer().generatedAlwaysAsIdentity()`
     - `timestamp().defaultNow()` → `timestamp().defaultNow()`
   - All tables use `myProject.table()` instead of direct table creation

4. **Drizzle Config (`drizzle.config.ts`):**
   - Changed dialect: `mysql` → `postgresql`
   - Added `schemaFilter: ['my_project']` to isolate schema operations
   - Added `migrations` config to store migrations in project schema:
     ```typescript
     migrations: {
       schema: 'my_project',
       table: '__drizzle_migrations',
     }
     ```
   - Changed output directory: `./db/migrations` → `./drizzle`

5. **Database Connection (`src/db/index.ts`):**
   - Changed from PlanetScale Client to node-postgres
   - Simplified to: `drizzle(process.env.DATABASE_URL ?? '', { schema })`

6. **File Structure Change:**
   - Moved from `db/schema.ts` → `src/db/schema.ts`
   - Moved from `lib/db/index.ts` → `src/db/index.ts`
   - Migrations now in `./drizzle/` instead of `./db/migrations/`

**Why Schema Isolation?**
- Allows multiple projects to coexist in one PostgreSQL database
- Each project has its own schema namespace (`my_project`, `other_project`, etc.)
- Prevents table name collisions
- Migrations are tracked per-schema, not globally

**Verification:**
- ✅ TypeScript compilation passes (no LSP errors)
- ✅ `npm run db:generate` successfully creates migrations
- ✅ Generated migration file: `drizzle/0000_cool_mystique.sql`
- ✅ All 3 tables detected: users, questions, answers

**Connection String Format:**
```
postgresql://postgres.{id}:{password}@{host}:{port}/postgres
```

**Important Notes:**
- The `schemaFilter` ensures Drizzle only operates on `my_project` schema
- Migration table `__drizzle_migrations` is stored in `my_project` schema, not `public`
- This prevents interference with other projects' migrations in the same database

---

# Phase 4: Complete UI Implementation

## Date: 2026-01-18

### Component Structure Decisions

**Layout Architecture:**
- **3-Column Responsive Layout**: Implemented using CSS Flexbox
  - Sidebar: `hidden lg:block w-64 lg:w-80` - Progressive disclosure for mobile
  - MainContent: `flex-1` - Fluid width that adapts to available space
  - RightPanel: `hidden lg:block w-96` - Only visible on desktop (>1024px)
  
- **Sticky Positioning**: Both sidebar and right panel use `sticky top-0` with `h-screen` for persistent navigation while scrolling main content

**Component Organization:**
```
components/
├── layout/          # Structural components
│   ├── Sidebar.tsx
│   ├── RightPanel.tsx
│   └── MainContent.tsx
├── questions/       # Q&A specific components
│   ├── QuestionBubble.tsx
│   └── AnswerBubble.tsx
├── profile/         # Profile page components
│   ├── ProfileHeader.tsx
│   └── QuestionForm.tsx
└── home/           # Home page specific components
    ├── HeroCard.tsx
    ├── QAFeed.tsx
    └── PeopleList.tsx
```

**Rationale**: Organized by feature/domain rather than component type. This makes it easier to locate related components and understand the application structure.

### Responsive Strategy

**Breakpoints Used:**
- Mobile: `< 768px` - Single column, no sidebar/right panel
- Tablet: `768px - 1024px` - Sidebar visible, no right panel
- Desktop: `> 1024px` - Full 3-column layout

**Implementation Approach:**
- Used Tailwind's responsive prefixes (`lg:`) consistently
- `hidden lg:block` pattern for progressive enhancement
- Width classes scale up: `w-64 lg:w-80` for sidebar

**Key Decisions:**
- Sidebar navigation uses `rounded-full` pills for active state with `bg-orange-100` and `text-orange-500`
- Active state detection via `usePathname()` hook in client component
- Mobile navigation deferred (hamburger menu) - not implemented in this phase

### Tailwind Customizations

**Colors Used (All Defaults):**
- Primary: `orange-500`, `orange-600` (hover states)
- Light accents: `orange-100`, `orange-50`
- Backgrounds: `gray-50` (main), `white` (cards/panels)
- Text: `gray-900` (primary), `gray-500` (secondary), `gray-400` (disabled)
- Borders: `gray-200`, `gray-300`

**Border Radius Patterns:**
- Hero card: `rounded-3xl` (24px) - Large, dramatic
- Chat bubbles: `rounded-xl` (12px) - Friendly, conversational
- Inputs/buttons: `rounded-lg` (8px) - Standard form elements
- Navigation pills: `rounded-full` - Infinite radius for pill shape
- Profile avatar: `rounded-full` with `ring-4 ring-orange-500` for emphasis

**Shadow Strategy:**
- Subtle shadows: `shadow-sm` for cards and bubbles
- Dramatic shadow: `shadow-lg` for hero card
- No heavy shadows - keeps design light and modern

### Typography Implementation

**Font Loading:**
- Used Next.js `localFont` with multiple weights (400, 500, 600, 700)
- Font files expected in `/public/fonts/Pretendard-*.woff2`
- CSS variable: `--font-pretendard`
- Applied via `font-sans` class in root layout

**Korean Text Optimization:**
- Line height: Default Tailwind (1.5-1.75) works well for Hangul
- Font weights: Regular (400) for body, Medium (500) for emphasis, Bold (700) for headings
- No custom line-height needed - Tailwind defaults are Korean-friendly

### Visual Design Choices

**Hero Card:**
- **Gradient**: `from-orange-400 via-orange-500 to-orange-600` - Warm, inviting
- **Pattern overlay**: SVG grid pattern with `opacity-30` for texture
- **Typography**: Large (text-4xl) headline with smaller subline
- **Positioning**: Left-bottom alignment via flexbox

**Q&A Bubbles:**
- **Question (left)**: White background, anonymous avatar, gray metadata
- **Answer (right)**: Orange background, white text, user avatar
- **Spacing**: `space-y-6` between Q&A pairs, `space-y-4` within pairs
- **Metadata**: Small (text-xs) gray text below bubbles

**Profile Header:**
- **Avatar**: 124px circular with 4px orange ring (`ring-4 ring-orange-500`)
- **Social links**: Circular icon containers (48px) with labels below
- **Layout**: Centered column layout with divider at bottom

**Question Form:**
- **Radio buttons**: Custom styled with orange accent color
- **Textarea**: Gray border with orange focus ring
- **Submit button**: Gray (disabled) with orange hover state
- **Micro-copy**: Small gray text for terms agreement

### State Management

**Client Components:**
- `Sidebar.tsx`: Uses `usePathname()` for active state
- `QuestionForm.tsx`: Uses `useState()` for form state (question text, type)

**Server Components:**
- All page components (page.tsx files) are server components by default
- Profile page uses async/await for params (Next.js 16 pattern)

### Next.js 16 Patterns

**Dynamic Routes:**
- `app/[username]/page.tsx` uses `params: Promise<{username: string}>` pattern
- Must await params before use: `const { username } = await params;`

**Image Optimization:**
- Used Next.js `Image` component throughout
- External images from dicebear.com (avatar generator)
- Width/height specified for all images (40px, 62px, 124px)

### Accessibility Considerations

**Semantic HTML:**
- Proper heading hierarchy (h1, h2)
- Button elements with `type="button"` attribute
- Form labels and inputs properly associated

**Keyboard Navigation:**
- All interactive elements are keyboard accessible
- Focus states via Tailwind's default focus rings

**Screen Readers:**
- Alt text on all images
- Semantic navigation structure

### Performance Optimizations

**Component Splitting:**
- Extracted HeroCard, QAFeed, PeopleList to separate files
- Reduces page component complexity
- Enables better code splitting

**Static Data:**
- Mock data defined as constants
- No runtime data fetching in this phase
- Ready for backend integration

### Build & Deployment

**Verification Results:**
- ✅ Dev server starts successfully (bun run dev)
- ✅ TypeScript compilation passes (no errors)
- ✅ Production build succeeds (bun run build)
- ✅ All routes generated correctly (/, /[username], /more)

**Bundle Size:**
- Not measured in this phase
- All components are server components by default (good for bundle size)
- Only 2 client components: Sidebar, QuestionForm

### Design Philosophy

**Aesthetic Direction: Modern Korean Social Platform**
- **Tone**: Friendly, approachable, warm (orange palette)
- **Inspiration**: Korean Q&A platforms (Ask.fm, Peing) but modernized
- **Differentiation**: Gradient hero card, chat-style Q&A bubbles, clean typography

**Visual Hierarchy:**
1. Hero card (largest, most colorful)
2. Q&A feed (conversational, alternating sides)
3. Right panel (subtle, supportive)

**Color Psychology:**
- Orange: Friendly, energetic, approachable
- White: Clean, simple, trustworthy
- Gray: Neutral, professional, readable

### Lessons Learned

1. **Component extraction prevents comment clutter**: Instead of using comments to mark sections, extract to named components
2. **Tailwind defaults are sufficient**: No custom colors needed, orange-500 works perfectly
3. **Responsive design via utility classes**: `hidden lg:block` pattern is clean and maintainable
4. **Korean fonts need proper loading**: localFont with multiple weights ensures good typography
5. **Next.js 16 async params**: Must await params in dynamic routes
6. **Type safety matters**: Using proper TypeScript interfaces prevents runtime errors
7. **Accessibility by default**: Semantic HTML + Tailwind focus states = good a11y baseline

### Known Limitations

**Not Implemented:**
- Mobile hamburger menu (sidebar hidden on mobile)
- Actual authentication flow (Clerk integration exists but not wired up)
- Backend API integration
- Real-time updates
- Image uploads
- Form validation and submission

**Future Enhancements:**
- Add mobile navigation drawer
- Implement infinite scroll for Q&A feed
- Add loading states and skeletons
- Implement error boundaries
- Add animations/transitions (consider Motion library)
- Optimize for Korean input methods (IME)

### Files Created

**Layout Components:**
- `components/layout/Sidebar.tsx` - Navigation sidebar with active state
- `components/layout/RightPanel.tsx` - Right panel container
- `components/layout/MainContent.tsx` - Main content area wrapper

**Question Components:**
- `components/questions/QuestionBubble.tsx` - Question display (left-aligned)
- `components/questions/AnswerBubble.tsx` - Answer display (right-aligned)

**Profile Components:**
- `components/profile/ProfileHeader.tsx` - User profile header with avatar and social links
- `components/profile/QuestionForm.tsx` - Question submission form

**Home Components:**
- `components/home/HeroCard.tsx` - Hero card with gradient and pattern
- `components/home/QAFeed.tsx` - Q&A feed with mock data
- `components/home/PeopleList.tsx` - Recent people list

**Pages:**
- `app/page.tsx` - Home page (hero + feed + people)
- `app/[username]/page.tsx` - Profile page (header + feed + question form)
- `app/more/page.tsx` - More/settings page (options list)

### Next Steps (Phase 5)

1. Wire up Clerk authentication
2. Connect to PlanetScale database
3. Implement API routes for CRUD operations
4. Add real-time subscriptions
5. Implement mobile navigation
6. Add form validation and error handling
7. Optimize images and fonts
8. Add analytics and monitoring
