(() => {
  'use strict';
  const dataElement=document.getElementById('eleu-atlas-data');
  if(!dataElement)return;
  const atlas=JSON.parse(dataElement.textContent);
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byGenus=new Map(atlas.map(a=>[a.genus,a]));
  const buttons=[...document.querySelectorAll('[data-eleu-genus]')];
  const detail=document.getElementById('eleu-genus-detail');
  const search=document.getElementById('eleu-search');
  const lineage=document.getElementById('eleu-lineage');
  const count=document.getElementById('eleu-result-count');
  const empty=document.getElementById('eleu-no-matches');
  let selected='Cochleanthes';
  function showGenus(genus){
    const a=byGenus.get(genus);if(!a)return;
    selected=genus;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.eleuGenus===genus)));
    // Plate 4 retains a three-column canvas, with the third column empty.
    const columns=3,index=a.figure===4?({a:0,b:1,c:3,d:4}[a.panel]):a.panel.charCodeAt(0)-97;
    detail.innerHTML=`<h3><i>${escape(genus)}</i></h3><p class="eleu-genus-lineage">${escape(a.lineage)}</p><div class="eleu-detail-grid"><figure><div class="eleu-panel-window" style="--panel-columns:${columns};--panel-x:${index%columns};--panel-y:${Math.floor(index/columns)};aspect-ratio:${columns===2?'2/1':'4/3'}"><img src="/images/eleutherocytes-2026/figure-${a.figure}.jpg" alt="Representative ${escape(genus)} cells from manuscript Figure ${a.figure}${a.panel}"></div><figcaption>Representative field · Figure ${a.figure}${a.panel}. <a href="#plate-${a.figure}" data-go-plate="${a.figure}">View the complete plate ↗</a></figcaption></figure><dl><div><dt>Cell outlines</dt><dd>${escape(a.shape)}</dd></div><div><dt>Visible contents</dt><dd>${escape(a.contents)}</dd></div><div><dt>Packing and organisation</dt><dd>${escape(a.packing)}</dd></div></dl></div><div class="eleu-sample-counts"><span>${a.accessions} accession${a.accessions===1?'':'s'}</span><span>${a.stills} still images</span><span>${a.videos} live recording${a.videos===1?'':'s'}</span></div>${a.qualifier?`<p class="eleu-qualifier">${escape(a.qualifier)}</p>`:''}`;
    detail.hidden=false;
  }
  function filter(){
    const query=search.value.trim().toLowerCase(),group=lineage.value;
    const matches=atlas.filter(a=>(!group||a.lineage===group)&&(!query||`${a.genus} ${a.taxa.join(' ')}`.toLowerCase().includes(query)));
    const names=new Set(matches.map(a=>a.genus));
    buttons.forEach(b=>{b.hidden=!names.has(b.dataset.eleuGenus);});
    count.textContent=`${matches.length} of ${atlas.length} genera`;
    empty.hidden=matches.length>0;
    if(!matches.length){detail.hidden=true;return;}
    if(!names.has(selected)||detail.hidden)showGenus(matches[0].genus);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>showGenus(b.dataset.eleuGenus)));
  search.addEventListener('input',filter);lineage.addEventListener('change',filter);
  document.getElementById('eleu-reset').addEventListener('click',()=>{search.value='';lineage.value='';showGenus('Cochleanthes');filter();});
  showGenus(selected);filter();
  document.querySelector('[data-atlas-controls]').hidden=false;
  document.querySelector('[data-atlas-browser]').hidden=false;
  const plates=[...document.querySelectorAll('[data-atlas-plate]')];
  const plateButtons=[...document.querySelectorAll('[data-show-plate]')];
  function showPlate(number){
    if(![1,2,3,4].includes(Number(number)))return;
    plates.forEach(p=>{p.hidden=Number(p.dataset.atlasPlate)!==Number(number);});
    plateButtons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.showPlate)===Number(number))));
  }
  plateButtons.forEach(b=>b.addEventListener('click',()=>showPlate(b.dataset.showPlate)));
  document.addEventListener('click',event=>{const link=event.target.closest('[data-go-plate]');if(link)showPlate(link.dataset.goPlate);});
  showPlate(1);document.querySelector('[data-plate-controls]').hidden=false;
  const transfer=document.getElementById('eleu-transfer-detail');
  const transferButtons=[...document.querySelectorAll('[data-transfer-step]')];
  const plants=[...document.querySelectorAll('[data-plant]')];
  const steps={
    1:{plant:'A',heading:'Pollen begins with plant A',tokens:[['a','A · pollen']],text:'A pollinator carries pollen from A. The later contribution of a third plant is not yet part of this first step.'},
    2:{plant:'B',heading:'A possible contribution from an earlier stigma',tokens:[['a','A · pollen'],['b','B · carried cells']],text:'If the pollinator withdraws pollen still carrying composite from B, detached cells of B could travel with the pollen. Persistence and transfer in natural visits require direct tests.'},
    3:{plant:'C',heading:'The proposed tri-individual recipient',tokens:[['a','A · pollen'],['b','B · carried cells'],['c','C · recipient cells']],text:'The stigma of C would contain its own cells, pollen from A, and cells carried from B. DNA release and exposure are further hypotheses; this scenario does not establish genetic integration or inheritance.'}
  };
  function showStep(number){
    const step=steps[number];if(!step)return;
    transferButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.transferStep===String(number))));
    plants.forEach(p=>p.classList.toggle('is-current',p.dataset.plant===step.plant));
    transfer.innerHTML=`<strong>${escape(step.heading)}</strong><p>${step.tokens.map(([source,label])=>`<span class="eleu-token source-${source}">${escape(label)}</span>`).join('')}</p><p>${escape(step.text)}</p>`;
  }
  transferButtons.forEach(b=>b.addEventListener('click',()=>showStep(b.dataset.transferStep)));
  showStep(1);document.querySelector('[data-transfer-controls]').hidden=false;
})();
