export const ENTITY_TYPES = ['dungeons','creatures','heroes','npcs','quests','loot_items','interactables','brouhaha_effects','media_assets'];
// Only data from the nine business stores is exported; auth, meta and logs are never visited.
export function structuredData(value) {
  if (value instanceof Blob || value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return undefined;
  if (Array.isArray(value)) return value.map(structuredData).filter(v => v !== undefined);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([key]) => !['blob','thumb_blob'].includes(key))
      .map(([key,v]) => [key,structuredData(v)]).filter(([,v])=>v !== undefined));
  }
  if (value === undefined) return undefined;
  return value;
}
export function validateBackup(input) {
  if (input?.format !== 'gargottex-structured' || input.version !== 1 || !input.data) throw new Error('Sauvegarde JSON incompatible');
  const data = {};
  for (const type of ENTITY_TYPES) {
    if (!Array.isArray(input.data[type])) throw new Error(`Catégorie manquante : ${type}`);
    const ids = new Set();
    data[type] = input.data[type].map(row => {
      if (!row || typeof row !== 'object' || Array.isArray(row) || typeof row.id !== 'string' || !row.id || ids.has(row.id)) throw new Error(`Identifiant invalide ou dupliqué : ${type}`);
      ids.add(row.id);
      const clean = structuredData(row);
      if (JSON.stringify(clean) !== JSON.stringify(row)) throw new Error('Données binaires interdites dans le JSON structuré');
      return clean;
    });
  }
  return data;
}
