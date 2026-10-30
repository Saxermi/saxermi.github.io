import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  copyFileSync,
  readFileSync,
  rmSync,
  existsSync,
  cpSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

// Validate future content in a disposable copy, keeping the real content store untouched.
const workspace = mkdtempSync(join(tmpdir(), 'saxermi-notes-test-'));
try {
  for (const directory of ['src', 'public'])
    cpSync(directory, join(workspace, directory), { recursive: true });
  for (const file of [
    'package.json',
    'astro.config.mjs',
    'tailwind.config.cjs',
    'tsconfig.json',
  ])
    copyFileSync(file, join(workspace, file));
  symlinkSync(resolve('node_modules'), join(workspace, 'node_modules'), 'dir');
  const put = (path, text) => writeFileSync(join(workspace, path), text);
  mkdirSync(join(workspace, 'public/notes'), { recursive: true });
  copyFileSync(
    'public/cv/michael-saxer-cv.pdf',
    join(workspace, 'public/notes/integration-fixture.pdf'),
  );
  put(
    'src/content/notes/integration-fixture.md',
    `---\ntitle: Integration fixture\ndescription: Temporary validation only\nslug: integration-fixture\ntags: [integration]\npdf: /notes/integration-fixture.pdf\n---\n\nInline math $x^2$ and display math:\n\n$$\n\\int_0^1 x \\, dx = \\frac{1}{2}\n$$\n`,
  );
  put(
    'src/content/notes/integration-mdx.mdx',
    `---\ntitle: MDX integration fixture\ndescription: Temporary validation only\nslug: integration-mdx\ntags: [integration]\n---\n\n# MDX content\n\nInline math $E=mc^2$.\n`,
  );
  put(
    'src/content/notes/integration-draft.md',
    `---\ntitle: Unpublished integration draft\ndescription: Must never appear\nslug: integration-draft\ndraft: true\n---\nNot published.\n`,
  );
  const run = spawnSync('npm', ['run', 'build'], {
    cwd: workspace,
    encoding: 'utf8',
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });
  if (run.status !== 0) throw new Error(run.stdout + '\n' + run.stderr);
  const output = join(workspace, 'dist');
  const md = readFileSync(
    join(output, 'notes/integration-fixture/index.html'),
    'utf8',
  );
  const mdx = readFileSync(
    join(output, 'notes/integration-mdx/index.html'),
    'utf8',
  );
  assert.match(md, /class="katex"/);
  assert.match(md, /katex-display/);
  assert.match(mdx, /class="katex"/);
  assert.match(md, /<iframe[^>]+title="PDF: Integration fixture"/);
  assert.match(md, /download/);
  assert.ok(existsSync(join(output, 'notes/integration-fixture.pdf')));
  assert.match(
    readFileSync(join(output, 'notes/index.html'), 'utf8'),
    /My summaries/,
  );
  assert.ok(!existsSync(join(output, 'notes/integration-draft/index.html')));
  console.log(
    'PASS: Markdown, MDX, inline/display KaTeX, PDF viewer/download, summaries listing and draft exclusion.',
  );
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
