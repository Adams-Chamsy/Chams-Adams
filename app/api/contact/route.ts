import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema, CONTACT_TOPIC_LABELS } from '@/lib/schemas/contact';

/**
 * POST /api/contact
 *
 * Validation serveur (même schéma Zod que le client). Rate limit simple
 * en mémoire (5 envois / IP / heure). Envoi email best-effort via Resend :
 * si RESEND_API_KEY est absent, on log et on répond OK — pratique en dev.
 */

type RateEntry = { count: number; resetAt: number };
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
const rateStore = new Map<string, RateEntry>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean } {
  const now = Date.now();
  const existing = rateStore.get(ip);
  if (!existing || existing.resetAt < now) {
    rateStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }
  if (existing.count >= RATE_LIMIT) return { allowed: false };
  existing.count += 1;
  return { allowed: true };
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip).allowed) {
    return NextResponse.json(
      {
        error:
          'Trop de messages en peu de temps. Merci de réessayer dans l’heure.',
      },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? 'Données invalides.' },
      { status: 400 }
    );
  }

  const { name, email, phone, topic, message } = parsed.data;
  const topicLabel = CONTACT_TOPIC_LABELS[topic];
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL ?? 'contact@chams-adams.com';

  if (apiKey && !apiKey.startsWith('re_...')) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: `Chams Adams <${contactEmail}>`,
        to: contactEmail,
        replyTo: email,
        subject: `[Contact] ${topicLabel} — ${name}`,
        text: [
          `Nom : ${name}`,
          `Email : ${email}`,
          phone ? `Téléphone : ${phone}` : null,
          `Sujet : ${topicLabel}`,
          '',
          'Message :',
          message,
        ]
          .filter(Boolean)
          .join('\n'),
      });
    } catch (err) {
      console.error('[contact] email send failed', err);
      // On ne remonte pas l'erreur au client : la demande est reçue côté serveur.
    }
  } else {
    console.info('[contact] (no email backend configured — message logged)', {
      name,
      email,
      topic: topicLabel,
    });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
