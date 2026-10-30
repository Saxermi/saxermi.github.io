# Michael Saxer — personal website

A static, bilingual personal website for computational science, data science and physics. Built with Astro 5, TypeScript, Tailwind CSS and Astro Content Collections. Inter is self-hosted; there are no runtime requests to YouTube, Scholar or ORCID, analytics, database or backend.

## Development

Use the existing checkout in each isolated cloud task; a Git worktree is unnecessary unless explicitly requested.

Requires Node **22.12+** (Node 22 is used in CI) and npm. The only lockfile is `package-lock.json`.

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run dev
```

The telemetry variable avoids writing to a restricted home directory in the cloud environment. The server prints its local address. If a cloud execution sandbox blocks network/listening, use its supported command escalation. Keep the configured proxy and TLS validation enabled.

```sh
npm run check           # Astro and TypeScript diagnostics
npm run build           # Static output in dist/
npm test                # Migration, links, metadata and content checks; build first
npx playwright install chromium  # Only if no system Chromium is available
npm run test:browser    # Desktop/mobile browser tests; starts its own preview
npm run preview         # Serve the production output locally
```

No linter is configured. `npm run format:check` checks formatting; `npm run format` formats the source. `node_modules`, `.astro`, and `dist` are generated and ignored. Earlier versions committed these directories; they have been removed from the Git index to make clean installs reproducible.

## Architecture

- `src/layouts/BaseLayout.astro`: navigation, footer, SEO, self-hosted fonts and theme.
- `src/styles/global.css`: shared Swiss editorial design and responsive/print styles; Tailwind utilities remain available.
- `src/content/config.ts`: validated project, writing, note and political-article collections.
- `src/content/project/`: real technical projects; `slug` controls public URLs.
- `src/content/blog/`: writing in its original language.
- `src/content/notes/`: future authored Markdown/MDX notes. Empty by design.
- `src/content/politics/`: future political articles. Empty by design.
- `src/data/profile.ts`: biography, education, experience, activities, skills and presentations.
- `src/data/publications.ts`: local publication metadata and BibTeX.
- `src/data/resources.json`: 47 third-party educational resources with original titles and exact URLs.
- `public/`: static assets, CV PDF and future study PDFs.

English navigation is shared across the site. German articles and the Politics page use `lang="de"`; English pages use `lang="en"`. No duplicate machine translations or misleading `hreflang` alternates are generated. Light/dark initially follows the system; an explicit choice is saved locally. Content and navigation work without JavaScript; live resource filters and the theme button progressively enhance them.

## Add a project

Create `src/content/project/my-project.md` (or `.mdx`):

```yaml
---
title: A real project title
description: A brief factual summary.
slug: my-project
category: Scientific computing
methods: [Python, FEM]
tags: [numerical methods]
# Optional, only when verified:
# pubDate: 2026-10-30
# period: September 2026 – October 2026
# repository: https://github.com/owner/repository
# document: https://example.org/report.pdf
# publication: https://doi.org/verified-doi
---
```

Follow with the project description. Dates are optional; do not invent them. The homepage selection is intentionally curated in `src/pages/index.astro`. All projects appear under `/projects/`.

## Add writing or political content

For writing, add `src/content/blog/slug.md` or `.mdx` with `title`, `description`, `pubDate` (ISO date), `lang` (`en` or `de`), `category`, optional `tags`, and optional `updatedDate`. Use `draft: true` to keep unfinished entries out of all generated routes and lists.

For a political article, use the same fields in `src/content/politics/` (no `category` required). It will appear on `/politics/` with a detail page under `/politics/slug/`. Writing with `category: Politics` also appears on the Politics page. Keep biographical roles in `profile.ts` and the short German introduction on `politics.astro` consistent. Personal views are labelled separately from factual roles.

## Add a learning resource

Append an object to `src/data/resources.json`:

```json
{
  "title": "Exact resource title",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "category": "Linear Algebra",
  "type": "Video",
  "source": "Verified author or channel"
}
```

Supported types: `Video`, `Playlist`, `Channel`, `PDF`, `Notes`. Categories are derived from the data. For a new format, also add it to the format selector in `src/pages/notes/index.astro`. Search covers title, subject, author and type. No thumbnails, embeds or metadata API calls are made. Unknown authors are labelled YouTube. Preserve existing URLs; the migration fixture intentionally protects the original 47 entries. The migration test protects the original subset; when adding resources, update the browser test’s expected counts.

## Add an authored summary or PDF

No authored summaries have been supplied, so “My summaries” is hidden. Place an actual PDF at `public/notes/my-summary.pdf`, then create `src/content/notes/my-summary.md`:

```yaml
---
title: Your actual summary title
description: What this summary covers.
tags: [linear algebra]
lang: en
pdf: /notes/my-summary.pdf
# pubDate and updatedDate are optional verified ISO dates.
# draft: true
---
```

Follow with Markdown, or MDX if needed. Math uses `$...$` inline and `$$...$$` for display equations, rendered at build time with remark-math and rehype-katex. Published notes appear under “My summaries” separately from third-party resources, with a detail page, PDF viewer, open link and download link. Omit `pdf` for Markdown-only notes. Never publish invented notes or sample PDFs. Check that PDF paths exist with `npm test` after building.

## CV and publications

Update `src/data/profile.ts` from verified facts. The homepage/about copy and German Politics introduction are deliberately edited prose and should be reviewed when relevant facts change. The master’s is presented as **in progress**, not a completed qualification. The PSI work ends in June 2025.

`docs/cv-public.tex` contains a public copy of the supplied LaTeX CV with private contact details removed. `public/cv/michael-saxer-cv.pdf` was compiled from it and is served directly. To regenerate with TeX Live (geometry, enumitem, hyperref, titlesec, tabularx):

```sh
scripts/build-cv.sh
```

The script supplies Unicode µ handling in a temporary wrapper without altering the public source. The PDF has two pages. A minor line-overflow warning in the original work-experience text is retained rather than silently rewording the CV. After future CV edits, update both the approved source and structured website data, regenerate and inspect the PDF. TeX is **not required** for the website build or GitHub Actions because the PDF is committed.

Edit `src/data/publications.ts` for publications. Separate conference papers, theses, projects and talks. Provide DOI links and add PDFs only when verified and publicly available. The BibTeX entry transcribes the CV citation; no unverified pagination or external API is needed. Presentation links requiring a CERN account are labelled.

## Migration and legacy URLs

| Original                                   | New canonical route                       |
| ------------------------------------------ | ----------------------------------------- |
| `/summaries/`                              | `/notes/`                                 |
| `/project/`                                | `/projects/`                              |
| `/project/project1/`                       | `/projects/biomedical-rag/`               |
| `/project/project2/`                       | `/projects/speech-encoders/`              |
| `/project/project3/`                       | `/projects/cms-vertex-reconstruction/`    |
| `/blog/`                                   | `/writing/`                               |
| `/blog/post1/`                             | `/writing/das-bildungssystem-neu-denken/` |
| `/blog/tag/Bildung/`, `/blog/tag/Politik/` | `/writing/`                               |
| `/interests/`, `/services/`                | `/about/`                                 |

GitHub Pages does not support arbitrary server-side 301 rules. Static redirects therefore use a meta refresh, an absolute canonical URL, `noindex, follow` and a visible fallback link. Existing `/cv/` and `/politics/` remain. Demo store entries, duplicate projects and Lorem ipsum posts were removed; their old URLs return the custom 404 page. Their sources remain in Git history. Relevant original assets remain available; no generic demo image is used as a project figure.

Relevant curriculum, youth-work and organisation links from the old CV remain linked from About; the public FDP profile is linked from Politics. An association link does not assert a current membership.

The original German education article retains its 23 November 2023 date, original language and AI-generation disclosure. The two existing long project descriptions retain their own AI-assistance disclosures. The CMS project was updated from “ongoing” using the supplied CV. The fourth, FEM/PINN project comes from the CV, without an invented exact date.

## Deployment

GitHub repository **Settings → Pages → Source: GitHub Actions**. The workflow `.github/workflows/astro.yml` runs frozen dependency installation, Astro/TypeScript checks, production build, static link/migration tests and Chromium desktop/mobile tests. Pull requests validate without deploying. A push/merge to `main` or a manually triggered workflow on `main` uploads and deploys `dist/` using the official Pages actions.

The site URL is `https://saxermi.github.io`, with root-relative assets and trailing slashes. Sitemap, canonical URLs, robots.txt, Person structured data and a local social-preview image are generated without remote APIs. Review the redesign branch before merging; this task does not push or publish the site.

