/* ════════════════════════════════════════
   LAYGEN
════════════════════════════════════════ */
const lgState = { boxCount:2, selectedLayout:null, selectedStyle:'solid', styleOptions:{borderWidth:3,borderRadius:8}, cells:[], selectedCellIndex:null, codeType:'full', palette:'navy' };

// Color palettes: each has [accent, accentText, bg, text]
const lgPalettes = {
  navy:   { accent:'#000054', accentText:'#fac800', bg:'#f5f5f5', text:'#222222', border:'#000054', lightBg:'#ecedf4' },
  red:    { accent:'#e61e2a', accentText:'#ffffff', bg:'#fff5f5', text:'#222222', border:'#e61e2a', lightBg:'#fce8e9' },
  yellow: { accent:'#fac800', accentText:'#000054', bg:'#fffbea', text:'#222222', border:'#fac800', lightBg:'#fef9e6' },
  green:  { accent:'#00875a', accentText:'#ffffff', bg:'#f0fdf8', text:'#222222', border:'#00875a', lightBg:'#d1fae5' },
  grey:   { accent:'#555555', accentText:'#ffffff', bg:'#f5f5f5', text:'#222222', border:'#555555', lightBg:'#e8e8e8' },
};

function lgSetColor(name, el) {
  lgState.palette = name;
  document.querySelectorAll('.lg-color-dot').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
  lgRender();
}
const lgGetLayoutOptions = count => {
  const o = [];
  if(count===1){o.push({value:'1x1',rows:1,ratios:[[12]],label:'1×1',symmetric:true})}
  else if(count===2){o.push(
    {value:'1x2_6-6',rows:1,ratios:[[6,6]],  label:'6 : 6',  symmetric:true},
    {value:'1x2_5-7',rows:1,ratios:[[5,7]],  label:'5 : 7',  symmetric:false, flip:'1x2_7-5'},
    {value:'1x2_7-5',rows:1,ratios:[[7,5]],  label:'7 : 5',  symmetric:false, flip:'1x2_5-7', hidden:true},
    {value:'1x2_4-8',rows:1,ratios:[[4,8]],  label:'4 : 8',  symmetric:false, flip:'1x2_8-4'},
    {value:'1x2_8-4',rows:1,ratios:[[8,4]],  label:'8 : 4',  symmetric:false, flip:'1x2_4-8', hidden:true},
    {value:'1x2_3-9',rows:1,ratios:[[3,9]],  label:'3 : 9',  symmetric:false, flip:'1x2_9-3'},
    {value:'1x2_9-3',rows:1,ratios:[[9,3]],  label:'9 : 3',  symmetric:false, flip:'1x2_3-9', hidden:true}
  )}
  else if(count===3){o.push(
    {value:'1x3_4-4-4',rows:1,ratios:[[4,4,4]],  label:'4:4:4', symmetric:true},
    {value:'1x3_3-6-3',rows:1,ratios:[[3,6,3]],  label:'3:6:3', symmetric:true},
    {value:'1x3_2-8-2',rows:1,ratios:[[2,8,2]],  label:'2:8:2', symmetric:true},
    {value:'1x3_6-3-3',rows:1,ratios:[[6,3,3]],  label:'6:3:3', symmetric:false, flip:'1x3_3-3-6'},
    {value:'1x3_3-3-6',rows:1,ratios:[[3,3,6]],  label:'3:3:6', symmetric:false, flip:'1x3_6-3-3', hidden:true},
    {value:'1x3_2-4-6',rows:1,ratios:[[2,4,6]],  label:'2:4:6', symmetric:false, flip:'1x3_6-4-2'},
    {value:'1x3_6-4-2',rows:1,ratios:[[6,4,2]],  label:'6:4:2', symmetric:false, flip:'1x3_2-4-6', hidden:true}
  )}
  else if(count===4){o.push(
    {value:'2x2',rows:2,ratios:[[6,6],[6,6]],       label:'2×2',    symmetric:true},
    {value:'1x4',rows:1,ratios:[[3,3,3,3]],         label:'1×4',    symmetric:true},
    {value:'2r_4a',rows:2,ratios:[[4,8],[6,6]],      label:'4:8 / 6:6', symmetric:false, flip:'2r_4b'},
    {value:'2r_4b',rows:2,ratios:[[8,4],[6,6]],      label:'8:4 / 6:6', symmetric:false, flip:'2r_4a', hidden:true}
  )}
  else if(count===5){o.push(
    {value:'2r_5a',rows:2,ratios:[[4,4,4],[2,4,4,2]],label:'3+2',   symmetric:true},
    {value:'2r_5b',rows:2,ratios:[[6,6],[4,4,4]],    label:'2+3',   symmetric:true}
  )}
  else if(count===6){o.push(
    {value:'2x3',rows:2,ratios:[[4,4,4],[4,4,4]],    label:'2×3',   symmetric:true},
    {value:'3x2',rows:3,ratios:[[6,6],[6,6],[6,6]],  label:'3×2',   symmetric:true}
  )}
  else if(count===7){o.push(
    {value:'3r_7',rows:3,ratios:[[4,4,4],[2,4,4,2],[2,4,4,2]],label:'3-2-2', symmetric:true}
  )}
  else if(count===8){o.push(
    {value:'2x4',rows:2,ratios:[[3,3,3,3],[3,3,3,3]],label:'2×4',   symmetric:true},
    {value:'4x2',rows:4,ratios:[[6,6],[6,6],[6,6],[6,6]],label:'4×2', symmetric:true}
  )}
  else if(count===9){o.push(
    {value:'3x3',rows:3,ratios:[[4,4,4],[4,4,4],[4,4,4]],label:'3×3', symmetric:true}
  )}
  // filter out hidden unless it's the currently selected one
  return o.filter(opt => !opt.hidden || opt.value === (lgState.selectedLayout && lgState.selectedLayout.value));
};

