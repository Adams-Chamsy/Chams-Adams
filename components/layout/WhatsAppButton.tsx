'use client';

/**
 * Bouton flottant WhatsApp — apparaît en bas à gauche (le ScrollToTop occupe
 * le coin bas-droit). Désactivé si `NEXT_PUBLIC_WHATSAPP_NUMBER` n'est pas
 * défini.
 *
 * Ouvre wa.me dans un nouvel onglet, sans tracking côté Meta (pas de pixel).
 */
export function WhatsAppButton() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!raw) return null;

  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;

  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    "Bonjour, je souhaite échanger avec la Maison Chams Adams.";
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      data-cursor="hover"
      className="fixed bottom-6 left-6 z-[200] inline-flex h-12 w-12 items-center justify-center rounded-full border border-or/40 bg-noir/80 text-or backdrop-blur-sm transition-colors duration-500 ease-out-expo hover:border-or hover:bg-or hover:text-noir focus:outline-none focus-visible:ring-2 focus-visible:ring-or focus-visible:ring-offset-2 focus-visible:ring-offset-noir md:h-14 md:w-14"
    >
      <WhatsAppIcon />
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5 md:h-6 md:w-6"
      fill="currentColor"
    >
      <path d="M20.52 3.48A11.92 11.92 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6.04L0 24l6.16-1.62A11.91 11.91 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 22a9.93 9.93 0 0 1-5.07-1.38l-.36-.21-3.66.96.98-3.56-.24-.37A9.97 9.97 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0 1 22 12c0 5.52-4.48 10-10 10Zm5.49-7.37c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.5a9.04 9.04 0 0 1-1.67-2.07c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.13 3.26 5.16 4.57.72.31 1.28.5 1.72.63.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.07-.13-.28-.2-.57-.35Z" />
    </svg>
  );
}
