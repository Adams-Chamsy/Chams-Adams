import Image from 'next/image';
import { cn } from '@/lib/utils';

export type ArticleGalleryItem = {
  src: string;
  alt: string;
  caption?: string;
};

export type ArticleGalleryProps = {
  images: ArticleGalleryItem[];
  /** 2 colonnes (default) ou 3 colonnes. */
  cols?: 2 | 3;
  className?: string;
};

/**
 * Galerie 2 ou 3 images côte-à-côte dans un article. Sur mobile → stack vertical.
 */
export function ArticleGallery({ images, cols = 2, className }: ArticleGalleryProps) {
  return (
    <div
      className={cn(
        'my-12 grid gap-4 md:-mx-16',
        cols === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2',
        className
      )}
    >
      {images.map((img, i) => (
        <figure key={i} className="flex flex-col gap-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-noir-800">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={cols === 3 ? '(max-width: 768px) 90vw, 32vw' : '(max-width: 768px) 90vw, 45vw'}
              className="object-cover"
            />
          </div>
          {img.caption && (
            <figcaption className="font-sans text-[11px] italic text-ivoire/50">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
