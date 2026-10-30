import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
const read = (path) => readFileSync(path, 'utf8');
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((f) =>
    f.isDirectory() ? files(join(dir, f.name)) : [join(dir, f.name)],
  );
}
const publicEmail = JSON.parse(read('src/data/public-contact.json')).partyEmail;
const pages = files('dist').filter(
  (f) => f.endsWith('.html') && !f.includes('/google'),
);
test('all 47 original resource titles and exact URLs survive migration', () => {
  const original = JSON.parse(read('tests/fixtures/legacy-resources.json'));
  const resources = JSON.parse(read('src/data/resources.json'));
  assert.equal(original.length, 47);
  for (const entry of original)
    assert.ok(
      resources.some((r) => JSON.stringify(r) === JSON.stringify(entry)),
      entry.url,
    );
  const library = read('dist/notes/index.html').replaceAll('&amp;', '&');
  for (const { url, title } of original) {
    assert.ok(library.includes(url), url);
    assert.ok(library.includes(title), title);
  }
});
test('all internal links and assets resolve in the static output', () => {
  const broken = [];
  for (const f of pages)
    for (const m of read(f).matchAll(/(?:href|src)="([^"#]+)"/g)) {
      const url = m[1];
      if (!url.startsWith('/') || url.startsWith('//')) continue;
      const path = decodeURIComponent(url.split(/[?#]/)[0]);
      if (
        !(
          existsSync('dist' + path) || existsSync('dist' + path + '/index.html')
        )
      )
        broken.push(`${f}: ${url}`);
    }
  assert.deepEqual(broken, []);
});
test('published pages have canonical URLs, language, description and no demo content', () => {
  for (const f of pages) {
    const html = read(f);
    assert.doesNotMatch(
      html.replaceAll(`mailto:${publicEmail}`, 'public-party-contact'),
      /lorem ipsum|Demo Post|Demo Item|astrofy-template/i,
      f,
    );
    assert.match(html, /<html[^>]+lang="(?:en|de)"/, f);
    assert.match(html, /<link[^>]+rel="canonical"/, f);
    if (!html.includes('http-equiv="refresh"'))
      assert.match(html, /<meta[^>]+name="description"/, f);
  }
  assert.match(
    read('dist/robots.txt'),
    /https:\/\/saxermi.github.io\/sitemap-index.xml/,
  );
  assert.ok(existsSync('dist/sitemap-index.xml'));
});
test('CV, publication, projects and original German article are available', () => {
  assert.ok(statSync('dist/cv/michael-saxer-cv.pdf').size > 10000);
  const cv = read('dist/cv/index.html');
  for (const term of [
    '06/2025',
    '06/2029',
    'In progress',
    '0009-0005-7907-8170',
    '10.1109/SDS66131.2025.00029',
    'Since 2026',
  ])
    assert.ok(cv.includes(term), term);
  assert.match(
    read('dist/writing/das-bildungssystem-neu-denken/index.html'),
    /2023-11-23/,
  );
  for (const slug of [
    'cms-vertex-reconstruction',
    'biomedical-rag',
    'speech-encoders',
    'charged-particle-modeling',
  ])
    assert.ok(existsSync(`dist/projects/${slug}/index.html`));
  assert.doesNotMatch(read('dist/index.html'), /President|Präsident|FDP/);
  assert.doesNotMatch(read('dist/notes/index.html'), /My summaries/);
});

test('public output contains no private contact links or email addresses', () => {
  for (const f of pages) {
    const html = read(f);
    assert.doesNotMatch(
      html.replaceAll(`mailto:${publicEmail}`, 'public-party-contact'),
      /mailto:|tel:|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
      f,
    );
  }
  const cvSource = read('docs/cv-public.tex');
  assert.doesNotMatch(
    cvSource,
    /mailto:|tel:|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  );
});
