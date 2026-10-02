// Local reproduction of the approved HTML mockup. No network API or bitmap text.
import './vendor/circletype-2.3.1.js';
import { PUBLIC_LOCATIONS } from './map-v2-cartography.js';
export const MAP_TEXT_SCALE=.75;
const configs={region:{font:34,pad:94,arc:12,weight:'700',ratio:.020,max:.24},place:{font:23,pad:66,arc:4,weight:'400',ratio:.0136,max:.20},river:{font:23,pad:30,arc:3,weight:'400',ratio:.0136,max:.17},ocean:{font:28,pad:78,arc:5,weight:'400',ratio:.018,max:.29}};
const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('fr',{granularity:'grapheme'}):null;
const split=text=>segmenter?Array.from(segmenter.segment(text),s=>s.segment):Array.from(text);
// Presentation offsets (%) keep the approved reference anchors separate from lettering.
const offsets={'Arbres-Colosses':[0,2],'Collines de la Vieille Lande':[-1,-3.5],'Saint-Fût-le-Petit':[-5,-2],'Ruisseau des Saules':[0,2],'La Chope Qui Colle':[1,1],'L’Avelorne':[-2,7],'La Rivombre':[0,2]};
const atlasOffsets={
  valdorie:offsets,
  ardera:{'Mer Boréale':[-2,-2]},
  austrebrume:{'Les Fjords de Nacrelune':[0,4],'Les Bois des Dernières Feuilles':[0,-3],'Les Monts du Voile':[-3,1],'Les Landes du Grand Hiver':[2,2],'Falaises de Nacrelune':[0,5],'Plateaux du Dernier Vent':[0,3],'Cascades de Brume':[0,-2],'Le Bassin des Lacs Sombres':[0,-4]},
  ferrecime:{'L’Échine d’Ardéra':[1,-3]},
  enfer:{'Le Tribunal de la Mesure':[0,2]}
};
let active=null;

for(const [id,locations] of Object.entries(PUBLIC_LOCATIONS)){
  atlasOffsets[id]={...atlasOffsets[id],...Object.fromEntries(locations.map(l=>[l.name,[l.label[0]-l.anchor[0],l.label[1]-l.anchor[1]]]))};
}

export function disposeMapToponyms(){active?.dispose();active=null;}

