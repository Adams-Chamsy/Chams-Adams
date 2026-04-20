import Image from 'next/image';
import { cn } from '@/lib/utils';

export type ArticleImageProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  ratio?: '4/5' | '3/4' | '16/9' | '21/9' | '1/1';
  /** `wide` déborde du container pour un effet éditorial (bleed). */
  size?: 'default' | 'wide';
  className?: string;
};

const RATIO_CLASS: Record<NonNullable<ArticleImageProps['ratio']>, string> = {
  '4/5': 'aspect-[4/5]',
  '3/4': 'aspect-[3/4]',
  '16/9': 'aspect-video',
  '21/9': 'aspect-[21/9]',
  '1/1': 'aspect-square',
};

/**
 * Image éditoriale pour articles MDX — avec légende optionnelle sous l'image.
 * `size="wide"` : sort du container de lecture (720px) pour un bleed dramatique.
 */
export function ArticleImage({
  src,
  alt,
  caption,
  width,
  height,
  ratio,
  size = 'default',
  className,
}: ArticleImageProps) {
  const useRatio = ratio ?? '4/5';
  const isWide = size === 'wide';

  return (
    <figure
      className={cn(
        'my-12',
        isWide && 'md:-mx-24 lg:-mx-32',
        className
      )}
    >
      <div className={cn('relative w-full overflow-hidden bg-noir-800', RATIO_CLASS[useRatio])}>
        {width && height ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={isWide ? '(max-width: 768px) 100vw, 80vw' : '(max-width: 768px) 90vw, 720px'}
            className="object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={isWide ? '(max-width: 768px) 100vw, 80vw' : '(max-width: 768px) 90vw, 720px'}
            className="object-cover"
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 font-sans text-xs italic text-ivoire/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
