# Pallet Site repository policy

## Scope

These instructions apply to the entire Pallet Site repository (`DBSBSG/PalletSite`).

When a model selector is available, prefer GPT-6 Luna unless the developer requests a different model. If the app or session fixes the model, use the assigned model.

## File authorization

Treat the repository as read-only by default. Inspect files, configuration, tests, and Git history freely. Create, edit, delete, rename, or move tracked project files only when the developer explicitly authorizes the exact paths for the current task.

- Authorization for a source file does not extend to its tests, imports, callers, type definitions, documentation, or adjacent files.
- Broad requests such as “fix this feature,” directory names, and references supplied for context do not authorize individual paths.
- Keep diffs focused on the requested change. Leave unrelated cleanup, refactors, and fixes for separate work.
- If another file is necessary, finish what can be done within scope and identify the exact additional path and why it is needed.
- Keep dependency manifests and lockfiles, CI workflows, deployment scripts, environment files, compiler and tool configuration, and this policy under the same exact-path rule.

## Commands and generated output

Check what a command writes before running it. Scope formatting, lint fixes, dependency updates, scaffolding, and generators to the authorized files. Use frozen installation when only restoring dependencies.

The normal build and test commands may write their ignored outputs in `src/js/`, `dist/`, `test-results/`, and `playwright-report/`. Keep generated output and `node_modules/` out of commits. Never expose or commit Hostinger credentials or local environment values.

## Formatting and verification

Before every commit:

1. Confirm `pnpm exec prettier --version` reports the lockfile version, currently `3.9.10`. Use that exact version or report the blocker before committing.
2. Format the authorized changed paths that Prettier supports with `pnpm exec prettier --write <paths>`, then run `pnpm exec prettier --check <paths>`.
3. Run `pnpm format:check`. Formatting-only fixes with the pinned Prettier version are pre-authorized for files that this command reports. This exception excludes content edits and files outside the check. Keep writes targeted, since `pnpm format` scans the whole repository.
4. Use `git status --short` and `git diff --cached --name-only` to verify the staged files are in scope. Run `git diff --cached --check` before committing. Keep pre-existing user changes intact.

Run the checks relevant to the change. The site uses Node.js 22.18 or later and pnpm 10.33.0. CI runs `pnpm lint`, `pnpm format:check`, and `pnpm test`. Playwright starts the local site on port `4173` by default. Use `BASE_URL` to check an already running site. The Hostinger build runs `pnpm build:hosting` and publishes the static files from `dist/`.

## Git and deployment

- Use **Baja Blast <codepro1012@gmail.com>** as the author and committer for new commits. Verify the identity before committing.
- Work on `stage` by default. Promote to `main` through a pull request when the developer asks. Keep existing Git history intact unless the developer explicitly authorizes a rewrite.
- GitHub Actions deploys `stage` to staging and `main` to production after checks pass. The two Hostinger destinations are listed in `README.md`.
- Keep deployment limited to those two environments. Pull requests run checks. Preview deployments require an explicit request.

## Handoff

Report the paths changed, checks run and their outcomes, and any exact paths that still need authorization. Before handing off a pushed change, verify the destination branch and commit author.
