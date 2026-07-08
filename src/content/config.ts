import { defineCollection, z } from 'astro:content';

const gallery = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
        cover: z.string().optional(),
        photos: z.array(z.string()).default([]),
    }),
});

const openSource = defineCollection({
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

export const collections = { gallery, "open-source": openSource, topics };
