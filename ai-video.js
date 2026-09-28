// Sound for AI Video page: package buttons preselect the brief, and the brief is sent to
// /.netlify/functions/ai-video-request (emails Touch Sound and confirms to the creator).
const aivForm=document.getElementById('aiVideoForm');
const aivStatus=document.getElementById('aivStatus');
const aivPackage=document.getElementById('aivPackage');

document.querySelectorAll('[data-package]').forEach((link)=>{
  link.addEventListener('click',()=>{ if(aivPackage) aivPackage.value=link.dataset.package; });
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
    aivStatus.textContent='Got it! Check your inbox: we\'ll email your quote shortly.';
    aivStatus.style.color='#4d6600';
    aivForm.reset();
  }catch(err){
    aivStatus.textContent='Something went wrong sending your brief. Please try again or email contact@touchsound.online.';
    aivStatus.style.color='#b00020';
  }finally{
    submitBtn.disabled=false;
    submitBtn.textContent='Request my quote';
  }
});
