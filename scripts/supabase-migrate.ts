/**
 * Exécute le schéma SQL initial directement sur la DB Postgres Supabase.
 * Lit `supabase/migrations/001_initial_schema.sql` et l'envoie en une passe.
 *
 * Pré-requis env :
 *   NEXT_PUBLIC_SUPABASE_URL    (pour dériver le host)
 *   SUPABASE_DB_PASSWORD        (mot de passe DB — à retirer après setup)
 *
 * Tente la connexion directe, fallback sur les poolers régionaux.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import postgres from 'postgres';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl || !dbPassword) {
  console.error(
    '✗ Variables manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_DB_PASSWORD.'
  );
  process.exit(1);
}

const projectRef = new URL(supabaseUrl).hostname.split('.')[0]!;

// Ordre : direct (IPv6), puis pooler transaction mode par région
const POOLER_REGIONS = [
  'eu-west-3',
  'eu-west-1',
  'eu-central-1',
  'eu-west-2',
  'us-east-1',
];

const connectionTargets = [
  {
    label: 'direct',
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    user: 'postgres',
  },
  ...POOLER_REGIONS.map((region) => ({
    label: `pooler:${region}`,
    host: `aws-0-${region}.pooler.supabase.com`,
    port: 6543,
    user: `postgres.${projectRef}`,
  })),
];

async function runMigration() {
  const sqlPath = path.join(
    process.cwd(),
    'supabase/migrations/001_initial_schema.sql'
  );
  const sqlContent = await fs.readFile(sqlPath, 'utf-8');
  console.log(`→ Migration : ${sqlPath} (${sqlContent.length} chars)\n`);

  let lastError: unknown = null;
  for (const target of connectionTargets) {
    console.log(`→ Tentative ${target.label} (${target.host}:${target.port})`);
    const sql = postgres({
      host: target.host,
      port: target.port,
      user: target.user,
      password: dbPassword!,
      database: 'postgres',
      ssl: 'require',
      connect_timeout: 10,
      max: 1,
      prepare: false,
    });

    try {
      // Test rapide : ping
      await sql`select 1 as ping`;
      console.log(`  ✓ Connexion OK`);

      // Exécute tout le fichier SQL en une seule commande
      await sql.unsafe(sqlContent);
      console.log(`  ✓ Migration appliquée\n`);

      await sql.end();
      return;
    } catch (err) {
      console.log(`  ✗ ${(err as Error).message}`);
      lastError = err;
      await sql.end().catch(() => {});
    }
  }

  console.error('\n✗ Impossible de se connecter via aucun endpoint.');
  console.error('  Dernière erreur :', lastError);
  process.exit(1);
}

runMigration().catch((err) => {
  console.error('✗ Migration échouée :', err);
  process.exit(1);
});
