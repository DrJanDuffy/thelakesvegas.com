# Security

## Reporting a vulnerability

If you believe you have found a security issue in this repository or the live site, please **do not** open a public GitHub issue.

Instead, contact the repository maintainers privately with:

- A short description of the issue and its impact
- Steps to reproduce (if safe to share)
- Any relevant URLs or request/response samples (redact secrets)

We will acknowledge receipt and work with you on a coordinated fix and disclosure timeline where appropriate.

## Secrets and configuration

- Never commit `.env`, `.env.local`, API keys, or Vercel tokens.
- Rotate credentials if they are ever exposed in a commit or log.
- Production and preview secrets belong in the Vercel project **Environment Variables** dashboard.

## Dependency updates

Automated dependency update PRs may be opened by [Dependabot](.github/dependabot.yml). Review changelogs before merging, especially for `next`, `react`, and auth-related packages.
