# Aventura Mall Next.js demo

An independent redesign concept for Aventura Mall ownership and management. Built with Next.js App Router and exported as a static website. No database, accounts, form service, analytics, API keys or backend is required.

## Explore the demo

The site includes an editorial homepage, shopping and dining directory search, category filters, discovery links, art section, mobile navigation and visitor information. Directory records are sample content; photos are illustrative stock references rather than verified Aventura Mall photography.

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

The static website is generated in `out/`. Deploy that directory to a static web host. The preview server binds to 127.0.0.1:3000.

## Build and browser verification

The GitHub Actions workflow installs dependencies, checks TypeScript, builds Next.js and runs Playwright visitor flow checks at desktop and mobile sizes. It uploads the built website, resolved dependency lockfile and browser report as artifacts. See the repository Actions tab for the current result; adding the workflow does not itself prove the checks passed.

To run the browser checks locally after building:

```sh
npx playwright install chromium
npm run test:e2e
```

The first install generates `package-lock.json`. Commit that lockfile when a working environment is available and then use `npm ci`. CI preserves a resolved dependency lockfile as an artifact until one is tracked. No local dependency installation or build was possible in the original Codex workspace because it did not become available.

## Project structure

- `app/page.tsx`: Next.js entry and interaction lifecycle.
- `app/layout.tsx`: metadata, language, favicon and concept noindex setting.
- `app/globals.css`: responsive styling.
- `lib/experience.js`: static presentation and directory/menu interactions.
- `scripts/serve-static.mjs`: local preview of the exported output.
- `tests/visitor-flow.spec.ts`: search, filters, discovery links, mobile navigation and overflow checks.
- `docs/PROPOSAL.md`: pitch, full reproduction checklist, scope, schedule and cost estimates.
- `docs/ASSETS.md`: image references and outstanding verification.
- `preview.html`: earlier standalone HTML concept preview.

The presentation is shared with the original preview. Keep `experienceHtml` as authored static content; never concatenate user input or untrusted CMS content into it. Search changes textContent and element visibility. Convert the shared presentation to typed React components before integrating a CMS or expanding the data model.

## Before public launch

Confirm tenant records, visitor details and media rights with the mall owner. Download approved images into the project and inspect their crops and alternative text. Verify all intended links, review accessibility with keyboard and screen reader, and inspect the design on real devices. The automated browser checks do not establish complete WCAG conformance or verify image licensing.

This is an independent concept, not an official mall or city website. It remains noindex for pitching. No hosting service has been purchased or production domain configured.

## Hosting on GitHub Pages

The workflow publishes the static website after TypeScript, build and desktop/mobile browser checks pass. The repository's GitHub Pages source must be set to **GitHub Actions** in Settings → Pages. Once enabled, future pushes to main publish automatically; workflow_dispatch is available for manual publication.

The workflow uses `NEXT_PUBLIC_BASE_PATH=/aventura-mall`, which adjusts Next.js assets, the favicon and the test preview to the repository's Pages path. Local development keeps the root path by default. To test a Pages path locally, set the same environment variable when building, serving and running the browser checks.

The compiled static export is hosted without a database, server process or paid hosting account. No custom domain is configured.
