import { test, expect } from '@playwright/test';

test.describe('Home — Chams Adams', () => {
  test('charge correctement et affiche le hero', async ({ page }) => {
    await page.goto('/');

    // Title metadata
    await expect(page).toHaveTitle(/Chams Adams/i);

    // H1 visible (TextReveal fini)
    const heading = page.getByRole('heading', {
      name: /Le kaftan comme héritage/i,
      level: 1,
    });
    await expect(heading).toBeVisible({ timeout: 10_000 });

    // CTA principal
    const cta = page.getByRole('link', { name: /Entrer dans l'univers/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/collections');
  });

  test('la navigation du header fonctionne', async ({ page }) => {
    await page.goto('/');

    // Click Collections
    await page.getByRole('link', { name: /Collections/i }).first().click();
    await expect(page).toHaveURL(/\/collections/);
  });

  test('le Footer expose les liens légaux', async ({ page }) => {
    await page.goto('/');

    const mentionsLink = page.getByRole('link', { name: /Mentions légales/i });
    await expect(mentionsLink).toHaveAttribute('href', '/mentions-legales');

    const cgvLink = page.getByRole('link', { name: /^CGV$/i });
    await expect(cgvLink).toHaveAttribute('href', '/cgv');
  });
});
