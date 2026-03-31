# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Next.js dev server
npm run build        # production build
npm run type-check   # tsc --noEmit (run before commits)
npm run lint         # ESLint via next lint
npm run test         # run all tests once (vitest run)
npm run test:watch   # vitest in watch mode
```

Run a single test file:
```bash
npx vitest run src/lib/db/__tests__/spin-logic.test.ts
```

## Architecture

### Session & Auth (frontend-only today)
Auth lives entirely in `src/context/SessionContext.tsx` backed by `localStorage` — there is no real backend auth yet. `signIn()` simulates a 1-second delay and creates a synthetic user. `SessionContext` provides `user`, `mounted`, `signIn`, `signOut`, `completeOnboarding`, and `bumpPostsToday`. All session writes go through `setUser()` which keeps state and storage in sync.

`AuthGate` (`src/components/layout/AuthGate.tsx`) wraps every authenticated page: it redirects to `/auth` if no user, to `/onboarding` if onboarding is incomplete, and renders a spinner until `mounted` is true (prevents hydration mismatch from localStorage reads).

### Theme
`src/context/ThemeContext.tsx` manages dark/light mode via `document.documentElement.classList` and `localStorage` (`convo_theme`). An inline `<script>` in `src/app/layout.tsx` applies the class before React hydration to prevent flash. Tailwind is configured with `darkMode: 'class'`.

### Page Layout
Every authenticated page wraps its content in `AppShell` (`src/components/layout/AppShell.tsx`), which composes `AuthGate` → `TopBar` → `<main>` → `BottomNav`. Pages that skip the shell (auth, onboarding) render standalone full-screen layouts.

### Filler Data
`src/lib/filler.ts` is the single source of truth for all static data: `UW_CAMPUS`, `UW_MAJORS_BY_COLLEGE` (grouped by college for `<optgroup>`), flat `MAJORS`, `TOPICS`, `INTERESTS`, `SAMPLE_POSTS`, `SAMPLE_REPLIES`. All pages read from here — nothing hits a real database on the frontend yet.

### REST API
Route handlers live under `src/app/api/v1/`. Each handler follows the same pattern:
1. `requireUUID()` validates path params
2. `requireAuth(request)` verifies Bearer JWT via Supabase, returns `{ id, campusId, majorId, token }`
3. `createUserDbClient(token)` creates a per-request Supabase client bearing the user JWT so RLS evaluates as that user
4. Business logic in `src/lib/db/` modules
5. Errors thrown as `ApiError` instances, caught by `handleError()` which serialises to `{ error: { code, message } }`

API endpoints:
- `GET  /api/v1/campuses/:campusId/majors-for-wheel` — eligible majors for the spin wheel
- `POST /api/v1/campuses/:campusId/majors-spin` — execute a spin, write event, return winner
- `POST /api/v1/conversations` — create a conversation post
- `GET  /api/v1/me/major-spins` — current user's spin history

### Database Layer
`src/lib/db/` contains: `client.ts` (per-request Supabase client), `majors.ts` (shared wheel eligibility query), `spins.ts` (`pickWinner` pure fn + DB writes), `conversations.ts` (daily limit check + insert). `pickWinner` is exported and unit tested independently of the DB.

### Tests
Tests live in `src/**/__tests__/` and run in a `node` environment (no DOM). The `@/` alias is configured in `vitest.config.ts`. Current coverage: `errors.ts`, `validate.ts`, `spins.ts` (including chi-square distribution test).

### Key Constraints
- UW-only: `@uw.edu` email gated at `/auth`, `campusId` hardcoded to `'uw'` throughout
- React 19: no `forwardRef`; dynamic route params use `useParams<{ id: string }>()` hook in client components (not async page props)
- Next.js 15 async params: route handler `params` is a `Promise` — must be `await`ed
- Post limit: 5 posts/day per user, enforced in `src/lib/db/conversations.ts` and the compose page
- `suppressHydrationWarning` is on `<html>` — required because the theme script modifies the class before hydration