function lgFlipLayout() {
  if (!lgState.selectedLayout || !lgState.selectedLayout.flip) return;
  // build the flipped layout directly from current ratios (reversed per row)
  const cur = lgState.selectedLayout;
  const flippedRatios = cur.ratios.map(row => [...row].reverse());
  const labelParts = cur.label.split(':');
  const flippedLabel = labelParts.length > 1 ? labelParts.reverse().join(':') : cur.label;
  lgState.selectedLayout = {
    ...cur,
    value: cur.flip,
    ratios: flippedRatios,
    label: flippedLabel,
    flip: cur.value,
    hidden: false
  };
  lgRender();
}
const lgStyleDefs = [
  {id:'solid',    name:'Solid',      hasBorder:false, hasRadius:true,  pvStyle:'background:#f5f5f5;border-radius:4px;'},
  {id:'line',     name:'Grey Line',  hasBorder:true,  hasRadius:false, pvStyle:'border:2px solid #dbdbdb;'},
  {id:'dash',     name:'Dash',       hasBorder:true,  hasRadius:true,  pvStyle:'border:2px dashed #aaa;border-radius:4px;'},
  {id:'blueLine', name:'Color Line', hasBorder:true,  hasRadius:false, pvStyle:'border:2px solid #000054;'},
  // 6 new styles
  {id:'headerBand',  name:'Header Band',  hasBorder:false, hasRadius:false, pvStyle:'background:linear-gradient(to bottom,#000054 40%,#f5f5f5 40%);border-radius:4px;'},
  {id:'borderLeft',  name:'Border Left',  hasBorder:false, hasRadius:false, pvStyle:'border-left:5px solid #000054;background:#f5f5f5;'},
  {id:'borderTop',   name:'Border Top',   hasBorder:false, hasRadius:false, pvStyle:'border-top:5px solid #fac800;background:#f5f5f5;'},
  {id:'sideLabel',   name:'Side Label',   hasBorder:false, hasRadius:false, pvStyle:'display:flex;background:linear-gradient(to right,#000054 25%,#f5f5f5 25%);border-radius:4px;'},
  {id:'floatBadge',  name:'Float Badge',  hasBorder:false, hasRadius:false, pvStyle:'background:#f5f5f5;border:2px solid #000054;border-radius:4px;position:relative;'},
  {id:'cornerAccent',name:'Corner',       hasBorder:false, hasRadius:false, pvStyle:'background:linear-gradient(to bottom right,#fac800 0,#fac800 40%,#f5f5f5 40%);border-radius:4px;'},
];
function lgRender() { lgUpdateCellData(); lgRenderControls(); lgRenderPreview(); }
function lgUpdateCellData() {
  for(let i=0;i<lgState.boxCount;i++) if(!lgState.cells[i]) lgState.cells[i]={title:`Step ${i+1}`,description:'Your text will look like this',hidden:false};
  lgState.cells.length=lgState.boxCount;
  if(lgState.boxCount>=3&&(lgState.selectedStyle==='dash'||lgState.selectedStyle==='blueLine')) lgState.selectedStyle='solid';
}
function lgRenderControls() {
  document.getElementById('lg-box-count-selector').childNodes.forEach(b=>b.classList.toggle('selected',parseInt(b.dataset.count)===lgState.boxCount));
  const opts=lgGetLayoutOptions(lgState.boxCount);
  document.getElementById('lg-layout-selector').innerHTML='';
  if(!lgState.selectedLayout) lgState.selectedLayout=opts[0]||null;
  else if(!opts.some(o=>o.value===lgState.selectedLayout.value)&&!lgState.selectedLayout.flip) lgState.selectedLayout=opts[0]||null;
  opts.forEach(opt=>{
    const t=document.createElement('div');t.className='lg-layout-tile';t.classList.toggle('selected',opt.value===lgState.selectedLayout.value);
    let p='<div class="preview-grid">';
    opt.ratios.forEach(r=>{
      p+='<div class="preview-row">';
      const tot=r.reduce((a,b)=>a+b,0);
      r.forEach(rat=>{
        // use exact percentage so preview bar widths are proportional
        const pct=(rat/tot*100).toFixed(1);
        p+=`<div class="preview-box" style="flex:0 0 ${pct}%;max-width:${pct}%;"></div>`;
      });
      p+='</div>';
    });
    p+=`</div><span>${opt.label}</span>`;
    t.innerHTML=p;
    document.getElementById('lg-layout-selector').appendChild(t);
  });

  // flip button — show only when selected layout has an asymmetric flip
  let flipBtn = document.getElementById('lg-flip-btn');
  if (!flipBtn) {
    flipBtn = document.createElement('button');
    flipBtn.id = 'lg-flip-btn';
    flipBtn.className = 'lg-btn-selector';
    flipBtn.style.cssText = 'width:100%;margin-top:6px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:9pt;';
    flipBtn.innerHTML = '⇄ Flip layout';
    flipBtn.onclick = lgFlipLayout;
    document.getElementById('lg-layout-selector').parentElement.appendChild(flipBtn);
  }
  flipBtn.style.display = (lgState.selectedLayout && lgState.selectedLayout.flip) ? 'flex' : 'none';
  document.getElementById('lg-style-selector').childNodes.forEach(tile=>{
    tile.classList.toggle('selected',tile.dataset.styleId===lgState.selectedStyle);
    const newStyles=['headerBand','borderLeft','borderTop','sideLabel','floatBadge','cornerAccent'];
    tile.classList.toggle('disabled',lgState.boxCount>=3&&(tile.dataset.styleId==='dash'));
  });
  const def=lgStyleDefs.find(s=>s.id===lgState.selectedStyle);
  document.getElementById('lg-style-customization-section').style.display=(def&&(def.hasBorder||def.hasRadius))?'block':'none';
  document.getElementById('lg-border-width-control').style.display=def&&def.hasBorder?'flex':'none';
  document.getElementById('lg-border-radius-control').style.display=def&&def.hasRadius?'flex':'none';
  // always show color section
  document.getElementById('lg-color-section').style.display='block';
  document.getElementById('lg-border-width-slider').value=lgState.styleOptions.borderWidth;
  document.getElementById('lg-border-width-input').value=lgState.styleOptions.borderWidth;
  document.getElementById('lg-border-radius-slider').value=lgState.styleOptions.borderRadius;
  document.getElementById('lg-border-radius-input').value=lgState.styleOptions.borderRadius;
  const cs=document.getElementById('lg-content-section');
  if(lgState.selectedCellIndex===null||!lgState.cells[lgState.selectedCellIndex]){cs.style.display='none';}
  else{cs.style.display='block';document.getElementById('lg-content-section-title').textContent=`3. Content (Box ${lgState.selectedCellIndex+1})`;const c=lgState.cells[lgState.selectedCellIndex];document.getElementById('lg-content-title-input').value=c.title;document.getElementById('lg-content-desc-input').value=c.description;document.getElementById('lg-hide-box-checkbox').checked=c.hidden;}
}
function lgRenderPreview() {
  const canvas=document.getElementById('lg-preview-canvas');canvas.innerHTML='';
  if(!lgState.selectedLayout) return;
  let ci=0;
  lgState.selectedLayout.ratios.forEach(rr=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;gap:0;margin-bottom:12px;width:100%;align-items:stretch;';
    const tot=rr.reduce((a,b)=>a+b,0);
    rr.forEach(ratio=>{
      const pct=(ratio/tot*100).toFixed(2);
      const col=document.createElement('div');
      col.style.cssText=`flex:0 0 ${pct}%;max-width:${pct}%;box-sizing:border-box;padding:0 8px;`;
      if(ratio<=2){col.innerHTML='<p>&nbsp;</p>';}
      else if(ci>=lgState.boxCount){col.innerHTML='<p>&nbsp;</p>';}
      else{
        const cont=document.createElement('div');cont.className='lg-preview-box-container';cont.dataset.cellIndex=ci;
        cont.style.cssText='height:100%;';
        const box=document.createElement('div');box.className='lg-preview-box-content';box.classList.toggle('selected',ci===lgState.selectedCellIndex);
        box.innerHTML=lgGenCellHTML(ci,'preview');cont.appendChild(box);col.appendChild(cont);ci++;
      }
      row.appendChild(col);
    });
    canvas.appendChild(row);
  });
}
function lgGenCellHTML(idx, ctx='final') {
  const c = lgState.cells[idx]; if (c.hidden) return '<p>&nbsp;</p>';
  const { borderWidth, borderRadius } = lgState.styleOptions;
  const p = lgPalettes[lgState.palette] || lgPalettes.navy;
  const { accent, accentText, bg, text } = p;
  const title = c.title || '';
  const desc  = c.description || '';
  let h = '';

  switch (lgState.selectedStyle) {
    case 'solid':
      h = `<div style="height:100%;box-sizing:border-box;background-color:${bg};padding:15px 30px;border-radius:${borderRadius}px; margin-bottom:24px;">` +
          `<p style="text-align:center;"><span style="color:${accent};"><strong>${title}</strong></span></p><hr>` +
          `<p style="color:${text};">${desc}</p></div>`;
      break;

    case 'line':
      h = `<div style="height:100%;box-sizing:border-box;border:solid #dbdbdb ${borderWidth}px;padding:15px; margin-bottom:24px;">` +
          `<p style="text-align:center;"><span style="color:${accent};"><strong>${title}</strong></span></p><hr>` +
          `<p style="color:${text};">${desc}</p></div>`;
      break;

    case 'blueLine':
      h = `<div style="height:100%;box-sizing:border-box;border:solid ${accent} ${borderWidth}px;padding:15px; margin-bottom:24px;">` +
          `<p style="text-align:center;"><span style="color:${accent};"><strong>${title}</strong></span></p><hr>` +
          `<p style="color:${text};">${desc}</p></div>`;
      break;

    case 'dash':
      h = `<div style="height:100%;box-sizing:border-box;background-color:${bg};padding:20px;border:${borderWidth}px dashed ${accent};border-radius:${borderRadius}px; margin-bottom:24px;">` +
          `<p><strong><span style="color:${accent};">${title}</span></strong></p>` +
          `<p style="color:${text};">${desc}</p></div>`;
      break;

    // ── 6 NEW STYLES ──────────────────────────────────────
    case 'headerBand':
      h = `<div style="border-radius:8px;overflow:hidden;  margin-bottom:24px;">` +
          `<div style="background-color:${accent};padding:10px 20px;">` +
          `<p style="margin:0;color:${accentText};font-size:15px;letter-spacing:0.02em;"><strong>${title}</strong></p></div>` +
          `<div style="height:100%;background-color:#f5f5f5;padding:16px 20px;">` +
          `<p style="margin:0;font-size:15px;line-height:1.7;color:${text};">${desc}</p></div></div>`;
      break;

    case 'borderLeft':
      h = `<div style="border-left:5px solid ${accent};background:${bg};padding:16px 20px;border-radius:0 8px 8px 0;position:relative;  margin-bottom:24px;">` +
          `<p style="margin:0 0 6px;font-size:13px;letter-spacing:0.08em;color:${accent};"><strong>${title}</strong></p>` +
          `<p style="margin:0;font-size:15px;line-height:1.7;color:${text};">${desc}</p></div>`;
      break;

    case 'borderTop':
      h = `<div style="border-top:5px solid ${accent};background:#f5f5f5;height:100%;padding:20px 24px;border-radius:0 0 8px 8px;  margin-bottom:24px;">` +
          `<p style="margin:0 0 8px;font-size:15px;color:${accent};"><strong>${title}</strong></p>` +
          `<p style="margin:0;font-size:15px;line-height:1.7;color:${text};">${desc}</p></div>`;
      break;

    case 'sideLabel':
      h = `<div style="display:flex;border-radius:8px;overflow:hidden;">` +
          `<div style="background:${accent};padding:16px 14px;display:flex;align-items:center;justify-content:center;min-width:64px;  margin-bottom:24px;">` +
          `<strong><span style="color:${accentText};font-size:11px;letter-spacing:0.1em;writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);">${title}</span></strong></div>` +
          `<div style="height:100%;background:#f5f5f5;padding:16px 20px;flex:1;border:1.5px solid #dbdbdb;border-left:none;border-radius:0 8px 8px 0;">` +
          `<p style="margin:0;font-size:15px;line-height:1.7;color:${text};">${desc}</p></div></div>`;
      break;

    case 'floatBadge':
      h = `<div style="position:relative;height:100%;background:#f5f5f5;border:1.5px solid ${accent};border-radius:8px;padding:28px 24px 20px;  margin-bottom:24px;">` +
          `<span style="position:absolute;top:-13px;left:16px;background:${accent};color:${accentText};font-size:14px;padding:3px 14px;border-radius:20px;letter-spacing:0.06em;"><strong>${title}</strong></span>` +
          `<p style="margin:0;font-size:15px;line-height:1.7;color:${text};">${desc}</p></div>`;
      break;

    case 'cornerAccent':
      h = `<div style="background-color:#f5f5f5;background-image:linear-gradient(to bottom right,${accent} 0px,${accent} 35px,transparent 37px),linear-gradient(to top left,#cccccc 0px,#cccccc 19px,transparent 21px);padding:36px 32px 40px 32px;  margin-bottom:24px;">` +
          `<p style="margin:0 0 8px;font-size:15px;color:${accent};"><strong>${title}</strong></p>` +
          `<p style="margin:0;font-size:15px;line-height:1.7;color:${text};">${desc}</p></div>`;
      break;
  }
  return h;
}
function lgGenFinalCode() {
  if(!lgState.selectedLayout) return '';
  if(lgState.boxCount===1&&lgState.codeType==='full'&&lgState.selectedLayout.value==='1x1') return lgGenCellHTML(0,'final').trim();
  let html='',ci=0;
  lgState.selectedLayout.ratios.forEach(rr=>{
    html+=`<div class="grid-row">\n`;const tot=rr.reduce((a,b)=>a+b,0);
    rr.forEach(ratio=>{
      const cw=Math.round(ratio/tot*12);html+=`  <div class="col-xs-12 col-md-${cw}">\n`;
      let content='';
      if(ratio<=2){content='<p>&nbsp;</p>';}
      else if(ci>=lgState.boxCount){content='<p>&nbsp;</p>';}
      else{content=lgState.codeType==='full'?lgGenCellHTML(ci,'final'):(lgState.cells[ci].hidden?'<p>&nbsp;</p>':`<p>${lgState.cells[ci].description}</p>`);ci++;}
      html+=content.split('\n').map(l=>'    '+l).join('\n')+'\n';html+='  </div>\n';
    });
    html+='</div>\n';
  });
  return html.trim();
}
function lgOpenModal() {
  document.getElementById('lg-generated-code-textarea').value=lgGenFinalCode();
  document.getElementById('lg-code-modal').classList.add('visible');
  setTimeout(()=>{const ta=document.getElementById('lg-generated-code-textarea');ta.focus();ta.select();},100);
}
function lgInitControls() {
  for(let i=1;i<=9;i++){const b=document.createElement('button');b.className='lg-btn-selector';b.textContent=i;b.dataset.count=i;b.addEventListener('click',()=>{lgState.boxCount=i;lgState.selectedCellIndex=null;lgRender();});document.getElementById('lg-box-count-selector').appendChild(b);}
  lgStyleDefs.forEach(def=>{
    const t=document.createElement('div');t.className='lg-style-tile';t.dataset.styleId=def.id;
    const pv = def.pvStyle || '';
    t.innerHTML=`<div class="lg-style-tile-preview" style="${pv}"></div><span>${def.name}</span>`;
    t.addEventListener('click',()=>{if(!t.classList.contains('disabled')){lgState.selectedStyle=def.id;lgRender();}});
    document.getElementById('lg-style-selector').appendChild(t);
  });
  document.getElementById('lg-layout-selector').addEventListener('click',e=>{const tile=e.target.closest('.lg-layout-tile');if(!tile)return;const opts=lgGetLayoutOptions(lgState.boxCount);const idx=Array.from(document.getElementById('lg-layout-selector').children).indexOf(tile);lgState.selectedLayout=opts[idx];lgRender();});
  document.getElementById('lg-preview-canvas').addEventListener('click',e=>{const box=e.target.closest('.lg-preview-box-container');lgState.selectedCellIndex=box?parseInt(box.dataset.cellIndex):null;lgRender();});
  document.getElementById('lg-border-width-slider').addEventListener('input',e=>{lgState.styleOptions.borderWidth=e.target.value;lgRender();});
  document.getElementById('lg-border-width-input').addEventListener('input',e=>{lgState.styleOptions.borderWidth=e.target.value;lgRender();});
  document.getElementById('lg-border-radius-slider').addEventListener('input',e=>{lgState.styleOptions.borderRadius=e.target.value;lgRender();});
  document.getElementById('lg-border-radius-input').addEventListener('input',e=>{lgState.styleOptions.borderRadius=e.target.value;lgRender();});
  document.getElementById('lg-content-title-input').addEventListener('input',e=>{if(lgState.selectedCellIndex!==null)lgState.cells[lgState.selectedCellIndex].title=e.target.value;lgRender();});
  document.getElementById('lg-content-desc-input').addEventListener('input',e=>{if(lgState.selectedCellIndex!==null)lgState.cells[lgState.selectedCellIndex].description=e.target.value;lgRender();});
  document.getElementById('lg-hide-box-checkbox').addEventListener('change',e=>{if(lgState.selectedCellIndex!==null)lgState.cells[lgState.selectedCellIndex].hidden=e.target.checked;lgRender();});
  document.getElementById('lg-close-modal-button').addEventListener('click',()=>document.getElementById('lg-code-modal').classList.remove('visible'));
  document.getElementById('lg-code-modal').addEventListener('click',e=>{if(e.target===document.getElementById('lg-code-modal'))document.getElementById('lg-code-modal').classList.remove('visible');});
  document.getElementById('lg-switch-code-type-button').addEventListener('click',()=>{lgState.codeType=lgState.codeType==='full'?'layoutOnly':'full';document.getElementById('lg-switch-code-type-button').textContent=lgState.codeType==='full'?'Switch to Layout Only':'Switch to Full Style';lgOpenModal();});
  document.getElementById('lg-copy-code-button').addEventListener('click',()=>{const ta=document.getElementById('lg-generated-code-textarea');ta.focus();ta.select();try{document.execCommand('copy');document.getElementById('lg-copy-code-button').textContent='Copied!';document.getElementById('lg-copy-code-button').disabled=true;setTimeout(()=>{document.getElementById('lg-copy-code-button').textContent='Copy Code';document.getElementById('lg-copy-code-button').disabled=false;},2000);}catch(e){}});
  lgRender();
}


document.addEventListener('DOMContentLoaded', () => {
  lgInitControls();
  if (typeof lgState !== 'undefined' && lgState) lgRender();
});
