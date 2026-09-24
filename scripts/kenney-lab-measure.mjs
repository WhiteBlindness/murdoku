import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import process from 'node:process';

const BASELINE_SHA = 'aa384c2f69ab6168786abccf04f713ad3ae24a58';
const packs = [
  ['building-kit','Building Kit','building-kit','kenney_building-kit.zip','https://kenney.nl/assets/building-kit',[['roof-flat-square.glb',['building'],'structure'],['wall-doorway-square.glb',['building','commercial'],'structure'],['wall-window-square.glb',['building'],'structure']]],
  ['city-kit-commercial','City Kit (Commercial)','city-kit-commercial_2.1','kenney_city-kit-commercial_2.1.zip','https://kenney.nl/assets/city-kit-commercial',[['building-a.glb',['commercial'],'structure'],['detail-awning.glb',['commercial'],'detail'],['detail-parasol-a.glb',['commercial','cafe'],'detail']]],
  ['city-kit-industrial','City Kit (Industrial)','city-kit-industrial_2.0','kenney_city-kit-industrial_2.0.zip','https://kenney.nl/assets/city-kit-industrial',[['building-a.glb',['industrial'],'structure'],['detail-tank.glb',['industrial'],'storage'],['shipping-container-a.glb',['industrial'],'storage']]],
  ['city-kit-roads','City Kit (Roads)','city-kit-roads','kenney_city-kit-roads.zip','https://kenney.nl/assets/city-kit-roads',[['road-straight.glb',['road'],'ground'],['road-crossing.glb',['road'],'ground'],['road-bend-sidewalk.glb',['road','commercial'],'path']]],
  ['city-kit-suburban','City Kit (Suburban)','city-kit-suburban_20','kenney_city-kit-suburban_20.zip','https://kenney.nl/assets/city-kit-suburban',[['building-type-a.glb',['suburban'],'structure'],['fence-2x3.glb',['suburban'],'structure'],['fence-low.glb',['suburban'],'structure'],['driveway-short.glb',['suburban'],'ground'],['driveway-long.glb',['suburban'],'ground'],['path-short.glb',['suburban'],'path'],['path-stones-messy.glb',['suburban'],'path'],['tree-large.glb',['suburban'],'vegetation'],['tree-small.glb',['suburban'],'vegetation']]],
  ['factory-kit','Factory Kit','factory-kit_3.0','kenney_factory-kit_3.0.zip','https://kenney.nl/assets/factory-kit',[['machine.glb',['industrial'],'detail'],['conveyor-long.glb',['industrial'],'surface'],['crane.glb',['industrial'],'detail'],['box-large.glb',['industrial'],'storage']]],
  ['food-kit','Food Kit','food-kit','kenney_food-kit.zip','https://kenney.nl/assets/food-kit',[['cup-coffee.glb',['cafe'],'detail'],['cake.glb',['cafe'],'detail'],['plate-dinner.glb',['cafe'],'surface'],['glass-wine.glb',['cafe'],'detail']]],
  ['furniture-kit','Furniture Kit','furniture-kit','kenney_furniture-kit.zip','https://kenney.nl/assets/furniture-kit',[['chair.glb',['reference','cafe'],'seating'],['table.glb',['reference','cafe'],'surface'],['wall.glb',['reference','building'],'structure'],['doorway.glb',['reference','building'],'structure']]],
  ['graveyard-kit','Graveyard Kit','graveyard-kit_5.0','kenney_graveyard-kit_5.0.zip','https://kenney.nl/assets/graveyard-kit',[['grave.glb',['graveyard'],'detail'],['gravestone-cross.glb',['graveyard'],'detail'],['crypt-small.glb',['graveyard'],'structure']]],
  ['holiday-kit','Holiday Kit','holiday-kit','kenney_holiday-kit.zip','https://kenney.nl/assets/holiday-kit',[['cabin-wall.glb',['holiday'],'structure'],['cabin-doorway.glb',['holiday'],'structure'],['cabin-wall-wreath.glb',['holiday'],'structure'],['cabin-window-large.glb',['holiday'],'structure'],['cabin-roof-snow.glb',['holiday'],'structure'],['cabin-roof-snow-chimney.glb',['holiday'],'structure'],['cabin-fence.glb',['holiday'],'boundary'],['floor-wood-snow.glb',['holiday'],'ground'],['tree-decorated-snow.glb',['holiday'],'vegetation'],['present-a-cube.glb',['holiday'],'clue-object'],['lantern.glb',['holiday'],'clue-object'],['snowman.glb',['holiday'],'detail']]],
  ['mini-market','Mini Market','mini-market','kenney_mini-market.zip','https://kenney.nl/assets/mini-market',[['shelf-boxes.glb',['market'],'storage'],['shelf-bags.glb',['market'],'storage'],['shelf-end.glb',['market'],'storage'],['display-bread.glb',['market'],'clue-object'],['display-fruit.glb',['market'],'clue-object'],['freezer.glb',['market'],'storage'],['shopping-cart.glb',['market'],'clue-object'],['shopping-basket.glb',['market'],'clue-object'],['cash-register.glb',['market'],'detail'],['wall.glb',['market'],'structure'],['wall-window.glb',['market'],'structure'],['character-employee.glb',['market'],'human-scale']]],
  ['minigolf-kit','Minigolf Kit','minigolf-kit','kenney_minigolf-kit.zip','https://kenney.nl/assets/minigolf-kit',[['straight.glb',['minigolf'],'ground'],['corner.glb',['minigolf'],'ground'],['start.glb',['minigolf'],'ground'],['hole-round.glb',['minigolf'],'clue-object'],['hole-square.glb',['minigolf'],'clue-object'],['windmill.glb',['minigolf'],'obstacle'],['obstacle-diamond.glb',['minigolf'],'obstacle'],['ramp.glb',['minigolf'],'ground'],['hill-square.glb',['minigolf'],'ground'],['tunnel-wide.glb',['minigolf'],'obstacle'],['flag-red.glb',['minigolf'],'clue-object'],['ball-red.glb',['minigolf'],'clue-object'],['castle.glb',['minigolf'],'detail']]],
  ['modular-buildings','Modular Buildings','modular-buildings','kenney_modular-buildings.zip','https://kenney.nl/assets/modular-buildings',[['building-sample-house-a.glb',['building'],'structure'],['building-window-balcony.glb',['building'],'structure'],['roof-gable.glb',['building'],'structure']]],
  ['nature-kit','Nature Kit','nature-kit','kenney_nature-kit.zip','https://kenney.nl/assets/nature-kit',[['tree_default.glb',['reference','suburban'],'vegetation'],['plant_bush.glb',['suburban'],'vegetation'],['path_stone.glb',['suburban'],'path'],['fence_simple.glb',['suburban'],'structure']]],
  ['retro-urban-kit','Retro Urban Kit','retro-urban-kit','kenney_retro-urban-kit.zip','https://kenney.nl/assets/retro-urban-kit',[['road-asphalt-damaged.glb',['road','retro-urban'],'ground'],['wall-a-painted.glb',['retro-urban'],'structure'],['truck-grey-cargo.glb',['retro-urban'],'detail']]],
  ['survival-kit','Survival Kit','survival-kit','kenney_survival-kit.zip','https://kenney.nl/assets/survival-kit',[['tent.glb',['survival'],'structure'],['campfire-pit.glb',['survival'],'detail'],['bedroll.glb',['survival'],'surface']]],
];

