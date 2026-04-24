/**
 * Setup admin Supabase :
 *   1. Crée un user auth avec l'email fourni (ou retrouve l'existant)
 *   2. L'ajoute à public.admin_users avec rôle "admin"
 *
 * Pré-requis : le schéma SQL (supabase/migrations/001_initial_schema.sql)
 * doit déjà avoir été exécuté dans le SQL editor du dashboard. Le script
 * supabase-js ne peut pas exécuter de DDL arbitraire — c'est l'unique étape
 * manuelle.
 *
 * Lancer : `npm run supabase:setup -- <email>`
 */

import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2];

if (!url || !serviceRoleKey) {
  console.error(
    '✗ Variables manquantes dans .env.local : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.'
  );
  process.exit(1);
}

if (!email || !email.includes('@')) {
  console.error('✗ Usage : npm run supabase:setup -- <email>');
  console.error('  Exemple : npm run supabase:setup -- moi@chams-adams.com');
  process.exit(1);
}

const adminEmail: string = email;

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Génère un mot de passe fort (24 chars base64url). */
function generatePassword() {
  return randomBytes(18).toString('base64url');
}

async function findUserByEmail(targetEmail: string) {
  // listUsers paginate par 50 — pour un seul user en tête de liste ça suffit
  const { data, error } = await supabase.auth.admin.listUsers({
    perPage: 200,
  });
  if (error) throw error;
  return data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
}

async function main() {
  console.log(`\n→ Setup admin pour : ${adminEmail}\n`);

  // 1. User auth
  let userId: string;
  let generatedPassword: string | null = null;

  const existing = await findUserByEmail(adminEmail);
  if (existing) {
    console.log(`  ℹ User déjà présent (id: ${existing.id}) — on conserve`);
    userId = existing.id;
  } else {
    generatedPassword = generatePassword();
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: generatedPassword,
      email_confirm: true,
    });
    if (error) {
      console.error(`  ✗ Création auth échouée : ${error.message}`);
      process.exit(1);
    }
    console.log(`  ✓ User auth créé (id: ${data.user.id})`);
    userId = data.user.id;
  }

  // 2. Admin_users
  const { error: upsertError } = await supabase
    .from('admin_users')
    .upsert({ id: userId, role: 'admin', email: adminEmail });
  if (upsertError) {
    console.error(`  ✗ Insertion admin_users échouée : ${upsertError.message}`);
    console.error('    → As-tu bien exécuté supabase/migrations/001_initial_schema.sql ?');
    process.exit(1);
  }
  console.log(`  ✓ Rôle admin accordé dans public.admin_users`);

  // Résumé
  console.log('\n─────────────────────────────────────────────────────────');
  console.log(' Setup terminé.');
  console.log('─────────────────────────────────────────────────────────');
  console.log(` Email : ${adminEmail}`);
  if (generatedPassword) {
    console.log(` Password : ${generatedPassword}`);
    console.log('   ↑ copie-le ET change-le après première connexion');
  } else {
    console.log(' Password : (inchangé — utilise celui déjà défini)');
  }
  console.log(` Connexion : http://localhost:3003/admin/login`);
  console.log('─────────────────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('\n✗ Erreur inattendue :', err);
  process.exit(1);
});
