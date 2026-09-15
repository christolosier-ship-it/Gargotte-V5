import { build } from 'esbuild';
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const path of ['index.html','styles.css','manifest.webmanifest','seed-data.js','src','assets','templates']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
await build({ entryPoints:['src/cloud/client.js'], bundle:true, format:'esm', platform:'browser', target:['safari16'], outfile:'dist/src/cloud/client.js', minify:true });
const neonUrl = process.env.PUBLIC_NEON_DATABASE_URL || '';
if (neonUrl) {
 const url = new URL(neonUrl);
 if (url.protocol !== 'https:' || url.username || url.password || url.search || !url.hostname.endsWith('.neon.tech')) throw new Error('Expected public Neon HTTPS URL');
}
await writeFile('dist/config.js', `globalThis.GARGOTTEX_CONFIG = ${JSON.stringify({ neonUrl })};\n`);
const worker = await readFile('service-worker.js','utf8');
await writeFile('dist/service-worker.js', worker);
console.log('PWA built in dist/');
