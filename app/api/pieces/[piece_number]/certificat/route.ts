import { NextRequest, NextResponse } from 'next/server';
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from '@/lib/supabase/server';
import type { PieceRow } from '@/lib/supabase/types';

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderCertificate(p: PieceRow): string {
  const completed = p.completed_at
    ? DATE_FMT.format(new Date(p.completed_at))
    : DATE_FMT.format(new Date(p.created_at));
  const owner = escapeHtml(p.owner_name ?? p.owner_email);
  const productName = escapeHtml(p.product_name);
  const pieceNumber = escapeHtml(p.piece_number);
  const artisan = p.artisan_name ? escapeHtml(p.artisan_name) : '—';
  const artisanRole = p.artisan_role ? escapeHtml(p.artisan_role) : '';
  const fabric = p.fabric_origin ? escapeHtml(p.fabric_origin) : '—';
  const fabricLot = p.fabric_lot ? escapeHtml(p.fabric_lot) : '—';
  const hours = p.embroidery_hours != null ? `${p.embroidery_hours} h` : '—';
  const monogram = p.monogram ? escapeHtml(p.monogram) : null;
  const size = p.size ? escapeHtml(p.size) : '—';
  const sigUrl = p.artisan_signature_url
    ? escapeHtml(p.artisan_signature_url)
    : null;

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>Certificat d'origine — ${pieceNumber} · Chams Adams</title>
<meta name="robots" content="noindex,nofollow" />
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, "Times New Roman", serif;
    color: #0A0A0A;
    background: #F5F0E6;
    margin: 0;
    padding: 24px;
    line-height: 1.5;
  }
  .frame {
    border: 1px solid #C9A961;
    padding: 48px 40px;
    max-width: 720px;
    margin: 0 auto;
    background: #FAF6EC;
    position: relative;
  }
  .eyebrow {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #C9A961;
    margin: 0 0 8px 0;
  }
  .wordmark {
    font-size: 32px;
    font-weight: 300;
    margin: 0 0 28px 0;
    letter-spacing: 0.05em;
  }
  h1 {
    font-size: 28px;
    font-weight: 300;
    margin: 0 0 8px 0;
  }
  .lede {
    font-style: italic;
    color: #595449;
    margin: 0 0 32px 0;
  }
  .number {
    font-family: "Courier New", monospace;
    font-size: 14px;
    color: #C9A961;
    letter-spacing: 0.15em;
  }
  dl {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 12px 24px;
    margin: 24px 0;
  }
  dt {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #595449;
    padding-top: 4px;
  }
  dd {
    margin: 0;
    font-size: 15px;
  }
  .mono { font-family: "Courier New", monospace; color: #C9A961; }
  .divider {
    border: 0;
    border-top: 1px solid #D9CDA8;
    margin: 32px 0;
  }
  .signature {
    margin-top: 32px;
    text-align: right;
  }
  .signature img {
    max-width: 180px;
    height: auto;
    opacity: 0.9;
  }
  .signature-name {
    font-style: italic;
    color: #595449;
    font-size: 13px;
    margin-top: 6px;
  }
  .footer {
    margin-top: 40px;
    text-align: center;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #595449;
  }
  @media print {
    body { background: #fff; padding: 0; }
    .frame { background: #fff; box-shadow: none; }
    .print-hidden { display: none !important; }
  }
</style>
</head>
<body>
<div class="print-hidden" style="text-align:center; margin: 8px 0 16px 0;">
  <button onclick="window.print()" style="border:1px solid #C9A961; background:#C9A961; color:#0A0A0A; padding:10px 20px; font-family: Helvetica, Arial, sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer;">
    Télécharger en PDF
  </button>
</div>
<div class="frame">
  <p class="eyebrow">Maison de couture</p>
  <p class="wordmark">Chams Adams</p>

  <h1>Certificat d'origine</h1>
  <p class="lede">
    La maison atteste que la pièce ci-dessous a été conçue dans ses ateliers
    selon les règles de notre savoir-faire.
  </p>

  <p>
    <span class="eyebrow">Numéro de pièce</span><br />
    <span class="number">${pieceNumber}</span>
  </p>

  <hr class="divider" />

  <dl>
    <dt>Pièce</dt>
    <dd><strong>${productName}</strong></dd>
    <dt>Taille</dt>
    <dd>${size}</dd>
    ${monogram ? `<dt>Monogramme</dt><dd><span class="mono">${monogram}</span> — brodé d'or</dd>` : ''}
    <dt>Confectionnée pour</dt>
    <dd>${owner}</dd>
    <dt>Achevée le</dt>
    <dd>${completed}</dd>
  </dl>

  <hr class="divider" />

  <dl>
    <dt>Main</dt>
    <dd>${artisan}${artisanRole ? ` · ${artisanRole}` : ''}</dd>
    <dt>Heures de broderie</dt>
    <dd>${hours}</dd>
    <dt>Tissu</dt>
    <dd>${fabric}</dd>
    <dt>Lot</dt>
    <dd><span class="mono">${fabricLot}</span></dd>
  </dl>

  <div class="signature">
    ${sigUrl ? `<img src="${sigUrl}" alt="Signature de l'artisan" />` : ''}
    <p class="signature-name">${artisan}</p>
  </div>

  <p class="footer">
    Pièce documentée à vie · Atelier Chams Adams
  </p>
</div>
</body>
</html>`;
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ piece_number: string }> }
) {
  const { piece_number } = await ctx.params;

  // Auth user
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Lookup with service role + manual ownership check
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from('pieces')
    .select('*')
    .eq('piece_number', piece_number)
    .maybeSingle();

  if (!data) {
    return new NextResponse('Not found', { status: 404 });
  }
  const piece = data as PieceRow;

  // Vérification : owner OU admin
  let allowed = false;
  if (user) {
    if (
      piece.owner_user_id === user.id ||
      (user.email &&
        piece.owner_email.toLowerCase() === user.email.toLowerCase())
    ) {
      allowed = true;
    } else {
      const { data: adminRow } = await service
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      if (adminRow) allowed = true;
    }
  }
  if (!allowed) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (!piece.certificate_published) {
    return new NextResponse(
      'Certificate not yet published — please contact the maison.',
      { status: 425 }
    );
  }

  return new NextResponse(renderCertificate(piece), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, max-age=300',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
