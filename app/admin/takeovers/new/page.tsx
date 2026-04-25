import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { createTakeoverAction } from '../actions';

const inputCls =
  'w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none';

export default function NewTakeoverPage() {
  return (
    <section className="flex flex-col gap-8 max-w-3xl">
      <AdminPageHeader
        eyebrow="Sélection saisonnière"
        title="Nouvelle cérémonie"
        action={
          <Link
            href="/admin/takeovers"
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70 hover:text-or"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Retour
          </Link>
        }
      />

      <form action={createTakeoverAction} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Titre">
            <input name="title" type="text" required className={inputCls} placeholder="Tabaski 2026" />
          </Field>
          <Field label="Slug (auto si vide)">
            <input name="slug" type="text" className={inputCls} placeholder="tabaski-2026" />
          </Field>
          <Field label="Type d'événement">
            <select name="event_type" required className={inputCls} defaultValue="tabaski">
              <option value="tabaski" className="bg-noir">Tabaski</option>
              <option value="magal" className="bg-noir">Magal</option>
              <option value="maouloud" className="bg-noir">Maouloud</option>
              <option value="mariage-saison" className="bg-noir">Mariage saison</option>
              <option value="autre" className="bg-noir">Autre</option>
            </select>
          </Field>
          <Field label="Date de la cérémonie">
            <input name="event_date" type="date" required className={inputCls} />
          </Field>
          <Field label="Date limite de livraison garantie">
            <input name="delivery_deadline" type="date" className={inputCls} />
          </Field>
          <Field label="Libellé du CTA">
            <input name="cta_label" type="text" className={inputCls} defaultValue="Découvrir la sélection" />
          </Field>
        </div>

        <Field label="Eyebrow (sur-titre court)">
          <input name="hero_eyebrow" type="text" className={inputCls} placeholder="Le grand jour approche" />
        </Field>
        <Field label="Sous-titre du hero">
          <textarea name="hero_subtitle" rows={2} className="border border-bronze/40 bg-transparent p-3 font-serif text-ivoire focus:border-or focus:outline-none" placeholder="Pour la prière, l'apparat et la lumière du jour" />
        </Field>
        <Field label="URL image hero">
          <input name="hero_image_url" type="url" className={inputCls} />
        </Field>
        <Field label="Description (1-2 paragraphes)">
          <textarea name="description" rows={5} className="border border-bronze/40 bg-transparent p-3 font-serif text-ivoire focus:border-or focus:outline-none" />
        </Field>
        <Field label="Slugs des produits curés (un par ligne ou séparés par virgules)" hint="Maximum recommandé : 12 pièces.">
          <textarea name="curated_product_slugs" rows={5} className="border border-bronze/40 bg-transparent p-3 font-serif text-ivoire focus:border-or focus:outline-none" placeholder={'kaftan-or-ceremonie\nkaftan-bazin-indigo\nkaftan-broderie-bronze'} />
        </Field>

        <label className="inline-flex items-center gap-3">
          <input name="published" type="checkbox" defaultChecked />
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/80">Publier maintenant</span>
        </label>

        <button
          type="submit"
          className="self-start border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong"
        >
          Créer la sélection
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">{label}</span>
      {children}
      {hint && <span className="font-sans text-[10px] italic text-ivoire/50">{hint}</span>}
    </label>
  );
}
