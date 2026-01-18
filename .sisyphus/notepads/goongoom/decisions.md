# Phase 1: Architectural Decisions

## Date: 2026-01-18

### Technology Stack Decisions

1. **Next.js 16 with App Router**
   - **Decision:** Use App Router (not Pages Router)
   - **Rationale:** 
     - Server Components by default = better performance
     - Simplified data fetching with async components
     - Better TypeScript support
     - Future-proof (Pages Router is legacy)

2. **Clerk for Authentication**
   - **Decision:** Use Clerk instead of NextAuth/Auth.js
   - **Rationale:**
     - Built-in @username support (critical for user profiles)
     - Simpler setup than NextAuth
     - Better UX with hosted sign-in pages
     - Middleware-based protection is cleaner

3. **PlanetScale + Drizzle ORM**
   - **Decision:** PlanetScale (MySQL) + Drizzle instead of Prisma + Postgres
   - **Rationale:**
     - PlanetScale: Serverless, auto-scaling, no connection pooling needed
     - Drizzle: Lighter than Prisma, better TypeScript inference
     - MySQL: Familiar, well-supported by PlanetScale

4. **Tailwind CSS v4**
   - **Decision:** Use Tailwind v4 (latest) instead of v3
   - **Rationale:**
     - Better performance with new engine
     - CSS variables for theming (needed for dark mode)
     - shadcn/ui supports v4

5. **shadcn/ui (coss/ui)**
   - **Decision:** Use shadcn/ui instead of component library (MUI, Chakra)
   - **Rationale:**
     - Copy-paste components = full control
     - No bundle size overhead
     - Tailwind-native styling
     - Easy customization for Korean UI

6. **Pretendard Font**
   - **Decision:** Use Pretendard instead of Noto Sans KR
   - **Rationale:**
     - Better Korean character rendering
     - Lighter file size than Noto Sans
     - Modern, clean aesthetic
     - Industry standard for Korean web apps

### Project Structure Decisions

1. **No src/ directory**
   - **Decision:** Keep `app/` at root level
   - **Rationale:** Simpler structure, Next.js default, easier navigation

2. **Separate db/ directory**
   - **Decision:** Keep database schema separate from lib/
   - **Rationale:** Clear separation of concerns, easier to find migrations

3. **Component organization**
   - **Decision:** Organize by feature (layout/, questions/, profile/) not by type
   - **Rationale:** Easier to find related components, scales better

### Configuration Decisions

1. **TypeScript Strict Mode**
   - **Decision:** Enable strict mode + noUncheckedIndexedAccess
   - **Rationale:** Catch bugs early, better type safety, prevents runtime errors

2. **Public Routes**
   - **Decision:** Make user profiles (`/@username`) public
   - **Rationale:** Users should be able to share profile links without auth

3. **Environment Variables**
   - **Decision:** Use .env.local (not .env)
   - **Rationale:** .env.local is gitignored by default, safer for secrets

### Deferred Decisions (To Be Made Later)

- Dark mode implementation strategy
- Image upload service (Cloudinary vs. Uploadthing vs. S3)
- Real-time updates (polling vs. websockets vs. Server-Sent Events)
- Caching strategy (React Cache vs. Redis)
- Analytics provider (Vercel Analytics vs. Plausible vs. PostHog)
