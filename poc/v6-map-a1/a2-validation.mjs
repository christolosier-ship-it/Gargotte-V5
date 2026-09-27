import { compareNeutral } from "./a2-benchmark.mjs";
const status=document.querySelector("#bench-status");
const offline=document.querySelector("#offline-status");
const names=["ardera","trame-astrale","hautes-fermentations","royaume-soifs-eteintes"];
document.querySelector("#run-benchmark").addEventListener("click",async()=>{
 const button=document.querySelector("#run-benchmark");
 button.disabled=true;status.textContent="Comparaison neutre en cours sur cet appareil…";
 try{
  const result=await compareNeutral();
  const body=document.querySelector("#bench-results tbody");body.replaceChildren();
  for(const r of result.results){
   const tr=document.createElement("tr");
   const cells=[r.size+" px",r.format,r.supported?r.bytes:"non pris en charge",r.encode_ms??"—",r.decode_ms??"—",r.sampled_mad_rgb??"—",r.rgba_floor_bytes];
   for(const v of cells){const td=document.createElement("td");td.textContent=String(v);tr.append(td);}
   body.append(tr);
  }
  document.querySelector("#raw").value=JSON.stringify(result,null,2);
  status.textContent="Mesures locales terminées. Copier le JSON pour le compte rendu matériel.";
 }catch(error){status.textContent="Mesure impossible : "+String(error?.message||error);}
 finally{button.disabled=false;}
});
async function cacheInfo(){
 const registrations=await navigator.serviceWorker.getRegistrations();
 const own=registrations.find(r=>r.scope===new URL("./",location.href).href);
 const worker=own?.active;
 if(!worker)return {scope:own?.scope||null,active:false,controller:navigator.serviceWorker.controller?.scriptURL||null,all:false,checks:[false,false,false,false]};
 const status=await new Promise((resolve,reject)=>{
  const channel=new MessageChannel();
  const timeout=setTimeout(()=>reject(Error("Worker A2 ne répond pas au diagnostic cache")),7000);
  channel.port1.onmessage=event=>{clearTimeout(timeout);channel.port1.close();if(event.data?.error)reject(Error(event.data.error));else resolve(event.data);};
  worker.postMessage({type:"A2_CACHE_STATUS"},[channel.port2]);
 });
 return {...status,scope:own.scope,active:true,controller:navigator.serviceWorker.controller?.scriptURL||null};
}
async function showCache(){
 try{const d=await cacheInfo();offline.textContent="SW A2 actif : "+d.active+" ; pilote cette page : "+Boolean(d.controller?.endsWith("/a2-sw.js"))+" ; fonds présents : "+d.checks.filter(Boolean).length+"/4"+(navigator.onLine?" ; navigateur annonce en ligne":" ; navigateur annonce hors ligne");return d;}
 catch(error){offline.textContent="Diagnostic cache impossible : "+error.message;throw error;}
}
document.querySelector("#install-offline").addEventListener("click",async()=>{
 try{
  if(!("serviceWorker" in navigator)||!("caches" in window))throw Error("CacheStorage / Service Worker indisponible");
  offline.textContent="Préchargement des fonds publics…";
  const reg=await navigator.serviceWorker.register("./a2-sw.js",{scope:"./",updateViaCache:"none"});
  if(reg.installing)await new Promise((resolve,reject)=>{
   const worker=reg.installing;
   const fn=()=>{if(worker.state==="activated"){worker.removeEventListener("statechange",fn);resolve();}else if(worker.state==="redundant"){worker.removeEventListener("statechange",fn);reject(Error("Installation incomplète"));}};
   worker.addEventListener("statechange",fn);fn();
  });
  const result=await showCache();
  if(result.all)offline.textContent+=". Recharger cette page en ligne avant le test hors réseau.";
 }catch(error){offline.textContent="Échec installation : "+String(error?.message||error);}
});
document.querySelector("#check-offline").addEventListener("click",showCache);
navigator.serviceWorker?.addEventListener("controllerchange",()=>void showCache());
void showCache();
