import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

test('service worker serves cached shell offline and never intercepts Neon or writes', async () => {
  const handlers = {};
  const shell = new Response('cached shell');
  let networkCalls = 0;
  const context = vm.createContext({
    URL, Response,
    self: { location:{origin:'https://app.example'},addEventListener:(name,fn)=>{handlers[name]=fn;} },
    caches:{match:async request=>request.url==='https://app.example/index.html' ? shell : undefined},
    fetch:async()=>{networkCalls++;throw new Error('offline');},
  });
  vm.runInContext(await readFile('service-worker.js','utf8'),context);
  let result;
  handlers.fetch({request:{method:'GET',url:'https://app.example/index.html'},respondWith:promise=>{result=promise;}});
  assert.equal(await (await result).text(),'cached shell');
  assert.equal(networkCalls,1);
  for (const request of [
    {method:'GET',url:'https://example.neon.tech/neondb/auth'},
    {method:'POST',url:'https://app.example/save'},
  ]) handlers.fetch({request,respondWith:()=>assert.fail('must not intercept')});
  assert.equal(networkCalls,1);
});
