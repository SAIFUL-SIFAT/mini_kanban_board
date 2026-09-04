import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic background color generator for user initials avatar
 * Selects from a curated retro accent palette based on user id or email string.
 */
const RETRO_AVATAR_PALETTE = [
  { bg: "#15803D", text: "#FFFFFF" }, // Forest Green
  { bg: "#D97706", text: "#FFFFFF" }, // Deep Mustard / Amber
  { bg: "#2563EB", text: "#FFFFFF" }, // Vintage Blue
  { bg: "#DC2626", text: "#FFFFFF" }, // Crimson
  { bg: "#7C3AED", text: "#FFFFFF" }, // Deep Purple
  { bg: "#0D9488", text: "#FFFFFF" }, // Dark Teal
];

export function getAvatarColor(identifier?: string | null) {
  if (!identifier) return RETRO_AVATAR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % RETRO_AVATAR_PALETTE.length;
  return RETRO_AVATAR_PALETTE[index];
}

export function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (email && email.trim().length > 0) {
    return email.substring(0, 2).toUpperCase();
  }
  return "U";
}
