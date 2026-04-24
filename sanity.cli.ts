import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  },
  studioHost: 'chams-adams',
  /** Dossier racine du Studio embarqué — sert aussi pour `sanity deploy`. */
  autoUpdates: true,
});
