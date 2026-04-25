import { test, expect } from '@playwright/test';

test.describe('Retours', () => {
  test('/retours/demande affiche le formulaire de retour', async ({ page }) => {
    await page.goto('/retours/demande');

    await expect(
      page.getByRole('heading', { name: /Initier un retour/i, level: 1 })
    ).toBeVisible();

    // Champs principaux (scope main pour éviter le footer newsletter)
    const main = page.locator('main');
    await expect(main.getByLabel(/N° de commande/i)).toBeVisible();
    await expect(main.getByLabel(/Adresse de courriel/i)).toBeVisible();
    await expect(main.getByLabel(/Motif/i)).toBeVisible();

    // CTA submit
    await expect(
      page.getByRole('button', { name: /Envoyer la demande/i })
    ).toBeVisible();
  });

  test('Conditions de retour affichées dans la sidebar', async ({ page }) => {
    await page.goto('/retours/demande');

    await expect(
      page.getByRole('heading', { name: /Conditions/i })
    ).toBeVisible();
    // Le texte "30 jours" apparaît plusieurs fois — first() suffit
    await expect(page.getByText(/30 jours/i).first()).toBeVisible();
  });
});
