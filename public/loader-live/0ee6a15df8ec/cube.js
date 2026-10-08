// Valinor Systems live loader. Native WebGL2; no Three.js, R3F or video.
// Material shader and lookup tables derived from Three.js r186 (MIT).
const ORDERS=[[3,0,6,7,4,1,2,8,5],[5,2,7,0,8,4,6,1,3],[6,4,0,2,7,3,8,5,1],[1,7,4,5,0,8,3,6,2]];
export const FIRST_TURN_END=6.6*Math.max(...Array.from({length:27},(_,i)=>{
 const depth=Math.floor(i/9),rank=ORDERS[0][(i+depth*3)%9];
 return .39+rank*.019+depth*.006+.35+i%3*.013;
}));
const SIGNS=[-1,1,1,-1,1,-1,1,1,-1];
const NORMALS=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const U=[[0,0,-1],[0,0,1],[1,0,0],[1,0,0],[1,0,0],[-1,0,0]];
const V=[[0,1,0],[0,1,0],[0,0,-1],[0,0,1],[0,1,0],[0,1,0]];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function rootRotation(x,y){const sx=Math.sin(x),cx=Math.cos(x),sy=Math.sin(y),cy=Math.cos(y);return new Float32Array([cy,sx*sy,-cx*sy,0,cx,sx,sy,-sx*cy,cx*cy]);}
function transform(m,v){return [m[0]*v[0]+m[3]*v[1]+m[6]*v[2],m[1]*v[0]+m[4]*v[1]+m[7]*v[2],m[2]*v[0]+m[5]*v[1]+m[8]*v[2]];}
function transpose(m){return [m[0],m[3],m[6],m[1],m[4],m[7],m[2],m[5],m[8]];}

export function makeGeometry(quality="light"){
 // Spend vertices on the curved exterior, not on the planar centre.
 // The .21/.79 breakpoints are the .07 outer radius in a 1/3 cubie.
 // Intermediate points sample the rounded edge at 15-degree intervals.
 const edge=.21*Math.tan(Math.PI/12),edge2=.21*Math.tan(Math.PI/6);
 const points=quality==="high"?Array.from({length:13},(_,i)=>i/12):[0,.21-edge2,.21-edge,.21,.79,.79+edge,.79+edge2,1];
 const segments=points.length-1,vertices=[],indices=[];
 for(let face=0;face<6;face++){
  const first=vertices.length/9;
  for(let row=0;row<=segments;row++)for(let col=0;col<=segments;col++){
   const u=points[col],v=points[row];
   const p=NORMALS[face].map((n,k)=>n/6+U[face][k]*(u-.5)/3+V[face][k]*(v-.5)/3);
   vertices.push(...p,...NORMALS[face],u,v,face);
  }
  for(let row=0;row<segments;row++)for(let col=0;col<segments;col++){
   const a=first+row*(segments+1)+col,b=a+1,c=a+segments+1,d=c+1;
   indices.push(c,a,d,a,b,d);
  }
 }
 return {vertices:new Float32Array(vertices),indices:new Uint16Array(indices)};
}

