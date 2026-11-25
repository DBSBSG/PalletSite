# Pallet Site

A U.S. liquidation supplier directory for Amazon returns, overstock, and wholesale pallets.

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

- `src/index.html` is the marketplace homepage.
- `src/ts/features/suppliers.ts` contains the curated supplier directory.
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

## Supplier research

| Source                      | Public material                                                                                                                            | Buying model                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| Amazon Liquidation Auctions | [Official B2B storefront and eligibility](https://bstock.com/amazon/about/), [buyer FAQ](https://bstock.com/amazon/faq/)                   | Auctions for eligible U.S. resellers           |
| Via Trading                 | [Wholesale catalog](https://www.viatrading.com/products), [retailer programs](https://www.viatrading.com/retailers)                        | Direct purchase or offer, depending on the lot |
| Liquidation.com             | [Pallet inventory](https://www.liquidation.com/auction/search?size=LTL), [buying and fees](https://www.liquidation.com/c/buyer/index.html) | Auctions and eligible Buy Now listings         |
| Target Liquidation Auctions | [Target storefront](https://bstock.com/target/)                                                                                            | Retail liquidation auctions                    |
| Direct Liquidation          | [Wholesale marketplace](https://www.directliquidation.com/)                                                                                | Buying options vary by lot                     |

The directory links to seller storefronts so customers can check available lots and terms. Supplier ingestion needs a supported feed or publishing permission. A listing feed should retain source listing IDs and timestamps, distinguish bids from fixed prices, and remove expired or sold inventory. On-site transactions require a seller agreement covering inventory, payment, freight, and order fulfillment.
