/**
 * Vérification serveur d'un jeton Cloudflare Turnstile.
 *
 * - Si `TURNSTILE_SECRET_KEY` n'est pas configuré (dev local), on retourne
 *   `true` : les formulaires fonctionnent sans captcha.
 * - En production avec la clé définie, le jeton est obligatoire et validé
 *   auprès de Cloudflare.
 */
export async function verifyTurnstile(
  token: string | undefined | null
): Promise<{ success: boolean; skipped: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { success: true, skipped: true };
  if (!token) return { success: false, skipped: false };

  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret,
          response: token,
        }).toString(),
      }
    );
    const data = (await res.json()) as { success?: boolean };
    return { success: Boolean(data.success), skipped: false };
  } catch {
    return { success: false, skipped: false };
  }
}
