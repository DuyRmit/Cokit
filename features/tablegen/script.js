/* ════════════════════════════════════════
   TABLE GENERATOR
════════════════════════════════════════ */
const TBL = {
  headerBg:'#000054', headerFg:'#ffffff',
  rowEven:'#ffffff',  rowOdd:'#e6e6ef',
  borderColor:'#d0d0d0', breakColor:'#000054',
  align:'left'
};

function tblSetPreset(btn) {
  document.querySelectorAll('.tbl-preset-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  TBL.headerBg = btn.dataset.bg;
  TBL.headerFg = btn.dataset.fg;
  tblGenerate();
}
function tblSetPair(btn) {
  document.querySelectorAll('.tbl-pair-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  TBL.rowEven = btn.dataset.even;
  TBL.rowOdd  = btn.dataset.odd;
  tblGenerate();
}
function tblSetBorder(btn) {
  document.querySelectorAll('#panel-tablegen [data-bc]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  TBL.borderColor = btn.dataset.bc;
  tblGenerate();
}
function tblSetBreakColor(btn) {
  document.querySelectorAll('#panel-tablegen [data-bc2]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  TBL.breakColor = btn.dataset.bc2;
  tblGenerate();
}
function tblSetAlign(dir) {
  TBL.align = dir;
  ['left','center','right'].forEach(d=>{
    document.getElementById('tbl-align-'+d).classList.toggle('active', d===dir);
  });
  tblGenerate();
}

// Wire up toggle & input listeners after DOM ready
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('tbl-enable-span').addEventListener('change', function(){
    document.getElementById('tbl-span-wrap').style.display = this.checked ? 'flex' : 'none';
    tblGenerate();
  });
  document.getElementById('tbl-section-break').addEventListener('change', function(){
    document.getElementById('tbl-break-wrap').style.display = this.checked ? 'block' : 'none';
    tblGenerate();
  });
  document.getElementById('tbl-alt-rows').addEventListener('change', function(){
    document.getElementById('tbl-alt-wrap').style.display = this.checked ? 'flex' : 'none';
    tblGenerate();
  });
  document.getElementById('tbl-has-header').addEventListener('change', function(){
    document.getElementById('tbl-header-color-field').style.display = this.checked ? 'flex' : 'none';
    tblGenerate();
  });
  ['tbl-num-cols','tbl-num-rows','tbl-span-size','tbl-break-row'].forEach(id=>{
    document.getElementById(id).addEventListener('input', ()=>{
      if(id==='tbl-num-cols') document.getElementById('tbl-col-b').textContent = document.getElementById(id).value;
      if(id==='tbl-num-rows') document.getElementById('tbl-row-b').textContent = document.getElementById(id).value;
      tblGenerate();
    });
  });
  tblGenerate();
});

function tblGenerate() {
  const cols       = Math.max(1, parseInt(document.getElementById('tbl-num-cols').value)||3);
  const rows       = Math.max(1, parseInt(document.getElementById('tbl-num-rows').value)||4);
  const hasHeader  = document.getElementById('tbl-has-header').checked;
  const altRows    = document.getElementById('tbl-alt-rows').checked;
  const enableSpan = document.getElementById('tbl-enable-span').checked;
  const spanSize   = Math.max(2, parseInt(document.getElementById('tbl-span-size').value)||2);
  const sectionBreak = document.getElementById('tbl-section-break').checked;
  const breakRow   = parseInt(document.getElementById('tbl-break-row').value)||2;
  const lineThick  = parseFloat(document.getElementById('tbl-line-thickness').value);
  const padding    = document.getElementById('tbl-padding-size').value;

  const bdr = lineThick===0 ? 'none' : `${lineThick}px solid ${TBL.borderColor}`;
  const thSt = `padding:${padding};text-align:${TBL.align};border:${bdr};background-color:${TBL.headerBg};color:${TBL.headerFg};font-size:12pt;line-height:1.4;font-weight:700;`;
  const tdBase = `color:#1a1a1a;padding:${padding};text-align:${TBL.align};border:${bdr};`;

  let out = `<table class="ic-Table ic-Table--condensed ic-Table--hover-row" style="border-collapse:collapse;width:100%;">
`;

  if(hasHeader) {
    out += `  <thead>
    <tr>
`;
    for(let c=0;c<cols;c++) out += `      <th style="${thSt}">Header ${c+1}</th>
`;
    out += `    </tr>
  </thead>
`;
  }

  out += `  <tbody>
`;
  let r = 0;
  while(r < rows) {
    const isBreak   = sectionBreak && r===breakRow;
    const breakTop  = isBreak ? `border-top:3px solid ${TBL.breakColor};` : '';
    const groupSize = enableSpan ? Math.min(spanSize, rows-r) : 1;

    if(enableSpan && groupSize>1) {
      const bg = altRows ? (r%2===0 ? TBL.rowEven : TBL.rowOdd) : 'transparent';
      out += `    <tr>
`;
      out += `      <td rowspan="${groupSize}" style="${tdBase}background-color:${bg};vertical-align:middle;${breakTop}">Row ${r+1}–${r+groupSize}, Col 1</td>
`;
      for(let c=1;c<cols;c++) out += `      <td style="${tdBase}background-color:${bg};${breakTop}">Row ${r+1}, Col ${c+1}</td>
`;
      out += `    </tr>
`;
      for(let sg=1;sg<groupSize;sg++) {
        const bg2 = altRows ? (r%2===0 ? TBL.rowEven : TBL.rowOdd) : 'transparent';
        out += `    <tr>
`;
        for(let c=1;c<cols;c++) out += `      <td style="${tdBase}background-color:${bg2};">Row ${r+1+sg}, Col ${c+1}</td>
`;
        out += `    </tr>
`;
      }
      r += groupSize;
    } else {
      const bg = altRows ? (r%2===0 ? TBL.rowEven : TBL.rowOdd) : 'transparent';
      out += `    <tr>
`;
      for(let c=0;c<cols;c++) out += `      <td style="${tdBase}background-color:${bg};${breakTop}">Row ${r+1}, Col ${c+1}</td>
`;
      out += `    </tr>
`;
      r++;
    }
  }
  out += `  </tbody>
</table>`;

  document.getElementById('tbl-table-output').innerHTML = out;
  document.getElementById('tbl-code-output').textContent = out;
}

function tblCopyHTML() {
  const text = document.getElementById('tbl-code-output').textContent;
  const btns = [document.getElementById('tbl-code-copy-btn'), document.getElementById('tbl-copy-sidebar-btn')];
  const copy = () => {
    btns.forEach(b=>{ if(b){ b.textContent='✓ Copied!'; b.classList.add('copied'); }});
    setTimeout(()=>btns.forEach(b=>{ if(b){ b.textContent = b.id==='tbl-code-copy-btn' ? '📋 Copy Code' : '⎘ Copy HTML for Canvas'; b.classList.remove('copied'); }}), 2200);
  };
  if(navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(copy).catch(()=>tblFallbackCopy(text, copy));
  } else { tblFallbackCopy(text, copy); }
}
function tblFallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px;opacity:0;';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); cb(); } catch(e) { alert('Copy failed — please select and copy the code manually.'); }
  document.body.removeChild(ta);
}
