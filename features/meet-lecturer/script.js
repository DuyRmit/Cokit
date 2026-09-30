/* ════════════════════════════════════════
   MEET LECTURER
════════════════════════════════════════ */

/* ── Tab switcher ── */
function mlSwitchTab(tab, el) {
  document.querySelectorAll('.ml-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ml-pane').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ml-pane-' + tab).classList.add('active');
}

/* ── Profile builder ── */
let mlProfileCount = 0;
const ML_IMG = 'https://via.placeholder.com/250?text=Photo';

function mlAddProfile() {
  mlProfileCount++;
  const id = mlProfileCount;
  const container = document.getElementById('ml-profile-forms');
  const block = document.createElement('div');
  block.className = 'ml-profile-block';
  block.id = 'ml-block-' + id;
  block.innerHTML = `
    <div class="ml-profile-block-header">
      <span>Lecturer ${id}</span>
      ${id > 1 ? `<button class="ml-remove-profile" onclick="mlRemoveProfile(${id})">✕ Remove</button>` : ''}
    </div>
    <div class="ml-profile-block-body">
      <div class="ml-field">
        <label>Full Name</label>
        <input type="text" class="ml-fullname" placeholder="e.g. Dr. Jane Smith">
      </div>
      <div class="ml-field">
        <label>Role</label>
        <input type="text" class="ml-role" placeholder="e.g. Senior Lecturer">
      </div>
      <div class="ml-field">
        <label>Email</label>
        <input type="email" class="ml-email" placeholder="name@rmit.edu.vn">
      </div>
      <div class="ml-field">
        <label>Campus</label>
        <div class="ml-campus-row">
          <label><input type="radio" name="ml-campus-${id}" value="Saigon South Campus" checked> Saigon South</label>
          <label><input type="radio" name="ml-campus-${id}" value="Hanoi Campus"> Hanoi</label>
        </div>
      </div>
      <div class="ml-field">
        <label>Learn More (bio / details)</label>
        <textarea class="ml-bio" placeholder="Write a short bio or additional details…"></textarea>
      </div>
    </div>
  `;
  container.appendChild(block);
}

function mlRemoveProfile(id) {
  const el = document.getElementById('ml-block-' + id);
  if (el) el.remove();
}

function mlGenerate() {
  const blocks = document.querySelectorAll('.ml-profile-block');
  if (!blocks.length) { alert('Add at least one lecturer profile first.'); return; }

  const previewDiv = document.getElementById('ml-preview-output');
  previewDiv.innerHTML = '';
  let rows = '';

  // chunk into rows of 3
  const profiles = Array.from(blocks);
  for (let i = 0; i < profiles.length; i += 3) {
    const chunk = profiles.slice(i, i + 3);
    let rowHtml = `<div class="grid-row">\n`;
    let previewRow = document.createElement('div');
    previewRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px;';

    chunk.forEach(block => {
      const name    = block.querySelector('.ml-fullname').value || 'Lecturer Name';
      const role    = block.querySelector('.ml-role').value    || 'Role';
      const email   = block.querySelector('.ml-email').value   || 'email@rmit.edu.vn';
      const campus  = block.querySelector('input[type=radio]:checked').value;
      const bio     = block.querySelector('.ml-bio').value     || '';

      const card = `  <div class="col-xs-12 col-md-4">
    <div style="display:table;height:100%;border-bottom:3px solid #411530;">
      <div style="display:table-row;width:250px;height:250px;">
        <div style="display:table-cell;background-color:#f0f1ef;overflow:hidden;width:250px;height:250px;">
          <img src="${ML_IMG}" alt="lecturer image" style="width:100%;height:100%;object-fit:cover;" />
        </div>
      </div>
      <div style="display:table-row;">
        <div style="display:table-cell;height:100%;background-color:#f0f1ef;padding:0 20px;text-align:left;">
          <h4><span style="font-size:14pt;color:#000054;border-bottom:3px solid #000054;">${name}</span></h4>
          <p><strong>${role}</strong></p>
          <p><a href="mailto:${email}">${email}</a></p>
          <p>${campus}</p>
          <details style="background-color:#f0f1ef;padding:15px 0;">
            <summary><strong>Learn More</strong></summary>
            <p>${bio}</p>
          </details>
        </div>
      </div>
    </div>
  </div>`;

      rowHtml += card + '\n';

      // preview card (simplified)
      const prev = document.createElement('div');
      prev.style.cssText = 'width:220px;border-bottom:3px solid #411530;font-family:sans-serif;font-size:12px;flex-shrink:0;';
      prev.innerHTML = `
        <div style="width:220px;height:180px;background:#f0f1ef;overflow:hidden;">
          <img src="${ML_IMG}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="background:#f0f1ef;padding:10px 14px;">
          <div style="font-size:13px;font-weight:700;color:#000054;border-bottom:2px solid #000054;display:inline-block;margin-bottom:4px;">${name}</div>
          <div style="font-size:11px;font-weight:600;">${role}</div>
          <div style="font-size:11px;"><a href="mailto:${email}" style="color:#000054;">${email}</a></div>
          <div style="font-size:11px;">${campus}</div>
        </div>`;
      previewRow.appendChild(prev);
    });

    // pad empty cols
    for (let p = chunk.length; p < 3; p++) {
      rowHtml += `  <div class="col-xs-12 col-md-4"><!-- empty --></div>\n`;
    }
    rowHtml += `</div>\n`;
    rows += rowHtml;
    previewDiv.appendChild(previewRow);
  }

  const finalCode = `<div>\n${rows}</div>`;
  document.getElementById('ml-code-output').textContent = finalCode;
}