export function bindMapToponyms(frame){
  disposeMapToponyms();
  const mapId=frame.closest('[data-map-current]')?.dataset.mapCurrent;
  if(mapId==='entrevers'||!frame.querySelector('.map-mj-label,.map-dungeon-label')) return null;
  const probe=document.createElement('span');
  probe.className='map-mj-probe';probe.setAttribute('aria-hidden','true');frame.append(probe);
  const instances=new Map();
  let disposed=false,lastWidth=0,lastHeight=0,layoutFrame=0;
  function destroy(){for(const circle of instances.values()) circle.destroy();instances.clear();}
  function renderLabel(el,mapWidth){
    const kind=el.dataset.mjKind,config=configs[kind],text=el.dataset.mjText;
    const chars=split(text);
    const [dx,dy]=atlasOffsets[mapId]?.[text]||[0,0];
    el.style.left='calc(var(--x) + '+dx+'%)';el.style.top='calc(var(--y) + '+dy+'%)';
    el.replaceChildren();
    let font=Math.min(config.font,mapWidth*config.ratio);
    let padding=config.pad*font/config.font;
    // Keep the complete cartouche inside the image, without moving its anchor.
    const x=(parseFloat(el.style.getPropertyValue('--x'))+dx)/100;
    const available=Math.min(mapWidth*config.max,2*Math.min(x,1-x)*mapWidth-4);
    const measure=()=>{
      probe.style.fontWeight=config.weight;probe.style.fontSize=font+'px';
      probe.style.letterSpacing=kind==='ocean'?'.045em':'normal';
      return chars.map(char=>{probe.textContent=char;return probe.getBoundingClientRect().width;});
    };
    let metrics=measure(),length=metrics.reduce((a,b)=>a+b,0);
    if(length+padding>available){
      const scale=Math.max(0,available)/Math.max(1,length+padding);
      font*=scale;padding*=scale;metrics=measure();length=metrics.reduce((a,b)=>a+b,0);
    }
    // Owner decision: exactly 25% below the previous fitted lettering, at equal map width.
    font*=MAP_TEXT_SCALE;padding*=MAP_TEXT_SCALE;metrics=measure();length=metrics.reduce((a,b)=>a+b,0);
    const width=Math.min(available,length+padding);
    const sag=Math.min(config.arc*font/config.font,length*.032);
    const radius=length>0&&sag>0?length*length/(8*sag)+sag/2:10000;
    const center=width/2;
    const curve=x=>radius-Math.sqrt(Math.max(0,radius*radius-(x-center)*(x-center)));
    const top=14*font/config.font,paperHeight=font*1.3;
    let textTop=top+font*.15,height=top+paperHeight+curve(0)+14*font/config.font;
    el.style.width=width+'px';el.style.height=height+'px';
    el.dataset.fontSize=font.toFixed(2);
    const art=document.createElement('span');art.className='map-mj-art';art.setAttribute('aria-hidden','true');el.append(art);
    function polygon(inset){
      const points=[],steps=64;
      if(kind==='ocean'){
        const cap=Math.min(14*font/config.font,width*.12);
        const half=paperHeight/2-inset,capRadius=Math.max(.1,cap-inset),scale=font/config.font;
        const upper=t=>Math.sin(Math.PI*t)*(Math.sin(t*Math.PI*3+.35)*1.35+Math.sin(t*Math.PI*7)*.28)*scale;
        const lower=t=>Math.sin(Math.PI*t)*(Math.sin(t*Math.PI*3+1.3)*1.15+Math.sin(t*Math.PI*5)*.35)*scale;
        for(let i=0;i<=steps;i++){
          const t=i/steps,x=cap+(width-2*cap)*t;
          points.push(x+'px '+(top+curve(x)+inset+upper(t))+'px');
        }
        for(let i=1;i<=24;i++){
          const angle=-Math.PI/2+Math.PI*i/24;
          points.push((width-cap+capRadius*Math.cos(angle))+'px '+(top+curve(width-cap)+paperHeight/2+half*Math.sin(angle))+'px');
        }
        for(let i=steps-1;i>=0;i--){
          const t=i/steps,x=cap+(width-2*cap)*t;
          points.push(x+'px '+(top+paperHeight+curve(x)-inset+lower(t))+'px');
        }
        for(let i=1;i<24;i++){
          const angle=Math.PI/2+Math.PI*i/24;
          points.push((cap+capRadius*Math.cos(angle))+'px '+(top+curve(cap)+paperHeight/2+half*Math.sin(angle))+'px');
        }
      }else{
        const margin=1+inset;
        for(let i=0;i<=steps;i++){
          const x=margin+(width-2*margin)*i/steps;
          points.push(x+'px '+(top+curve(x)+inset+(i===0||i===steps?5*font/config.font:0))+'px');
        }
        for(let i=steps;i>=0;i--){
          const x=margin+(width-2*margin)*i/steps;
          points.push(x+'px '+(top+paperHeight+curve(x)-inset-(i===0||i===steps?5*font/config.font:0))+'px');
        }
      }
      return 'polygon('+points.join(',')+')';
    }
    if(kind==='region'||kind==='place'){
      const fullHeight=font*(kind==='region'?3.0:2.8),fullWidth=fullHeight*3;
      const visibleHeight=fullHeight*.60,cropY=fullHeight*.195;
      const cap=Math.min(fullWidth*.13,width*.20),artTop=6*font/config.font;
      const makeSlice=(x,w,sourceX,rotation=0)=>{
        const slice=document.createElement('span');slice.className='map-mj-slice';
        Object.assign(slice.style,{left:x+'px',top:(artTop+curve(x+w/2))+'px',width:(w+.6)+'px',height:visibleHeight+'px',backgroundSize:fullWidth+'px '+fullHeight+'px',backgroundPosition:(-sourceX)+'px '+(-cropY)+'px'});
        if(rotation){slice.style.transform='rotate('+rotation+'deg)';slice.style.transformOrigin='50% 50%';}
        art.append(slice);
      };
      makeSlice(0,cap,0,Math.asin((cap/2-center)/radius)*180/Math.PI);
      const middle=width-2*cap,sourceMiddle=fullWidth-2*cap,count=Math.max(1,Math.ceil(middle/2));
      for(let i=0;i<count;i++)makeSlice(cap+middle*i/count,middle/count,cap+sourceMiddle*i/count);
      makeSlice(width-cap,cap,fullWidth-cap,Math.asin((width-cap/2-center)/radius)*180/Math.PI);
      textTop=artTop+visibleHeight*.5-font*.5;height=artTop+visibleHeight+curve(0)+10*font/config.font;
      el.style.height=height+'px';
    }else{
      for(const [part,inset] of [['edge',0],['paper',1.6*font/config.font]]){
        const shape=document.createElement('span');shape.className='map-mj-shape map-mj-'+part;
        shape.style.clipPath=polygon(inset);art.append(shape);
      }
    }
    if(kind==='ocean')for(const side of ['left','right']){
      const ornament=document.createElement('span'),scale=font/config.font;
      ornament.className='map-mj-ornament';ornament.setAttribute('aria-hidden','true');
      ornament.style.top=(top+paperHeight/2-12+curve(side==='left'?20*scale:width-20*scale))+'px';
      ornament.style[side]=(7*scale-12.5*(1-scale))+'px';
      ornament.style.transform='scale('+(side==='right'?-scale:scale)+','+scale+')';
      ornament.append(document.createElement('i'));el.append(ornament);
    }
    const name=document.createElement('span');name.className='map-mj-text';
    name.style.fontSize=font+'px';name.style.fontWeight=config.weight;name.style.top=textTop+'px';
    name.setAttribute('aria-hidden','true');name.textContent=text;el.append(name);
    instances.set(el,new window.CircleType(name,split).radius(radius+font).forceWidth(false));
  }
  function redraw(){
    if(disposed||!frame.isConnected)return;
    destroy();lastWidth=frame.clientWidth;lastHeight=frame.clientHeight;
    for(const el of frame.querySelectorAll('.map-mj-label'))renderLabel(el,lastWidth);
    layoutDungeonCartouches(frame);
    cancelAnimationFrame(layoutFrame);
    // CircleType finishes its geometry on the next animation frame.
    layoutFrame=requestAnimationFrame(()=>{if(!disposed)layoutDungeonCartouches(frame);});
  }
  const resize=new ResizeObserver(()=>{if(frame.clientWidth!==lastWidth||frame.clientHeight!==lastHeight)redraw();});resize.observe(frame);
  // A view can be removed by the application shell, not only by Map navigation.
  const removal=new MutationObserver(()=>{if(!frame.isConnected)controller.dispose();});
  const main=frame.closest('#main-content');
  if(main){removal.observe(main,{childList:true});if(main.parentElement)removal.observe(main.parentElement,{childList:true});}
  const controller={redraw,clear:destroy,dispose(){
    if(disposed)return;disposed=true;cancelAnimationFrame(layoutFrame);resize.disconnect();removal.disconnect();destroy();probe.remove();
    if(active===controller)active=null;
  }};
  active=controller;redraw();
  document.fonts.load('23px "IM Fell English"').then(redraw).catch(()=>{});
  return controller;
}

