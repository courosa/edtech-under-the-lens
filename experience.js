'use strict';
const key = 'edtech-under-the-lens-v2';
const legacyKey = 'edtech-thought-lab-v1';
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const freshState = () => ({brief:0, step:0, answers:{}, custom:null});
const fieldsFor = i => activities[i].pages.flatMap(p => p[2]);
const validCustom = b => Array.isArray(b) && b.length===2 && b.every(v=>typeof v==='string' && v.trim()) ? [b[0].slice(0,160),b[1].slice(0,1200)] : null;
// Never remap an older draft onto an unrelated product when the menu changes.
function normalizeState(s, i, legacy=false) {
 s = s && typeof s==='object' ? s : {};
 const oldBrief = legacy && legacyBriefs[i][s.brief];
 const match = oldBrief ? activities[i].briefs.findIndex(b=>b[0]===oldBrief[0]) : s.brief;
 const brief = Number.isInteger(match) && match>=0 && match<activities[i].briefs.length ? match : 0;
 const answers = Object.fromEntries(fieldsFor(i).filter(f=>typeof s.answers?.[f[0]]==='string').map(f=>[f[0],s.answers[f[0]]]));
 return {brief,step:Number.isInteger(s.step)&&s.step>=0&&s.step<=3?s.step:0,answers,custom:validCustom(s.custom)||(oldBrief && match===-1 ? [...oldBrief] : null)};
}
let current=0, active=false, states=activities.map(freshState), storageOK=true;
let stageMode='guide',stageActivity=0,stageIndex=0,stageItems=[],stageReturn=null;
let pendingAction=null;
function readSaved() {
 try {
  let data, legacy=false;
  const raw=localStorage.getItem(key);
  if(raw) { try {data=JSON.parse(raw)} catch {showNotice('The saved draft could not be read. You can start again or clear saved work.')} }
  else {const old=localStorage.getItem(legacyKey);if(old){try{data=JSON.parse(old);legacy=true}catch{showNotice('An older saved draft could not be read.')}}}
  if(Array.isArray(data?.states)&&data.states.length===3) {
   states=data.states.map((s,i)=>normalizeState(s,i,legacy));
   if(legacy) {save();showNotice('Your previous drafts are available. Retired briefs are kept with their original answers.');}
  }
 } catch {storageOK=false;}
}
function storageMessage(){
 const text=storageOK?'Saved in this browser':'Saving unavailable · download before leaving';
 if($('saved').textContent!==text)$('saved').textContent=text;
 $('storageNote').textContent=storageOK?'Your work is saved only in this browser. Download a copy to keep or share it.':'Browser saving is unavailable. Download your work before leaving this page.';
}
function save(){try{localStorage.setItem(key,JSON.stringify({version:2,states}));storageOK=true}catch{storageOK=false}storageMessage();}
function showNotice(text){$('notice').textContent=text;$('notice').hidden=!text;}
function briefFor(i=current){return states[i].custom || activities[i].briefs[states[i].brief];}
function answered(i=current){return fieldsFor(i).filter(f=>states[i].answers[f[0]]?.trim()).length;}
function hasWork(i){return answered(i)>0 || Boolean(states[i].custom);}
function preparedAnswers(i=current){return Object.fromEntries(fieldsFor(i).map(f=>[f[0],states[i].answers[f[0]]?.trim()||'[Not added yet]']));}
function result(i=current){return activities[i].compose(briefFor(i),preparedAnswers(i));}
function focusHeading(id){const el=$(id);el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'instant'});}
function goHome(){active=false;render();$('intro').scrollIntoView({block:'start'});$('tabs').querySelector('button')?.focus({preventScroll:true});}
function selectActivity(i){
 current=i;active=true;states[i].step=0;
 document.querySelectorAll('aside details').forEach((d,j)=>d.open=j===0);
 showNotice(hasWork(i)?'Your saved answers are here. Back to beginning keeps them; Reset this activity clears them.':'');
 render();save();focusHeading('title');
}
function setStep(step){states[current].step=step;render();save();focusHeading(step<3?'pageHeading':'resultTitle');}
function render(){
 const a=activities[current],s=states[current],b=briefFor();
 $('tabs').innerHTML=activities.map((a,i)=>`<button data-tab="${i}"><span class="num">ACTIVITY 0${i+1}</span>${esc(a.title)}<small>${['Write the apology. Own the consequences.','Sell the familiar. Defend the learning.','Imagine the failure. Rethink the future.'][i]}</small><span class="cardAction">${hasWork(i)?'Open saved activity →':'Start activity →'}</span></button>`).join('');
 $('tabs').querySelectorAll('button').forEach(btn=>btn.onclick=()=>selectActivity(Number(btn.dataset.tab)));
 $('workspace').hidden=!active;$('home').hidden=!active;$('intro').hidden=active;$('tabs').hidden=active;
 $('actLabel').textContent=a.tag;$('title').textContent=a.title;$('purpose').textContent=a.purpose;
 $('instructions').innerHTML=a.instructions.map(t=>`<li>${esc(t)}</li>`).join('');
 $('presentInstructions').textContent=talkInstructions[current];
 $('product').textContent=b[0];$('description').textContent=b[1];
 $('choose').innerHTML=a.briefs.map((b,i)=>`<option value="${i}">${i+1}. ${esc(b[0])}</option>`).join('')+(s.custom?'<option value="custom">Your edited / saved brief</option>':'');
 $('choose').value=s.custom?'custom':String(s.brief);
 $('stepText').textContent=s.step===3?'Review & share':`Step ${s.step+1} of 3`;
 $('steps').innerHTML=[...a.pages.map(p=>p[0]),'Review'].map((name,i)=>`<button data-step="${i}"${s.step===i?' aria-current="step"':''}>${i<3?i+1+'. ':''}${esc(name)}</button>`).join('');
 $('steps').querySelectorAll('button').forEach(btn=>btn.onclick=()=>setStep(Number(btn.dataset.step)));
 $('fields').hidden=s.step===3;$('result').hidden=s.step!==3;
 $('back').disabled=s.step===0;$('next').hidden=s.step===3;
 $('back').textContent=s.step===3?'Edit last step':'Previous step';
 $('next').textContent=s.step===2?'Review my piece':'Next: '+a.pages[Math.min(s.step+1,2)][0];
 $('status').textContent='';
 if(s.step<3){
  const p=a.pages[s.step];
  $('fields').innerHTML=`<h3 tabindex="-1" id="pageHeading">${esc(p[0])}</h3><p class="hint">${esc(p[1])}</p>`+p[2].map(f=>`<label class="field" for="answer-${f[0]}">${esc(f[1])}<small id="hint-${f[0]}">${esc(f[2])}</small></label><textarea id="answer-${f[0]}" aria-label="${esc(f[1])}" aria-describedby="hint-${f[0]}" placeholder="${esc(f[3])}">${esc(s.answers[f[0]]||'')}</textarea>`).join('');
  p[2].forEach(f=>$('answer-'+f[0]).oninput=e=>{s.answers[f[0]]=e.target.value;save();});
 }else{
  $('resultTitle').textContent=current===0?b[0]:s.answers.name||b[0];$('resultTitle').tabIndex=-1;
  const n=answered(),total=fieldsFor(current).length;
  $('reviewHint').textContent=n===total?'Your piece is ready. Present it, share the text, or return to any step to edit.':`${n} of ${total} prompts answered. Unfinished prompts are marked “Not added yet”. Return to any step to add more.`;
  $('output').innerHTML=result().split(/\n\n/).map(t=>`<p>${esc(t)}</p>`).join('');
 }
 storageMessage();
}
function confirmAction(title,text,label,action){pendingAction=action;$('confirmTitle').textContent=title;$('confirmText').textContent=text;$('confirmAction').textContent=label;$('cancelAction').textContent='Cancel';$('confirmDialog').showModal();$('cancelAction').focus();}
$('cancelAction').onclick=()=>{$('confirmDialog').close();};
$('confirmDialog').addEventListener('close',()=>{pendingAction=null;});
$('confirmAction').onclick=()=>{const action=pendingAction;pendingAction=null;$('confirmDialog').close();action?.();};
function setBrief(i){
 if(!Number.isInteger(i)||!activities[current].briefs[i])return;
 const s=states[current];if(i===s.brief&&!s.custom)return;
 const apply=()=>{states[current]={...freshState(),brief:i};save();render();showNotice('New brief selected. This activity starts at step 1.');focusHeading('pageHeading');};
 $('choose').value=s.custom?'custom':String(s.brief);
 if(hasWork(current))confirmAction('Change the brief?','This clears the answers and edited brief for this activity only. Download your draft first if you want to keep it.','Change brief & clear answers',apply);else apply();
}
$('resetActivity').onclick=()=>confirmAction('Reset this activity?','Clear its answers and edited brief, then return to the first brief at step 1. Your other activities stay saved. Download anything you want to keep first.','Reset this activity',()=>{states[current]=freshState();save();render();showNotice('This activity has been reset.');focusHeading('pageHeading');});
$('resetAll').onclick=()=>confirmAction('Clear all saved work?','Clear answers and edited briefs for all three activities in this browser, including older drafts. Other websites and course pages are unaffected. Download anything you want to keep first.','Clear all saved work',()=>{
 states=activities.map(freshState);current=0;
 try{localStorage.removeItem(key);localStorage.removeItem(legacyKey);storageOK=true;showNotice('All saved work has been cleared from this browser.');}catch{storageOK=false;showNotice('Work is cleared from this page, but browser storage could not be cleared. Use your browser’s site-data settings before leaving.');}
 goHome();
});
$('editBrief').onclick=()=>{const b=briefFor();$('briefName').value=b[0];$('briefDescription').value=b[1];$('briefDialog').showModal();$('briefName').focus();};
$('cancelBrief').onclick=()=>$('briefDialog').close();
$('briefForm').onsubmit=e=>{e.preventDefault();const name=$('briefName').value.trim(),description=$('briefDescription').value.trim();if(!name||!description)return;states[current].custom=[name,description];save();$('briefDialog').close();render();showNotice('Brief updated. Your answers have been kept.');$('editBrief').focus();};
$('beginning').onclick=()=>{setStep(0);showNotice('Back at the beginning. Your answers are still here.');};
$('random').onclick=()=>{const n=activities[current].briefs.length;setBrief((states[current].brief+1+Math.floor(Math.random()*(n-1)))%n);};
$('choose').onchange=e=>{if(e.target.value!=='custom')setBrief(Number(e.target.value));};
$('next').onclick=()=>{if(states[current].step<3)setStep(states[current].step+1);};
$('back').onclick=()=>{if(states[current].step>0)setStep(states[current].step-1);};
$('home').onclick=goHome;$('another').onclick=goHome;
$('brand').onclick=e=>{e.preventDefault();goHome();};
function piecePages(i){
 const a=activities[i],s=states[i],b=briefFor(i);
 return a.pages.map(p=>({label:p[0],title:i===0?b[0]:s.answers.name||b[0],html:p[2].map(f=>`<p class="stagePrompt">${esc(f[1])}</p><p class="stageAnswer">${esc(s.answers[f[0]]?.trim()||'[Not added yet]')}</p>`).join('')}));
}
function questionPages(i){return questions[i].map(q=>({label:q[2],title:activities[i].title,html:`<p class="question">${esc(q[0])}</p><p class="followup">${esc(q[1])}</p>`}));}
function setStage(mode,i=stageActivity){stageMode=mode;stageActivity=i;stageIndex=0;stageItems=mode==='piece'?piecePages(i):mode==='questions'?questionPages(i):[];renderStage();}
function openStage(mode){stageReturn=document.activeElement;stageActivity=current;setStage(mode,current);$('stage').showModal();document.body.style.overflow='hidden';focusStage();}
function focusStage(){$('stage').scrollTop=0;$('stageTitle').focus({preventScroll:true});}
function renderStage(){
 $('stageType').textContent=stageMode==='piece'?'Present':stageMode==='presentationEnd'?'Presentation complete':'Discussion';
 $('closeStage').textContent=active?'Back to my draft':'Back to activities';
 $('stageBack').hidden=!['piece','questions'].includes(stageMode);$('stageNext').hidden=$('stageBack').hidden;
 $('guideMenu').hidden=stageMode==='guide';
 if(stageMode==='guide'){
  $('stageLabel').textContent='DISCUSSION GUIDE';$('stageTitle').textContent='Choose a conversation.';
  $('stageBody').innerHTML='<p class="followup">One question at a time. Pause, listen, and invite another perspective.</p>'+activities.map((a,i)=>`<button class="guideChoice" data-guide="${i}">${esc(a.title)}<small>4 discussion questions →</small></button>`).join('');
  $('stageBody').querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>setStage('questions',Number(b.dataset.guide)));
  $('stageCount').textContent='';
 }else if(stageMode==='discussionEnd'||stageMode==='presentationEnd'){
  const discussion=stageMode==='discussionEnd';
  $('stageLabel').textContent=discussion?'CONVERSATION COMPLETE':'READY FOR CONVERSATION';
  $('stageTitle').textContent=discussion?'What will you carry forward?':'Make room for another perspective.';
  $('stageBody').innerHTML=`<p class="followup">${discussion?'Take one question or insight into your next educational technology decision.':'Invite responses to '+esc(activities[stageActivity].title)+'.'}</p><div class="endChoices">${discussion?'': '<button class="stageButton" id="beginDiscussion">Discuss this activity</button>'}<button class="stageButton" id="openActivity">Open this activity at step 1</button><button class="stageButton" id="chooseActivity">Choose another activity</button></div>`;
  if(!discussion)$('beginDiscussion').onclick=()=>setStage('questions');
  $('openActivity').onclick=async()=>{const i=stageActivity;await closeStage(false);selectActivity(i);};
  $('chooseActivity').onclick=leaveStageForHome;
  $('stageCount').textContent='';
 }else{
  const p=stageItems[stageIndex];$('stageLabel').textContent=p.label;$('stageTitle').textContent=p.title;$('stageBody').innerHTML=p.html;
  const piece=stageMode==='piece';$('stageBack').disabled=stageIndex===0;$('stageBack').textContent=piece?'Previous slide':'Previous question';
  $('stageCount').textContent=`${piece?'Slide':'Question'} ${stageIndex+1} of ${stageItems.length}`;
  $('stageNext').textContent=stageIndex===stageItems.length-1?(piece?'Finish presentation':'Finish discussion'):(piece?'Next slide':'Next question');
 }
 if($('stage').open)focusStage();
}
async function closeStage(restore=true){
 if(document.fullscreenElement)try{await document.exitFullscreen()}catch{}
 $('stage').close();document.body.style.overflow='';if(restore&&stageReturn?.isConnected)stageReturn.focus();
}
async function leaveStageForHome(){await closeStage(false);goHome();}
$('stage').addEventListener('close',()=>{document.body.style.overflow='';});
$('stage').addEventListener('cancel',e=>{e.preventDefault();closeStage();});
$('closeStage').onclick=()=>closeStage();$('stageHome').onclick=leaveStageForHome;
$('guideMenu').onclick=()=>setStage('guide');
$('stageNext').onclick=()=>{if(stageIndex<stageItems.length-1){stageIndex++;renderStage();}else setStage(stageMode==='piece'?'presentationEnd':'discussionEnd');};
$('stageBack').onclick=()=>{if(stageIndex>0){stageIndex--;renderStage();}};
$('stage').addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&!$('stageNext').hidden){e.preventDefault();$('stageNext').click();}if(e.key==='ArrowLeft'&&!$('stageBack').hidden){e.preventDefault();$('stageBack').click();}});
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('stage').requestFullscreen();}catch{$('fullscreen').textContent='Full screen unavailable';}};
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Exit full screen':'Full screen';});
$('present').onclick=()=>openStage('piece');$('discuss').onclick=()=>openStage('questions');$('discussTop').onclick=()=>openStage(active?'questions':'guide');
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(result());$('status').textContent='Copied. Paste wherever you want to share your piece.';}catch{const sel=window.getSelection(),range=document.createRange();range.selectNodeContents($('output'));sel.removeAllRanges();sel.addRange(range);$('status').textContent='Text selected. Press Command-C on Mac or Ctrl-C on Windows to copy.';}};
$('download').onclick=()=>{const blob=new Blob([activities[current].title+'\nBrief: '+briefFor()[0]+'\n'+briefFor()[1]+'\n\n'+result()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='EdTech-Under-the-Lens-'+activities[current].short.toLowerCase()+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
readSaved();render();
