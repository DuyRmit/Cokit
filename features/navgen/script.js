/* ════════════════════════════════════════
   NAVIGATE GENERATOR
════════════════════════════════════════ */
let ngSections=[{title:'Course Introduction',content:'Overview of the course and learning objectives.'},{title:'Study Materials',content:'Reading list, references and resources.'},{title:'Assignments & Tests',content:'Assignment guidelines and assessment schedule.'}];
let ngStyle='gradient',ngColor='#000054';
function ngRenderSections(){
  const list=document.getElementById('ng-sectionsList');list.innerHTML='';
  ngSections.forEach((s,i)=>{
    list.innerHTML+=`<div class="ng-section-card"><div class="ng-section-card-header"><div class="ng-section-num">${i+1}</div><input type="text" placeholder="Section title..." value="${ngEsc(s.title)}" oninput="ngSections[${i}].title=this.value"><button class="ng-btn-remove" onclick="ngRemoveSection(${i})">×</button></div><div class="ng-section-card-body"><textarea rows="3" placeholder="Content..." oninput="ngSections[${i}].content=this.value">${ngEsc(s.content)}</textarea></div></div>`;
  });
}
function ngEsc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function ngAddSection(){ngSections.push({title:'',content:''});ngRenderSections();}
function ngRemoveSection(i){if(ngSections.length<=1)return;ngSections.splice(i,1);ngRenderSections();}
function ngSetStyle(btn){document.querySelectorAll('.ng-style-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');ngStyle=btn.dataset.style;}
function ngUpdateStyleButtons(){
  const color = ngColor;
  document.querySelectorAll('.ng-style-btn').forEach(btn=>{
    btn.style.setProperty('--ng-color', color);
  });
}
function ngSetColor(el){document.querySelectorAll('.ng-color-swatch').forEach(s=>s.classList.remove('active'));el.classList.add('active');ngColor=el.dataset.color;document.getElementById('ng-customColor').value=ngColor;}
function ngSetCustomColor(el){ngColor=el.value;document.querySelectorAll('.ng-color-swatch').forEach(s=>s.classList.remove('active'));}
function ngSwitchTab(tab,el){document.querySelectorAll('.ng-output-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.ng-output-area').forEach(a=>a.classList.remove('active'));el.classList.add('active');document.getElementById('ng-tab-'+tab).classList.add('active');}
function ngColClass(n){if(n<=1)return'col-xs-12';if(n===2)return'col-xs-12 col-md-6';if(n===3)return'col-xs-12 col-md-4';return'col-xs-12 col-md-3';}
function ngNavId(i){return i===0?'navigation':'navigation'+i;}
function ngBuildNavCard(i,s){
  const id=ngNavId(i),num=String(i+1).padStart(2,'0'),label=`SECTION ${num}`,title=s.title||`Section ${i+1}`;
  if(ngStyle==='gradient') return `<div id="${id}" style="padding:6px 4px;"><a href="#section${i+1}" style="display:block;background:linear-gradient(135deg,${ngColor},${ngColor}cc);color:#ffffff;text-decoration:none;border-radius:10px;padding:14px 18px;font-size:12pt;font-weight:600;text-align:left;box-shadow:0 3px 10px rgba(0,0,0,0.2);"><span style="display:inline-block;background:rgba(255,200,0,0.25);border-radius:50%;width:28px;height:28px;line-height:28px;text-align:center;font-size:10pt;font-weight:700;margin-right:10px;vertical-align:middle;">${i+1}</span>${title}</a></div>`;
  if(ngStyle==='border-left') return `<div id="${id}" style="padding:4px 2px;"><a href="#section${i+1}" style="display:block;background:#f5f5f5;color:${ngColor};text-decoration:none;border-radius:6px;border-left:4px solid ${ngColor};padding:12px 16px;font-size:12pt;font-weight:600;text-align:left;box-shadow:0 2px 6px rgba(0,0,0,0.1);"><span style="display:block;color:#FAC800;font-size:8.5pt;font-weight:700;letter-spacing:1px;margin-bottom:4px;">${label}</span>${title}</a></div>`;
  if(ngStyle==='border-top') return `<div id="${id}" style="padding:4px 2px;"><a href="#section${i+1}" style="display:block;background:#f5f5f5;color:${ngColor};text-decoration:none;border-radius:6px;border-top:4px solid ${ngColor};padding:12px 16px;font-size:12pt;font-weight:600;text-align:left;box-shadow:0 2px 6px rgba(0,0,0,0.1);"><span style="display:block;color:#FAC800;font-size:8.5pt;font-weight:700;letter-spacing:1px;margin-bottom:4px;">${label}</span>${title}</a></div>`;
  return `<div id="${id}" style="padding:4px 2px;"><a href="#section${i+1}" style="display:block;background:#ffffff;color:${ngColor};text-decoration:none;border-radius:6px;border:1.5px solid ${ngColor};padding:12px 16px;font-size:12pt;font-weight:600;text-align:left;"><span style="display:inline-block;font-size:9pt;font-weight:700;margin-right:8px;opacity:0.5;">${num}</span>${title}</a></div>`;
}
function ngGenerate(){
  const n=ngSections.length,perRow=n<=4?n:Math.ceil(n/2),col=ngColClass(perRow);
  let rows=[];
  for(let r=0;r<n;r+=perRow){
    const chunk=ngSections.slice(r,r+perRow);let row=`  <div class="grid-row">\n`;
    chunk.forEach((s,ci)=>{const gi=r+ci;row+=`    <div class="${col}">\n      <div class="content-box pad-box-mini" style="background-color:#f5f5f5;padding:8px 12px;height:100%;">\n        ${ngBuildNavCard(gi,s)}\n      </div>\n    </div>\n`;});
    row+=`  </div>`;rows.push(row);
  }
  const nav=`<div class="content-box">\n${rows.join('\n')}\n</div>`;
  const body=ngSections.map((s,i)=>`<h3>${s.title||`Section ${i+1}`}</h3>\n<div id="section${i+1}" class="content-box">\n  <p>${s.content||''}</p>\n  <div style="display:flex;justify-content:center;margin-top:12px;"><a href="#${ngNavId(0)}" style="display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#FAC800,#f0b800);border-radius:50%;width:48px;height:48px;text-decoration:none;color:${ngColor};font-size:18px;box-shadow:0 4px 12px rgba(250,200,0,0.4);">&#8679;</a></div>\n</div>`).join('\n\n');
  const code=nav+'\n\n'+body;

  // preview removed
  document.getElementById('ng-codeOutput').textContent=code;
}
function ngCopyCode(){
  const code=document.getElementById('ng-codeOutput').textContent;if(!code.trim())return;
  const btn=document.getElementById('ng-copyBtn');
  const ta=document.createElement('textarea');ta.value=code;ta.style.cssText='position:fixed;top:0;left:0;opacity:0;pointer-events:none;';document.body.appendChild(ta);ta.focus();ta.select();
  try{document.execCommand('copy');btn.textContent='✓ Copied!';btn.classList.add('copied');setTimeout(()=>{btn.textContent='📋 Copy Code';btn.classList.remove('copied');},2000);}catch(e){}
  document.body.removeChild(ta);
}


document.addEventListener('DOMContentLoaded', () => {
  ngRenderSections();
  ngUpdateStyleButtons();
  ngGenerate();
});
