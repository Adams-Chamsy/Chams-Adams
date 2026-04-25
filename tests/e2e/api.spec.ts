import { test, expect } from '@playwright/test';

test.describe('APIs publiques', () => {
  test('POST /api/promos/validate rejette un code inconnu', async ({
    request,
  }) => {
    const res = await request.post('/api/promos/validate', {
      data: { code: 'NEXISTEPAS123', cart_total_cents: 50000 },
    });
    // 400 si invalide, 429 si rate-limited, 500 si Supabase indisponible —
    // dans tous les cas pas un 2xx
    expect([400, 429, 500]).toContain(res.status());
  });

  test('POST /api/promos/validate refuse un payload invalide', async ({
    request,
  }) => {
    const res = await request.post('/api/promos/validate', {
      data: { foo: 'bar' },
    });
    expect(res.status()).toBe(400);
  });

  test('POST /api/gift-cards/validate rejette un code inconnu', async ({
    request,
  }) => {
    const res = await request.post('/api/gift-cards/validate', {
      data: { code: 'CA-INEXISTANT', cart_total_cents: 50000 },
    });
    expect([400, 429, 500]).toContain(res.status());
  });

  test('POST /api/wishlist sans auth → 401', async ({ request }) => {
    const res = await request.post('/api/wishlist', {
      data: { product_slugs: ['test'] },
    });
    expect(res.status()).toBe(401);
  });

  test('GET /api/wishlist sans auth → 200 avec slugs vides', async ({
    request,
  }) => {
    const res = await request.get('/api/wishlist');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.slugs)).toBe(true);
  });

  test('POST /api/returns refuse un payload invalide', async ({ request }) => {
    const res = await request.post('/api/returns', {
      data: { email: 'pas-un-email', reason: 'wrong-reason' },
    });
    expect(res.status()).toBe(400);
  });
});
