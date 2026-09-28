// Sound for AI Video page: package buttons preselect the brief, and the brief is sent to
// /.netlify/functions/ai-video-request (emails Touch Sound and confirms to the creator).
const aivForm=document.getElementById('aiVideoForm');
const aivStatus=document.getElementById('aivStatus');
const aivPackage=document.getElementById('aivPackage');

const aivSubmit=document.getElementById('aivSubmit');
const REQUEST_TEXT={
  test:{title:'100% free',note:'Your 5-second test arrives by email. No card required.',button:'Get my free test'},
  quote:{title:'Free quote',note:'Reply by email. Nothing is charged until you accept.',button:'Request my quote'},
};
const currentRequest=()=>aivForm?.querySelector('input[name="request"]:checked')?.value||'test';
function showRequest(){
  const t=REQUEST_TEXT[currentRequest()];
  document.getElementById('aivSubmitTitle').textContent=t.title;
  document.getElementById('aivSubmitNote').textContent=t.note;
  if(aivSubmit) aivSubmit.textContent=t.button;
}
function setRequest(value){
  const input=aivForm?.querySelector(`input[name="request"][value="${value}"]`);
  if(input){ input.checked=true; showRequest(); }
}
aivForm?.querySelectorAll('input[name="request"]').forEach((input)=>input.addEventListener('change',showRequest));

document.querySelectorAll('[data-package]').forEach((link)=>{
  link.addEventListener('click',()=>{ if(aivPackage) aivPackage.value=link.dataset.package; setRequest('quote'); });
});
document.querySelectorAll('[data-request]').forEach((link)=>{
  link.addEventListener('click',()=>setRequest(link.dataset.request));
});

aivForm?.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const data=new FormData(aivForm);
  const payload=Object.fromEntries(data.entries());
  payload.mood=data.getAll('mood');
  const submitBtn=aivForm.querySelector('button[type="submit"]');
  submitBtn.disabled=true;
  submitBtn.textContent='Sending…';
  aivStatus.textContent='Sending your brief…';
  aivStatus.style.color='#666';
  try{
    const res=await fetch('/.netlify/functions/ai-video-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const json=await res.json().catch(()=>({}));
    if(!res.ok || !json.success) throw new Error(json.error||'Something went wrong');
    aivStatus.textContent=payload.request==='test'
      ?'Got it! Your free 5-second test will arrive by email.'
      :'Got it! Check your inbox: we\'ll email your quote shortly.';
    aivStatus.style.color='#4d6600';
    aivForm.reset();
    showRequest();
  }catch(err){
    aivStatus.textContent='Something went wrong sending your brief. Please try again or email contact@touchsound.online.';
    aivStatus.style.color='#b00020';
  }finally{
    submitBtn.disabled=false;
    showRequest();
  }
});
