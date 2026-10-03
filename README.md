# Aventura Mall Next.js demo

An independent redesign concept for Aventura Mall ownership and management. Built with Next.js App Router and exported as a static website. No database, accounts, form service, analytics, API keys or backend is required. Ask Aventura demonstrates AI visitor assistance using scripted answers in the browser.

## Explore the demo

The site includes an editorial homepage, shopping and dining directory search, category filters, discovery links, art section, mobile navigation, visitor information and the Ask Aventura assistant simulation. Open it from the header, fixed launcher or inline invitation. Choose a suggested question or enter your own; close, reopen or reset the conversation. Directory records are sample content; photos are illustrative stock references rather than verified Aventura Mall photography.

## Run locally

Use Node.js 22 or newer:

```sh
npm install
npm run typecheck
npm run dev
```

Open http://localhost:3000. To preview the production static export:

```sh
npm run build
npm run preview
```

The static website is generated in `out/`. Deploy that directory to a static web host. The manual preview server defaults to 127.0.0.1:3000; set `AVENTURA_PREVIEW_PORT` to choose another port. Browser tests start their own preview on port 3147 and refuse to reuse an existing service.

## Build and browser verification

The GitHub Actions workflow installs dependencies, checks TypeScript, builds Next.js and runs Playwright visitor flow checks at desktop and mobile sizes. It uploads the built website, resolved dependency lockfile and browser report as artifacts. See the repository Actions tab for the current result; adding the workflow does not itself prove the checks passed.

To run the browser checks locally after building:

```sh
npx playwright install chromium
npm run test:e2e
```

The resolved `package-lock.json` is tracked; use `npm ci` for subsequent installs. The Mac checkout supports installation, static builds and browser QA.

## Project structure

- `app/page.tsx`: Next.js entry and interaction lifecycle.
- `app/layout.tsx`: metadata, language, favicon and concept noindex setting.
- `app/globals.css`: responsive styling.
- `lib/experience.js`: static presentation and directory/menu interactions.
- `lib/visitor-assistant.js`: deterministic question routing, source snapshot and assistant lifecycle.
- `scripts/serve-static.mjs`: local preview of the exported output.
- `tests/visitor-flow.spec.ts`: search, filters, discovery links, mobile navigation and overflow checks.
- `docs/PROPOSAL.md`: pitch, full reproduction checklist, scope, schedule and cost estimates.
- `docs/ASSETS.md`: image references and outstanding verification.
- `preview.html`: earlier standalone HTML concept preview.

The presentation is shared with the original preview. Keep `experienceHtml` as authored static content; never concatenate user input or untrusted CMS content into it. Search changes textContent and element visibility. Convert the shared presentation to typed React components before integrating a CMS or expanding the data model.

## Before public launch

Confirm tenant records, visitor details and media rights with the mall owner. Download approved images into the project and inspect their crops and alternative text. Verify all intended links, review accessibility with keyboard and screen reader, and inspect the design on real devices. The automated browser checks do not establish complete WCAG conformance or verify image licensing.

This is an independent concept, not an official mall or city website. It remains noindex for pitching. No hosting service has been purchased or production domain configured.

## Existing Sites publication

The canonical demo is [Aventura Mall Renewal Demo](https://aventura-mall-renewal-demo.ethan072498.chatgpt.site). Reuse the Site ID in `.openai/hosting.json` and preserve its existing custom access policy. Publish the root-path static `out/` export through the Sites workflow. Do not create a replacement Site or broaden sharing.

## Historical GitHub Pages workflow

The separate GitHub Pages workflow was configured to publish after TypeScript, build and desktop/mobile browser checks. Its Configure Pages step has a known failure; Sites is the correct hosting target for this demonstration. The repository's GitHub Pages source must be set to **GitHub Actions** in Settings → Pages. Once enabled, future pushes to main publish automatically; workflow_dispatch is available for manual publication.

The workflow uses `NEXT_PUBLIC_BASE_PATH=/aventura-mall`, which adjusts Next.js assets, the favicon and the test preview to the repository's Pages path. Local development keeps the root path by default. To test a Pages path locally, set the same environment variable when building, serving and running the browser checks.

The compiled static export is hosted without a database, server process or paid hosting account. No custom domain is configured.

## Visitor assistant scope and verification

The assistant supports anniversary jewelry, Mexican food and a weekend with kids, plus art, directory, hours, parking and accessibility. It uses official-source descriptions checked October 3, 2026, with source links and freshness notices on each response. It never claims live inventory, prices, restaurant availability or confirmed weekend events. Unsupported or sensitive requests fall back to official information. This is keyword routing, not a live language model; ambiguous follow ups may fall back.

Questions are rendered with `textContent`, never inserted as HTML. The temporary transcript is capped at eight turns and clears on Start over or reload. No questions are transmitted, stored in browser storage or logged to a backend. No data/model service has been purchased. Production source ingestion, grounding/evaluation, privacy, failure handling, usage caps and implementation/operating assumptions are included in the existing delivery plan in `docs/PROPOSAL.md`; the $130,000 build and $4,000/month terms are preserved and live AI costs remain unpriced.

### Verified October 3, 2026

- `npm run typecheck` and `npm run build`: passed with the tracked lockfile and Next.js static export.
- JavaScript syntax checks and `git diff --check`: passed. No lint script is configured in this project.
- `PLAYWRIGHT_BROWSERS_PATH=/tmp/aventura-playwright npm run test:e2e`: 16 passed; two mobile-only cases skipped on desktop. Chromium was installed in that temporary task directory.
- Verified the three approved questions, paraphrases, repeated questions, bounded transcript, unsupported and sensitive requests, literal user-text rendering, empty input, reset/reload privacy, close/reopen, Escape/focus loop, mobile menu entry, and directory navigation.
- Layout checks at 320, 390, 768 and 1280px plus 200% root text sizing passed without dialog/page horizontal overflow. Desktop and narrow-mobile screenshots were visually inspected. This is Chromium emulation, not a full real-device or screen-reader audit.
- Every internal anchor resolves. All nine distinct official mall URL destinations and the existing Google Maps directions URL returned HTTP 200 during the outbound-link check. Existing directory behavior passed regression checks. No question-triggered fetch/XHR or browser storage was observed.

The original GitHub Pages Configure Pages failure remains separate from Sites hosting. This verification does not establish live event/inventory accuracy, production AI readiness or media licensing.
