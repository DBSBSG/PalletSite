# Pallet Site

Site for Pallet Idea.

The site skeleton uses the same Node.js, pnpm, TypeScript, ESLint, Prettier, and Playwright toolchain as TownSeeker.

## Getting started

Use Node.js 22.18 or later and pnpm 10.33.0.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm build
pnpm start
```

The local site runs at http://127.0.0.1:4173.

## Checks

```sh
pnpm lint
pnpm format:check
pnpm test
```

Playwright builds and starts the local site automatically. Set `BASE_URL` to run the smoke test against an already running site. Use `pnpm test:e2e:ui` for the Playwright UI.

## Layout

- `src/index.html` is the placeholder homepage.
- `src/ts/` is for TypeScript source. The build writes JavaScript to `src/js/`.
- `src/css/` and `src/assets/` hold styles and site assets.
- `tests/` holds Playwright tests.
- `.github/workflows/` runs checks for pushes and pull requests targeting `main` or `stage`.

## Hostinger deployment targets

After CI passes, GitHub Actions runs `pnpm build:hosting` and publishes the resulting `dist/` directory to the Hostinger site for that branch. Set the repository Actions variable `HOSTINGER_USERNAME` and secret `HOSTINGER_API_TOKEN` to enable deployment. Run the CI workflow manually for each branch to deploy without another commit.

| Branch  | Environment | URL                                                  |
| ------- | ----------- | ---------------------------------------------------- |
| `main`  | Production  | https://mobile-seashell-zebra-35.hostingersite.com/  |
| `stage` | Staging     | https://heroic-seagreen-jaguar-29.hostingersite.com/ |
