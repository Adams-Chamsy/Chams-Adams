/**
 * Seed Sanity — importe les données mock actuelles dans le projet.
 *
 * Idempotent : utilise `createOrReplace` avec des `_id` déterministes
 * basés sur les slugs/ids sources. Relancer le script écrase sans dupliquer.
 *
 * Lancer : `npm run sanity:seed`
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { createClient } from '@sanity/client';

import { COLLECTIONS } from '../lib/data/collections.mock';
import { EVENTS } from '../lib/data/events.mock';
import { PRESS } from '../lib/data/press.mock';
import { FAQ } from '../lib/data/faq.mock';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    'Variables manquantes : NEXT_PUBLIC_SANITY_PROJECT_ID et/ou SANITY_API_TOKEN.\n' +
      'Remplis .env.local puis relance.'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

async function uploadImage(
  relativePath: string,
  alt: string
): Promise<Record<string, unknown> | undefined> {
  try {
    const fullPath = path.join(process.cwd(), 'public', relativePath);
    const buffer = await fs.readFile(fullPath);
    const asset = await client.assets.upload('image', buffer, {
      filename: path.basename(relativePath),
    });
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
      alt,
    };
  } catch (err) {
    console.warn(`  ⚠ image skip (${relativePath}): ${(err as Error).message}`);
    return undefined;
  }
}

function toParagraphBlock(text: string): Record<string, unknown> {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).slice(2, 10),
        text,
        marks: [],
      },
    ],
  };
}

// --------------------------------------------------------------
// Seed functions
// --------------------------------------------------------------

async function seedCollections() {
  console.log('→ Collections');
  for (let i = 0; i < COLLECTIONS.length; i++) {
    const c = COLLECTIONS[i]!;
    const heroImage = await uploadImage(c.heroImage.url, c.heroImage.alt);
    await client.createOrReplace({
      _id: `collection-${c.slug}`,
      _type: 'collection',
      name: c.name,
      slug: { _type: 'slug', current: c.slug },
      tagline: c.tagline,
      description: c.description,
      longDescription: c.longDescription,
      order: i,
      ...(heroImage ? { heroImage } : {}),
    });
    console.log(`  ✓ ${c.name}`);
  }
}

async function seedArticles() {
  console.log('→ Articles Journal');
  const dir = path.join(process.cwd(), 'content/journal');
  const files = await fs.readdir(dir).catch(() => []);

  for (const f of files) {
    if (!f.endsWith('.mdx') && !f.endsWith('.md')) continue;
    const raw = await fs.readFile(path.join(dir, f), 'utf-8');
    const { data, content } = matter(raw);
    const slug = (data.slug ?? f.replace(/\.mdx?$/, '')) as string;

    const coverImage = data.coverImage
      ? await uploadImage(data.coverImage as string, data.title as string)
      : undefined;

    // Body : on split le MDX brut en paragraphes (pas d'interprétation
    // MDX — les composants custom seront à repasser via le Studio).
    const paragraphs = (content ?? '')
      .split(/\n{2,}/)
      .map((p: string) => p.trim())
      .filter((p: string) => p && !p.startsWith('<'))
      .slice(0, 40)
      .map(toParagraphBlock);

    await client.createOrReplace({
      _id: `article-${slug}`,
      _type: 'article',
      title: data.title as string,
      slug: { _type: 'slug', current: slug },
      category: data.category as string,
      excerpt: data.excerpt as string,
      publishedAt: data.date as string,
      readingTime: (data.readingTime as number) ?? 5,
      ...(coverImage ? { coverImage } : {}),
      body: paragraphs,
    });
    console.log(`  ✓ ${data.title}`);
  }
}

async function seedEvents() {
  console.log('→ Événements');
  for (const e of EVENTS) {
    await client.createOrReplace({
      _id: `event-${e.id}`,
      _type: 'event',
      title: e.title,
      type: e.type,
      startDate: e.date,
      ...(e.endDate ? { endDate: e.endDate } : {}),
      location: e.location,
      city: e.city,
      country: e.country,
      description: e.description,
      ...(e.cta ? { cta: e.cta } : {}),
    });
    console.log(`  ✓ ${e.title}`);
  }
}

async function seedPress() {
  console.log('→ Revue de presse');
  for (const p of PRESS) {
    await client.createOrReplace({
      _id: `press-${p.id}`,
      _type: 'pressEntry',
      publication: p.publication,
      logoText: p.logoText,
      publishedAt: p.date,
      title: p.title,
      excerpt: p.excerpt,
      ...(p.articleUrl ? { articleUrl: p.articleUrl } : {}),
      featured: p.featured ?? false,
    });
    console.log(`  ✓ ${p.publication}`);
  }
}

async function seedFaq() {
  console.log('→ FAQ');
  for (let i = 0; i < FAQ.length; i++) {
    const f = FAQ[i]!;
    await client.createOrReplace({
      _id: `faq-${f.id}`,
      _type: 'faqItem',
      category: f.category,
      question: f.question,
      answer: f.answer,
      order: i,
    });
  }
  console.log(`  ✓ ${FAQ.length} questions`);
}

// --------------------------------------------------------------
// Run
// --------------------------------------------------------------

async function main() {
  console.log(`\nSeed Sanity (project: ${projectId}, dataset: ${dataset})\n`);
  await seedCollections();
  await seedArticles();
  await seedEvents();
  await seedPress();
  await seedFaq();
  console.log('\n✓ Seed terminé.\n');
}

main().catch((err) => {
  console.error('\n✗ Seed échoué:', err);
  process.exit(1);
});
