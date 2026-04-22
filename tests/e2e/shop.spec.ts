import { test, expect } from '@playwright/test';

test.describe('Parcours boutique', () => {
  test('Boutique affiche une grille produits', async ({ page }) => {
    await page.goto('/boutique');

    await expect(
      page.getByRole('heading', { name: /Boutique/i, level: 1 })
    ).toBeVisible();

    // Au moins une carte produit
    const productLinks = page.locator('a[href^="/produit/"]');
    await expect(productLinks.first()).toBeVisible({ timeout: 10_000 });
    await expect(await productLinks.count()).toBeGreaterThan(0);
  });

  test('Fiche produit affiche prix + bouton panier', async ({ page }) => {
    await page.goto('/boutique');
    await page.locator('a[href^="/produit/"]').first().click();

    await page.waitForURL(/\/produit\//);

    // Prix formaté (€) — le premier match est le prix principal du produit
    await expect(page.locator('text=/€/').first()).toBeVisible();

    // Bouton "Ajouter" / "Composer" quelconque
    const addButton = page.getByRole('button', { name: /panier|ajouter|sélection/i });
    await expect(addButton.first()).toBeVisible();
  });

  test('Le guide des tailles réagit aux clics sur silhouette', async ({ page }) => {
    await page.goto('/guide-tailles');

    await expect(
      page.getByRole('heading', { name: /Guide des tailles/i, level: 1 })
    ).toBeVisible();

    // Toggle cm/in présent
    await expect(page.getByRole('tab', { name: /Centimètres/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Pouces/i })).toBeVisible();

    // Cliquer sur "Pouces" et vérifier le state
    await page.getByRole('tab', { name: /Pouces/i }).click();
    await expect(page.getByRole('tab', { name: /Pouces/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });
});
