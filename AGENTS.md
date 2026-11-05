<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## What this is

StudioSpace (package name `studio-tech`) — peer-to-peer studio rental/booking marketplace. Next.js 16 App Router, all code under `src/`. `README.md` is unmodified create-next-app boilerplate; ignore it.

## Architecture

- **Auth: Better Auth.** Server config in `src/lib/auth.ts` (email+password + Google OAuth, MongoDB adapter, JWT session cookie cache). Client hooks come from `src/lib/auth-client.ts` — use its `useAuthUser()`, not raw `useSession`. All auth endpoints are handled by `src/app/api/auth/[...all]/route.ts`.
- **Data: MongoDB.** Shared singleton client in `src/lib/mongodb.ts` (db `studio_tech_2026`, cached on `globalThis` for dev hot-reload). Server-side data access goes through `src/lib/studios.ts` — server components and API routes only, never client components.
- **Route protection:** `src/proxy.ts` (this Next.js version's middleware name) redirects signed-out users to `/login` for `/add-studio`, `/my-bookings`, `/my-listings`, `/studios/:id`. `POST /api/studios` independently rejects unauthenticated requests with 401 — keep that server-side check when editing API routes.
- `STUDIO_CATEGORIES` (the category allowlist used for validation everywhere) lives in `src/types/studio.ts`, not in `lib/`.
- Toasts: Sonner `<Toaster>` is mounted in the root layout; use `sonner` for auth/CRUD feedback.
- Path alias `@/*` → `src/*`.

## Commands

- npm only (lockfile committed). There is no test script or test framework.
- `npm run dev` / `npm run build` / `npm run start`.
- `npm run lint` runs plain `eslint`. It exits 1 on two pre-existing scaffold errors (`src/components/ui/carousel.tsx:98`, `src/hooks/use-mobile.ts:14`, rule `react-hooks/set-state-in-effect`). Treat those as pre-existing; check your own files with `npx eslint <path>`.
- Typecheck with `npx tsc --noEmit` (no typecheck script). Run `next dev` or `next build` first so `.next/types/` route types exist for full route-export validation. Note: `tsc --noEmit` currently reports several pre-existing app errors (`src/components/site/BookingList.tsx`, `src/components/site/SubmitPopOver.tsx`, `src/hooks/use-highlighted-code.ts` imports missing `@/lib/highlighter`, `src/lib/studios.ts` maps `id` but `Studio` declares `_id`). Filter the tsc output to your own files instead of expecting a clean run.

## Environment

- `.env` is gitignored (`.env*` in `.gitignore`) and holds `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGO_DB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Auth and MongoDB (including `next dev`) fail without it; it exists only on this machine. Don't commit it or invent placeholder-checkins.

## Gotchas

- **Never leave a route file empty.** Empty `page.tsx` files make `tsc --noEmit` fail with confusing `File ... is not a module` errors pointing at `.next/dev/types/validator.ts`. A stub route must at least `export default function Page() { return null }`.
- Route/layout props use this version's generated generic types (e.g. `LayoutProps<"/">` in `src/app/layout.tsx`, `params: Promise<{ id: string }>`, awaited — see `src/app/api/studios/[id]/route.ts`), not hand-written `{ children: React.ReactNode }` shapes. Match the existing pattern.
- `next.config.ts` enables flags that change defaults from older Next.js: `cacheComponents` + `partialPrefetching` (data fetching is dynamic by default; opt into caching with the `use cache` directive) and `reactCompiler` (memoization is automatic — don't add `useMemo`/`memo`, and `react-hooks` lint is strict about setState-in-effect). Docs for all of these are bundled under `node_modules/next/dist/docs/`.
- `next/image` is configured to accept **any https host** (`images.remotePatterns` in `next.config.ts`) because studio images come from imgbb, postimage, unsplash, etc. A broken image usually means a non-https URL, not a missing remote pattern.
- Tailwind v4 with no `tailwind.config.*`: theme tokens live in `src/app/globals.css`; CSS is processed via the `@tailwindcss/turbopack` rule in `next.config.ts`.
- UI components are shadcn **"base-nova" style built on Base UI (`@base-ui/react/*`), not Radix**. Base UI props differ from Radix — e.g. there is no `asChild`; use Base UI's own `render` prop. Add components with the shadcn CLI (configured via `components.json`) instead of hand-porting Radix snippets. Icons come from `lucide-react`; `cn()` is re-exported from the `cn` package in `src/lib/utils.ts`.
- Root layout enables dark mode (`dark` class on `<html>`) and smooth scrolling via `data-scroll-behavior="smooth"` — don't remove these when touching the layout.
