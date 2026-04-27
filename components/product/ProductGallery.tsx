'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/lib/types/product';

const isVideo = (m: ProductImage) => m.type === 'video';

type Props = {
  images: ProductImage[];
  productName: string;
  className?: string;
};

/**
 * Galerie d'images de fiche produit — thumbnails sticky à gauche + main image
 * à droite (desktop), carousel snap horizontal (mobile).
 *
 * - Clic sur une thumbnail : switch de l'image principale (crossfade 400ms)
 * - Clic sur la main image : ouvre le lightbox plein écran (scale 0.95 → 1)
 * - Lightbox : ←/→ ou swipe pour naviguer, ESC ou clic backdrop pour fermer
 */
export function ProductGallery({ images, productName, className }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const safeImages = images.length > 0 ? images : [];
  const activeImage = safeImages[activeIdx] ?? safeImages[0];

  const goNext = useCallback(
    () => setActiveIdx((i) => (i + 1) % safeImages.length),
    [safeImages.length]
  );
  const goPrev = useCallback(
    () =>
      setActiveIdx((i) => (i - 1 + safeImages.length) % safeImages.length),
    [safeImages.length]
  );

  if (!activeImage) return null;

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {/* Thumbnails — verticales sur desktop, cachées sur mobile (on a le carousel à la place) */}
        <div className="hidden flex-col gap-3 lg:flex">
          {safeImages.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActiveIdx(i)}
              data-cursor="hover"
              aria-label={`Voir ${img.alt}`}
              aria-current={i === activeIdx}
              className={cn(
                'relative h-[100px] w-20 overflow-hidden border transition-all duration-300',
                i === activeIdx
                  ? 'border-or opacity-100'
                  : 'border-bronze/30 opacity-60 hover:opacity-90'
              )}
            >
              {isVideo(img) ? (
                <>
                  <video
                    src={img.url}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center bg-noir/30 text-ivoire"
                  >
                    <Play className="h-4 w-4" fill="currentColor" />
                  </span>
                </>
              ) : (
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>

        {/* Main media — desktop */}
        <div className="relative hidden aspect-[4/5] w-full max-w-[640px] overflow-hidden bg-noir-800 lg:block">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            data-cursor="magnetic"
            aria-label={`Ouvrir ${activeImage.alt} en plein écran`}
            className="group/zoom block h-full w-full cursor-zoom-in"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {isVideo(activeImage) ? (
                  <video
                    src={activeImage.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={activeImage.url}
                    alt={activeImage.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 40vw"
                    className="object-cover"
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-ivoire/20 bg-noir/40 text-ivoire/70 backdrop-blur-sm transition-all duration-300 group-hover/zoom:border-or group-hover/zoom:text-or"
            >
              <ZoomIn className="h-4 w-4" aria-hidden />
            </span>
          </button>
        </div>

        {/* Carousel mobile — snap horizontal */}
        <div className="scrollbar-none relative -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 lg:hidden">
          {safeImages.map((img, i) => (
            <div
              key={`m-${img.url}-${i}`}
              className="relative aspect-[4/5] w-[85%] flex-shrink-0 snap-center overflow-hidden bg-noir-800"
            >
              {isVideo(img) ? (
                <video
                  src={img.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  sizes="85vw"
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* Pagination bullets (mobile) */}
        <div className="flex justify-center gap-2 lg:hidden">
          {safeImages.map((_, i) => (
            <span
              key={`b-${i}`}
              aria-hidden
              className={cn(
                'h-1 w-6 transition-colors duration-300',
                i === activeIdx ? 'bg-or' : 'bg-ivoire/20'
              )}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={safeImages}
            activeIdx={activeIdx}
            onClose={() => setLightboxOpen(false)}
            onNext={goNext}
            onPrev={goPrev}
            productName={productName}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

type LightboxProps = {
  images: ProductImage[];
  activeIdx: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  productName: string;
};

function Lightbox({
  images,
  activeIdx,
  onClose,
  onNext,
  onPrev,
  productName,
}: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const active = images[activeIdx];

  useEffect(() => {
    closeRef.current?.focus();
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = original;
    };
  }, [onClose, onNext, onPrev]);

  if (!active) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Visualisation plein écran — ${productName}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] bg-noir"
    >
      {/* Backdrop click */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* Média */}
      <motion.div
        key={activeIdx}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 md:p-16"
      >
        <div className="relative h-full w-full">
          {isVideo(active) ? (
            <video
              src={active.url}
              controls
              autoPlay
              loop
              playsInline
              className="pointer-events-auto h-full w-full object-contain"
            />
          ) : (
            <Image
              src={active.url}
              alt={active.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Fermer la vue plein écran"
        data-cursor="hover"
        className="absolute right-6 top-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivoire/20 bg-noir/40 text-ivoire/80 backdrop-blur-sm transition-colors duration-300 hover:border-or hover:text-or"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={onPrev}
            aria-label="Image précédente"
            data-cursor="hover"
            className="absolute left-6 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivoire/20 bg-noir/40 text-ivoire/80 backdrop-blur-sm transition-colors duration-300 hover:border-or hover:text-or"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Image suivante"
            data-cursor="hover"
            className="absolute right-6 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivoire/20 bg-noir/40 text-ivoire/80 backdrop-blur-sm transition-colors duration-300 hover:border-or hover:text-or"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </>
      )}

      {/* Compteur */}
      <p
        aria-hidden
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-sans text-xs uppercase tracking-[0.3em] text-ivoire/60"
      >
        {String(activeIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </p>
    </motion.div>
  );
}
