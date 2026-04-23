import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema, CONTACT_TOPIC_LABELS } from '@/lib/schemas/contact';
import { verifyTurnstile } from '@/lib/captcha/verifyTurnstile';
import { rateLimitHourly } from '@/lib/rate-limit';

/**
 * POST /api/contact
 *
 * Validation serveur (même schéma Zod que le client). Rate limit simple
 * en mémoire (5 envois / IP / heure). Envoi email best-effort via Resend :
 * si RESEND_API_KEY est absent, on log et on répond OK — pratique en dev.
 */

export async function POST(req: NextRequest) {
  const rate = rateLimitHourly(req, 'contact');
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error:
          'Trop de messages en peu de temps. Merci de réessayer dans l’heure.',
      },
      { status: 429 }
    );
  }

  let body: (Record<string, unknown> & { captchaToken?: string }) | null = null;
  try {
    body = (await req.json()) as Record<string, unknown> & {
      captchaToken?: string;
    };
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 });
  }

  // Captcha (best-effort : skippé en dev si pas de clé)
  const captcha = await verifyTurnstile(body?.captchaToken);
  if (!captcha.success) {
    return NextResponse.json(
      { error: 'Validation anti-spam échouée. Merci de réessayer.' },
      { status: 400 }
    );
  }

  const { captchaToken: _ignored, ...rest } = body ?? {};
  const parsed = contactSchema.safeParse(rest);
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
