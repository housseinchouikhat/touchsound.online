const menu=document.getElementById('menu');
const nav=document.getElementById('navLinks');
const plan=document.getElementById('plan');
const form=document.getElementById('orderForm');
const files=document.getElementById('files');
const fileNames=document.getElementById('fileNames');
const status=document.getElementById('status');

const TOUCH_EMAIL='ch.houssein@gmail.com';
const PAYPAL_LINKS={
  single:'https://paypal.me/ElHousseinChouikhat/40USD',
  creator:'https://paypal.me/ElHousseinChouikhat/150USD',
  pro:'https://paypal.me/ElHousseinChouikhat/280USD'
};

menu?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  nav.style.display=open?'flex':'';
  nav.style.flexDirection=open?'column':'';
  nav.style.position=open?'absolute':'';
  nav.style.right=open?'4vw':'';
  nav.style.top=open?'76px':'';
  nav.style.background=open?'#080808':'';
  nav.style.padding=open?'20px':'';
  nav.style.border=open?'1px solid #333':'';
  nav.style.borderRadius=open?'15px':'';
});

document.querySelectorAll('[data-plan]').forEach(btn=>{
  btn.addEventListener('click',()=>{plan.value=btn.dataset.plan;});
});

files?.addEventListener('change',()=>{
  const list=[...files.files];
  fileNames.textContent=list.length?list.map(f=>f.name).join(' • '):'No files selected';
});

form?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const data=new FormData(form);
  const chosen=data.get('plan');
  const subject=`Touch Sound project — ${data.get('show')}`;
  const body=[
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Podcast/Channel: ${data.get('show')}`,
    `Service: ${chosen}`,
    `Duration: ${data.get('duration')||''}`,
    `Tracks: ${data.get('tracks')||''}`,
    `Notes: ${data.get('notes')||''}`,
    `Files selected: ${files?.files?.length||0}`
  ].join('\n');

  if(PAYPAL_LINKS[chosen] && !PAYPAL_LINKS[chosen].includes('YOUR_')) window.open(PAYPAL_LINKS[chosen],'_blank','noopener');
  if(TOUCH_EMAIL!=='YOUR_EMAIL_HERE'){
    window.location.href=`mailto:${TOUCH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent='Your email client is opening. Send the message to complete the request.';
  } else {
    status.textContent='Ready for launch. Add your real email and PayPal links in script.js.';
  }
});

const sampleForm=document.getElementById('sampleForm');
const sampleStatus=document.getElementById('sampleStatus');

sampleForm?.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const data=new FormData(sampleForm);
  const submitBtn=sampleForm.querySelector('button[type="submit"]');
  submitBtn.disabled=true;
  submitBtn.textContent='SENDING…';
  sampleStatus.textContent='Uploading your clip, please wait…';
  sampleStatus.style.color='#9a9a9a';
  try{
    const res=await fetch('/.netlify/functions/start-production',{method:'POST',body:data});
    const json=await res.json().catch(()=>({}));
    if(res.ok && json.success){
      sampleStatus.textContent='Got it! Check your email in a few minutes for your cleaned sample.';
      sampleStatus.style.color='#d9ff2f';
      sampleForm.reset();
      document.getElementById('fileNames')?.textContent;
    } else {
      throw new Error(json.error||'Something went wrong');
    }
  }catch(err){
    sampleStatus.textContent='Something went wrong sending your clip. Please try again or email us directly.';
    sampleStatus.style.color='#ff8080';
  }finally{
    submitBtn.disabled=false;
    submitBtn.textContent='GET MY FREE SAMPLE →';
  }
});
