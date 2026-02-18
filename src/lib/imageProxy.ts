/**
 * Converts an absolute external image URL into a relative proxy URL.
 * The real URL is base64url-encoded so it is never visible in plain text
 * in the browser's network tab.
 *
 * Only absolute http/https URLs are proxied; relative paths or empty
 * values are returned unchanged.
 */
export function toProxyUrl(url: string | null | undefined): string | null | undefined {
  if (!url || !url.startsWith('http')) return url;
  const encoded = Buffer.from(url).toString('base64url');
  return `/api/images?url=${encoded}`;
}
