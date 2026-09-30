/* ════════════════════════════════════════
   COLDATE
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('cd-addColorBtn').addEventListener('click',()=>cdAddPair('',''));
  document.getElementById('cd-processBtn').addEventListener('click',function(){
    const code=document.getElementById('cd-inputCode').value;if(!code.trim()){alert('Please enter some code first.');return;}
    const start=performance.now();const reps=cdGetReplacements();let out=code,rc=0;
    reps.forEach(p=>{const rx=new RegExp(cdEscRx(p.oldColor),'gi');const prev=out;out=out.replace(rx,p.newColor);rc+=(prev.match(rx)||[]).length-(out.match(new RegExp(cdEscRx(p.newColor),'gi'))||[]).length+0;});
    reps.forEach(p=>{const rx=new RegExp(cdEscRx(p.oldColor),'gi');const m=(code.match(rx)||[]).length;rc+=m;});
    document.getElementById('cd-outputCode').value=out;const dur=((performance.now()-start)/1000).toFixed(2);
    document.getElementById('cd-replaceCount').textContent=`${reps.length} pair(s) applied`;document.getElementById('cd-timeInfo').textContent=`Done in ${dur}s`;
  });
  document.getElementById('cd-scanColorsBtn').addEventListener('click',function(){const code=document.getElementById('cd-inputCode').value;if(!code.trim()){alert('Please enter some code first.');return;}cdDisplayColors(cdDetectColors(code));});
  document.getElementById('cd-copyBtn').addEventListener('click',function(){
    const ta=document.getElementById('cd-outputCode');ta.select();document.execCommand('copy');
    const orig=this.textContent;this.textContent='Copied!';this.style.background='#4CAF50';setTimeout(()=>{this.textContent=orig;this.style.background='';},2000);
  });
  cdAddPair();
});
const CD_SUGGEST = [
  // RMIT Red tints
  {hex:'#E61E2A', label:'RMIT Red 100%'},
  {hex:'#EC565F', label:'RMIT Red 75%'},
  {hex:'#F28E94', label:'RMIT Red 50%'},
  {hex:'#F7BBBF', label:'RMIT Red 30%'},
  // RMIT Blue tints
  {hex:'#000054', label:'RMIT Blue 100%'},
  {hex:'#40407F', label:'RMIT Blue 75%'},
  {hex:'#7F7FA9', label:'RMIT Blue 50%'},
  {hex:'#B2B2CB', label:'RMIT Blue 30%'},
  // RMIT Yellow tints
  {hex:'#FAC800', label:'RMIT Yellow 100%'},
  {hex:'#FBD640', label:'RMIT Yellow 75%'},
  {hex:'#FCE37F', label:'RMIT Yellow 50%'},
  {hex:'#FDEEB2', label:'RMIT Yellow 30%'},
  // RMIT Grey tints
  {hex:'#DBDBDB', label:'RMIT Grey 100%'},
  {hex:'#E4E4E4', label:'RMIT Grey 75%'},
  {hex:'#DEDEDE', label:'RMIT Grey 50%'},
  {hex:'#F5F5F5', label:'RMIT Grey 30%'},
  // Extras
  {hex:'#ffffff', label:'White'},
];

function cdAddPair(old='',nw=''){
  const id=Date.now();const el=document.createElement('div');el.className='cd-color-pair';
  el.style.cssText='flex-direction:column;gap:6px;';

  // row: old → new inputs
  const row=document.createElement('div');
  row.style.cssText='display:flex;gap:7px;align-items:center;';
  row.innerHTML=`<input type="text" class="cd-color-input old-color" value="${old}" placeholder="Old color" data-preview="cdold-${id}" style="flex:1;"><div class="cd-color-preview" id="cdold-${id}" style="background:${old||'transparent'}"></div><span style="color:var(--text-mute);font-size:13px;">→</span><input type="text" class="cd-color-input new-color" value="${nw}" placeholder="New color" data-preview="cdnew-${id}" style="flex:1;"><div class="cd-color-preview" id="cdnew-${id}" style="background:${nw||'transparent'}"></div><button class="cd-remove-btn">×</button>`;

  // suggest row under new-color
  const suggestWrap=document.createElement('div');
  suggestWrap.style.cssText='padding:5px 0 2px 0;';
  let swatchHTML=`<div class="cd-suggest-label">Quick pick →</div><div class="cd-suggest-row">`;
  CD_SUGGEST.forEach(s=>{
    const _lightColors=['#ffffff','#f5f5f5','#FDEEB2','#fdeeb2','#F5F5F5','#E4E4E4','#e4e4e4','#DEDEDE','#dedede','#F7BBBF','#f7bbbf','#FCE37F','#fce37f','#B2B2CB','#b2b2cb'];
    swatchHTML+=`<div class="cd-swatch" title="${s.label} ${s.hex}" style="background:${s.hex};${_lightColors.includes(s.hex)?'border-color:#ccc;':''}" data-color="${s.hex}"></div>`;
  });
  swatchHTML+=`</div>`;
  suggestWrap.innerHTML=swatchHTML;

  el.appendChild(row);
  el.appendChild(suggestWrap);
  document.getElementById('cd-colorPairsContainer').appendChild(el);

  // wire input → preview
  row.querySelectorAll('.cd-color-input').forEach(inp=>inp.addEventListener('input',e=>{
    const prev=document.getElementById(e.target.dataset.preview);
    if(prev)prev.style.backgroundColor=e.target.value||'transparent';
  }));

  // wire swatches → fill new-color input
  suggestWrap.querySelectorAll('.cd-swatch').forEach(sw=>sw.addEventListener('click',()=>{
    const inp=row.querySelector('.new-color');
    const prev=document.getElementById(inp.dataset.preview);
    inp.value=sw.dataset.color;
    if(prev)prev.style.backgroundColor=sw.dataset.color;
  }));

  row.querySelector('.cd-remove-btn').addEventListener('click',()=>el.remove());
}
function cdGetReplacements(){const pairs=[];document.querySelectorAll('.cd-color-pair').forEach(p=>{const o=p.querySelector('.old-color').value.trim();const n=p.querySelector('.new-color').value.trim();if(o&&n)pairs.push({oldColor:o,newColor:n});});return pairs;}
function cdEscRx(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function cdDetectColors(code){const rx=/(#([0-9a-f]{3}){1,2}\b|rgb\((\s*\d+\s*,){2}\s*\d+\s*\)|rgba\((\s*\d+\s*,){3}\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*\)|hsla\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*,\s*[\d.]+\s*\))/gi;const m=code.match(rx)||[];const counts={};m.forEach(c=>{const n=c.toLowerCase();counts[n]=(counts[n]||0)+1;});return Object.entries(counts).map(([c,n])=>({color:c,count:n})).sort((a,b)=>b.count-a.count);}
function cdDisplayColors(colors){
  const list=document.getElementById('cd-colorList');list.innerHTML='';document.getElementById('cd-colorCount').textContent=`${colors.length} colors detected`;
  if(!colors.length){list.innerHTML='<p>No color codes found.</p>';return;}
  colors.forEach(c=>{
    const el=document.createElement('div');el.className='cd-color-item';
    el.innerHTML=`<div style="display:flex;align-items:center;gap:9px;"><div class="cd-color-preview" style="background:${c.color}"></div><span>${c.color}</span></div><span>${c.count}x</span>`;
    el.addEventListener('click',()=>{cdAddPair(c.color,'');document.getElementById('cd-colorPairsContainer').lastElementChild.scrollIntoView({behavior:'smooth'});document.getElementById('cd-colorPairsContainer').lastElementChild.querySelector('.new-color').focus();});
    list.appendChild(el);
  });
}