// Only lettering moves to a nearby free slot. Feature points never move.
function layoutDungeonCartouches(frame){
  if(frame.closest('.is-dungeons-hidden'))return;
  const bounds=frame.getBoundingClientRect(),w=bounds.width,h=bounds.height;
  const labels=[...frame.querySelectorAll('.map-dungeon-label')];
  if(!w||!h||!labels.length)return;
  const gap=Math.max(3,w*.005);
  const rectangle=el=>{const r=el.getBoundingClientRect();return {x:r.left-bounds.left,y:r.top-bounds.top,w:r.width,h:r.height};};
  const occupied=[...frame.querySelectorAll('.map-mj-label,.map-dungeon-dot')].filter(el=>el.getClientRects().length).map(rectangle);
  const overlaps=(a,b)=>a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;
  for(const el of labels){el.style.fontSize=(MAP_TEXT_SCALE*Math.max(4.5,Math.min(16,w*.0155)))+'px';el.style.maxWidth=(MAP_TEXT_SCALE*Math.min(w*.22,220))+'px';}
  labels.sort((a,b)=>b.getBoundingClientRect().width*b.getBoundingClientRect().height-a.getBoundingClientRect().width*a.getBoundingClientRect().height);
  for(const el of labels){
    const size=el.getBoundingClientRect(),cx=Number(el.dataset.labelX)*w/100,cy=Number(el.dataset.labelY)*h/100;
    let best=null;
    // Deterministic, bounded search, also rerun after fonts/toggles/resizing.
    for(const range of [20,40]){
    for(let dx=-range;dx<=range;dx+=2)for(let dy=-range;dy<=range;dy+=2){
      const r={x:cx+dx*w/100-size.width/2,y:cy+dy*h/100-size.height/2,w:size.width,h:size.height};
      if(r.x<gap||r.y<gap||r.x+r.w>w-gap||r.y+r.h>h-gap)continue;
      const collisions=occupied.filter(o=>overlaps(r,o)).length;
      const score=collisions*100000+dx*dx+dy*dy*.8;
      if(!best||score<best.score)best={...r,score,collisions};
    }
    if(best?.collisions===0)break;
    }
    // Keep text in the image even on exceptionally narrow displays.
    best ||= {x:Math.max(gap,Math.min(w-size.width-gap,cx-size.width/2)),y:Math.max(gap,Math.min(h-size.height-gap,cy-size.height/2)),w:size.width,h:size.height,collisions:0};
    el.style.left=(best.x+best.w/2)+'px';el.style.top=(best.y+best.h/2)+'px';
    el.dataset.layoutCollisions=String(best.collisions);occupied.push(best);
    const pin=el.closest('.map-dungeon-pin'),x=parseFloat(pin.style.getPropertyValue('--x'))*w/100,y=parseFloat(pin.style.getPropertyValue('--y'))*h/100;
    const tx=Math.max(best.x,Math.min(x,best.x+best.w)),ty=Math.max(best.y,Math.min(y,best.y+best.h));
    const line=pin.querySelector('[data-dungeon-line="'+el.dataset.dungeonId+'"]');
    Object.assign(line.style,{left:x+'px',top:(y-1)+'px',width:Math.hypot(tx-x,ty-y)+'px',transform:'rotate('+Math.atan2(ty-y,tx-x)+'rad)'});
  }
}
