# Redesign validation

Sources of factual content: supplied CV, the three substantive original project descriptions and the original German blog article. The fixture `tests/fixtures/legacy-resources.json` was extracted from the original `summaries.astro` before replacement. It contains 47 exact original URLs and titles across six categories.

Removed public content: Lorem ipsum posts, duplicate demo projects, demonstration store entries and the placeholder political page. Original source remains in repository history. Old substantive article/project routes are static redirects.

No remote Scholar/ORCID API, YouTube metadata scraping, embeds or external tracking fonts are used. Remote link availability was not exhaustively verified. CERN Indico talks may require an account. Publication metadata and the public ORCID link come directly from the supplied CV. The master's period 2026–2029 is identified as in progress/expected completion.

The download PDF was compiled from the public LaTeX CV, with private contact details removed using a wrapper for the Unicode micro symbol. Website builds use the committed PDF; no TeX package installation is needed in CI.

Run `npm ci`, `npm run check`, `npm run build`, `npm test`, and `npm run test:browser` to reproduce validation. Browser screenshots and authored-note fixture checks are recorded in the task report; test-only fixtures must not be published as actual notes.

Validated in this instance:

- Frozen npm installation and Astro 5 production build (25 generated HTML pages).
- Astro/TypeScript: zero errors, warnings or hints in diagnostics. Empty future collections produce informational build warnings.
- Five static tests: resource migration, generated links/assets, metadata/demo removal, CV/article/project content and private-contact exclusion.
- Twelve Chromium tests across desktop and mobile, including automated WCAG 2.2 AA checks on representative pages.
- Additional overflow checks at 320, 768, 1024 and 1920px; light/dark and homepage/CV screenshots visually inspected.
- Temporary-note integration: Markdown, MDX, inline/display KaTeX, PDF viewer/download, listing and draft exclusion.
- Public two-page CV text checked for absence of email addresses; source scan permits only the existing public FDP contact. Existing public images contain no GPS EXIF field.
- Prettier formatting check.

GitHub Actions deployment is configured but has not been run remotely or published by this task. External resource availability was not exhaustively checked. Automated accessibility results do not replace a complete manual audit.
