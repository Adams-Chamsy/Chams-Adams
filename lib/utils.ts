import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusionne des classNames conditionnelles + déduplique les classes Tailwind en conflit.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
