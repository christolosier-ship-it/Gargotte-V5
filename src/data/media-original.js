// The original is never rendered through a canvas or re-encoded.
// Hashing/transfer will be performed by the separate media worker in phase 2.
export function originalMediaFields(file, {width, height}) {
  if (!(file instanceof Blob) || file.size === 0) throw new Error('Fichier média vide ou invalide');
  return {blob:file, byte_size:file.size, mime_type:file.type || 'application/octet-stream', width, height};
}
