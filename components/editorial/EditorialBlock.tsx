'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/animations/TextReveal';
import { ZoomReveal } from '@/components/animations/ZoomReveal';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

export type EditorialImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type EditorialBlockProps = {
  variant: 'text-image' | 'image-text' | 'full-image' | 'quote' | 'triptych';
  eyebrow?: string;
  title?: string;
  body?: React.ReactNode;
  image?: EditorialImage;
  images?: EditorialImage[];
  quote?: { text: string; author?: string };
  reversed?: boolean;
  className?: string;
};

/**
 * Bloc éditorial réutilisable — 5 compositions de type magazine.
 * Padding vertical généreux (120px desktop), animations au scroll soignées.
 */
export function EditorialBlock(props: EditorialBlockProps) {
  return (
    <section className={cn('py-[80px] md:py-[120px]', props.className)}>
      <div className="container-content">{renderVariant(props)}</div>
    </section>
  );
}

function renderVariant(p: EditorialBlockProps) {
  switch (p.variant) {
    case 'text-image':
    case 'image-text':
      return <TextImageVariant {...p} />;
    case 'full-image':
      return <FullImageVariant {...p} />;
    case 'quote':
      return <QuoteVariant {...p} />;
    case 'triptych':
      return <TriptychVariant {...p} />;
  }
}

// --------------------------------------------------------------------
// Text + Image (alternating)
// --------------------------------------------------------------------
function TextImageVariant({ variant, eyebrow, title, body, image, reversed }: EditorialBlockProps) {
  if (!image) return null;
  const imageFirst = variant === 'image-text' ? !reversed : reversed;

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
      <div className={cn('lg:col-span-6', imageFirst ? 'lg:order-1' : 'lg:order-2')}>
        <ZoomReveal scale={[1, 1.15]} className="relative aspect-[4/5] w-full overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 90vw, 50vw"
              className="object-cover"
            />
          </div>
        </ZoomReveal>
        {image.caption && (
          <p className="mt-3 font-sans text-xs italic text-ivoire/60">
            {image.caption}
          </p>
        )}
      </div>

      <div
        className={cn(
          'flex flex-col gap-6 lg:col-span-5',
          imageFirst ? 'lg:order-2' : 'lg:order-1',
          imageFirst ? 'lg:col-start-8' : 'lg:col-start-1'
        )}
      >
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
            className="font-sans text-xs uppercase tracking-[0.3em] text-or"
          >
            {eyebrow}
          </motion.span>
        )}
        {title && (
          <TextReveal
            as="h2"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light leading-tight text-ivoire text-[clamp(1.75rem,3.5vw,3rem)]"
          >
            {title}
          </TextReveal>
        )}
        {body && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.2 }}
            className="flex flex-col gap-5 font-serif text-ivoire/80 text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.75]"
          >
            {body}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------
// Full image (pleine largeur + légende)
// --------------------------------------------------------------------
function FullImageVariant({ eyebrow, title, body, image }: EditorialBlockProps) {
  if (!image) return null;

  return (
    <div className="flex flex-col gap-10">
      {(eyebrow || title) && (
        <div className="flex flex-col gap-4">
          {eyebrow && (
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6 }}
              className="font-sans text-xs uppercase tracking-[0.3em] text-or"
            >
              {eyebrow}
            </motion.span>
          )}
          {title && (
            <TextReveal
              as="h2"
              splitBy="words"
              stagger={0.05}
              className="max-w-prose font-serif font-light leading-tight text-ivoire text-[clamp(2rem,4vw,3.5rem)]"
            >
              {title}
            </TextReveal>
          )}
        </div>
      )}
      <ZoomReveal scale={[1, 1.1]} className="relative aspect-[21/9] w-full overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover"
          />
        </div>
      </ZoomReveal>
      {image.caption && (
        <p className="font-sans text-xs italic text-ivoire/60">{image.caption}</p>
      )}
      {body && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="mx-auto flex max-w-prose flex-col gap-5 font-serif text-ivoire/80 text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.75]"
        >
          {body}
        </motion.div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------
// Quote variant
// --------------------------------------------------------------------
function QuoteVariant({ quote, eyebrow }: EditorialBlockProps) {
  if (!quote) return null;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO }}
      className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center"
    >
      {eyebrow && (
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
          {eyebrow}
        </span>
      )}
      <blockquote className="font-serif italic text-ivoire text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.4]">
        « {quote.text} »
      </blockquote>
      {quote.author && (
        <figcaption className="flex items-center gap-4 font-sans text-xs uppercase tracking-[0.25em] text-or/80">
          <span aria-hidden className="h-px w-12 bg-or/60" />
          {quote.author}
        </figcaption>
      )}
    </motion.figure>
  );
}

// --------------------------------------------------------------------
// Triptych (3 images alignées)
// --------------------------------------------------------------------
function TriptychVariant({ eyebrow, title, body, images }: EditorialBlockProps) {
  if (!images || images.length < 3) return null;

  return (
    <div className="flex flex-col gap-12">
      {(eyebrow || title) && (
        <div className="flex flex-col gap-4">
          {eyebrow && (
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              {eyebrow}
            </span>
          )}
          {title && (
            <TextReveal
              as="h2"
              splitBy="words"
              stagger={0.05}
              className="font-serif font-light text-ivoire text-[clamp(1.75rem,3.5vw,3rem)] leading-tight"
            >
              {title}
            </TextReveal>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4 lg:gap-8">
        {images.slice(0, 3).map((img, i) => (
          <ZoomReveal
            key={i}
            scale={[1, 1.12]}
            className="relative aspect-[3/4] w-full overflow-hidden"
          >
            <div className="relative h-full w-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 90vw, 30vw"
                className="object-cover"
              />
            </div>
          </ZoomReveal>
        ))}
      </div>
      {body && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="mx-auto flex max-w-prose flex-col gap-5 font-serif text-ivoire/80 text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.75]"
        >
          {body}
        </motion.div>
      )}
    </div>
  );
}
