# Phase 1: Issues & Blockers

## Date: 2026-01-18

### Issues Encountered

1. **create-next-app directory conflict**
   - **Problem:** create-next-app refused to initialize in directory with existing `.sisyphus/` folder
   - **Impact:** Could not run setup command directly in target directory
   - **Resolution:** Created project in temp directory, removed `.git`, copied files to target
   - **Status:** ✅ Resolved

2. **Pretendard font CDN download failed**
   - **Problem:** jsdelivr CDN URLs returned 404 errors for Pretendard font files
   - **Impact:** Could not download fonts directly via curl/wget
   - **Resolution:** Installed `pretendard` npm package, copied woff2 files from node_modules
   - **Status:** ✅ Resolved

3. **TypeScript strict mode non-null assertion**
   - **Problem:** `process.env.DATABASE_URL!` triggered ESLint error (forbidden non-null assertion)
   - **Impact:** TypeScript compilation would fail with strict rules
   - **Resolution:** Changed to nullish coalescing: `process.env.DATABASE_URL ?? ""`
   - **Status:** ✅ Resolved

### Known Limitations

1. **Environment variables not set**
   - `.env.local` created with empty placeholders
   - Clerk and PlanetScale credentials needed before app can run fully
   - Database connection will fail until `DATABASE_URL` is set

2. **Database not initialized**
   - Schema defined but migrations not run
   - Need to run `npm run db:push` after PlanetScale setup

3. **No authentication UI**
   - Clerk middleware configured but no sign-in/sign-up pages created
   - Will need to add Clerk components or custom auth UI

### Warnings to Address

- 4 moderate severity vulnerabilities in npm packages (from drizzle-kit dependencies)
- Deprecated packages: `@esbuild-kit/esm-loader`, `@esbuild-kit/core-utils`
- These are dev dependencies and don't affect production build
