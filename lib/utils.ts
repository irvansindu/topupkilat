import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TK${timestamp}${random}`;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 2 
    ? local.substring(0, 2) + '****' 
    : '****';
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length >= 10) {
    return clean.substring(0, 4) + '****' + clean.substring(clean.length - 4);
  }
  return phone;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  return /^(62|0)?8[1-9][0-9]{7,11}$/.test(cleanPhone);
}

export function normalizePhone(phone: string): string {
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }
  return clean;
}

export function generateIdempotencyKey(data: Record<string, any>): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