## Verification scope

Automated tests check exact preservation of the 47 original learning-resource links, local links/assets in generated output, CV/profile metadata, absence of demo content, legacy redirects, library search and combined filters, no-JavaScript access, themes, reduced motion and mobile overflow. The browser tests use system Chromium when available and the Playwright download otherwise.

External YouTube availability and account-restricted CERN pages cannot be guaranteed; preserving the exact original URLs does not establish their current remote availability. No scraping or new remote verification claims are made. See `docs/verification.md` for the implementation validation record.

## Privacy

The public site and downloadable CV intentionally omit personal phone numbers, postal addresses, personal location/contact blocks and email addresses. General contact is through public profile links; the Politics page may use the existing public FDP contact. `docs/cv-public.tex` is explicitly a redacted public copy; no unredacted CV source is retained in this working tree. Tests reject telephone links and all email addresses other than the explicitly allowlisted public FDP contact. Do not add private contact details when updating biography or CV files.

The contact link found in the pre-redesign source was verified to use a public FDP domain. It is retained only on the Politics page and allowlisted in `src/data/public-contact.json`. The private mailbox supplied in the CV is omitted everywhere in the working tree and generated output. Existing Git history was not rewritten.

`npm run test:notes` validates temporary Markdown/MDX notes, inline/display math, PDF viewing/downloading, listing and draft exclusion in a temporary output directory. Fixtures are built in a disposable copy of the source and assets, removed in a `finally` block, and never enter the real source tree, content cache or production build.
