import { cn } from '@/lib/utils';

export type ArticleQuoteProps = {
  children: React.ReactNode;
  author?: string;
  className?: string;
};

/**
 * Citation encadrée dans un article MDX — typo grande, respiration autour,
 * ligne or discrète pour la signature.
 */
export function ArticleQuote({ children, author, className }: ArticleQuoteProps) {
  return (
    <figure
      className={cn(
        'my-16 flex flex-col items-center gap-6 border-y border-bronze/15 py-12 text-center',
        className
      )}
    >
      <blockquote className="max-w-prose font-serif italic text-ivoire text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.4]">
        « {children} »
      </blockquote>
      {author && (
        <figcaption className="flex items-center gap-4 font-sans text-xs uppercase tracking-[0.25em] text-or/80">
          <span aria-hidden className="h-px w-8 bg-or/60" />
          {author}
        </figcaption>
      )}
    </figure>
  );
}
