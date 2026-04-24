'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  name: string;
  label: string;
  initialUrl?: string | null;
  folder?: string;
  aspect?: string;
};

/**
 * Champ d'upload image (Supabase Storage) + preview.
 * Le hidden input `name` reçoit l'URL définitive après upload.
 */
export function ImageUploadField({
  name,
  label,
  initialUrl,
  folder = 'uploads',
  aspect = 'aspect-[4/5]',
}: Props) {
  const [url, setUrl] = useState<string>(initialUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/admin/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload échoué');
      const { url: newUrl } = (await res.json()) as { url: string };
      setUrl(newUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label}
      </span>
      <div className="flex items-start gap-4">
        {url && (
          <div
            className={`relative w-24 overflow-hidden bg-noir-800 ${aspect}`}
          >
            <Image src={url} alt="Prévisualisation" fill sizes="96px" className="object-cover" />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2">
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 border border-or/60 px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] text-or hover:bg-or/10">
            {uploading ? 'Upload…' : url ? 'Remplacer' : 'Téléverser'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFile(file);
                e.target.value = '';
              }}
            />
          </label>
          {url && (
            <p className="truncate font-sans text-xs italic text-ivoire/50">
              {url}
            </p>
          )}
          {error && (
            <p role="alert" className="font-sans text-xs italic text-destructive">
              {error}
            </p>
          )}
        </div>
      </div>
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
