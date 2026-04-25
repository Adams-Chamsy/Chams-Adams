import { test, expect } from '@playwright/test';

test.describe('Compte client', () => {
  test('/compte affiche l\u2019écran public si non authentifié', async ({ page }) => {
    await page.goto('/compte');

    // Heading principal
    await expect(
      page.getByRole('heading', { name: /Mon compte/i, level: 1 })
    ).toBeVisible();

    // Les CTAs login/inscription sont présents
    await expect(
      page.getByRole('link', { name: /Se connecter/i })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Créer un accès/i })
    ).toBeVisible();
  });

  test('/compte/connexion affiche le formulaire', async ({ page }) => {
    await page.goto('/compte/connexion');

    await expect(
      page.getByRole('heading', { name: /Se connecter/i, level: 1 })
    ).toBeVisible();
    await expect(
      page.locator('main').getByLabel(/Adresse de courriel/i)
    ).toBeVisible();
    await expect(page.getByLabel(/Mot de passe/i)).toBeVisible();
  });

  test('/compte/inscription affiche le formulaire', async ({ page }) => {
    await page.goto('/compte/inscription');

    await expect(
      page.getByRole('heading', { name: /Créer un accès/i, level: 1 })
    ).toBeVisible();
    await expect(page.getByLabel(/Mot de passe/i)).toBeVisible();
  });

  test('/compte/commandes redirige vers /compte/connexion si non auth', async ({
    page,
  }) => {
    await page.goto('/compte/commandes');
    await expect(page).toHaveURL(/\/compte\/connexion/);
  });

  test('/compte/fidelite redirige vers /compte/connexion si non auth', async ({
    page,
  }) => {
    await page.goto('/compte/fidelite');
    await expect(page).toHaveURL(/\/compte\/connexion/);
  });

  test('/compte/retours redirige vers /compte/connexion si non auth', async ({
    page,
  }) => {
    await page.goto('/compte/retours');
    await expect(page).toHaveURL(/\/compte\/connexion/);
  });
});