function mlCopy() {
  const text = document.getElementById('ml-code-output').textContent;
  if (!text.trim()) { mlGenerate(); }
  const btns = [
    document.getElementById('ml-code-copy-btn'),
    document.getElementById('ml-copy-sidebar')
  ];
  const done = () => {
    btns.forEach(b => { if(b){ b.textContent = b.id === 'ml-code-copy-btn' ? '✓ Copied!' : '✓ Copied!'; b.classList.add('copied'); }});
    setTimeout(() => btns.forEach(b => { if(b){ b.textContent = b.id === 'ml-code-copy-btn' ? '📋 Copy Code' : '⎘ Copy HTML for Canvas'; b.classList.remove('copied'); }}), 2200);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => mlFallbackCopy(text, done));
  } else { mlFallbackCopy(text, done); }
}
function mlFallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.cssText = 'position:fixed;top:-9999px;opacity:0;';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); cb(); } catch(e) { alert('Copy failed — please select and copy manually.'); }
  document.body.removeChild(ta);
}

/* ── Image crop ── */
let mlDragImg = null, mlIsDragging = false;
let mlStartX = 0, mlStartY = 0, mlImgX = 0, mlImgY = 0;

document.addEventListener('DOMContentLoaded', function() {
  /* init one profile */
  mlAddProfile();

  /* wire up image upload */
  document.getElementById('ml-image-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      const container = document.getElementById('ml-crop-container');
      // clear placeholder
      container.innerHTML = '';
      if (mlDragImg) { mlDragImg = null; }
      mlDragImg = document.createElement('img');
      mlDragImg.src = ev.target.result;
      mlDragImg.style.cssText = 'position:absolute;top:0;left:0;user-select:none;';
      mlImgX = 0; mlImgY = 0;
      container.appendChild(mlDragImg);

      mlDragImg.onload = function() {
        const iar = mlDragImg.naturalWidth / mlDragImg.naturalHeight;
        const car = container.clientWidth / container.clientHeight;
        if (iar > car) { mlDragImg.style.height = '100%'; mlDragImg.style.width = 'auto'; }
        else           { mlDragImg.style.width  = '100%'; mlDragImg.style.height = 'auto'; }
        mlDragImg.style.left = ((container.clientWidth  - mlDragImg.offsetWidth)  / 2) + 'px';
        mlDragImg.style.top  = ((container.clientHeight - mlDragImg.offsetHeight) / 2) + 'px';
        mlImgX = parseInt(mlDragImg.style.left) || 0;
        mlImgY = parseInt(mlDragImg.style.top)  || 0;
        mlEnableDrag();
      };
    };
    reader.readAsDataURL(file);
  });
});

