# Security & React Code Review

> Scope: full-stack Next.js 14 (App Router) client-side coloring-book generator.
> Last reviewed at **v1.7.1** (2026-08-13). Supersedes the v1.1.2 review.

## 1. Security

### API key handling
- Keys are entered at runtime and stored under the `apikey_${engine}` key in
  `window.localStorage` (see `app/contexts/ConfigContext.tsx`). `config.getApiKey`
  reads the same `apikey_${engine}` prefix, so runtime keys are actually used by
  generation requests (this contract is locked by `tests/ai/config.test.ts`).
- Build-time fallback uses `NEXT_PUBLIC_*` env vars. LocalStorage takes priority
  over env (per OpenSpec), which is correct: a user-entered key overrides a
  shared build-time key. No key is ever written to source, logs, or committed
  files (`.env.local` is gitignored and contains only placeholders).
- `next.config.mjs` sets `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, and a restrictive
  `Content-Security-Policy`. The app is purely client-side, so there is no
  server-rendered secret surface.

### Input handling / XSS
- `generateStories` (gemini.ts) and chat both pass user text through
  `sanitizeInput`, which strips HTML and template/brace sequences and caps length
  at 200 chars. No `dangerouslySetInnerHTML` is used anywhere in the tree.
- Translated strings are rendered as plain text/attributes via `t()`; no raw
  HTML injection path exists.

### Outbound requests
- All image/story generation goes to the configured provider endpoints only
  (Google GenAI, OpenAI, DALL·E, Claude, or a user-supplied compatible base URL).
  `openaiCompatible.ts` uses the user-provided `baseUrl` directly; consumers
  SHOULD validate that base URL points to a trusted host before use (left as a
  deployment concern, not enforced in code).

## 2. Architecture & React

### Provider/gateway pattern
- `app/services/ai/gateway.ts` exposes `generateImage` / `generateStory` and
  dispatches to per-engine modules (`gemini`, `dalle`, `claude`,
  `openaiCompatible`). Each module returns a normalized `AiServiceResponse<T>`,
  so failures are handled uniformly by callers.
- Gemini image generation uses `inlineData` (binary) and no longer relies on a
  `text/plain` JSON-parsing fallback (this was fixed after the v1.1.x review).

### Parallelism
- `app/hooks/useBookGenerator.ts` runs story and image generation concurrently
  (Promise-based fan-out with per-page progress), and `generateBookPages`
  tolerates partial image failures (a failed page returns `success:false` without
  aborting the whole book).

### State & forms
- `getStageKey(totalPages, generatedPages)` returns the current UI stage. As of
  v1.7.1 it correctly treats `(0,0)` as the *idea* stage rather than *finish*
  (the `(0,0)` "finish" misclassification was fixed in this release).

## 3. Test health (v1.7.1)
- `vitest` suite: **44 tests passing** across `tests/ai`, `tests/lib`,
  `tests/i18n`. `tests/setup.ts` provides a working in-memory `localStorage`
  shim only when the runtime does not already supply one.
- `vitest.config.ts` defines an `@` alias to the project root and runs under
  `jsdom`. The previously committed `--no-experimental-web-storage` node flag
  was removed because Node 26 no longer accepts it.
- `tsc --noEmit` passes (strict mode).

## 4. Known limitations / future work
- `openaiCompatible` base-URL trust is not validated in-app.
- Coverage is concentrated on the AI gateway and helpers; PDF rendering and React
  component trees have lighter coverage.
- Story/chat prompts are not yet covered by snapshot tests.
