import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { cp, mkdir, readFile, writeFile, rm, readdir, access } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const path of ['index.html','styles.css','manifest.webmanifest','seed-data.js','src','assets','templates']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
await build({ entryPoints:['src/cloud/client.js'], bundle:true, format:'esm', platform:'browser', target:['safari16'], outfile:'dist/src/cloud/client.js', minify:true });
// This public endpoint is intentionally restricted to the dedicated development branch.
const previewBranch = process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_GIT_COMMIT_REF === 'refactor/v6-neon-local-first';
const neonUrl = process.env.PUBLIC_NEON_DATABASE_URL || (previewBranch ? 'https://ep-billowing-union-b4sgvbcf.c-6.us-east-2.aws.neon.tech/neondb' : '');
if (process.env.VERCEL_ENV === 'production' && !neonUrl) throw new Error('Configure PUBLIC_NEON_DATABASE_URL for production after Neon migration approval');
if (neonUrl) {
 const url = new URL(neonUrl);
 if (url.protocol !== 'https:' || url.username || url.password || url.search || !url.hostname.endsWith('.neon.tech')) throw new Error('Expected public Neon HTTPS URL');
}
await writeFile('dist/config.js', `globalThis.GARGOTTEX_CONFIG = ${JSON.stringify({ neonUrl })};\n`);
let worker = await readFile('service-worker.js','utf8');
const match=worker.match(/const ASSETS = (\[[\s\S]*?\]);/);
const assets=JSON.parse(match[1]);
assets.push('./src/cloud/client.js');
const valid=[];
for(const asset of assets) {try {await access('dist/'+asset.replace(/^\.\//,'')); valid.push(asset);} catch {}}
const hash=createHash('sha256');
for(const asset of valid.filter(a=>a!=='./')) hash.update(await readFile('dist/'+asset.replace(/^\.\//,'')));
const version=hash.digest('hex').slice(0,16);
worker=worker.replace(/const CACHE = .*?;/,`const CACHE = "gargottex-v6-${version}";`).replace(match[0],`const ASSETS = ${JSON.stringify(valid)};`);
await writeFile('dist/service-worker.js', worker);
console.log('PWA built in dist/');