function mlEnableDrag() {
  if (!mlDragImg) return;
  mlDragImg.addEventListener('mousedown', mlStartDrag);
  window.addEventListener('mouseup',   mlEndDrag);
  window.addEventListener('mousemove', mlDoDrag);
  mlDragImg.addEventListener('touchstart', mlStartDragT, {passive:false});
  window.addEventListener('touchend',   mlEndDragT);
  window.addEventListener('touchmove',  mlDoDragT, {passive:false});
}
function mlStartDrag(e) { e.preventDefault(); mlIsDragging=true; mlStartX=e.clientX; mlStartY=e.clientY; }
function mlEndDrag()    { mlIsDragging=false; mlImgX=parseInt(mlDragImg.style.left)||0; mlImgY=parseInt(mlDragImg.style.top)||0; }
function mlDoDrag(e) {
  if (!mlIsDragging) return; e.preventDefault();
  const cont = document.getElementById('ml-crop-container');
  let nx = mlImgX + (e.clientX - mlStartX);
  let ny = mlImgY + (e.clientY - mlStartY);
  const minL = cont.clientWidth  - mlDragImg.offsetWidth;
  const minT = cont.clientHeight - mlDragImg.offsetHeight;
  nx = Math.min(0, Math.max(minL, nx));
  ny = Math.min(0, Math.max(minT, ny));
  mlDragImg.style.left = nx + 'px'; mlDragImg.style.top = ny + 'px';
}
function mlStartDragT(e) { e.preventDefault(); mlIsDragging=true; mlStartX=e.touches[0].clientX; mlStartY=e.touches[0].clientY; }
function mlEndDragT()    { mlIsDragging=false; mlImgX=parseInt(mlDragImg.style.left)||0; mlImgY=parseInt(mlDragImg.style.top)||0; }
function mlDoDragT(e) {
  if (!mlIsDragging) return; e.preventDefault();
  const cont = document.getElementById('ml-crop-container');
  let nx = mlImgX + (e.touches[0].clientX - mlStartX);
  let ny = mlImgY + (e.touches[0].clientY - mlStartY);
  const minL = cont.clientWidth  - mlDragImg.offsetWidth;
  const minT = cont.clientHeight - mlDragImg.offsetHeight;
  nx = Math.min(0, Math.max(minL, nx));
  ny = Math.min(0, Math.max(minT, ny));
  mlDragImg.style.left = nx + 'px'; mlDragImg.style.top = ny + 'px';
}

function mlCropImage() {
  if (!mlDragImg) { alert('Please upload an image first.'); return; }
  const canvas = document.createElement('canvas');
  canvas.width = 250; canvas.height = 250;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    mlDragImg,
    parseInt(mlDragImg.style.left) || 0,
    parseInt(mlDragImg.style.top)  || 0,
    mlDragImg.offsetWidth,
    mlDragImg.offsetHeight
  );
  canvas.toBlob(function(blob) {
    if (!blob) { alert('Crop failed.'); return; }
    const url = URL.createObjectURL(blob);
    const resultWrap = document.getElementById('ml-crop-result');
    resultWrap.innerHTML = '';

    const img = document.createElement('img');
    img.src = url; img.width = 250; img.height = 250;
    img.style.cssText = 'border-radius:8px;border:1px solid var(--border);display:block;';
    resultWrap.appendChild(img);

    const link = document.createElement('a');
    link.href = url; link.download = 'lecturer-photo.png';
    link.className = 'ml-download-link';
    link.innerHTML = '⬇ Download 250×250 PNG';
    resultWrap.appendChild(link);
  }, 'image/png');
}
