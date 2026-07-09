import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      slug: z.string().optional(),
      status: z.preprocess(emptyToUndefined, z.string().default("Publicado")),
      pubDate: z.coerce.date(),
      updatedDate: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
      heroImage: z.preprocess(
        emptyToUndefined,
        z.union([image(), z.string()]).optional(),
      ),
      coverAlt: z.string().optional(),
      author: z.string().optional(),
      tags: z.preprocess(
        (value) => (Array.isArray(value) ? value : []),
        z.array(z.string()).default([]),
      ),
    }),
});

export const collections = {
  blog,
};
