import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
//import remarkMath from 'remark-math';
//import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
site: 'https://saxermi.github.io/',
 base: '/saxermi.github.io',
  markdown: {
    	shikiConfig: {
			theme: "dracula",
			wrap: false,
		}
  },
    integrations: [mdx({//remarkPlugins: [remarkMath], // relevant
			//rehypePlugins: [rehypeKatex] // relevant
			}), sitemap(), tailwind()],
});

