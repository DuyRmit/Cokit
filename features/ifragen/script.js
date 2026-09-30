let ifraCode = '';

function ifraGenerate() {
  const link = document.getElementById('ifra-fileLink').value.trim();
  const height = document.getElementById('ifra-height').value || '2000';
  const output = document.getElementById('ifra-outputCode');
  const err = document.getElementById('ifra-error');

  err.style.display = 'none';
  output.classList.add('empty');
  output.textContent = 'Code will appear here after generating...';
  ifraCode = '';

  const cm = link.match(/\/courses\/(\d+)\//);
  const fm = link.match(/preview=(\d+)/);
  if (cm && fm) {
    const cid = cm[1], fid = fm[1];
    const ariaHidden = document.getElementById('ifra-aria-hidden').checked;
    const ariaAttr = ariaHidden ? ' aria-hidden="true"' : '';
    ifraCode = `<p><iframe src="https://rmit.instructure.com/courses/${cid}/files/${fid}/download" width="1200" height="${height}" loading="lazy" allowfullscreen="allowfullscreen"${ariaAttr} data-api-endpoint="https://rmit.instructure.com/api/v1/courses/${cid}/files/${fid}" data-api-returntype="File"></iframe></p>`;
    output.textContent = ifraCode;
    output.classList.remove('empty');
  } else {
    err.style.display = 'block';
  }
}

function ifraToggleAriaStyle(cb) {
  document.getElementById('ifra-aria-label').classList.toggle('checked', cb.checked);
}

function ifraCopy() {
  if (!ifraCode) return;
  const btn = document.getElementById('ifra-copyBtn');
  copyToClipboard(ifraCode, btn, '📋 Copy', '✓ Copied!');
}

function copyToClipboard(text, btn, defaultLabel, doneLabel) {
  const done = () => {
    btn.textContent = doneLabel;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = defaultLabel;
      btn.classList.remove('copied');
    }, 1800);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch (e) {}
  document.body.removeChild(ta);
}
