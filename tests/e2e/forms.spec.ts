import { test, expect } from '@playwright/test';

test.describe('Formulaires', () => {
  test('Contact — validation client bloque un envoi vide', async ({ page }) => {
    await page.goto('/contact');

    const submit = page.getByRole('button', { name: /Envoyer le message/i });
    await expect(submit).toBeVisible();
    // Submit sans remplir : bouton disabled tant que form invalid
    await expect(submit).toBeDisabled();
  });

  test('Contact — un formulaire valide active le bouton', async ({ page }) => {
    await page.goto('/contact');

    // Mode 'onBlur' sur RHF : chaque champ doit perdre le focus pour être validé
    const name = page.getByLabel(/Votre nom/i);
    await name.fill('Adams Chamsy');
    await name.blur();

    const email = page.getByLabel(/^Courriel$/i);
    await email.fill('test@example.com');
    await email.blur();

    const message = page.getByLabel(/Votre message/i);
    await message.fill(
      'Ceci est un message de test, suffisamment long pour passer la validation Zod.'
    );
    await message.blur();

    const consent = page.getByRole('checkbox');
    await consent.check();
    await consent.blur();

    // Force la revalidation RHF en tabulant une fois de plus
    await page.keyboard.press('Tab');

    const submit = page.getByRole('button', { name: /Envoyer le message/i });
    await expect(submit).toBeEnabled({ timeout: 8_000 });
  });

  test('FAQ — une question s\u2019ouvre et affiche la réponse', async ({ page }) => {
    await page.goto('/faq');

    await expect(
      page.getByRole('heading', { name: /Vos questions, nos réponses/i, level: 1 })
    ).toBeVisible();

    // Première question : click → réponse visible
    const firstQuestion = page
      .getByRole('group')
      .first()
      .or(page.locator('details').first());
    await page.locator('details').first().locator('summary').click();
    const answer = page.locator('details[open] p').first();
    await expect(answer).toBeVisible();
  });
});