const prototypes = [
  ['suburban','Casa suburbana',['city-kit-suburban','nature-kit'],['city-kit-suburban--building-type-a','city-kit-suburban--fence-2x3','city-kit-suburban--fence-low','city-kit-suburban--driveway-short','city-kit-suburban--driveway-long','city-kit-suburban--path-short','city-kit-suburban--path-stones-messy','city-kit-suburban--tree-large','city-kit-suburban--tree-small','nature-kit--tree-default','nature-kit--plant-bush','nature-kit--path-stone','nature-kit--fence-simple']],
  ['cafe','Café',['food-kit','furniture-kit','city-kit-commercial'],['food-kit--cup-coffee','food-kit--cake','food-kit--plate-dinner','food-kit--glass-wine','furniture-kit--chair','furniture-kit--table','city-kit-commercial--detail-awning','city-kit-commercial--detail-parasol-a']],
  ['market','Supermercado de bairro',['mini-market'],['mini-market--shelf-boxes','mini-market--shelf-bags','mini-market--shelf-end','mini-market--display-bread','mini-market--display-fruit','mini-market--freezer','mini-market--shopping-cart','mini-market--shopping-basket','mini-market--cash-register','mini-market--wall','mini-market--wall-window','mini-market--character-employee']],
  ['graveyard','Cemitério',['graveyard-kit'],['graveyard-kit--grave','graveyard-kit--gravestone-cross','graveyard-kit--crypt-small']],
  ['industrial','Fábrica e zona industrial',['factory-kit','city-kit-industrial'],['factory-kit--machine','factory-kit--conveyor-long','factory-kit--crane','factory-kit--box-large','city-kit-industrial--building-a','city-kit-industrial--detail-tank','city-kit-industrial--shipping-container-a']],
  ['commercial','Fachada comercial',['city-kit-commercial'],['city-kit-commercial--building-a','city-kit-commercial--detail-awning','city-kit-commercial--detail-parasol-a']],
  ['road','Frente urbana e estrada',['city-kit-roads','retro-urban-kit'],['city-kit-roads--road-straight','city-kit-roads--road-crossing','city-kit-roads--road-bend-sidewalk','retro-urban-kit--road-asphalt-damaged']],
  ['survival','Acampamento',['survival-kit'],['survival-kit--tent','survival-kit--campfire-pit','survival-kit--bedroll']],
  ['holiday','Aldeia de Natal',['holiday-kit'],['holiday-kit--cabin-wall','holiday-kit--cabin-doorway','holiday-kit--cabin-wall-wreath','holiday-kit--cabin-window-large','holiday-kit--cabin-roof-snow','holiday-kit--cabin-roof-snow-chimney','holiday-kit--cabin-fence','holiday-kit--floor-wood-snow','holiday-kit--tree-decorated-snow','holiday-kit--present-a-cube','holiday-kit--lantern','holiday-kit--snowman']],
  ['minigolf','Minigolfe',['minigolf-kit'],['minigolf-kit--straight','minigolf-kit--corner','minigolf-kit--start','minigolf-kit--hole-round','minigolf-kit--hole-square','minigolf-kit--windmill','minigolf-kit--obstacle-diamond','minigolf-kit--ramp','minigolf-kit--hill-square','minigolf-kit--tunnel-wide','minigolf-kit--flag-red','minigolf-kit--ball-red','minigolf-kit--castle']],
  ['building-modular','Edifício modular',['building-kit','modular-buildings'],['building-kit--roof-flat-square','building-kit--wall-doorway-square','building-kit--wall-window-square','modular-buildings--building-sample-house-a','modular-buildings--building-window-balcony','modular-buildings--roof-gable']],
];
const componentReaders = new Map([
  [5120,[1,(b,o)=>b.readInt8(o)]],[5121,[1,(b,o)=>b.readUInt8(o)]],
  [5122,[2,(b,o)=>b.readInt16LE(o)]],[5123,[2,(b,o)=>b.readUInt16LE(o)]],
  [5125,[4,(b,o)=>b.readUInt32LE(o)]],[5126,[4,(b,o)=>b.readFloatLE(o)]],
]);

