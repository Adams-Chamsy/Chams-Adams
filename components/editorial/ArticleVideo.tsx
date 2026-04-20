import { cn } from '@/lib/utils';

export type ArticleVideoProps = {
  src: string;
  poster?: string;
  caption?: string;
  /** Muet et autoplay en boucle (ambiance) — default true. */
  ambient?: boolean;
  className?: string;
};

/**
 * Vidéo éditoriale dans un article MDX.
 * - `ambient` : muted + autoPlay + loop (cinémagraphe ambiance)
 * - Sinon : contrôles natifs
 */
export function ArticleVideo({
  src,
  poster,
  caption,
  ambient = true,
  className,
}: ArticleVideoProps) {
  return (
    <figure className={cn('my-12', className)}>
      <video
        src={src}
        poster={poster}
        autoPlay={ambient}
        muted={ambient}
        loop={ambient}
        playsInline
        controls={!ambient}
        preload="metadata"
        className="block w-full bg-noir-800"
      />
      {caption && (
        <figcaption className="mt-3 font-sans text-xs italic text-ivoire/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
