export function sanitizeText(value: string, maxLength = 240) {
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export function isValidUsername(value: string) {
  return /^@?[a-zA-Z0-9._]{3,24}$/.test(value.trim());
}

export function isValidScore(value: string) {
  return /^[0-9]{1,2}-[0-9]{1,2}(,\s*[0-9]{1,2}-[0-9]{1,2}){0,2}$/.test(value.trim());
}

export function validateImageAsset(asset?: { uri?: string; fileSize?: number | null; mimeType?: string | null }) {
  if (!asset?.uri) return { ok: false, message: 'No file selected.' };
  const mime = asset.mimeType || '';
  const lower = asset.uri.toLowerCase();
  const looksLikeImage = mime.startsWith('image/') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp');
  if (!looksLikeImage) return { ok: false, message: 'Please choose an image file.' };
  if (asset.fileSize && asset.fileSize > 6 * 1024 * 1024) return { ok: false, message: 'Image must be under 6 MB.' };
  return { ok: true, message: 'File accepted.' };
}