export async function startCube(canvas,{onReady=()=>{},onError=()=>{},staticOnly=false,reviewTime=null,profile=false,timeOffset=0,playbackRate=1,quality="light",onSlow=()=>{},settleAfterFirstTurn=false,onSettled=()=>{},onProgress=()=>{},signal:externalSignal}={}){
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 if(staticOnly||preference.matches||navigator.connection?.saveData){canvas.dataset.state='static';return {dispose(){},stats:{static:true}};}
 const abort=new AbortController(),signal=abort.signal;
 const base=new URL('.',import.meta.url);
 const fetchFile=async(name,kind='text')=>{const r=await fetch(new URL(name,base),{signal,priority:"low"});if(!r.ok)throw Error(`${name}: ${r.status}`);return r[kind]();};
 const packed=async name=>{
  const r=await fetch(new URL(name,base),{signal,priority:"low"});if(!r.ok)throw Error(`${name}: ${r.status}`);
  if(!globalThis.DecompressionStream)throw Error('Compressed texture support unavailable');
  return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
 };
 const loadImage=async name=>{const blob=await fetchFile(name,'blob'),url=URL.createObjectURL(blob),image=new Image();try{image.src=url;await image.decode();return image;}finally{URL.revokeObjectURL(url);}};
 const gl=canvas.getContext('webgl2',{alpha:false,antialias:true,powerPreference:'low-power',depth:true});
 if(!gl){canvas.dataset.state='fallback';onError(Error('WebGL2 unavailable'));return {dispose(){},stats:{static:true}};}
 const buffers=[],textures=[],shaders=[];let program=null,vao=null,raf=0,disposed=false,intersecting=true;
 const motion=new Float32Array(27*3),cells=new Float32Array(27*4);
 let resizeObserver,intersectionObserver;
 const stats={drawCalls:1,triangles:46656,geometryBytes:0,frames:0,frameTimes:[],renderTimes:[],gpuTimes:[]};
 const gpuExt=profile?gl.getExtension('EXT_disjoint_timer_query_webgl2'):null,queries=[];
 let pointerX=0,pointerY=0,px=0,py=0,time=0,last=0,lastDraw=0,profileStart=0,ready=false,settled=false,atRest=false;
 const high=quality==="high",maxPixels=high?768*768:512*512;
 let slowFrames=0,measuredFrames=0;
 function resize(){const size=Math.max(1,canvas.getBoundingClientRect().width);const dpr=Math.min(devicePixelRatio,high?2:1.5,Math.sqrt(maxPixels/(size*size)));const pixels=Math.max(1,Math.round(size*dpr));if(canvas.width!==pixels||canvas.height!==pixels){canvas.width=canvas.height=pixels;gl.viewport(0,0,pixels,pixels);}}
 function dispose(){
  if(disposed)return;disposed=true;abort.abort();cancelAnimationFrame(raf);
  externalSignal?.removeEventListener('abort',dispose);document.removeEventListener('visibilitychange',sync);preference.removeEventListener('change',sync);window.removeEventListener('pointermove',pointer);
  resizeObserver?.disconnect();intersectionObserver?.disconnect();queries.forEach(q=>gl.deleteQuery(q));
  buffers.forEach(b=>gl.deleteBuffer(b));textures.forEach(t=>gl.deleteTexture(t));shaders.forEach(s=>gl.deleteShader(s));if(vao)gl.deleteVertexArray(vao);if(program)gl.deleteProgram(program);
  gl.getExtension('WEBGL_lose_context')?.loseContext();
 }
 function pointer(e){pointerX=e.clientX/innerWidth*2-1;pointerY=1-e.clientY/innerHeight*2;}
 function sync(){cancelAnimationFrame(raf);last=lastDraw=0;if(!disposed&&!settled&&ready&&!document.hidden&&intersecting&&!preference.matches)raf=requestAnimationFrame(tick);}
 externalSignal?.addEventListener('abort',dispose,{once:true});
 if(externalSignal?.aborted){dispose();return {dispose,stats};}
 let draw=()=>{};
 function tick(now){
  if(disposed)return;
  raf=requestAnimationFrame(tick);
  // Display-aligned 30 fps at 60/120 Hz, without a continuous React loop.
  if(lastDraw&&now-lastDraw<(high?15:31))return;
  const interval=lastDraw?now-lastDraw:0;
  if(high&&interval>0&&measuredFrames<16){measuredFrames++;if(interval>34)slowFrames++;if(measuredFrames===16&&slowFrames>8)onSlow();}
  if(disposed)return;
  if(last)time+=Math.min((now-last)/1000,.1);last=now;lastDraw=now;
  px+=(pointerX-px)*.15;py+=(pointerY-py)*.15;
  if(profile&&gpuExt&&queries.length&&gl.getQueryParameter(queries[0],gl.QUERY_RESULT_AVAILABLE)){
   const q=queries.shift();if(!gl.getParameter(gpuExt.GPU_DISJOINT_EXT))stats.gpuTimes.push(gl.getQueryParameter(q,gl.QUERY_RESULT)/1e6);gl.deleteQuery(q);
  }
  const q=profile&&gpuExt&&profileStart&&now-profileStart>3000&&now-profileStart<33000&&stats.frames%8===0&&queries.length<4?gl.createQuery():null;
  if(q)gl.beginQuery(gpuExt.TIME_ELAPSED_EXT,q);
  const before=performance.now();draw(reviewTime??time);
  if(q){gl.endQuery(gpuExt.TIME_ELAPSED_EXT);queries.push(q);}
  if(profile){if(!profileStart)profileStart=now;if(now-profileStart>3000&&now-profileStart<33000&&interval<250){stats.frameTimes.push(interval);stats.renderTimes.push(performance.now()-before);}}
  stats.frames++;
  if(settleAfterFirstTurn)onProgress(clamp((timeOffset+time*playbackRate-3)/(FIRST_TURN_END-3),0,1));
  if(atRest&&!settled){settled=true;cancelAnimationFrame(raf);canvas.dataset.settled="true";onSettled();}
  if(stats.frames%30===0){
   canvas.dataset.second=String(Math.floor(time));
   if(profile){const p=(a,q)=>a.length?[...a].sort((x,y)=>x-y)[Math.min(a.length-1,Math.floor(a.length*q))]:null;canvas.dataset.profile=JSON.stringify({elapsed:(now-profileStart)/1000,samples:stats.frameTimes.length,fps:stats.frameTimes.length?1000*stats.frameTimes.length/stats.frameTimes.reduce((a,b)=>a+b,0):null,cpuP50:p(stats.renderTimes,.5),cpuP95:p(stats.renderTimes,.95),gpuP50:p(stats.gpuTimes,.5),gpuP95:p(stats.gpuTimes,.95),canvas:[canvas.width,canvas.height],draws:1,triangles:stats.triangles,geometryBytes:stats.geometryBytes});}
  }
 }
 try{
  const [vertex,rawFragment,material,tree,search,env,ltc1,ltc2,dfg]=await Promise.all([fetchFile('geometry.glsl.txt'),fetchFile('material.glsl.txt'),fetchFile('material.json','json'),loadImage(high?'trees-high.png':'trees.png'),loadImage(high?'search-high.png':'search.png'),packed(high?'environment-high.bin.gz':'environment.bin.gz'),packed('ltc1.bin.gz'),packed('ltc2.bin.gz'),packed('dfg.bin.gz')]);
  const fragment=high?rawFragment.replace(/#define CUBEUV_TEXEL_WIDTH .*/, '#define CUBEUV_TEXEL_WIDTH '+(1/768)).replace(/#define CUBEUV_TEXEL_HEIGHT .*/, '#define CUBEUV_TEXEL_HEIGHT '+(1/1024)).replace(/#define CUBEUV_MAX_MIP .*/, '#define CUBEUV_MAX_MIP 8.0'):rawFragment;
  if(high)material.environment={width:768,height:1024};
  const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);shaders.push(shader);return shader;};
  program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
  const parallel=gl.getExtension('KHR_parallel_shader_compile');
  if(parallel)while(!gl.getProgramParameter(program,parallel.COMPLETION_STATUS_KHR)){if(disposed)throw Error('Disposed');await new Promise(r=>setTimeout(r,8));}
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)+' '+shaders.map(s=>gl.getShaderInfoLog(s)).join('\n'));
  gl.useProgram(program);const locations=new Map();const loc=name=>{if(!locations.has(name))locations.set(name,gl.getUniformLocation(program,name));return locations.get(name);};
  for(const uniform of material.uniforms){
   const l=loc(uniform.name);if(l===null||uniform.type===gl.SAMPLER_2D)continue;const v=uniform.value;
   if(uniform.type===gl.FLOAT)gl.uniform1f(l,v);else if(uniform.type===gl.BOOL||uniform.type===gl.INT)gl.uniform1i(l,Number(v));
   else if(uniform.type===gl.FLOAT_VEC2)gl.uniform2fv(l,v);else if(uniform.type===gl.FLOAT_VEC3)gl.uniform3fv(l,v);else if(uniform.type===gl.FLOAT_VEC4)gl.uniform4fv(l,v);
   else if(uniform.type===gl.FLOAT_MAT3)gl.uniformMatrix3fv(l,false,v);else if(uniform.type===gl.FLOAT_MAT4)gl.uniformMatrix4fv(l,false,v);
  }
  let unit=0;
  const tex=(name,data,width,height,channels=4,image=false)=>{
   const t=gl.createTexture();textures.push(t);gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,image);
   if(image){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,data);gl.generateMipmap(gl.TEXTURE_2D);}
   else gl.texImage2D(gl.TEXTURE_2D,0,channels===2?gl.RG16F:gl.RGBA16F,width,height,0,channels===2?gl.RG:gl.RGBA,gl.HALF_FLOAT,new Uint16Array(data));
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,image?gl.LINEAR_MIPMAP_LINEAR:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   const anisotropy=gl.getExtension('EXT_texture_filter_anisotropic');if(image&&anisotropy)gl.texParameterf(gl.TEXTURE_2D,anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(4,gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
   gl.uniform1i(loc(name),unit++);
  };
  tex('uArtwork',tree,0,0,4,true);tex('uSearch',search,0,0,4,true);tex('envMap',env,material.environment.width,material.environment.height);tex('ltc_1',ltc1,64,64);tex('ltc_2',ltc2,64,64);tex('dfgLUT',dfg,16,16,2);
  const geometry=makeGeometry(quality);stats.triangles=geometry.indices.length/3*27;stats.geometryBytes=geometry.vertices.byteLength+geometry.indices.byteLength+cells.byteLength+motion.byteLength;
  vao=gl.createVertexArray();gl.bindVertexArray(vao);
  const buffer=(target,data,usage)=>{const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(target,b);gl.bufferData(target,data,usage);return b;};
  buffer(gl.ARRAY_BUFFER,geometry.vertices,gl.STATIC_DRAW);
  for(const [index,size,offset] of [[0,3,0],[1,3,3],[2,2,6],[3,1,8]]){gl.enableVertexAttribArray(index);gl.vertexAttribPointer(index,size,gl.FLOAT,false,36,offset*4);}
  buffer(gl.ELEMENT_ARRAY_BUFFER,geometry.indices,gl.STATIC_DRAW);
  for(let i=0;i<27;i++){const depth=Math.floor(i/9),sign=SIGNS[(i+depth*2)%9],axis=(i+depth)%2===0?1:2;cells.set([i%3-1,1-Math.floor(i%9/3),1-depth,axis*sign],i*4);}
  buffer(gl.ARRAY_BUFFER,cells,gl.STATIC_DRAW);gl.enableVertexAttribArray(4);gl.vertexAttribPointer(4,4,gl.FLOAT,false,16,0);gl.vertexAttribDivisor(4,1);
  const movement=buffer(gl.ARRAY_BUFFER,motion,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(5);gl.vertexAttribPointer(5,3,gl.FLOAT,false,12,0);gl.vertexAttribDivisor(5,1);
  const inverseBase=transpose(rootRotation(-.11,-.145));
  const lightData=material.uniforms.filter(u=>/^rectAreaLights\[\d\]\.(position|halfWidth|halfHeight)$/.test(u.name)).map(u=>({name:u.name,position:u.name.endsWith('.position'),local:transform(inverseBase,u.name.endsWith('.position')?[u.value[0],u.value[1],u.value[2]+8]:u.value)}));
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.frontFace(gl.CCW);gl.clearColor(0,0,0,1);
  draw=seconds=>{
   resize();const elapsed=timeOffset+seconds*playbackRate;atRest=settleAfterFirstTurn&&elapsed>=FIRST_TURN_END;const cycle=(settleAfterFirstTurn?Math.min(elapsed,FIRST_TURN_END):elapsed)%26.4,position=cycle/6.6,quarter=Math.floor(position),local=position-quarter,drift=Math.sin(cycle/26.4*Math.PI*2);
   for(let i=0;i<27;i++){const depth=Math.floor(i/9),rank=ORDERS[quarter][(i+depth*3)%9];const t=clamp((local-.39-rank*.019-depth*.006)/(.35+i%3*.013),0,1),turn=t*t*t*(t*(t*6-15)+10),angle=Math.sign(cells[i*4+3])*(quarter+turn)*Math.PI/2;motion.set([Math.sin(angle),Math.cos(angle),turn*turn*(3-2*turn)],i*3);}
   const root=rootRotation(-.11+py*.018+drift*.005,-.145+px*.024+drift*.007),shift=[px*.025,py*.025];
   gl.uniformMatrix3fv(loc('uRoot'),false,root);gl.uniform2fv(loc('uShift'),shift);gl.uniform4f(loc('uQuarter'),Math.sin(quarter*Math.PI/2),Math.cos(quarter*Math.PI/2),Math.sin((quarter+1)*Math.PI/2),Math.cos((quarter+1)*Math.PI/2));
   for(const light of lightData){const v=transform(root,light.local);if(light.position){v[0]+=shift[0];v[1]+=shift[1];v[2]-=8;}gl.uniform3fv(loc(light.name),v);}
   gl.bindBuffer(gl.ARRAY_BUFFER,movement);gl.bufferSubData(gl.ARRAY_BUFFER,0,motion);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawElementsInstanced(gl.TRIANGLES,geometry.indices.length,gl.UNSIGNED_SHORT,0,27);
  };
  resizeObserver=new ResizeObserver(()=>{if(ready&&!disposed)draw(reviewTime??time);});resizeObserver.observe(canvas);
  intersectionObserver=new IntersectionObserver(([entry])=>{intersecting=entry.isIntersecting;sync();});intersectionObserver.observe(canvas);
  document.addEventListener('visibilitychange',sync);preference.addEventListener('change',sync);window.addEventListener('pointermove',pointer,{passive:true});
  canvas.addEventListener('webglcontextlost',()=>{canvas.dataset.state='fallback';onError(Error('WebGL context lost'));dispose();},{once:true});
  draw(reviewTime??0);const error=gl.getError();if(error)throw Error(`WebGL error ${error}`);
  if(profile)canvas.dataset.assets=JSON.stringify(performance.getEntriesByType('resource').filter(r=>r.name.includes('/loader-live/')).map(r=>({file:r.name.split('/').pop(),encoded:r.encodedBodySize,decoded:r.decodedBodySize,transferred:r.transferSize})));
  ready=true;canvas.dataset.state='live';canvas.dataset.quality=quality;canvas.dataset.draws='1';canvas.dataset.geometryBytes=String(stats.geometryBytes);onReady();sync();
  return {dispose,stats};
 }catch(error){dispose();canvas.dataset.state='fallback';canvas.dataset.error=String(error);onError(error);return {dispose,stats};}
}
