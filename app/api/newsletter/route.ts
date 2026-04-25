import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import { rateLimitHourly } from '@/lib/rate-limit';
import { sendWelcomeEmail } from '@/lib/emails/sendBrandEmails';

const schema = z.object({
  email: z.string().email(),
});

/** POST /api/newsletter — inscription + email de bienvenue. */
export async function POST(req: NextRequest) {
  const rate = rateLimitHourly(req, 'newsletter');
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Trop de demandes. Réessayez plus tard.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Adresse invalide.' },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServiceClient();
  const email = parsed.data.email.trim().toLowerCase();

  // Insert (ignore conflict via re-subscribe)
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { email, unsubscribed_at: null, subscribed_at: new Date().toISOString() },
      { onConflict: 'email' }
    );
  if (error) {
    console.error('[newsletter]', error);
    return NextResponse.json(
      { error: 'Échec de l’inscription.' },
      { status: 500 }
    );
  }

  // Best-effort welcome email (non-bloquant)
  sendWelcomeEmail(email).catch((err) =>
    console.error('[newsletter] welcome email failed:', err)
  );

  return NextResponse.json({ ok: true });
}
