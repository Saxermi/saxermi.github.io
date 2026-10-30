import { z } from 'astro:content';
import raw from './resources.json';
const resource = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  category: z.string().min(1),
  type: z.enum(['Video', 'Playlist', 'Channel', 'PDF', 'Notes']),
  source: z.string(),
});
export const resources = z.array(resource).parse(raw);
export const categories = [...new Set(resources.map((r) => r.category))];
