import { test, expect } from '@playwright/test';

test('navigation, responsive layout and profile links', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const path of [
    '/',
    '/projects/',
    '/notes/',
    '/about/',
    '/cv/',
    '/writing/',
    '/politics/',
  ]) {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'ORCID' })).toHaveAttribute(
    'href',
    'https://orcid.org/0009-0005-7907-8170',
  );
  await expect(
    page.getByRole('link', { name: 'Google Scholar' }),
  ).toHaveAttribute('href', /uYN1tVUAAAAJ/);
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Projects', exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await page.locator('.project-row').first().click();
  await expect(page.locator('.prose')).toBeVisible();
  expect(errors).toEqual([]);
});

test('resource search, combined filters and empty state', async ({ page }) => {
  await page.goto('/notes/');
  const rows = page.locator('[data-resource]:visible');
  await expect(rows).toHaveCount(47);
  await page.getByLabel('Search resources').fill('statquest');
  await expect(rows).toHaveCount(6);
  await page.getByLabel('Subject', { exact: true }).selectOption('Statistics');
  await expect(rows).toHaveCount(1);
  await page.getByLabel('Format', { exact: true }).selectOption('Playlist');
  await expect(rows).toHaveCount(0);
  await expect(
    page.getByText('No resources match your search.', { exact: false }),
  ).toBeVisible();
  await page.getByLabel('Search resources').fill('');
  await page.getByLabel('Subject', { exact: true }).selectOption('');
  await page.getByLabel('Format', { exact: true }).selectOption('');
  await expect(rows).toHaveCount(47);
  await expect(page.getByRole('status')).toHaveText('47 of 47 resources');
});

test('theme follows system then persists an explicit choice', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  expect(
    await page
      .locator('body')
      .evaluate((e) => getComputedStyle(e).backgroundColor),
  ).toBe('rgb(24, 26, 26)');
  await page.getByRole('button', { name: 'Switch colour theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page
      .locator('html')
      .evaluate((e) => getComputedStyle(e).scrollBehavior),
  ).toBe('auto');
});

test('legacy routes redirect to migrated content', async ({ page }) => {
  for (const [from, to] of [
    ['/summaries/', '/notes/'],
    ['/blog/post1/', '/writing/das-bildungssystem-neu-denken/'],
    ['/project/project3/', '/projects/cms-vertex-reconstruction/'],
  ]) {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(to + '$'));
  }
});

test('library remains readable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL + '/notes/');
  await expect(page.locator('[data-resource]')).toHaveCount(47);
  await expect(page.locator('noscript p')).toBeVisible();
  await context.close();
});

test('core pages meet automated WCAG 2.2 AA checks', async ({ page }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  for (const path of [
    '/',
    '/notes/',
    '/cv/',
    '/politics/',
    '/writing/das-bildungssystem-neu-denken/',
  ]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations, path).toEqual([]);
  }
});
