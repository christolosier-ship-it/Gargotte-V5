// Local reproduction of the approved HTML mockup. No network API or bitmap text.
import './vendor/circletype-2.3.1.js';
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

export function disposeMapToponyms(){active?.dispose();active=null;}

export function bindMapToponyms(frame){
  disposeMapToponyms();
  const mapId=frame.closest('[data-map-current]')?.dataset.mapCurrent;
  if(mapId==='entrevers'||!frame.querySelector('.map-mj-label')) return null;
  const probe=document.createElement('span');
  probe.className='map-mj-probe';probe.setAttribute('aria-hidden','true');frame.append(probe);
  const instances=new Map();
  let disposed=false,lastWidth=0;
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
    destroy();lastWidth=frame.clientWidth;
    for(const el of frame.querySelectorAll('.map-mj-label'))renderLabel(el,lastWidth);
    // Only the presentation of these existing dungeon names moves. Sprite feet stay put.
    const dungeonOffsets={'Le Château Bastognac':[-4,-2],'Les Thermes de la Bonne Trempette':[-2,-2],'La Ruche Royale':[-7,3]};
    for(const el of frame.querySelectorAll('.map-dungeon-label')){
      const [dx,dy]=(mapId==='valdorie'?dungeonOffsets[el.textContent]:null)||[0,0];
      el.style.left='calc(var(--x) + '+dx+'%)';el.style.top='calc(var(--y) + '+dy+'%)';
    }
  }
  const resize=new ResizeObserver(()=>{if(frame.clientWidth!==lastWidth)redraw();});resize.observe(frame);
  // A view can be removed by the application shell, not only by Map navigation.
  const removal=new MutationObserver(()=>{if(!frame.isConnected)controller.dispose();});
  const main=frame.closest('#main-content');
  if(main){removal.observe(main,{childList:true});if(main.parentElement)removal.observe(main.parentElement,{childList:true});}
  const controller={redraw,clear:destroy,dispose(){
    if(disposed)return;disposed=true;resize.disconnect();removal.disconnect();destroy();probe.remove();
    if(active===controller)active=null;
  }};
  active=controller;redraw();
  document.fonts.load('23px "IM Fell English"').then(redraw).catch(()=>{});
  return controller;
}
