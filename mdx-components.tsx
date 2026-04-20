import type { MDXComponents } from 'mdx/types';
import { ArticleQuote } from '@/components/editorial/ArticleQuote';
import { ArticleImage } from '@/components/editorial/ArticleImage';
import { ArticleGallery } from '@/components/editorial/ArticleGallery';
import { ArticleVideo } from '@/components/editorial/ArticleVideo';

/**
 * Composants MDX partagés (typo éditoriale + custom components).
 *
 * - `mdxComponents` (plain object) : utilisable avec `compileMDX` programmatique
 * - `useMDXComponents` (Next convention) : utilisé automatiquement par les
 *   pages `.mdx` déposées dans `app/` si on en ajoute
 */
export const mdxComponents: MDXComponents = {
  // Custom components disponibles dans tous les .mdx
  ArticleQuote,
  ArticleImage,
  ArticleGallery,
  ArticleVideo,

  // Surcharge de la typo des balises HTML natives
  h2: ({ children }) => (
    <h2 className="mt-16 mb-6 font-serif font-light text-ivoire text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-12 mb-4 font-serif font-light text-ivoire text-xl md:text-2xl">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-6 font-serif text-ivoire/85 text-[19px] leading-[1.75]">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-serif italic text-or underline-offset-4 hover:underline"
      data-cursor="hover"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="text-ivoire font-normal">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-12 border-l-2 border-or pl-6 font-serif italic text-ivoire text-2xl md:text-[28px] leading-[1.6]">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="my-6 flex flex-col gap-3 font-serif text-ivoire/85 text-[18px] leading-[1.7]">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="flex gap-3 pl-1">
      <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-or/60" />
      <span>{children}</span>
    </li>
  ),
  hr: () => <hr aria-hidden className="mx-auto my-16 h-px w-12 border-0 bg-or/50" />,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}
