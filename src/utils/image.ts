import { SERVER_URL } from "./constants"

/**
 * Normalizes an image URL for display:
 * 1. Returns fallback if no path is provided.
 * 2. Leaves external HTTP/HTTPS URLs untouched.
 * 3. Keeps local frontend public folder assets (e.g. /model_1.png) local without prepending backend host.
 * 4. Prepends the backend SERVER_URL only for API-uploaded assets (e.g. /uploads/...).
 */
export const getImageUrl = (url?: string | null, fallback: string = "/model_1.png"): string => {
  if (!url || typeof url !== "string" || !url.trim()) {
    return fallback
  }

  const trimmed = url.trim()

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed
  }

  // Local frontend public folder assets (e.g. /model_1.png, /hero_2.jpg, /cloth_1.jpg)
  if (trimmed.startsWith("/") && !trimmed.startsWith("/uploads/")) {
    return trimmed
  }

  const cleanServerUrl = (SERVER_URL || "").replace(/\/+$/, "")
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  return `${cleanServerUrl}${cleanPath}`
}

