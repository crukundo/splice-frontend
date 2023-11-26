import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function detectCurrencyViaPhone(phoneNumber: string): string | null {
  if (phoneNumber.startsWith('234')) {
    return 'NGN';
  } else if (phoneNumber.startsWith('254')) {
    return 'KES';
  } else if (phoneNumber.startsWith('233')) {
    return 'GHC';
  } else if (phoneNumber.startsWith('0')) {
    if (phoneNumber.startsWith('080') || phoneNumber.startsWith('070')) {
      return 'NGN';
    } else if (phoneNumber.startsWith('07')) {
      return 'KES';
    } else if (phoneNumber.startsWith('02')) {
      return 'GHC'; // only considering Greater Accra for now
    }
    // maybe more edge cases here
  }

  return null;
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatRelativeTime(input: string | number): string {
  const timestamp = typeof input === "string" ? new Date(input).getTime() : input;
  const now = new Date().getTime();
  const elapsed = now - timestamp;

  if (elapsed < 60000) {
    const seconds = Math.floor(elapsed / 1000);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (elapsed < 3600000) {
    const minutes = Math.floor(elapsed / 60000);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (elapsed < 86400000) {
    const hours = Math.floor(elapsed / 3600000);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (elapsed < 604800000) {
    const days = Math.floor(elapsed / 86400000);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    const weeks = Math.floor(elapsed / 604800000);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
}
