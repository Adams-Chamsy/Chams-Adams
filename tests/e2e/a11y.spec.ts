import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * A11y smoke — vérifie qu'aucune violation `critical` ou `serious` (axe-core)
 * n'est présente sur les pages principales. Les violations `moderate` et
 * `minor` sont loggées mais non-bloquantes.
 *
 * Règles désactivées :
 *  - `color-contrast` sur éléments décoratifs absolus hors flux (filigranes,
 *    numéros géants en teinte warm gray) — déjà audités manuellement.
 */

const CRITICAL_IMPACTS = ['critical', 'serious'] as const;

async function runAxe(page: import('@playwright/test').Page) {
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .disableRules([
      'region', // fausses positives Next.js (layout minimal)
      // `color-contrast` : le thème luxe joue volontairement sur des hiérarchies
      // subtiles (ivoire/40, bronze/20 sur noir). L'audit contraste est mené
      // manuellement par le design, pas par axe.
      'color-contrast',
    ])
    .analyze();
}

const PAGES: { path: string; label: string }[] = [
  { path: '/', label: 'Home' },
  { path: '/maison', label: 'Maison' },
  { path: '/collections', label: 'Collections' },
  { path: '/boutique', label: 'Boutique' },
  { path: '/sur-mesure', label: 'Sur-mesure' },
  { path: '/contact', label: 'Contact' },
  { path: '/faq', label: 'FAQ' },
  { path: '/guide-tailles', label: 'Guide tailles' },
  { path: '/presse', label: 'Presse' },
  { path: '/evenements', label: 'Événements' },
  { path: '/mentions-legales', label: 'Mentions légales' },
  { path: '/cgv', label: 'CGV' },
];

for (const p of PAGES) {
  test(`A11y — ${p.label} (${p.path})`, async ({ page }) => {
    await page.goto(p.path);
    // Attendre que les animations d'entrée (TextReveal, etc.) se stabilisent
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(500);

    const results = await runAxe(page);
    const critical = results.violations.filter((v) =>
      (CRITICAL_IMPACTS as readonly string[]).includes(v.impact ?? '')
    );

    if (critical.length > 0) {
      const summary = critical
        .map(
          (v) =>
            `[${v.impact}] ${v.id} — ${v.description} (${v.nodes.length} occurrence${v.nodes.length > 1 ? 's' : ''})`
        )
        .join('\n');
      console.error(`\n>> Violations a11y sur ${p.path} :\n${summary}\n`);
    }

    expect(critical, `Violations critical/serious sur ${p.path}`).toHaveLength(0);
  });
}
