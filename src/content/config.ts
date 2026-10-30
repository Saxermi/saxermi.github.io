import { z, defineCollection } from 'astro:content';
const tags = z.array(z.string()).default([]);
const links = {
  repository: z.string().url().optional(),
  document: z.string().url().optional(),
  publication: z.string().url().optional(),
};
const project = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date().optional(),
    category: z.string(),
    period: z.string().optional(),
    methods: tags,
    tags,
    badge: z.string().optional(),
    ...links,
  }),
});
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lang: z.enum(['en', 'de']).default('en'),
    category: z.string().default('Writing'),
    tags,
    draft: z.boolean().default(false),
  }),
});
const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags,
    lang: z.enum(['en', 'de']).default('en'),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    pdf: z
      .string()
      .regex(/^\/notes\/.+\.pdf$/)
      .optional(),
    draft: z.boolean().default(false),
  }),
});
const politics = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags,
    lang: z.enum(['en', 'de']).default('de'),
    draft: z.boolean().default(false),
  }),
});
export const collections = { project, blog, notes, politics };
