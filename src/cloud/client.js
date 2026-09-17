import { createClient } from '@neondatabase/neon-js';
export function createCloudClient(url) {
  if (!url) return null;
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search ||
      !parsed.hostname.endsWith('.neon.tech')) throw new Error('URL HTTPS publique Neon invalide');
  return createClient(url);
}
