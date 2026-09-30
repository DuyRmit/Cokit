/* ═════════ RULES ═════════ */
const RULES = [
  { id: 'font',    title: 'Font is Lato',            help: 'Lato for all headings and body text.',
    lines: ["- Font: Lato, loaded from Google Fonts, with fallback 'Lato', 'Helvetica Neue', Arial, sans-serif"] },
  { id: 'size',    title: 'Text is 12pt or larger',   help: 'Body text at 12pt (16px) or larger. Small AI defaults such as 9pt are common.',
    lines: ['- Minimum text size: 12pt (16px) for all text'] },
  { id: 'caps',    title: 'No all caps',              help: 'Sentence case for headings and labels.',
    lines: ['- No ALL CAPS: no text-transform: uppercase, and do not type headings in capitals'] },
  { id: 'spacing', title: 'No wide letter spacing',   help: 'Normal spacing between letters.',
    lines: ['- letter-spacing: normal (no wide tracking)'] },
  { id: 'width',   title: 'Page width up to 1040px',  help: 'Page content stays within max-width: 1040px.',
    lines: ['- Page content max-width: 1040px'] },
  { id: 'bg',      title: 'Plain background',         help: 'No gradients or background images. Panels can use light grey.',
    lines: ['- Page background: plain (no gradients, no images); panels may use #f5f5f5'] },
  { id: 'palette', title: 'RMIT colours only',        help: 'Navy for headings and key text, yellow sparingly, red for warnings only, greys for panels and lines.',
    extra: '<span class="swatches" aria-label="RMIT palette">' +
      [['Navy','#000054'],['Yellow','#fac800'],['Red','#e61e2a'],['Grey line','#dbdbdb'],['Grey panel','#f5f5f5']]
        .map(c => `<span class="swatch"><i style="background:${c[1]}"></i>${c[0]} ${c[1]}</span>`).join('') + '</span>',
    lines: [
      '- Colours: only the RMIT palette',
      '  Navy #000054 (headings, key text), Yellow #fac800 (sparingly, accents),',
      '  Red #e61e2a (warnings/emphasis only), Grey line #dbdbdb, Grey panel #f5f5f5',
      '- Do not use bright brand colours as backgrounds'
    ] }
];

const $ = s => document.querySelector(s);
const cbs = () => [...document.querySelectorAll('.rule-cb')];

function renderRules() {
  $('#rules').innerHTML = RULES.map(r => `
    <div class="rule on" id="row-${r.id}">
      <label class="rule-main">
        <input type="checkbox" class="rule-cb" id="rule-${r.id}" value="${r.id}" checked>
        <span class="rule-text">
          <span class="rule-title">${r.title}</span>
          <span class="rule-help">${r.help}</span>
          ${r.extra || ''}
        </span>
      </label>
      <div class="rule-result" id="res-${r.id}" hidden></div>
    </div>`).join('');
  cbs().forEach(cb => cb.addEventListener('change', syncRules));
  syncRules();
}

function syncRules() {
  const all = cbs(), n = all.filter(c => c.checked).length;
  all.forEach(c => $('#row-' + c.value).classList.toggle('on', c.checked));
  $('#selCount').textContent = `${n} of ${all.length} selected`;
  $('#toggleAll').textContent = n === all.length ? 'Uncheck all' : 'Check all';
}

$('#toggleAll').addEventListener('click', () => {
  const all = cbs(), target = !all.every(c => c.checked);
  all.forEach(c => c.checked = target);
  syncRules();
});

/* ═════════ MODE ═════════ */
document.querySelectorAll('input[name=mode]').forEach(r => r.addEventListener('change', () => {
  const comp = document.querySelector('input[name=mode]:checked').value === 'component';
  $('#compField').hidden = !comp;
  $('#mode-whole').classList.toggle('on', !comp);
  $('#mode-comp').classList.toggle('on', comp);
}));

