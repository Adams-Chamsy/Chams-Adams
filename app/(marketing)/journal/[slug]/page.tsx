import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/mdx-components';
import { TextReveal } from '@/components/animations/TextReveal';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ReadingProgress } from '@/components/ui/ReadingProgress';
import { TiptapBody } from '@/components/editorial/TiptapBody';
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getAllArticles,
  formatArticleDate,
} from '@/lib/data/articles';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  const { meta } = article;
  return {
    title: meta.title,
    description: meta.excerpt,
    openGraph: {
      type: 'article',
      title: meta.title,
      description: meta.excerpt,
      images: [meta.coverImage],
      publishedTime: meta.date,
      authors: [meta.author],
    },
  };
}

export default async function JournalArticlePage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const { meta } = article;

  // Corps : Tiptap (Supabase) ou MDX (3 articles legacy content/journal/*.mdx)
  let bodyNode: React.ReactNode;
  if (article.source === 'supabase') {
    bodyNode = <TiptapBody value={article.body} />;
  } else {
    const { content: mdxContent } = await compileMDX({
      source: article.content,
      components: mdxComponents,
    });
    bodyNode = mdxContent;
  }

  // Articles suggérés (3 autres que celui-ci)
  const allArticles = await getAllArticles();
  const related = allArticles.filter((a) => a.slug !== meta.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.excerpt,
    image: meta.coverImage,
    datePublished: meta.date,
    author: { '@type': 'Organization', name: meta.author },
    publisher: {
      '@type': 'Organization',
      name: 'Chams Adams',
      logo: { '@type': 'ImageObject', url: '/icon.svg' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgress />

      {/* HEADER */}
      <article>
        <header className="bg-noir pt-[140px] md:pt-[180px]">
          <div className="container-content flex flex-col gap-6">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Journal', href: '/journal' },
                { label: meta.category },
              ]}
            />
            <TextReveal
              as="h1"
              splitBy="words"
              stagger={0.05}
              className="max-w-[14ch] font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.5rem,6vw,5.5rem)]"
            >
              {meta.title}
            </TextReveal>
            <p className="max-w-prose font-serif italic text-ivoire/75 text-xl md:text-2xl leading-relaxed">
              {meta.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-xs uppercase tracking-[0.2em] text-ivoire/60">
              <span>{formatArticleDate(meta.date)}</span>
              <span aria-hidden>·</span>
              <span>Lecture {meta.readingTime} min</span>
              <span aria-hidden>·</span>
              <span className="italic normal-case text-ivoire/50">{meta.author}</span>
            </div>
          </div>
        </header>

        {/* COVER IMAGE */}
        <div className="mt-12 bg-noir md:mt-16">
          <div className="relative aspect-[21/9] w-full overflow-hidden">
            <Image
              src={meta.coverImage}
              alt=""
              aria-hidden
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* CORPS */}
        <div className="bg-noir py-[80px] md:py-[120px]">
          <div className="drop-cap mx-auto max-w-[720px] px-6 md:px-0">
            {bodyNode}
          </div>
        </div>
      </article>

      {/* ARTICLES SUGGÉRÉS */}
      {related.length > 0 && (
        <section className="bg-noir pb-[120px]">
          <div className="container-content">
            <h2 className="mb-12 font-serif font-light text-ivoire text-2xl md:text-3xl">
              Lectures suggérées
            </h2>
            <ul className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug} className="flex flex-col gap-4">
                  <Link
                    href={`/journal/${a.slug}`}
                    data-cursor="hover"
                    className="group flex flex-col gap-3"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-noir-800">
                      <Image
                        src={a.coverImage}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 90vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-or">
                      {a.category}
                    </span>
                    <h3 className="font-serif text-lg text-ivoire group-hover:text-or transition-colors duration-300">
                      {a.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
