/* ════════════════════════════════════════
   DETAILS TOGGLE
════════════════════════════════════════ */
let dgTemplate='default';
function dgSetTemplate(t,btn){
  dgTemplate=t;
  document.querySelectorAll('.dg-style-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  dgUpdate();
}
function dgUpdate(){
  const s=(document.getElementById('dg-summary')||{}).value||'';
  const d=(document.getElementById('dg-description')||{}).value||'';
  const err=document.getElementById('dg-summary-error');
  if(!s.trim()){if(err)err.textContent='⚠ Summary cannot be empty.';document.getElementById('dg-codeBlock').innerHTML='<span class="dg-code-empty">Fill in the fields to generate code…</span>';dgUpdatePreview(s,d);return;}
  if(err)err.textContent='';
  const code=dgTemplate==='default'
    ?`<details style="margin-top: 15px;">\n    <summary style="color: #666666; cursor: pointer;">${s}</summary>\n    <div style="background-color: #f5f5f5; color: #333333; padding: 0px 15px; height: 100%; margin: 5px 15px;" title="embedded content">\n    <div style="margin: 0; padding: 10px 15px;">\n     <p>${d}</p>\n    </div>\n  </div>\n</details>`
    :`<details style="border: 1px solid #ccc; border-radius: 5px; overflow: hidden; margin-top:15px;">\n    <summary style="list-style: none; cursor: pointer; padding: 10px 15px; background-color: #efefef; border-bottom: 1px solid #ccc; display: block;"><span style="margin-right: 5px;">+</span><strong> ${s}</strong></summary>\n    <div style="padding: 5px 15px; background-color: #fff;">\n        <p>${d}</p>\n   </div>\n</details>`;
  document.getElementById('dg-codeBlock').textContent=code;
  dgUpdatePreview(s,d);
}
function dgUpdatePreview(s,d){
  const p=document.getElementById('dg-preview');if(!p)return;
  if(dgTemplate==='default'){
    p.innerHTML=`<details><summary style="color:#666;cursor:pointer;">${s||'Summary'}</summary><div style="background:#f5f5f5;color:#333;padding:0 15px;margin:5px 15px;"><p style="margin:0;padding:1em 0;">${d||'...'}</p></div></details>`;
  } else {
    p.innerHTML=`<details style="border:1px solid #ccc;border-radius:5px;overflow:hidden;"><summary style="list-style:none;cursor:pointer;padding:10px 15px;background:#efefef;border-bottom:1px solid #ccc;font-weight:bold;display:block;"><span style="margin-right:5px;">+</span>${s||'Summary'}</summary><div style="padding:1rem;background:#fff;"><p>${d||'...'}</p></div></details>`;
  }
}
function dgCopy(){
  const code=document.getElementById('dg-codeBlock').textContent;
  const btn=document.getElementById('dg-copyBtn');
  if(!code||code.includes('Fill in')) {dgShowToast('No code to copy.','error');return;}
  copyToClipboard(code,btn,'📋 Copy','✓ Copied!');
  dgShowToast('Copied to clipboard!','success');
}
function dgShowToast(msg,type){
  const t=document.getElementById('dg-toast');t.textContent=msg;t.className=`dg-toast ${type}`;t.style.display='flex';
  setTimeout(()=>t.style.display='none',3000);
}


document.addEventListener('DOMContentLoaded', () => {
  dgUpdate();
});
