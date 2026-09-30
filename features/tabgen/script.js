/* ════════════════════════════════════════
   TAB GENERATOR
════════════════════════════════════════ */
$(function(){
  let tgCount=0,tgData=[];
  const maxTabs=4;
  function tgRenderSettings(){
    const c=$('#tg-tab-settings-container');c.empty();$('#tg-tab-count-badge').text(`${tgData.length} / ${maxTabs}`);
    if(!tgData.length){c.append('<div class="tg-empty-state"><span class="emoji">🗂</span>No tabs yet. Hit <strong>Add Tab</strong>!</div>');return;}
    const list=$('<div class="tg-tab-settings-list"></div>');
    tgData.forEach((tab,i)=>{
      const card=$(`<div class="tg-tab-item-card"><div class="tg-tab-item-header"><span class="tg-tab-number">Tab ${i+1}</span><button class="tg-btn-remove" data-index="${i}">✕ Remove</button></div><div class="tg-tab-field"><label>Tab Title</label><input type="text" id="tg-title-${i}" value="${tgEsc(tab.title)}" placeholder="Enter tab title"></div><div class="tg-tab-field"><label>Tab Content</label><textarea id="tg-content-${i}" rows="2" placeholder="Enter tab content">${tgEsc(tab.content)}</textarea></div></div>`);
      list.append(card);
    });
    c.append(list);
  }
  function tgEsc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function tgUpdatePreview(){
    const p=$('#tg-preview-tabs');const ul=p.find('ul');
    if(p.hasClass('ui-tabs'))p.tabs('destroy');
    ul.empty();p.find('> div').remove();
    if(!tgData.length)return;
    tgData.forEach((tab,i)=>{const id=`tg-frag-${i+1}`;ul.append(`<li><a href="#${id}">${tab.title||`Tab ${i+1}`}</a></li>`);p.append(`<div id="${id}"><p>${tab.content||'...'}</p></div>`);});
    p.tabs();
  }
  function tgGenCode(){
    if(!tgData.length){$('#tg-generated-html-output').val('');return;}
    let ul='    <ul style="background-color: #f5f5f5;">\n',divs='';
    tgData.forEach((tab,i)=>{const id=`fragment-${i+1}`;ul+=`        <li><a style="color: #000054; text-decoration: none;" href="#${id}"><strong>${tab.title}</strong></a></li>\n`;divs+=`    <div id="${id}">\n        <p>${tab.content}</p>\n    </div>\n`;});
    ul+='    </ul>\n';
    $('#tg-generated-html-output').val(`<div class="enhanceable_content tabs" style="margin-top: 20px; margin-bottom: 20px;">\n${ul}${divs}</div>`);
  }
  function tgAdd(){if(tgData.length>=maxTabs)return false;tgCount++;tgData.push({title:`Tab ${tgCount}`,content:`Content for Tab ${tgCount}`});return true;}
  tgAdd();tgRenderSettings();tgUpdatePreview();tgGenCode();
  $('#tg-add-tab-btn').on('click',()=>{if(!tgAdd())return;tgRenderSettings();tgUpdatePreview();tgGenCode();});
  $(document).on('click','.tg-btn-remove',function(){tgData.splice(parseInt($(this).data('index')),1);tgRenderSettings();tgUpdatePreview();tgGenCode();});
  $(document).on('input','#tg-tab-settings-container input, #tg-tab-settings-container textarea',function(){const id=$(this).attr('id');const idx=parseInt(id.split('-').pop());if(id.includes('title'))tgData[idx].title=$(this).val();else tgData[idx].content=$(this).val();tgUpdatePreview();tgGenCode();});
  $('#tg-generate-code-btn').on('click',tgGenCode);
  $('#tg-copy-btn').on('click',function(){
    const code=$('#tg-generated-html-output').val();
    if(!code)return;
    const btn=$(this);
    const done=()=>{btn.text('✓ Copied!').addClass('copied');setTimeout(()=>btn.text('Copy Code').removeClass('copied'),2200);};
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(code).then(done).catch(()=>{
        const ta=document.createElement('textarea');ta.value=code;ta.style.cssText='position:fixed;top:-9999px;opacity:0;';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy');done();}catch(e){}document.body.removeChild(ta);
      });
    } else {
      const ta=document.createElement('textarea');ta.value=code;ta.style.cssText='position:fixed;top:-9999px;opacity:0;';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy');done();}catch(e){alert('Copy failed — please select the code and press Ctrl+C.');}document.body.removeChild(ta);
    }
  });
});
