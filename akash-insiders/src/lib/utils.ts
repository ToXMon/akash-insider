import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<string | null | undefined | false>) {
  return twMerge(inputs.filter(Boolean).join(' '));
}

