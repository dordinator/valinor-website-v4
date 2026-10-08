// ready: boolean or promise supplied by the actual page's essential readiness.
// There is deliberately no minimum duration or wait for an animation cycle.
export function mountInitialLoader(element,{ready,maxWaitMs=8000,...options}={}){
 const abort=new AbortController();let controller=null,finished=false,timer=0,raf=0;
 const finish=()=>{
  if(finished)return;finished=true;clearTimeout(timer);cancelAnimationFrame(raf);abort.abort();controller?.dispose();
  element.hidden=true;element.setAttribute('aria-hidden','true');element.dispatchEvent(new CustomEvent('loader:finished'));
 };
 if(ready===true){finish();return {finish,dispose:finish};}
 if(ready&&typeof ready.then==='function')ready.then(finish,finish);
 if(maxWaitMs>0)timer=setTimeout(finish,maxWaitMs);
 raf=requestAnimationFrame(async()=>{
  if(finished)return;
  try{
   const {startCube}=await import('./cube.js');if(finished)return;
   controller=await startCube(element.querySelector('canvas'),{...options,signal:abort.signal,onReady(){if(!finished)element.dataset.live='true';},onError(){element.dataset.live='false';}});
   if(finished)controller.dispose();
  }catch{element.dataset.live='false';}
 });
 return {finish,dispose:finish};
}
