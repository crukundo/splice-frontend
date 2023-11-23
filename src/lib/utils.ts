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