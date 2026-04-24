'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductRow } from '@/lib/supabase/types';

type VariantImage = {
  url: string;
  alt?: string;
  type?: string;
};

type Variant = {
  id?: string;
  color: string;
  colorName: string;
  sizes: string[];
  stock?: number | null;
  images: VariantImage[];
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<ProductRow> & { variants?: Variant[] };
  collections: { slug: string; name: string }[];
  submitLabel?: string;
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'sur-mesure'];

const inputCls =
  'border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none';

export function ProductForm({
  action,
  initial,
  collections,
  submitLabel = 'Enregistrer',
}: Props) {
  const [variants, setVariants] = useState<Variant[]>(
    initial?.variants && initial.variants.length > 0
      ? initial.variants
      : [{ color: '#000000', colorName: '', sizes: ['M'], stock: 1, images: [] }]
  );

  const details = (initial?.details ?? {}) as {
    craftingTime?: string;
    embroidery?: string;
    origin?: string;
    care?: string[];
  };

  function addVariant() {
    setVariants((v) => [
      ...v,
      { color: '#000000', colorName: '', sizes: ['M'], stock: 1, images: [] },
    ]);
  }

  function removeVariant(i: number) {
    if (variants.length <= 1) return;
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  function updateVariant(i: number, patch: Partial<Variant>) {
    setVariants((v) => v.map((vr, idx) => (idx === i ? { ...vr, ...patch } : vr)));
  }

  async function uploadVariantImage(i: number, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'products');
    const res = await fetch('/admin/api/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      alert('Upload échoué');
      return;
    }
    const { url } = (await res.json()) as { url: string };
    updateVariant(i, {
      images: [...variants[i]!.images, { url, alt: '', type: 'flat' }],
    });
  }

  function removeVariantImage(i: number, imgIdx: number) {
    updateVariant(i, {
      images: variants[i]!.images.filter((_, idx) => idx !== imgIdx),
    });
  }

  return (
    <form action={action} className="flex flex-col gap-8">
      {/* Main */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Field label="Nom">
          <input type="text" name="name" required defaultValue={initial?.name ?? ''} className={inputCls} />
        </Field>
        <Field label="Slug (auto si vide)">
          <input type="text" name="slug" defaultValue={initial?.slug ?? ''} className={inputCls} />
        </Field>
      </div>

      <Field label="Sous-titre">
        <input
          type="text"
          name="subtitle"
          defaultValue={initial?.subtitle ?? ''}
          placeholder="Kaftan de cérémonie…"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Field label="Prix (€)">
          <input
            type="number"
            name="price_amount"
            step="0.01"
            required
            defaultValue={
              initial?.price_amount ? (initial.price_amount / 100).toFixed(2) : ''
            }
            className={inputCls}
          />
        </Field>
        <Field label="Devise">
          <select
            name="price_currency"
            defaultValue={initial?.price_currency ?? 'EUR'}
            className={inputCls}
          >
            <option value="EUR" className="bg-noir">EUR</option>
            <option value="XOF" className="bg-noir">XOF</option>
            <option value="USD" className="bg-noir">USD</option>
          </select>
        </Field>
        <Field label="Collection">
          <select name="category_slug" required defaultValue={initial?.category_slug ?? ''} className={inputCls}>
            <option value="" className="bg-noir" disabled>
              Choisir…
            </option>
            {collections.map((c) => (
              <option key={c.slug} value={c.slug} className="bg-noir">
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description courte">
        <textarea
          name="description"
          rows={3}
          required
          defaultValue={initial?.description ?? ''}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-base text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <Field label="Description longue">
        <textarea
          name="long_description"
          rows={6}
          defaultValue={initial?.long_description ?? ''}
          className="border border-bronze/40 bg-transparent p-3 font-serif text-base text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      {/* Détails fabrication */}
      <fieldset className="flex flex-col gap-5 border border-bronze/20 p-5">
        <legend className="px-2 font-sans text-[11px] uppercase tracking-[0.25em] text-or/80">
          Détails fabrication
        </legend>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Field label="Temps de création">
            <input
              type="text"
              name="crafting_time"
              defaultValue={details.craftingTime ?? ''}
              placeholder="3 semaines"
              className={inputCls}
            />
          </Field>
          <Field label="Broderie">
            <input
              type="text"
              name="embroidery"
              defaultValue={details.embroidery ?? ''}
              placeholder="Fil de soie dorée, main"
              className={inputCls}
            />
          </Field>
          <Field label="Origine">
            <input
              type="text"
              name="origin"
              defaultValue={details.origin ?? ''}
              placeholder="Sénégal"
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Entretien (une ligne par instruction)">
          <textarea
            name="care"
            rows={4}
            defaultValue={(details.care ?? []).join('\n')}
            className="border border-bronze/40 bg-transparent p-3 font-serif text-base text-ivoire focus:border-or focus:outline-none"
          />
        </Field>
      </fieldset>

      {/* Meta */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Matières (séparées par virgules)">
          <input
            type="text"
            name="materials"
            defaultValue={(initial?.materials ?? []).join(', ')}
            placeholder="bazin-riche, soie"
            className={inputCls}
          />
        </Field>
        <Field label="Tags (séparés par virgules)">
          <input
            type="text"
            name="tags"
            defaultValue={(initial?.tags ?? []).join(', ')}
            placeholder="ceremonie, signature"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <Toggle name="is_signature" label="Pièce signature" defaultChecked={initial?.is_signature} />
        <Toggle name="is_new" label="Nouveauté" defaultChecked={initial?.is_new} />
        <Toggle name="published" label="Publié" defaultChecked={initial?.published} />
      </div>

      {/* Variants */}
      <fieldset className="flex flex-col gap-4 border border-bronze/20 p-5">
        <legend className="px-2 font-sans text-[11px] uppercase tracking-[0.25em] text-or/80">
          Variantes ({variants.length})
        </legend>

        {variants.map((v, i) => (
          <div key={i} className="flex flex-col gap-5 border-t border-bronze/15 pt-5 first:border-t-0 first:pt-0">
            <div className="flex items-start justify-between gap-4">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-or/80">
                Variante {i + 1}
              </span>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="inline-flex items-center gap-1 font-sans text-xs text-destructive hover:underline"
                >
                  <Trash2 className="h-3 w-3" />
                  Supprimer
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-[auto_1fr_auto]">
              <Field label="Hex">
                <input
                  type="color"
                  value={v.color}
                  onChange={(e) => updateVariant(i, { color: e.target.value })}
                  className="h-10 w-16 cursor-pointer border-0 bg-transparent"
                />
              </Field>
              <Field label="Nom couleur">
                <input
                  type="text"
                  value={v.colorName}
                  onChange={(e) => updateVariant(i, { colorName: e.target.value })}
                  placeholder="Indigo profond"
                  className={inputCls}
                />
              </Field>
              <Field label="Stock">
                <input
                  type="number"
                  value={v.stock ?? ''}
                  onChange={(e) =>
                    updateVariant(i, {
                      stock: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                  placeholder="∞"
                  className={cn(inputCls, 'w-24')}
                />
              </Field>
            </div>

            <Field label="Tailles disponibles">
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => {
                  const active = v.sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        updateVariant(i, {
                          sizes: active
                            ? v.sizes.filter((x) => x !== s)
                            : [...v.sizes, s],
                        })
                      }
                      className={cn(
                        'border px-3 py-1.5 font-sans text-xs uppercase tracking-[0.2em] transition-colors',
                        active
                          ? 'border-or bg-or text-noir'
                          : 'border-bronze/40 text-ivoire/70 hover:border-or hover:text-or'
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label={`Images (${v.images.length})`}>
              <div className="flex flex-wrap items-start gap-3">
                {v.images.map((img, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="relative aspect-[4/5] w-20 overflow-hidden bg-noir-800"
                  >
                    <Image src={img.url} alt={img.alt ?? ''} fill sizes="80px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeVariantImage(i, imgIdx)}
                      aria-label="Retirer"
                      className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-noir/80 text-ivoire hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    {imgIdx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-or px-1.5 py-0.5 font-sans text-[9px] uppercase tracking-widest text-noir">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
                <label className="inline-flex aspect-[4/5] w-20 cursor-pointer items-center justify-center border border-dashed border-bronze/50 text-or hover:border-or">
                  <Plus className="h-5 w-5" aria-hidden />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadVariantImage(i, f);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </Field>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="mt-2 inline-flex w-fit items-center gap-2 border border-or/60 px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] text-or hover:bg-or/10"
        >
          <Plus className="h-4 w-4" />
          Ajouter une variante
        </button>
      </fieldset>

      <input type="hidden" name="variants_json" value={JSON.stringify(variants)} />

      <div className="flex items-center gap-4 pt-4">
        <Submit label={submitLabel} />
        <Link
          href="/admin/products"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/60 hover:text-ivoire"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-or" />
      <span className="font-sans text-sm text-ivoire/80">{label}</span>
    </label>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong disabled:opacity-50"
    >
      {pending ? 'Enregistrement…' : label}
    </button>
  );
}
