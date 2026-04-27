/**
 * Converts an absolute external image URL into a relative proxy URL.
 * The real URL is base64url-encoded so it is never visible in plain text
 * in the browser's network tab.
 *
 * Only absolute http/https URLs are proxied; relative paths or empty
 * values are returned unchanged.
 */
const LEGACY_PROXY_PREFIX = '/api/image-proxy?url=';

function unwrapLegacyProxy(url: string): string {
  let current = url;
  let depth = 0;
  while (current.startsWith(LEGACY_PROXY_PREFIX) && depth < 25) {
    current = decodeURIComponent(current.slice(LEGACY_PROXY_PREFIX.length));
    depth += 1;
  }
  return current;
}

export function toProxyUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url;
  const unwrapped = unwrapLegacyProxy(url);
  if (!unwrapped.startsWith('http')) return unwrapped;
  const encoded = Buffer.from(unwrapped).toString('base64url');
  return `/api/images?url=${encoded}`;
}
