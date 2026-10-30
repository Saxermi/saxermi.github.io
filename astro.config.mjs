import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
  site: 'https://saxermi.github.io',
  output: 'static',
  cacheDir: './.astro/cache',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: { theme: 'github-light' },
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/blog/') &&
        !page.includes('/project/') &&
        !page.endsWith('/summaries/') &&
        !page.endsWith('/404/'),
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
