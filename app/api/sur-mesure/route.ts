import { NextRequest, NextResponse } from 'next/server';
import { surMesureSchema } from '@/lib/schemas/surMesure';
import { sendSurMesureEmails } from '@/lib/emails/sendSurMesureEmails';
import { verifyTurnstile } from '@/lib/captcha/verifyTurnstile';

/**
 * POST /api/sur-mesure
 *
 * Validation serveur (re-valide avec le même schéma Zod que le client).
 * Rate limit : 5 demandes / IP / heure — simple Map en mémoire (suffit en
 * local et en single-instance Vercel). Pour prod multi-instances : remplacer
 * par Upstash Redis / Vercel KV.
 *
 * Pas de captcha (hCaptcha/Turnstile) — à ajouter avant la vraie mise en
 * ligne pour protéger du spam bot. Documenté dans les points d'attention.
 */

type RateEntry = { count: number; resetAt: number };
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 heure
const rateStore = new Map<string, RateEntry>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAt?: number } {
  const now = Date.now();
  const existing = rateStore.get(ip);
  if (!existing || existing.resetAt < now) {
    rateStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }
  if (existing.count >= RATE_LIMIT) {
    return { allowed: false, retryAt: existing.resetAt };
  }
  existing.count += 1;
  return { allowed: true };
}

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error:
          'Trop de demandes en peu de temps. Merci de réessayer dans l’heure.',
      },
      { status: 429 }
    );
  }

  // Parse + validate
  let body: (Record<string, unknown> & { captchaToken?: string }) | null = null;
  try {
    body = (await req.json()) as Record<string, unknown> & {
      captchaToken?: string;
    };
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 });
  }

  const captcha = await verifyTurnstile(body?.captchaToken);
  if (!captcha.success) {
    return NextResponse.json(
      { error: 'Validation anti-spam échouée. Merci de réessayer.' },
      { status: 400 }
    );
  }

  const { captchaToken: _ignored, ...rest } = body ?? {};
  const parsed = surMesureSchema.safeParse(rest);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: firstIssue?.message ?? 'Données invalides.',
        issues: parsed.error.issues,
      },
      { status: 400 }
    );
  }

  const submittedAt = new Date().toISOString();

  // Envoi des 2 emails
  const results = await sendSurMesureEmails(parsed.data, submittedAt);

  // Log structuré (console pour l'instant ; à brancher sur un monitoring en prod)
  console.info('[sur-mesure] demande traitée', {
    ip,
    email: parsed.data.email,
    name: `${parsed.data.firstName} ${parsed.data.lastName}`,
    ack: results.acknowledgement,
    notif: results.notification,
  });

  // Même si les emails échouent partiellement, on renvoie success au client
  // (la demande est bien reçue côté serveur — on log l'erreur d'envoi)
  return NextResponse.json(
    {
      ok: true,
      emails: results,
    },
    { status: 200 }
  );
}
