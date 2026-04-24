import Image from 'next/image';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/lib/sanity/image';
import { ArticleQuote } from './ArticleQuote';

type SanityImageValue = {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  alt?: string;
  caption?: string;
};

type PullQuoteValue = {
  _type: 'pullQuote';
  text: string;
  author?: string;
};

/**
 * Rendu d'un corps d'article Portable Text (Sanity).
 *
 * - `image` → next/image avec hotspot, légende optionnelle
 * - `pullQuote` → réutilise <ArticleQuote>
 * - marks : link, strong, em
 * - styles : h2, h3, blockquote, normal
 */
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const img = value as SanityImageValue;
      const url = urlFor(img).width(1600).fit('max').auto('format').url();
      return (
        <figure className="my-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-noir-800">
            <Image
              src={url}
              alt={img.alt ?? ''}
              fill
              sizes="(max-width: 768px) 90vw, 720px"
              className="object-cover"
            />
          </div>
          {img.caption && (
            <figcaption className="mt-3 text-center font-sans text-xs italic text-ivoire/55">
              {img.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    pullQuote: ({ value }) => {
      const q = value as PullQuoteValue;
      return <ArticleQuote author={q.author}>{q.text}</ArticleQuote>;
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href ?? '#';
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="text-or underline decoration-1 underline-offset-4 transition-colors duration-300 hover:text-ivoire"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="text-ivoire">{children}</strong>,
    em: ({ children }) => <em className="italic text-ivoire/95">{children}</em>,
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-14 mb-5 font-serif text-3xl font-light text-ivoire md:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-4 font-serif text-2xl font-light text-ivoire">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-or/50 pl-6 font-serif italic text-ivoire/80 text-xl leading-relaxed">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-5 font-serif text-lg leading-[1.8] text-ivoire/80">
        {children}
      </p>
    ),
  },
};

export function PortableBody({ value }: { value: unknown }) {
  return <PortableText value={value as never} components={components} />;
}
