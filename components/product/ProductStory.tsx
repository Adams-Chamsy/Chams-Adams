'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

type Props = {
  productName: string;
  videoUrl?: string;
  audioUrl?: string;
};

/**
 * Onglet "Récit" — vidéo silencieuse de port + audio d'ambiance optionnel.
 *
 * Respect strict de prefers-reduced-motion (la vidéo bascule sur poster fixe)
 * et de l'autoplay (vidéo muted; audio uniquement sur action utilisateur).
 */
export function ProductStory({ productName, videoUrl, audioUrl }: Props) {
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (audioOn) {
      a.volume = 0.4;
      a.play().catch(() => setAudioOn(false));
    } else {
      a.pause();
    }
  }, [audioOn]);

  if (!videoUrl && !audioUrl) return null;

  return (
    <div className="flex flex-col gap-4">
      {videoUrl && (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-noir-800 motion-reduce:hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}

      {audioUrl && (
        <>
          <audio ref={audioRef} loop preload="none">
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
          <button
            type="button"
            onClick={() => setAudioOn((v) => !v)}
            aria-pressed={audioOn}
            className="inline-flex items-center gap-2 self-start border border-or/60 px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] text-or hover:bg-or/10"
          >
            {audioOn ? (
              <>
                <Volume2 className="h-4 w-4" aria-hidden />
                Couper l&apos;ambiance
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4" aria-hidden />
                Écouter l&apos;atelier
              </>
            )}
          </button>
        </>
      )}

      <p className="font-serif italic text-sm text-ivoire/60">
        Une parenthèse silencieuse autour de {productName} — le geste, le
        tombé, le mouvement.
      </p>
    </div>
  );
}
