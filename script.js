const menu=document.getElementById('menu');
const nav=document.getElementById('navLinks');
const plan=document.getElementById('plan');
const form=document.getElementById('orderForm');
const files=document.getElementById('files');
const fileNames=document.getElementById('fileNames');
const status=document.getElementById('status');

const TOUCH_EMAIL='contact@touchsound.online';
const RATE_PER_MINUTE=3;
const MINIMUM_PRICE=30;
const PAYPAL_BASE='https://paypal.me/ElHousseinChouikhat/';
const PAYPAL_LINKS={
  creator:'https://paypal.me/ElHousseinChouikhat/486USD',
  pro:'https://paypal.me/ElHousseinChouikhat/972USD'
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
  btn.addEventListener('click',()=>{
    plan.value=btn.dataset.plan;
    const price=btn.getAttribute('data-price');
    const minutes=btn.getAttribute('data-minutes');
    if(price && minutes){
      const durationField=form.querySelector('[name="duration"]');
      if(durationField) durationField.value=minutes+' min';
    }
  });
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

  let paypalUrl=PAYPAL_LINKS[chosen];
  if(chosen==='single'){
    const minutesMatch=(data.get('duration')||'').match(/\d+/);
    const minutes=minutesMatch?parseInt(minutesMatch[0],10):0;
    const price=Math.max(minutes*RATE_PER_MINUTE, MINIMUM_PRICE);
    paypalUrl=PAYPAL_BASE+price+'USD';
  }

  if(paypalUrl) window.open(paypalUrl,'_blank','noopener');
  if(TOUCH_EMAIL!=='YOUR_EMAIL_HERE'){
    window.location.href=`mailto:${TOUCH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent='Your email client is opening. Send the message to complete the request.';
  } else {
    status.textContent='Ready for launch. Add your real email and PayPal links in script.js.';
  }
});

const calcSlider=document.getElementById('calcSlider');
const calcMinutes=document.getElementById('calcMinutes');
const calcPrice=document.getElementById('calcPrice');
const calcCta=document.getElementById('calcCta');

function updateCalc(){
  if(!calcSlider) return;
  const minutes=parseInt(calcSlider.value,10);
  const price=Math.max(minutes*RATE_PER_MINUTE, MINIMUM_PRICE);
  calcMinutes.textContent=minutes;
  calcPrice.textContent='$'+price;
  if(calcCta){
    calcCta.setAttribute('data-price', price);
    calcCta.setAttribute('data-minutes', minutes);
  }
}
calcSlider?.addEventListener('input', updateCalc);
updateCalc();

const sampleForm=document.getElementById('sampleForm');
const sampleStatus=document.getElementById('sampleStatus');

function initHeroSphere(){
  const canvas=document.getElementById('heroCanvas');
  if(!canvas || typeof THREE==='undefined') return;

  const width=canvas.clientWidth || 520;
  const height=canvas.clientHeight || 520;

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45, width/height, 0.1, 100);
  camera.position.z=7;

  const renderer=new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(width,height);

  const group=new THREE.Group();
  scene.add(group);

  const particleCount=1400;
  const positions=new Float32Array(particleCount*3);
  const basePositions=new Float32Array(particleCount*3);
  const radius=2.6;

  for(let i=0;i<particleCount;i++){
    const theta=Math.random()*Math.PI*2;
    const phi=Math.acos((Math.random()*2)-1);
    const r=radius*(0.85+Math.random()*0.3);
    const x=r*Math.sin(phi)*Math.cos(theta);
    const y=r*Math.sin(phi)*Math.sin(theta);
    const z=r*Math.cos(phi);
    positions[i*3]=x; positions[i*3+1]=y; positions[i*3+2]=z;
    basePositions[i*3]=x; basePositions[i*3+1]=y; basePositions[i*3+2]=z;
  }

  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));

  const material=new THREE.PointsMaterial({
    color:0xd9ff2f,
    size:0.045,
    transparent:true,
    opacity:0.85,
    blending:THREE.AdditiveBlending,
    depthWrite:false
  });

  const points=new THREE.Points(geometry, material);
  group.add(points);

  const coreGeo=new THREE.SphereGeometry(0.55,32,32);
  const coreMat=new THREE.MeshBasicMaterial({color:0xd9ff2f, transparent:true, opacity:0.10});
  const core=new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  let t=0;
  function animate(){
    requestAnimationFrame(animate);
    t+=0.006;
    group.rotation.y+=0.0022;
    group.rotation.x=Math.sin(t*0.4)*0.08;

    const posAttr=geometry.attributes.position;
    for(let i=0;i<particleCount;i++){
      const bx=basePositions[i*3], by=basePositions[i*3+1], bz=basePositions[i*3+2];
      const wobble=1+Math.sin(t*1.6 + i*0.35)*0.045;
      posAttr.array[i*3]=bx*wobble;
      posAttr.array[i*3+1]=by*wobble;
      posAttr.array[i*3+2]=bz*wobble;
    }
    posAttr.needsUpdate=true;

    const breathe=1+Math.sin(t*1.1)*0.05;
    core.scale.setScalar(breathe);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize',()=>{
    const w=canvas.clientWidth, h=canvas.clientHeight;
    if(!w||!h) return;
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  });
}
initHeroSphere();

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
      sampleStatus.textContent='Got it! We\'ll email you your cleaned sample within 24 hours.';
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
