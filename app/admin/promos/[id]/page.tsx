import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createSupabaseServiceClient } from '@/lib/supabase/server';
import type { PromoCodeRow } from '@/lib/supabase/types';
import { PromoForm } from '../PromoForm';
import { updatePromoAction } from '../actions';

export default async function AdminPromoEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) notFound();

  const bound = updatePromoAction.bind(null, id);

  return (
    <section className="flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/promos"
          className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/55 hover:text-or"
        >
          ← Codes promo
        </Link>
        <h1 className="font-serif text-3xl font-light text-ivoire md:text-4xl">
          Éditer <code className="text-or">{(data as PromoCodeRow).code}</code>
        </h1>
      </header>
      <PromoForm action={bound} initial={data as PromoCodeRow} submitLabel="Mettre à jour" />
    </section>
  );
}
