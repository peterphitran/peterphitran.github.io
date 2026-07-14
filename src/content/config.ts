import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.string(),
        excerpt: z.string(),
    }),
});

const topics = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        status: z.string().default('Exploring'),
        updated: z.string().optional(),
        tags: z.array(z.string()).default([]),
    }),
});

export const collections = { blog, topics };
