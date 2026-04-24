/**
 * Seed Supabase — importe les données mock dans la DB.
 * Idempotent via IDs déterministes (sha1 namespacé).
 * Lancer : `npm run supabase:seed`
 */

import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import { FAQ } from '../lib/data/faq.mock';
import { EVENTS } from '../lib/data/events.mock';
import { PRESS } from '../lib/data/press.mock';
import { COLLECTIONS } from '../lib/data/collections.mock';
import { PRODUCTS } from '../lib/data/products.mock';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('✗ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function deterministicId(namespace: string, key: string): string {
  const hex = createHash('sha1').update(`${namespace}:${key}`).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

async function seedFaq() {
  console.log('→ FAQ');
  const rows = FAQ.map((item, index) => ({
    id: deterministicId('faq', item.id),
    category: item.category,
    question: item.question,
    answer: item.answer,
    sort_order: index,
    published: true,
  }));
  const { error } = await supabase.from('faq_items').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
  console.log(`  ✓ ${rows.length} questions`);
}

async function seedEvents() {
  console.log('→ Événements');
  const rows = EVENTS.map((e) => ({
    id: deterministicId('event', e.id),
    title: e.title,
    type: e.type,
    start_date: e.date,
    end_date: e.endDate ?? null,
    location: e.location,
    city: e.city,
    country: e.country,
    description: e.description,
    cta: e.cta ?? null,
    published: true,
  }));
  const { error } = await supabase.from('events').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
  console.log(`  ✓ ${rows.length} événements`);
}

async function seedPress() {
  console.log('→ Revue de presse');
  const rows = PRESS.map((p) => ({
    id: deterministicId('press', p.id),
    publication: p.publication,
    logo_text: p.logoText,
    published_at: p.date,
    title: p.title,
    excerpt: p.excerpt,
    article_url: p.articleUrl ?? null,
    featured: p.featured ?? false,
  }));
  const { error } = await supabase.from('press_entries').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
  console.log(`  ✓ ${rows.length} parutions`);
}

async function seedCollections() {
  console.log('→ Collections');
  const rows = COLLECTIONS.map((c, i) => ({
    id: deterministicId('collection', c.slug),
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    long_description: c.longDescription ?? null,
    hero_image_url: c.heroImage.url,
    hero_image_alt: c.heroImage.alt,
    sort_order: i,
  }));
  const { error } = await supabase.from('collections').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
  console.log(`  ✓ ${rows.length} collections`);
}

async function seedProducts() {
  console.log('→ Produits');
  for (const p of PRODUCTS) {
    const productId = deterministicId('product', p.slug);

    // 1. Upsert product
    const { error: pErr } = await supabase.from('products').upsert(
      {
        id: productId,
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle ?? null,
        description: p.description,
        long_description: p.longDescription ?? null,
        price_amount: Math.round(p.price.amount * 100), // units → cents
        price_currency: p.price.currency,
        category_slug: p.category,
        materials: p.materials,
        details: p.details ?? {},
        tags: p.tags ?? [],
        is_signature: p.isSignature ?? false,
        is_new: p.isNew ?? false,
        related_product_slugs: p.relatedProductIds ?? [],
        published: true,
        published_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    if (pErr) throw pErr;

    // 2. Clear old variants (cascade delete les images)
    await supabase.from('product_variants').delete().eq('product_id', productId);

    // 3. Insert variants + images
    for (let vIdx = 0; vIdx < p.variants.length; vIdx++) {
      const v = p.variants[vIdx]!;
      const { data: vRow, error: vErr } = await supabase
        .from('product_variants')
        .insert({
          product_id: productId,
          color: v.color,
          color_name: v.colorName,
          sizes: v.sizes,
          stock: v.stock ?? null,
          sort_order: vIdx,
        })
        .select('id')
        .single();
      if (vErr || !vRow) throw vErr ?? new Error('variant insert failed');

      if (v.images.length > 0) {
        const { error: iErr } = await supabase.from('product_variant_images').insert(
          v.images.map((img, i) => ({
            variant_id: vRow.id,
            url: img.url,
            alt: img.alt,
            type: img.type ?? 'flat',
            sort_order: i,
            is_primary: img.isPrimary ?? i === 0,
          }))
        );
        if (iErr) throw iErr;
      }
    }
    console.log(`  ✓ ${p.name}`);
  }
}

async function main() {
  console.log('\n→ Seed Supabase\n');
  await seedFaq();
  await seedEvents();
  await seedPress();
  await seedCollections();
  await seedProducts();
  console.log('\n✓ Seed terminé.\n');
}

main().catch((err) => {
  console.error('✗ Seed échoué :', err);
  process.exit(1);
});
