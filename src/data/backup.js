import { ENTITY_TYPES, structuredData, validateBackup } from './structured.js';
import { loadAllData, mergeStructuredData } from '../storage/idb.js';
export async function exportStructuredBackup() {
 const local=await loadAllData();
 return {format:'gargottex-structured',version:1,exported_at:new Date().toISOString(),
   data:Object.fromEntries(ENTITY_TYPES.map(t=>[t,structuredData(local[t])]))};
}
export async function importStructuredBackup(input) {
 const data=validateBackup(input); // All validation precedes the single write transaction.
 await mergeStructuredData(data);
 return Object.fromEntries(ENTITY_TYPES.map(t=>[t,data[t].length]));
}
