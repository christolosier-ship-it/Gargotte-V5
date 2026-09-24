import {
  getAll,
  getAllByIndex,
  getById,
  getOneByIndex,
  countStore,
  putOne,
  transaction
} from "./idb.js";

const BLOB_FIELDS = ["blob", "preview_blob", "thumb_blob", "transparent_blob"];

function entityKey(type, id) {
  return `${String(type || "")}:${String(id || "")}`;
}

function isStaticPath(path) {
  const value = String(path || "").trim();
  return Boolean(value) && !value.startsWith("local-media/");
}

function metadataFromRecord(record) {
  if (!record) return null;
  const metadata = {};
  for (const [key, value] of Object.entries(record)) {
    if (BLOB_FIELDS.includes(key)) continue;
    metadata[key] = value;
  }
  metadata.has_blob = Boolean(record.blob);
  metadata.has_preview_blob = Boolean(record.preview_blob);
  metadata.has_thumb_blob = Boolean(record.thumb_blob);
  metadata.has_transparent_blob = Boolean(record.transparent_blob);
  metadata.blob_size = Number(record.blob?.size || record.original_size || 0);
  metadata.preview_blob_size = Number(record.preview_blob?.size || 0);
  metadata.thumb_blob_size = Number(record.thumb_blob?.size || 0);
  metadata.transparent_blob_size = Number(record.transparent_blob?.size || 0);
  return metadata;
}

export function mediaHasApprovedTransparent(metadata) {
  return Boolean(
    metadata?.has_transparent_blob &&
    metadata.transparent_review_status === "approved" &&
    metadata.transparent_audit?.pass === true
  );
}

export class MediaRepository {
  constructor() {
    this.metadataById = new Map();
    this.entityIds = new Map();
    this.pathIds = new Map();
    this.loadedEntities = new Set();
    this.catalog = [];
    this.catalogLoaded = false;
    this.catalogPromise = null;
    this.urlCache = new Map();
    this.urlPromises = new Map();
    this.metrics = {
      catalogScans: 0,
      entityLookups: 0,
      pathLookups: 0,
      metadataIdReads: 0,
      fullRecordReads: 0,
      objectUrlsCreated: 0,
      writes: 0
    };
  }

  debugSnapshot() {
    return {
      ...this.metrics,
      catalogLoaded: this.catalogLoaded,
      cachedMetadata: this.metadataById.size,
      loadedEntityKeys: this.loadedEntities.size,
      liveObjectUrls: this.urlCache.size
    };
  }

  getCachedById(id) {
    return this.metadataById.get(String(id || "")) || null;
  }

  getCatalog() {
    return this.catalogLoaded ? [...this.catalog] : [];
  }

  isCatalogLoaded() {
    return this.catalogLoaded;
  }

  isEntityLoaded(type, id) {
    return this.loadedEntities.has(entityKey(type, id));
  }

  getCachedForEntity(type, id) {
    const ids = this.entityIds.get(entityKey(type, id));
    if (!ids?.size) return [];
    return [...ids].map(mediaId => this.metadataById.get(mediaId)).filter(Boolean);
  }

  getCachedByPath(path) {
    const id = this.pathIds.get(String(path || ""));
    return id ? this.metadataById.get(id) || null : null;
  }

  removeFromIndexes(metadata) {
    if (!metadata?.id) return;
    const id = String(metadata.id);
    const key = entityKey(metadata.entity_type, metadata.entity_id);
    const ids = this.entityIds.get(key);
    if (ids) {
      ids.delete(id);
      if (!ids.size) this.entityIds.delete(key);
    }
    for (const field of ["path", "preview_path", "thumb_path", "transparent_path"]) {
      const path = String(metadata[field] || "");
      if (path && this.pathIds.get(path) === id) this.pathIds.delete(path);
    }
  }

  rememberMetadata(metadata, { includeInCatalog = this.catalogLoaded } = {}) {
    if (!metadata?.id) return null;
    const id = String(metadata.id);
    const previous = this.metadataById.get(id);
    if (previous) this.removeFromIndexes(previous);
    this.metadataById.set(id, metadata);

    const key = entityKey(metadata.entity_type, metadata.entity_id);
    if (metadata.entity_type && metadata.entity_id) {
      if (!this.entityIds.has(key)) this.entityIds.set(key, new Set());
      this.entityIds.get(key).add(id);
    }
    for (const field of ["path", "preview_path", "thumb_path", "transparent_path"]) {
      const path = String(metadata[field] || "");
      if (path) this.pathIds.set(path, id);
    }

    if (includeInCatalog) {
      const index = this.catalog.findIndex(item => String(item.id) === id);
      if (index >= 0) this.catalog[index] = metadata;
      else this.catalog.push(metadata);
    }
    return metadata;
  }

  rememberRecord(record, options = {}) {
    return this.rememberMetadata(metadataFromRecord(record), options);
  }

  async loadMetadataById(id) {
    const key = String(id || "");
    if (!key) return null;
    const cached = this.getCachedById(key);
    if (cached) return cached;
    this.metrics.metadataIdReads += 1;
    const record = await getById("media_assets", key);
    return record ? this.rememberRecord(record) : null;
  }

  async loadMetadataByPath(path) {
    const clean = String(path || "").trim();
    if (!clean) return null;
    const cached = this.getCachedByPath(clean);
    if (cached) return cached;
    this.metrics.pathLookups += 1;
    const record = await getOneByIndex("media_assets", "path", clean);
    return record ? this.rememberRecord(record) : null;
  }

