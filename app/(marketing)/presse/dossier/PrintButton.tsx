'use client';

import { Download } from 'lucide-react';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 border border-or bg-or px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
    >
      <Download className="h-4 w-4" aria-hidden />
      Télécharger en PDF
    </button>
  );
}