function argsFrom(argv) {
  const out = {};
  for (let i=0;i<argv.length;i++) {
    if (argv[i]==='--selected-only' || argv[i]==='--copy-selected') out[argv[i].slice(2)] = true;
    else if (argv[i].startsWith('--') && argv[i+1]) out[argv[i].slice(2)] = argv[++i];
    else throw new Error('Argumento inválido: '+argv[i]);
  }
  return out;
}
function inside(root,target) {
  const relative=path.relative(path.resolve(root),path.resolve(target));
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Saída fora do worktree: '+target);
}
function r(v) { return Number.isFinite(v) ? Number(v.toFixed(5)) : null; }
function v3(a) { return a.map(r); }
function slug(s) { return s.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function idFor(packId,name) { return packId+'--'+slug(path.basename(name,path.extname(name))); }
async function walk(dir) {
  const out=[];
  for (const ent of await fs.readdir(dir,{withFileTypes:true})) {
    const full=path.join(dir,ent.name);
    if (ent.isDirectory()) out.push(...await walk(full));
    else if (ent.isFile() && ent.name.toLowerCase().endsWith('.glb')) out.push(full);
  }
  return out.sort();
}
async function shaFile(file) { return crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'); }
function parseGlb(b) {
  if (b.toString('ascii',0,4)!=='glTF' || b.readUInt32LE(4)!==2 || b.readUInt32LE(8)!==b.length) throw new Error('Cabeçalho ou versão GLB inválidos');
  const chunks=[]; let json=null;
  for(let o=12;o<b.length;) {
    const n=b.readUInt32LE(o), type=b.readUInt32LE(o+4), data=b.subarray(o+8,o+8+n);
    if(o+8+n>b.length) throw new Error('Bloco GLB truncado');
    chunks.push({type,data});
    if(type===0x4e4f534a) json=JSON.parse(data.toString('utf8').replaceAll('\0','').trim());
    o+=8+n;
  }
  if(!json) throw new Error('JSON GLB em falta');
  return {json,chunks};
}
function nodeMatrix(n={}) {
  if(n.matrix) return n.matrix;
  const t=n.translation||[0,0,0], q=n.rotation||[0,0,0,1], s=n.scale||[1,1,1];
  const [x,y,z,w]=q, x2=x+x,y2=y+y,z2=z+z, xx=x*x2,xy=x*y2,xz=x*z2,yy=y*y2,yz=y*z2,zz=z*z2,wx=w*x2,wy=w*y2,wz=w*z2;
  return [(1-yy-zz)*s[0],(xy+wz)*s[0],(xz-wy)*s[0],0,(xy-wz)*s[1],(1-xx-zz)*s[1],(yz+wx)*s[1],0,(xz+wy)*s[2],(yz-wx)*s[2],(1-xx-yy)*s[2],0,t[0],t[1],t[2],1];
}
function mul(a,b) {
  const o=new Array(16).fill(0);
  for(let c=0;c<4;c++) for(let row=0;row<4;row++) o[c*4+row]=a[row]*b[c*4]+a[4+row]*b[c*4+1]+a[8+row]*b[c*4+2]+a[12+row]*b[c*4+3];
  return o;
}
function point(m,x,y,z) {
  const w=m[3]*x+m[7]*y+m[11]*z+m[15]||1;
  return [(m[0]*x+m[4]*y+m[8]*z+m[12])/w,(m[1]*x+m[5]*y+m[9]*z+m[13])/w,(m[2]*x+m[6]*y+m[10]*z+m[14])/w];
}
async function buffersFor(parsed,file) {
  const bin=parsed.chunks.find(c=>c.type===0x004e4942)?.data, out=[];
  for(const [i,b] of (parsed.json.buffers||[]).entries()) {
    if(!b.uri) out[i]=bin||Buffer.alloc(0);
    else if(b.uri.startsWith('data:')) out[i]=Buffer.from(b.uri.slice(b.uri.indexOf(',')+1),'base64');
    else out[i]=await fs.readFile(path.resolve(path.dirname(file),decodeURIComponent(b.uri)));
  }
  return out;
}
function texInfoOf(gltf) {
  const refs=new Map(), channels=[['baseColor',m=>m.pbrMetallicRoughness?.baseColorTexture],['metallicRoughness',m=>m.pbrMetallicRoughness?.metallicRoughnessTexture],['normal',m=>m.normalTexture],['occlusion',m=>m.occlusionTexture],['emissive',m=>m.emissiveTexture]];
  for(const [mi,m] of (gltf.materials||[]).entries()) for(const [channel,get] of channels) {
    const ti=get(m)?.index, ii=Number.isInteger(ti)?gltf.textures?.[ti]?.source:null;
    if(!Number.isInteger(ii)) continue;
    const xs=refs.get(ii)||[]; xs.push({material:m.name||'material-'+mi,channel}); refs.set(ii,xs);
  }
  const images=(gltf.images||[]).map((im,i)=>{
    const bv=Number.isInteger(im.bufferView)?gltf.bufferViews?.[im.bufferView]:null;
    return {index:i,name:im.name||null,mimeType:im.mimeType||bv?.mimeType||(im.uri?.match(/^data:([^;,]+)/)?.[1])||null,embedding:im.uri?(im.uri.startsWith('data:')?'data-uri':'external-uri'):'buffer-view',uri:im.uri||null,byteLength:bv?.byteLength??null,references:refs.get(i)||[],colormap:/colou?r.?map/i.test((im.name||'')+' '+(im.uri||''))};
  });
  const transformCount=(gltf.materials||[]).reduce((n,m)=>{
    const infos=[m.pbrMetallicRoughness?.baseColorTexture,m.pbrMetallicRoughness?.metallicRoughnessTexture,m.normalTexture,m.occlusionTexture,m.emissiveTexture].filter(Boolean);
    return n+infos.filter(i=>i.extensions?.KHR_texture_transform).length;
  },0);
  return {images,transformCount,channels};
}
async function copyGlb(source,parsed,gltf,file,packRoot,assetId,publicRoot,textureRows) {
  const target=path.join(publicRoot,assetId+'.glb'); await fs.mkdir(publicRoot,{recursive:true});
  if((gltf.buffers||[]).some(b=>b.uri&&!b.uri.startsWith('data:'))) throw new Error('Modelo selecionado referencia um buffer externo');
  let changed=false;
  for(const [i,im] of (gltf.images||[]).entries()) {
    if(!im.uri||im.uri.startsWith('data:')) continue;
    const sourceTexture=path.resolve(path.dirname(file),decodeURIComponent(im.uri.split(/[?#]/,1)[0]));
    const rel=path.relative(packRoot,sourceTexture);
    if(rel.startsWith('..')||path.isAbsolute(rel)) throw new Error('Textura fora do pacote: '+im.uri);
    const ext=path.extname(sourceTexture)||'.bin', name=i+'-'+slug(path.basename(sourceTexture,ext))+ext.toLowerCase();
    const relOut=path.join('textures',assetId,name), destination=path.join(publicRoot,relOut);
    await fs.mkdir(path.dirname(destination),{recursive:true}); await fs.copyFile(sourceTexture,destination);
    im.uri=relOut.split(path.sep).join('/'); im.name=im.name||path.basename(sourceTexture); changed=true;
    if(textureRows[i]) textureRows[i].publicUri='/kenney-lab/'+im.uri;
  }
  if(!changed) { await fs.writeFile(target,source); return '/kenney-lab/'+assetId+'.glb'; }
  const chunks=parsed.chunks.map(c=>{
    if(c.type!==0x4e4f534a) return c;
    let data=Buffer.from(JSON.stringify(gltf)); const pad=(4-data.length%4)%4;
    if(pad) data=Buffer.concat([data,Buffer.alloc(pad,0x20)]);
    return {type:c.type,data};
  });
  const length=12+chunks.reduce((n,c)=>n+8+c.data.length,0), out=Buffer.alloc(length);
  out.write('glTF',0,'ascii'); out.writeUInt32LE(2,4); out.writeUInt32LE(length,8);
  let offset=12;
  for(const c of chunks) { out.writeUInt32LE(c.data.length,offset); out.writeUInt32LE(c.type,offset+4); c.data.copy(out,offset+8); offset+=8+c.data.length; }
  await fs.writeFile(target,out); return '/kenney-lab/'+assetId+'.glb';
}
async function measure(file,packRoot,pack,zipHash,selection,opts) {
  const bytes=await fs.readFile(file), parsed=parseGlb(bytes), g=parsed.json, buffers=await buffersFor(parsed,file), cache=new Map();
  const data=(i)=>{
    if(cache.has(i)) return cache.get(i);
    const a=g.accessors?.[i], bv=g.bufferViews?.[a?.bufferView], info=a&&componentReaders.get(a.componentType);
    if(!a||a.type!=='VEC3'||!bv||!info||a.sparse) throw new Error('Accessor POSITION não suportado');
    const [sz,read]=info, b=buffers[bv.buffer??0], stride=bv.byteStride||sz*3, base=(bv.byteOffset||0)+(a.byteOffset||0), arr=new Float64Array(a.count*3);
    for(let n=0;n<a.count;n++) for(let axis=0;axis<3;axis++) arr[n*3+axis]=read(b,base+n*stride+axis*sz);
    cache.set(i,arr); return arr;
  };
  const tex=texInfoOf(g), materials=(g.materials||[]).map((m,i)=>{
    const bindings=[];
    for(const [channel,get] of tex.channels) if(get(m)) bindings.push(channel);
    return {index:i,name:m.name||null,alphaMode:m.alphaMode||'OPAQUE',doubleSided:Boolean(m.doubleSided),unlit:Boolean(m.extensions?.KHR_materials_unlit),baseColorFactor:m.pbrMetallicRoughness?.baseColorFactor||[1,1,1,1],metallicFactor:m.pbrMetallicRoughness?.metallicFactor??1,roughnessFactor:m.pbrMetallicRoughness?.roughnessFactor??1,textureBindings:bindings};
  });
  const parents=new Set(); for(const n of g.nodes||[]) for(const c of n.children||[]) parents.add(c);
  const roots=g.scenes?.[Number.isInteger(g.scene)?g.scene:0]?.nodes||(g.nodes||[]).map((_,i)=>i).filter(i=>!parents.has(i));
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity],rootOrigins=[];
  let vertices=0,triangles=0,instances=0,primitives=0; const meshIds=new Set(),usedMaterialIds=new Set();
  const walk=(ni,parent,chain)=>{
    const node=(g.nodes||[])[ni]; if(!node)return;
    if(chain.has(ni)) throw new Error('Ciclo na hierarquia glTF');
    const next=new Set(chain);next.add(ni);const world=mul(parent,nodeMatrix(node));
    if(Number.isInteger(node.mesh)) {
      instances++;meshIds.add(node.mesh);
      for(const p of g.meshes?.[node.mesh]?.primitives||[]) {
        primitives++;const ai=p.attributes?.POSITION;if(!Number.isInteger(ai))continue;
        const arr=data(ai), count=g.accessors[ai].count;vertices+=count;
        const mode=p.mode??4, indexCount=Number.isInteger(p.indices)?g.accessors[p.indices]?.count:count;if(Number.isInteger(p.material))usedMaterialIds.add(p.material);
        if(mode===4)triangles+=Math.floor(indexCount/3);else if(mode===5||mode===6)triangles+=Math.max(0,indexCount-2);
        for(let k=0;k<arr.length;k+=3) { const q=point(world,arr[k],arr[k+1],arr[k+2]);for(let a=0;a<3;a++){lo[a]=Math.min(lo[a],q[a]);hi[a]=Math.max(hi[a],q[a]);} }
      }
    }
    for(const child of node.children||[])walk(child,world,next);
  };
  const identity=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
  for(const ri of roots){const n=g.nodes?.[ri]||{},m=nodeMatrix(n);rootOrigins.push({node:n.name||'node-'+ri,nodeIndex:ri,origin:v3(point(m,0,0,0)),translation:n.translation||[0,0,0],rotation:n.rotation||[0,0,0,1],scale:n.scale||[1,1,1],matrix:n.matrix||null});walk(ri,identity,new Set());}
  const bounds=lo.every(Number.isFinite)?{min:v3(lo),max:v3(hi),size:v3(lo.map((x,i)=>hi[i]-x)),center:v3(lo.map((x,i)=>(x+hi[i])/2))}:null;
  const origin=rootOrigins[0]?.origin||[0,0,0], groundOffsetY=bounds?r(bounds.min[1]-origin[1]):null;
  const record={id:idFor(pack[0],path.basename(file)),packageId:pack[0],name:path.basename(file),sourceRelativePath:path.relative(packRoot,file).split(path.sep).join('/'),sourceZipName:pack[3],sourceZipSha256:zipHash,sourceGlbSha256:crypto.createHash('sha256').update(bytes).digest('hex'),officialUrl:pack[4],license:'CC0',fileBytes:bytes.length,coordinateSystem:{up:'Y',handedness:'right-handed',units:'model-units'},bounds,pivot:{type:'gltf-scene-root-origin',origins:rootOrigins,firstRootOrigin:v3(origin),boundsMinFromFirstRoot:bounds?v3(bounds.min.map((x,i)=>x-origin[i])):null,floorContactOffsetY:groundOffsetY,touchesGroundAtOrigin:groundOffsetY!==null&&Math.abs(groundOffsetY)<=0.005},vertexCount:vertices,triangleCount:triangles,nodeCount:(g.nodes||[]).length,rootNodeCount:roots.length,meshInstanceCount:instances,primitiveCount:primitives,unreferencedMeshCount:Math.max(0,(g.meshes||[]).length-meshIds.size),materialCount:(g.materials||[]).length,usedMaterialCount:usedMaterialIds.size,hasUnlitMaterial:materials.some(m=>m.unlit),textureTransformCount:tex.transformCount,textureSummary:{imageCount:tex.images.length,referencedImageCount:tex.images.filter(x=>x.references.length).length,embeddedImageCount:tex.images.filter(x=>x.embedding!=='external-uri').length,externalImageCount:tex.images.filter(x=>x.embedding==='external-uri').length,colormapImageCount:tex.images.filter(x=>x.colormap).length},textures:tex.images,materials,animationCount:(g.animations||[]).length,skinCount:(g.skins||[]).length,extensionsUsed:g.extensionsUsed||[]};
  if(selection){record.selectedForPrototype=true;record.prototypeTags=selection.tags;record.labRole=selection.role;}
  if(opts.copySelected&&selection) record.publicPath=await copyGlb(bytes,parsed,g,file,packRoot,record.id,opts.publicRoot,record.textures);
  return record;
}
function q(values,p) {if(!values.length)return null;const a=[...values].sort((x,y)=>x-y),i=(a.length-1)*p,l=Math.floor(i),u=Math.ceil(i);return r(a[l]+(a[u]-a[l])*(i-l));}
function stats(rows,total,complete) {
  const boxes=rows.filter(x=>x.bounds);
  const sum=(values)=>values.length?{min:r(Math.min(...values)),median:q(values,.5),p90:q(values,.9),max:r(Math.max(...values)),mean:r(values.reduce((a,b)=>a+b,0)/values.length)}:null;
  return {modelCount:total,measuredModelCount:rows.length,complete:complete&&rows.length===total,totalFileBytes:rows.reduce((n,x)=>n+x.fileBytes,0),triangles:{total:rows.reduce((n,x)=>n+x.triangleCount,0),perModel:sum(rows.map(x=>x.triangleCount))},vertices:{total:rows.reduce((n,x)=>n+x.vertexCount,0),perModel:sum(rows.map(x=>x.vertexCount))},boundsSizeByAxis:{x:sum(boxes.map(x=>x.bounds.size[0])),y:sum(boxes.map(x=>x.bounds.size[1])),z:sum(boxes.map(x=>x.bounds.size[2])),maximumAxis:sum(boxes.map(x=>Math.max(...x.bounds.size)))},pivot:{atGroundCount:rows.filter(x=>x.pivot.touchesGroundAtOrigin).length,belowGroundCount:rows.filter(x=>x.pivot.floorContactOffsetY!==null&&x.pivot.floorContactOffsetY<-.005).length,aboveGroundCount:rows.filter(x=>x.pivot.floorContactOffsetY!==null&&x.pivot.floorContactOffsetY>.005).length,offsetY:sum(rows.map(x=>x.pivot.floorContactOffsetY)),originByAxis:{x:sum(rows.map(x=>x.pivot.firstRootOrigin[0])),y:sum(rows.map(x=>x.pivot.firstRootOrigin[1])),z:sum(rows.map(x=>x.pivot.firstRootOrigin[2]))},boundsMinFromOriginByAxis:{x:sum(rows.map(x=>x.pivot.boundsMinFromFirstRoot?.[0])),y:sum(rows.map(x=>x.pivot.boundsMinFromFirstRoot?.[1])),z:sum(rows.map(x=>x.pivot.boundsMinFromFirstRoot?.[2]))},nonIdentityTranslationModels:rows.filter(x=>x.pivot.origins.some(o=>o.translation?.some(v=>Math.abs(v)>0.0001))).length,nonIdentityRotationModels:rows.filter(x=>x.pivot.origins.some(o=>Math.abs(o.rotation?.[0]||0)>0.0001||Math.abs(o.rotation?.[1]||0)>0.0001||Math.abs(o.rotation?.[2]||0)>0.0001||Math.abs((o.rotation?.[3]??1)-1)>0.0001)).length,nonIdentityScaleModels:rows.filter(x=>x.pivot.origins.some(o=>o.scale?.some(v=>Math.abs(v-1)>0.0001))).length,matrixTransformModels:rows.filter(x=>x.pivot.origins.some(o=>o.matrix)).length},materials:{materialCount:rows.reduce((n,x)=>n+x.materialCount,0),modelsWithMaterials:rows.filter(x=>x.materialCount>0).length,modelsWithUnlit:rows.filter(x=>x.hasUnlitMaterial).length,modelsWithTextureTransform:rows.filter(x=>x.textureTransformCount>0).length,textureTransformBindings:rows.reduce((n,x)=>n+x.textureTransformCount,0),images:rows.reduce((n,x)=>n+x.textureSummary.imageCount,0),embeddedImages:rows.reduce((n,x)=>n+x.textureSummary.embeddedImageCount,0),externalImages:rows.reduce((n,x)=>n+x.textureSummary.externalImageCount,0),colormapImages:rows.reduce((n,x)=>n+x.textureSummary.colormapImageCount,0)}};
}
function manifestAsset(row) {
  const mats=row.materials.map(m=>{const x={name:m.name,alphaMode:m.alphaMode,doubleSided:m.doubleSided,unlit:m.unlit,baseColorFactor:m.baseColorFactor,metallicFactor:m.metallicFactor,roughnessFactor:m.roughnessFactor};for(const c of m.textureBindings) x[c+'Texture']=true;return x;});
  const referenced=row.textures.filter(x=>x.references.length);
  return {id:row.id,packageId:row.packageId,name:row.name,publicPath:row.publicPath,coordinateSystem:row.coordinateSystem,bounds:row.bounds,pivot:row.pivot,origin:row.pivot.firstRootOrigin,vertexCount:row.vertexCount,triangleCount:row.triangleCount,materials:mats,textureInfo:referenced.length?{kind:'texture-map',imageCount:referenced.length,images:referenced.map(({name,mimeType,embedding,uri,publicUri,references,colormap})=>({name,mimeType,embedding,uri,publicUri,references,colormap}))}:null,sourceZipSha256:row.sourceZipSha256,sourceGlbSha256:row.sourceGlbSha256,officialUrl:row.officialUrl,scaleRelativeToFurnitureKit:row.scaleRelativeToFurnitureKit,selectedForPrototype:true,prototypeTags:row.prototypeTags,labRole:row.labRole};
}
async function main() {
  const a=argsFrom(process.argv.slice(2)),root=process.cwd();
  if(!a['source-root'])throw new Error('Indica --source-root com a pasta extracted dos pacotes Kenney.');
  const source=path.resolve(a['source-root']),zipRoot=path.resolve(a['zip-root']||path.dirname(source)),publicRoot=path.resolve(root,a['public-root']||'public/kenney-lab');
  const reportPath=path.resolve(root,a.report||'docs/reports/kenney-lab-measurements.json'),manifestPath=path.resolve(root,a.manifest||'src/lab/data.json');
  inside(root,publicRoot);inside(root,reportPath);inside(root,manifestPath);
  const selectedOnly=Boolean(a['selected-only']),opts={copySelected:Boolean(a['copy-selected']),publicRoot},rows=[],packageRows=[],failures=[];
  for(const pack of packs) {
    const packRoot=path.join(source,pack[2]),files=await walk(packRoot),zipHash=await shaFile(path.join(zipRoot,pack[3])),selected=new Map();
    for(const [name,tags,role] of pack[5]) {
      const found=files.filter(file=>path.basename(file).toLowerCase()===name.toLowerCase());
      if(found.length!==1)throw new Error(pack[0]+': esperava um GLB '+name+', encontrei '+found.length);
      selected.set(found[0],{tags,role});
    }
    const chosen=selectedOnly?[...selected.keys()].sort():files,own=[];
    for(const file of chosen)try{const row=await measure(file,packRoot,pack,zipHash,selected.get(file)||null,opts);rows.push(row);own.push(row);}catch(e){failures.push({packageId:pack[0],path:path.relative(packRoot,file).split(path.sep).join('/'),message:String(e?.message||e)});}
    packageRows.push({id:pack[0],displayName:pack[1],officialUrl:pack[4],zipName:pack[3],zipSha256:zipHash,license:'CC0',modelCount:files.length,stats:stats(own,files.length,!selectedOnly)});
  }
  const chair=rows.find(x=>x.id==='furniture-kit--chair'),door=rows.find(x=>x.id==='furniture-kit--doorway'),wall=rows.find(x=>x.id==='furniture-kit--wall'),tree=rows.find(x=>x.id==='nature-kit--tree-default');
  const references={units:'Kenney model units; no verified conversion to metres.',furnitureKit:{chair:chair?.bounds?.size||null,chairHeight:chair?.bounds?.size?.[1]??null,doorway:door?.bounds?.size||null,doorwayHeight:door?.bounds?.size?.[1]??null,wall:wall?.bounds?.size||null,wallHeight:wall?.bounds?.size?.[1]??null},natureKit:{tree:tree?.bounds?.size||null,treeHeight:tree?.bounds?.size?.[1]??null}};
  for(const row of rows){const h=row.bounds?.size?.[1];row.scaleRelativeToFurnitureKit={chairHeight:h&&references.furnitureKit.chairHeight?r(h/references.furnitureKit.chairHeight):null,wallHeight:h&&references.furnitureKit.wallHeight?r(h/references.furnitureKit.wallHeight):null,doorwayHeight:h&&references.furnitureKit.doorwayHeight?r(h/references.furnitureKit.doorwayHeight):null};}
  const report={reportVersion:1,baselineSha:BASELINE_SHA,generatedAt:new Date().toISOString(),coverage:selectedOnly?'selected-only':'all-glb',source:{provider:'Kenney',license:'CC0',assetRootName:path.basename(source),zipRootName:path.basename(zipRoot)},scaleReferences:references,packages:packageRows,modelCount:rows.length,selectedModelCount:rows.filter(x=>x.selectedForPrototype).length,failedModelCount:failures.length,failures,models:rows.filter(x=>x.selectedForPrototype)};
  const manifest={schemaVersion:1,baselineSha:BASELINE_SHA,units:'unscaled Kenney model units',scaleNote:'No verified conversion from model units to metres. Ratios use measured Furniture Kit and Nature Kit references.',references,packages:packageRows.map(({id,displayName,officialUrl,zipSha256,modelCount,stats:packStats})=>({id,displayName,officialUrl,zipSha256,modelCount,stats:packStats})),assets:rows.filter(x=>x.selectedForPrototype).map(manifestAsset),prototypes:prototypes.map(([id,title,packIds,assetIds])=>({id,title,packIds,assetIds}))};
  await fs.mkdir(path.dirname(reportPath),{recursive:true});await fs.mkdir(path.dirname(manifestPath),{recursive:true});
  await fs.writeFile(reportPath,JSON.stringify(report,null,2)+'\n');await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
  process.stdout.write(JSON.stringify({coverage:report.coverage,measuredModels:rows.length,totalModels:packageRows.reduce((n,x)=>n+x.modelCount,0),selectedAssets:manifest.assets.length,failures:failures.length,reportPath:path.relative(root,reportPath),manifestPath:path.relative(root,manifestPath),scaleReferences:references,packages:packageRows.map(x=>({id:x.id,total:x.modelCount,measured:x.stats.measuredModelCount,triangles:x.stats.triangles.total,modelsWithTextureTransforms:x.stats.materials.modelsWithTextureTransform})),prototypes:manifest.prototypes},null,2)+'\n');
  if(failures.length&&!selectedOnly)process.exitCode=1;
}
main().catch(e=>{process.stderr.write(String(e?.stack||e)+'\n');process.exitCode=1;});