  async loadMetadataForEntity(type, id) {
    const key = entityKey(type, id);
    if (!type || !id) return [];
    if (this.loadedEntities.has(key)) return this.getCachedForEntity(type, id);
    this.metrics.entityLookups += 1;
    const records = await getAllByIndex("media_assets", "entity_id", String(id));
    for (const record of records) {
      if (String(record?.entity_type || "") !== String(type)) continue;
      this.rememberRecord(record);
    }
    this.loadedEntities.add(key);
    return this.getCachedForEntity(type, id);
  }

  async loadCatalogMetadata({ force = false } = {}) {
    if (this.catalogLoaded && !force) return this.getCatalog();
    if (this.catalogPromise && !force) return this.catalogPromise;
    this.catalogPromise = (async () => {
      this.metrics.catalogScans += 1;
      const rows = [];
      await transaction(["media_assets"], "readonly", ({ media_assets: store }) => new Promise((resolve, reject) => {
        const req = store.openCursor();
        req.onerror = () => reject(req.error || new Error("Media metadata cursor failed"));
        req.onsuccess = () => {
          const cursor = req.result;
          if (!cursor) {
            resolve();
            return;
          }
          const metadata = metadataFromRecord(cursor.value);
          if (metadata) rows.push(metadata);
          cursor.continue();
        };
      }));
      rows.sort((a, b) => String(a.label || a.file_name || a.id || "").localeCompare(
        String(b.label || b.file_name || b.id || ""), "fr", { sensitivity: "base" }
      ));
      this.catalog = [];
      for (const metadata of rows) this.rememberMetadata(metadata, { includeInCatalog: true });
      this.catalogLoaded = true;
      return this.getCatalog();
    })();
    try {
      return await this.catalogPromise;
    } finally {
      this.catalogPromise = null;
    }
  }

  async count() {
    return countStore("media_assets");
  }

  activeKind(metadata, entityType = metadata?.entity_type) {
    if (!metadata) return "";
    if (mediaHasApprovedTransparent(metadata)) return "transparent";
    if (String(entityType || "") === "dungeons" && (metadata.has_blob || isStaticPath(metadata.path))) return "original";
    return "";
  }

  canDisplay(metadata, entityType = metadata?.entity_type) {
    return Boolean(this.activeKind(metadata, entityType));
  }

  cachedActiveUrl(metadata, entityType = metadata?.entity_type) {
    if (!metadata?.id) return "";
    const kind = this.activeKind(metadata, entityType);
    if (!kind) return "";
    const key = `${metadata.id}:${kind}`;
    const cached = this.urlCache.get(key);
    if (cached) return cached;
    if (kind === "original" && !metadata.has_blob && isStaticPath(metadata.path)) return metadata.path;
    return "";
  }

  async ensureActiveUrl(metadata, entityType = metadata?.entity_type) {
    if (!metadata?.id) return "";
    const kind = this.activeKind(metadata, entityType);
    if (!kind) return "";
    const key = `${metadata.id}:${kind}`;
    const cached = this.cachedActiveUrl(metadata, entityType);
    if (cached) return cached;
    if (this.urlPromises.has(key)) return this.urlPromises.get(key);

    const promise = (async () => {
      this.metrics.fullRecordReads += 1;
      const record = await getById("media_assets", String(metadata.id));
      if (!record) return "";
      const fresh = this.rememberRecord(record);
      const freshKind = this.activeKind(fresh, entityType);
      if (freshKind !== kind) return "";
      const blob = kind === "transparent" ? record.transparent_blob : record.blob;
      if (!blob) {
        if (kind === "original" && isStaticPath(record.path)) return record.path;
        return "";
      }
      const url = URL.createObjectURL(blob);
      this.urlCache.set(key, url);
      this.metrics.objectUrlsCreated += 1;
      return url;
    })();

    this.urlPromises.set(key, promise);
    try {
      return await promise;
    } finally {
      this.urlPromises.delete(key);
    }
  }

  revokeAssetUrls(id) {
    const prefix = `${String(id || "")}:`;
    for (const [key, url] of [...this.urlCache.entries()]) {
      if (!key.startsWith(prefix)) continue;
      try { URL.revokeObjectURL(url); } catch (_) {}
      this.urlCache.delete(key);
    }
  }

  revokeAllUrls() {
    for (const url of this.urlCache.values()) {
      try { URL.revokeObjectURL(url); } catch (_) {}
    }
    this.urlCache.clear();
    this.urlPromises.clear();
  }

  async getFullAsset(id) {
    const key = String(id || "");
    if (!key) return null;
    this.metrics.fullRecordReads += 1;
    const record = await getById("media_assets", key);
    if (record) this.rememberRecord(record);
    return record || null;
  }

  async getAllFullAssetsForExplicitBackup() {
    this.metrics.fullRecordReads += 1;
    return getAll("media_assets");
  }

  async saveAsset(record) {
    if (!record?.id) throw new Error("Média sans identifiant.");
    const previous = this.getCachedById(record.id);
    await putOne("media_assets", record);
    this.metrics.writes += 1;
    this.revokeAssetUrls(record.id);
    if (previous) this.removeFromIndexes(previous);
    const metadata = this.rememberRecord(record, { includeInCatalog: this.catalogLoaded });
    this.loadedEntities.delete(entityKey(previous?.entity_type, previous?.entity_id));
    this.loadedEntities.delete(entityKey(metadata?.entity_type, metadata?.entity_id));
    return metadata;
  }
}

export { metadataFromRecord, isStaticPath };
