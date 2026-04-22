import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright — smoke tests parcours utilisateur.
 *
 * Port 3004 pour ne pas rentrer en conflit avec le dev server habituel
 * (3000 par défaut, ou 3003 que l'équipe utilise parfois).
 *
 * `webServer.reuseExistingServer` = true en local : si un dev server tourne
 * déjà sur ce port, on s'y branche. En CI, toujours démarrer un serveur frais.
 */

const PORT = 3004;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './tests/e2e/.results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
