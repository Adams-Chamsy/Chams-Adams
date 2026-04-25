import { NextRequest, NextResponse } from 'next/server';
import { surMesureSchema } from '@/lib/schemas/surMesure';
import { sendSurMesureEmails } from '@/lib/emails/sendSurMesureEmails';
import { verifyTurnstile } from '@/lib/captcha/verifyTurnstile';
import { rateLimitHourly, getClientIp } from '@/lib/rate-limit';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CustomerMeasurementsRow } from '@/lib/supabase/types';

function formatGabarit(g: CustomerMeasurementsRow): string {
  const lines: string[] = [];
  const push = (label: string, val: number | string | null) => {
    if (val !== null && val !== undefined && val !== '')
      lines.push(`  · ${label} : ${val}${typeof val === 'number' ? ' cm' : ''}`);
  };
  push('Poitrine', g.poitrine_cm);
  push('Taille', g.taille_cm);
  push('Hanches', g.hanches_cm);
  push('Longueur de bras', g.longueur_bras_cm);
  push('Longueur de jambe', g.longueur_jambe_cm);
  push("Hauteur d'épaule", g.hauteur_epaule_cm);
  push('Hauteur totale', g.hauteur_totale_cm);
  push('Taille préférée', g.taille_preferee);
  if (g.notes) lines.push(`  · Notes : ${g.notes}`);
  return lines.length > 0
    ? `\n\nGabarit enregistré du client :\n${lines.join('\n')}`
    : '';
}

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

export async function POST(req: NextRequest) {
  const rate = rateLimitHourly(req, 'sur-mesure');
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

  // Si user authentifié + gabarit rempli → injecter dans la note interne
  let payload = parsed.data;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: gabarit } = await supabase
        .from('customer_measurements')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (gabarit) {
        const suffix = formatGabarit(gabarit as CustomerMeasurementsRow);
        if (suffix) {
          payload = {
            ...payload,
            vision: `${payload.vision ?? ''}${suffix}`,
          } as typeof payload;
        }
      }
    }
  } catch (err) {
    console.warn('[sur-mesure] gabarit attach skipped:', err);
  }

  // Envoi des 2 emails
  const results = await sendSurMesureEmails(payload, submittedAt);

  // Log structuré (console pour l'instant ; à brancher sur un monitoring en prod)
  console.info('[sur-mesure] demande traitée', {
    ip: getClientIp(req),
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
