// Non-mutating application review on a disposable browser profile.
// node scripts/verify-map-art.mjs (isolated static server on 4175)
// Or pass an existing preview URL as the first argument.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
const url=process.argv[2] || 'http://127.0.0.1:4175/index.html';
const server=process.argv[2]?null:spawn('python3',['-u','-m','http.server','4175','--bind','127.0.0.1'],{stdio:['ignore','pipe','pipe']});
if(server) await new Promise((resolve,reject)=>{
  server.stdout.on('data',chunk=>{if(String(chunk).includes('Serving HTTP')) resolve();});
  server.on('error',reject);
  server.on('exit',code=>reject(new Error(`Static server exited: ${code}`)));
});
const output='map-review-results';
await mkdir(output,{recursive:true});
const browser=await chromium.launch();
const report=[];
try {
  for (const [name,width,height] of [['desktop',1440,900],['tablet',834,1112],['mobile',390,844]]) {
    const context=await browser.newContext({viewport:{width,height}});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',r=>{if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`);});
    await page.goto(url);
    await page.waitForFunction(()=>document.documentElement.dataset.gargottexReady==='true');
    const ids=await page.evaluate(async()=>Object.keys((await import('./src/map-v2-data.js')).MAPS));
    for (const id of ids) {
      await page.evaluate(async id=>{
        const m=await import('./src/map-v2.js');
        m.openMap(id);
        const main=document.querySelector('#main-content');
        main.innerHTML=m.renderMapView(); m.bindMapViewActions(main);
      },id);
      await page.locator('.map-v2-frame.is-image-ready').waitFor();
      await page.locator('.map-v2-page img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
      // Labels are measured with their local font, not a transient fallback serif.
      await page.evaluate(()=>document.fonts.ready);
      for(const mode of ['overview','detail']) {
      if(mode==='detail') await page.locator('[data-map-action="toggle-detail"]').click();
      await page.mouse.move(0,0);
      await page.locator(mode==='detail'?'.map-v2-viewport':'.map-v2-frame').screenshot({path:`${output}/${name}-${id}-${mode}.png`});
      const metrics=await page.evaluate(()=>{
        const frame=document.querySelector('.map-v2-frame').getBoundingClientRect();
        const labels=[...document.querySelectorAll('.map-toponym')].filter(el=>el.getClientRects().length).map(el=>({name:el.textContent,rect:el.getBoundingClientRect().toJSON()}));
        const overlap=[];
        for(let i=0;i<labels.length;i++) for(let j=i+1;j<labels.length;j++) {
          const a=labels[i].rect,b=labels[j].rect;
          if(Math.min(a.right,b.right)>Math.max(a.left,b.left) && Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)) overlap.push([labels[i].name,labels[j].name]);
        }
        return {width:frame.width,height:frame.height,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,overlap};
      });
      report.push({viewport:name,map:id,mode,...metrics});
      if (metrics.overflow>2) throw new Error(`Horizontal overflow: ${name}/${id}`);
      }
    }
    if(errors.length) throw new Error(errors.join('\n'));
    await context.close();
  }
  await writeFile(`${output}/review.json`,JSON.stringify(report,null,2));
  console.log(JSON.stringify({captures:report.length,overlaps:report.filter(r=>r.overlap.length)},null,2));
  if(report.some(r=>r.overlap.length)) throw new Error('Overlapping labels; inspect review.json and captures.');
} finally { await browser.close(); server?.kill(); }
