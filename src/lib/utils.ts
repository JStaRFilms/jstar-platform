import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to HH:mm format for timestamps
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Returns a random contact from an array of contacts
 */
export function getRandomContact(contacts: string[]): string {
  if (!contacts || contacts.length === 0) {
    return '';
  }
  const randomIndex = Math.floor(Math.random() * contacts.length);
  return contacts[randomIndex];
}
