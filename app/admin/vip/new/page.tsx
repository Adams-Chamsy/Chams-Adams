import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { createVipMemberAction } from '../actions';

export default function NewVipMemberPage() {
  return (
    <section className="flex flex-col gap-8 max-w-2xl">
      <AdminPageHeader
        eyebrow="Inviter"
        title="Nouveau membre VIP"
        action={
          <Link
            href="/admin/vip"
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour
          </Link>
        }
      />

      <form action={createVipMemberAction} className="flex flex-col gap-6">
        <Field label="Adresse de courriel">
          <input
            name="email"
            type="email"
            required
            className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
          />
        </Field>

        <Field label="Nom complet (optionnel)">
          <input
            name="full_name"
            type="text"
            className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
          />
        </Field>

        <Field label="Niveau">
          <select
            name="tier"
            defaultValue="silver"
            className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
          >
            <option value="silver" className="bg-noir">
              Silver — entrée du cercle
            </option>
            <option value="gold" className="bg-noir">
              Gold — fidèle de la maison
            </option>
            <option value="platinum" className="bg-noir">
              Platinum — figure d&apos;élection
            </option>
          </select>
        </Field>

        <Field label="Invité par (optionnel)">
          <input
            name="invited_by"
            type="text"
            placeholder="Nom du parrain ou de la marraine"
            className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
          />
        </Field>

        <Field label="Notes internes (optionnel)">
          <textarea
            name="notes"
            rows={3}
            className="w-full border border-bronze/40 bg-transparent p-3 font-serif text-ivoire focus:border-or focus:outline-none"
          />
        </Field>

        <fieldset className="flex flex-col gap-6 border-t border-bronze/20 pt-8">
          <legend className="font-sans text-[10px] uppercase tracking-[0.3em] text-or">
            Conseillère / Conseiller (Gold &amp; Platinum)
          </legend>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Nom du conseiller">
              <input
                name="advisor_name"
                type="text"
                placeholder="Aïssatou Ndiaye"
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <Field label="Rôle">
              <input
                name="advisor_role"
                type="text"
                placeholder="Conseillère couture"
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <Field label="URL photo">
              <input
                name="advisor_photo_url"
                type="url"
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <Field label="Email">
              <input
                name="advisor_email"
                type="email"
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <Field label="WhatsApp (format international)">
              <input
                name="advisor_whatsapp"
                type="text"
                placeholder="+221 77 000 00 00"
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
            <Field label="Lien Cal.com personnel">
              <input
                name="advisor_cal_link"
                type="url"
                placeholder="https://cal.com/aissatou/..."
                className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
              />
            </Field>
          </div>
        </fieldset>

        <button
          type="submit"
          className="self-start border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
        >
          Ajouter au cercle
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label}
      </span>
      {children}
    </label>
  );
}