/* ═════════ SCAN ═════════ */
const PALETTE = ['000054', 'fac800', 'e61e2a', 'dbdbdb', 'f5f5f5', 'ffffff'];
const NAMED = ['black','red','blue','green','orange','purple','pink','yellow','gray','grey','brown','teal','cyan','magenta','lime','maroon','navy','gold','silver','olive','aqua','coral','crimson','indigo','violet','turquoise','tomato','salmon','khaki','beige','ivory','lavender'];
const COLOR_PROP = /^(color|background(-color|-image)?|border(-[a-z]+)*|outline(-[a-z]+)*|fill|stroke|box-shadow|text-shadow|caret-color|accent-color|text-decoration(-color)?|column-rule(-color)?|--[\w-]+)$/;
const SKIP_FONT_SEL = /\b(code|pre|kbd|samp)\b/i;
const CAPS_SKIP_TAGS = new Set(['SCRIPT','STYLE','TEXTAREA','CODE','PRE','NOSCRIPT']);
const LETTER_SPACING_MAX_EM = 0.02;     // wider than this counts as "wide"
const MIN_PT = 12;

function fmt(n) { return (Math.round(n * 10) / 10).toString(); }
function cut(s, n) { s = (s || '').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

function toPt(raw) {
  const v = raw.trim().toLowerCase();
  if (!v || /var\(|calc\(|clamp\(|min\(|max\(|inherit|initial|unset|revert/.test(v)) return null;
  const kw = { 'xx-small': 6.75, 'x-small': 7.5, 'small': 9.75, 'medium': 12, 'large': 13.5, 'x-large': 18, 'xx-large': 24, 'smaller': 10 };
  if (kw[v] !== undefined) return kw[v];
  const m = v.match(/^([\d.]+)(px|pt|rem|em|%)$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return { px: n * 0.75, pt: n, rem: n * 12, em: n * 12, '%': n / 100 * 12 }[m[2]];
}
function toEm(raw) {
  const v = raw.trim().toLowerCase();
  if (!v || /var\(|calc\(|inherit|initial|unset|normal/.test(v)) return null;
  const m = v.match(/^(-?[\d.]+)(px|em|rem)?$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!m[2]) return n === 0 ? 0 : null;
  return m[2] === 'px' ? n / 16 : n;
}
function hex6(h) {
  h = h.toLowerCase();
  if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split('').map(c => c + c).join('');
  return h.slice(0, 6);
}

function scanHTML(text) {
  const doc = new DOMParser().parseFromString(text, 'text/html');   // scripts do not run
  const decls = [];

  function pushDecls(body, sel) {
    const re = /([-\w]+)\s*:\s*((?:[^;()]|\([^)]*\))*)/g;
    let m;
    while ((m = re.exec(body))) {
      decls.push({ prop: m[1].toLowerCase(), value: m[2].replace(/\s*!important\s*$/i, '').trim(), sel });
    }
  }

  let css = '';
  doc.querySelectorAll('style').forEach(st => { css += '\n' + st.textContent; });
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let latoLoaded = /@import[^;]*lato/i.test(css);
  const rb = /([^{}]*)\{([^{}]*)\}/g; let b;
  while ((b = rb.exec(css))) {
    const sel = b[1].split(';').pop().trim().replace(/\s+/g, ' ');
    if (/^@font-face/i.test(sel)) { if (/lato/i.test(b[2])) latoLoaded = true; continue; }
    pushDecls(b[2], sel);
  }
  doc.querySelectorAll('[style]').forEach(el => pushDecls(el.getAttribute('style'), el.tagName.toLowerCase() + '[style]'));
  doc.querySelectorAll('link[href]').forEach(l => { if (/fonts\.(googleapis|bunny)/i.test(l.href) && /lato/i.test(l.href)) latoLoaded = true; });
  const externalCss = [...doc.querySelectorAll('link[rel~="stylesheet"][href]')].filter(l => !/fonts\.(googleapis|gstatic|bunny)/i.test(l.href)).length;

  /* ── FONT ── */
  const fam = {}; let famTotal = 0, famBad = 0, usesLato = false;
  decls.forEach(d => {
    let list = null;
    if (d.prop === 'font-family') list = d.value;
    else if (d.prop === 'font') { const m = d.value.match(/[\d.]+(?:px|pt|rem|em|%)(?:\s*\/\s*[^\s]+)?\s+(.+)$/i); if (m) list = m[1]; }
    if (!list || /var\(|inherit|initial|unset/i.test(list) || SKIP_FONT_SEL.test(d.sel)) return;
    famTotal++;
    const first = list.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    if (first.toLowerCase() === 'lato') usesLato = true;
    else { famBad++; fam[first] = (fam[first] || 0) + 1; }
  });
  const fontNotLoaded = usesLato && !latoLoaded;
  const fontIssues = famBad + (famTotal === 0 ? 1 : 0) + (fontNotLoaded ? 1 : 0);
  const famList = Object.entries(fam).sort((a, b) => b[1] - a[1]).slice(0, 4).map(e => `${e[0]} ×${e[1]}`).join(', ');
  const fontParts = [];
  if (famBad) fontParts.push(`${famBad} font setting${famBad > 1 ? 's' : ''} not using Lato (${famList})`);
  if (famTotal === 0) fontParts.push('No font-family found, so the browser default will be used');
  if (fontNotLoaded) fontParts.push('Lato is set but not loaded, so it only shows on computers that have Lato installed');

  /* ── SIZE ── */
  let sizeCount = 0, minPt = Infinity;
  decls.forEach(d => {
    let raw = null;
    if (d.prop === 'font-size') raw = d.value;
    else if (d.prop === 'font') { const m = d.value.match(/([\d.]+(?:px|pt|rem|em|%))(?:\s*\/\s*[^\s]+)?\s+\S/i); if (m) raw = m[1]; }
    if (raw === null) return;
    const pt = toPt(raw);
    if (pt !== null && pt < MIN_PT - 0.01) { sizeCount++; minPt = Math.min(minPt, pt); }
  });

  /* ── CAPS ── */
  const upperCss = decls.filter(d => d.prop === 'text-transform' && /uppercase/i.test(d.value)).length;
  let typed = 0; const typedSamples = [];
  const root = doc.body || doc.documentElement;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (CAPS_SKIP_TAGS.has(node.parentNode.nodeName)) continue;
    const t = node.textContent.trim();
    if (t.length < 8) continue;
    const letters = t.replace(/[^A-Za-z]/g, '');
    if (letters.length >= 8 && letters === letters.toUpperCase()) { typed++; if (typedSamples.length < 2) typedSamples.push(cut(t, 36)); }
  }
  const capsIssues = upperCss + typed;
  const capsParts = [];
  if (upperCss) capsParts.push(`${upperCss} CSS rule${upperCss > 1 ? 's' : ''} set text-transform: uppercase`);
  if (typed) capsParts.push(`${typed} text item${typed > 1 ? 's' : ''} typed in capitals (${typedSamples.map(s => '"' + s + '"').join(', ')})`);

  /* ── SPACING ── */
  let wide = 0, maxEm = 0;
  decls.filter(d => d.prop === 'letter-spacing').forEach(d => {
    const em = toEm(d.value);
    if (em !== null && em > LETTER_SPACING_MAX_EM + 1e-6) { wide++; maxEm = Math.max(maxEm, em); }
  });

  /* ── WIDTH ── */
  let has1040 = false; const wider = [];
  decls.filter(d => d.prop === 'max-width').forEach(d => {
    const m = d.value.match(/^([\d.]+)px$/i);
    if (!m) return;
    const n = parseFloat(m[1]);
    if (n === 1040) has1040 = true;
    else if (n > 1040) wider.push(`${cut(d.sel, 24)} ${n}px`);
  });
  const widthIssues = (has1040 ? 0 : 1) + wider.length;
  const widthParts = [];
  if (wider.length) widthParts.push(`Wider than 1040px: ${wider.slice(0, 3).join(', ')}`);
  if (!has1040) widthParts.push('No max-width: 1040px found');

  /* ── BACKGROUND ── */
  let grads = 0, imgs = 0;
  decls.filter(d => d.prop === 'background' || d.prop === 'background-image').forEach(d => {
    if (/gradient\(/i.test(d.value)) grads++;
    if (/url\((?!\s*['"]?#)/i.test(d.value)) imgs++;
  });
  const bgParts = [];
  if (grads) bgParts.push(`${grads} gradient${grads > 1 ? 's' : ''}`);
  if (imgs) bgParts.push(`${imgs} background image${imgs > 1 ? 's' : ''}`);

  /* ── PALETTE ── */
  const cols = {};
  decls.filter(d => COLOR_PROP.test(d.prop)).forEach(d => {
    let v = d.value.replace(/url\([^)]*\)/gi, '').replace(/(['"]).*?\1/g, '');
    const add = k => { cols[k] = (cols[k] || 0) + 1; };
    v = v.replace(/#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi, (m0, h) => { const k = hex6(h); if (!PALETTE.includes(k)) add('#' + k); return ' '; });
    v = v.replace(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)[^)]*\)/gi, (m0, r, g, bl) => {
      const k = [r, g, bl].map(x => Math.min(255, +x).toString(16).padStart(2, '0')).join('');
      if (!PALETTE.includes(k)) add('#' + k); return ' ';
    });
    v = v.replace(/hsla?\([^)]*\)/gi, m0 => { add(m0.replace(/\s+/g, '')); return ' '; });
    (v.toLowerCase().match(/[a-z]+/g) || []).forEach(w => { if (NAMED.includes(w)) add(w); });
  });
  const colEntries = Object.entries(cols).sort((a, b) => b[1] - a[1]);
  const colList = colEntries.slice(0, 6).map(e => `${e[0]} ×${e[1]}`).join(', ');

  return {
    meta: { externalCss },
    font:    { issues: fontIssues, detail: fontIssues ? fontParts.join('. ') + '.' : 'Every font setting starts with Lato, and Lato is loaded.' },
    size:    { issues: sizeCount, detail: sizeCount ? `${sizeCount} place${sizeCount > 1 ? 's' : ''} below 12pt. The smallest is ${fmt(minPt)}pt.` : 'No text below 12pt found.' },
    caps:    { issues: capsIssues, detail: capsIssues ? capsParts.join('. ') + '.' : 'No uppercase styling or capital-letter text found.' },
    spacing: { issues: wide, detail: wide ? `${wide} place${wide > 1 ? 's' : ''} with wide letter spacing. The widest is ${fmt(maxEm)}em.` : 'No wide letter spacing found.' },
    width:   { issues: widthIssues, detail: widthIssues ? widthParts.join('. ') + '.' : 'max-width: 1040px is set.' },
    bg:      { issues: grads + imgs, detail: (grads + imgs) ? bgParts.join(' and ') + ' found.' : 'No gradients or background images found.' },
    palette: { issues: colEntries.length, detail: colEntries.length ? `${colEntries.length} colour${colEntries.length > 1 ? 's' : ''} outside the palette: ${colList}${colEntries.length > 6 ? ', …' : ''}.` : 'Every colour is from the RMIT palette (or white).' }
  };
}

function showSummary(html, isError) {
  const box = $('#scanSummary');
  box.innerHTML = html;
  box.classList.toggle('error', !!isError);
  box.hidden = false;
}

function applyScan(res, name) {
  let bad = 0;
  RULES.forEach(r => {
    const x = res[r.id], has = x.issues > 0;
    if (has) bad++;
    $('#rule-' + r.id).checked = has;
    const out = $('#res-' + r.id);
    out.innerHTML = `<span class="chip ${has ? 'chip-bad' : 'chip-ok'}">${has ? 'Found in your file' : 'No issue found'}</span><span class="rule-detail"></span>`;
    out.querySelector('.rule-detail').textContent = x.detail;
    out.hidden = false;
  });
  syncRules();
  const safe = document.createElement('div'); safe.textContent = name;
  let html = `<p><strong>${bad} of ${RULES.length} rules have issues</strong> in ${safe.innerHTML}. ` +
    (bad ? 'We ticked those rules for you. Change the ticks however you need.' : 'Tick any rules you still want in your prompt.') + '</p>' +
    '<p>The scan reads CSS written in the file. It cannot see styles that JavaScript adds while the activity runs.' +
    (res.meta.externalCss ? ` This file also links ${res.meta.externalCss} external stylesheet${res.meta.externalCss > 1 ? 's' : ''}, which were not scanned.` : '') + '</p>';
  showSummary(html, false);
}

function clearScan() {
  RULES.forEach(r => { const o = $('#res-' + r.id); o.hidden = true; o.innerHTML = ''; });
  $('#scanSummary').hidden = true;
  $('#fileBar').hidden = true;
  $('#file').value = '';
}

function handleFile(file) {
  if (!file) return;
  if (!/\.html?$/i.test(file.name)) {
    $('#fileBar').hidden = true;
    showSummary('<p><strong>Please choose an .html file.</strong> Other file types can\'t be scanned.</p>', true);
    return;
  }
  const rd = new FileReader();
  rd.onerror = () => showSummary('<p><strong>We couldn\'t read that file.</strong> Try choosing it again.</p>', true);
  rd.onload = () => {
    try {
      const res = scanHTML(String(rd.result));
      $('#fileName').textContent = file.name;
      $('#fileBar').hidden = false;
      applyScan(res, file.name);
    } catch (e) {
      showSummary('<p><strong>We couldn\'t scan that file.</strong> You can still pick the rules yourself below.</p>', true);
    }
  };
  rd.readAsText(file);
}

$('#file').addEventListener('change', e => handleFile(e.target.files[0]));
$('#clearScan').addEventListener('click', clearScan);
const drop = $('#drop');
['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]));

/* ═════════ PROMPT ═════════ */
function buildPrompt() {
  const mode = document.querySelector('input[name=mode]:checked').value;
  const picked = RULES.filter(r => $('#rule-' + r.id).checked);
  const what = $('#what').value.trim();
  const notes = $('#notes').value.trim();
  const blocks = [];

  if (mode === 'whole') {
    blocks.push('You are editing an HTML learning activity for RMIT University.\nRestyle it to follow these rules.');
  } else {
    blocks.push('Here is one component from an HTML learning activity for RMIT University.\n' +
      `Only change: ${what}.\nKeep everything else (text, tags, structure) exactly the same.` +
      (picked.length ? '\nAny styling you add or change must follow these rules.' : ''));
  }

  if (picked.length) blocks.push('STYLE RULES\n' + picked.flatMap(r => r.lines).join('\n'));

  blocks.push('MUST KEEP\n' +
    '- All functionality, JavaScript logic, ids and classes unchanged\n' +
    (mode === 'whole'
      ? '- Output stays ONE self-contained HTML file (CSS and JS inline), no external files\n'
      : '- It must still work inside ONE self-contained HTML file: CSS and JS stay inline, no external files\n') +
    '- Keep accessibility: contrast, alt text, labels, keyboard support');

  blocks.push('OUTPUT\n' + (mode === 'whole'
    ? '- Return the complete updated file, then a short list of what you changed.'
    : '- Return the full updated snippet.'));

  if (notes) blocks.push('ADDITIONAL NOTES\n' + notes);

  blocks.push(mode === 'whole' ? '[Paste your HTML below, or attach the file]' : '[Paste the component HTML (outerHTML) below]');
  return blocks.join('\n\n');
}

$('#generate').addEventListener('click', () => {
  const err = $('#err'); err.hidden = true;
  const mode = document.querySelector('input[name=mode]:checked').value;
  const anyRule = cbs().some(c => c.checked);
  if (mode === 'component' && !$('#what').value.trim()) {
    err.textContent = 'Describe what should change in the component (step 3).'; err.hidden = false; $('#what').focus(); return;
  }
  if (mode === 'whole' && !anyRule) {
    err.textContent = 'Tick at least one rule in step 2.'; err.hidden = false; return;
  }
  $('#outText').textContent = buildPrompt();
  $('#output').hidden = false;
  $('#outHelp').hidden = false;
  $('#output').scrollIntoView({ block: 'nearest' });
});

/* ═════════ COPY ═════════ */
$('#copyBtn').addEventListener('click', () => {
  const text = $('#outText').textContent, btn = $('#copyBtn');
  const done = () => { btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy prompt'; }, 1800); };
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done).catch(fallback);
  else fallback();
});

renderRules();
