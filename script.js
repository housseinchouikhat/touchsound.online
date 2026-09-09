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

document.addEventListener('DOMContentLoaded', function () {

  var CRETE = '#d9ff2f';   // crest color — Touch Sound lime
  var CREUX = '#3a3d45';   // trough color — dark neutral

  var host = document.getElementById('ts-waveform-3d');
  if (!host || !window.THREE) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    host.style.display = 'none';
    return;
  }

  var W = host.clientWidth, H = host.clientHeight;
  var petit = W < 620;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.domElement.style.display = 'block';
  host.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 200);

  var NB = petit ? 54 : 86;
  var LARGEUR = petit ? 11 : 16.5;
  var pas = LARGEUR / NB;

  var groupe = new THREE.Group();
  var geoBarre = new THREE.BoxGeometry(pas * 0.52, 1, 0.16);
  var cCrete = new THREE.Color(CRETE);
  var cCreux = new THREE.Color(CREUX);
  var barres = [];

  function alea(i) {
    var s = Math.sin(i * 127.1) * 43758.5453;
    return s - Math.floor(s);
  }

  for (var i = 0; i < NB; i++) {
    var mat = new THREE.MeshStandardMaterial({ color: CREUX, roughness: 0.45, metalness: 0.25 });
    var barre = new THREE.Mesh(geoBarre, mat);
    barre.position.x = (i / (NB - 1) - 0.5) * LARGEUR;
    groupe.add(barre);
    barres.push({ mesh: barre, mat: mat, u: i / (NB - 1), j: 0.72 + alea(i) * 0.28 });
  }

  var ligne = new THREE.Mesh(
    new THREE.BoxGeometry(LARGEUR * 1.04, 0.012, 0.02),
    new THREE.MeshBasicMaterial({ color: CREUX, transparent: true, opacity: 0.45 })
  );
  ligne.position.z = -0.1;
  groupe.add(ligne);

  groupe.rotation.y = -0.34;
  groupe.rotation.x = 0.1;
  scene.add(groupe);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  var key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(2.5, 4, 6);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0x9fb4d8, 0.45);
  fill.position.set(-5, -1, 3);
  scene.add(fill);

  function cadre() {
    var aspect = W / H;
    camera.aspect = aspect;
    var z = (LARGEUR / 2) / (Math.tan(Math.PI * 30 / 360) * aspect) * 1.06;
    camera.position.set(0, 0.5, Math.min(42, Math.max(6, z)));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }
  cadre();

  var lent = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t = 0, px = 0, cx = 0, visible = true, boucle = null;

  window.addEventListener('mousemove', function (e) {
    px = (e.clientX / window.innerWidth) - 0.5;
  });

  function dessine() {
    for (var k = 0; k < NB; k++) {
      var b = barres[k], u = b.u, x = k * 0.55;
      var souffle = 0.5 + 0.5 * Math.pow(Math.abs(Math.sin(u * 5.4 - t * 0.55)), 1.6);
      var onde = Math.abs(
        Math.sin(x + t * 2.1) * 0.55 +
        Math.sin(x * 2.3 - t * 1.4) * 0.30 +
        Math.sin(x * 0.6 + t * 0.9) * 0.25
      ) / 1.1;
      var bord = Math.min(1, Math.min(u, 1 - u) * 9);
      var h = bord * (0.15 + 4.0 * souffle * b.j * (0.35 + 0.65 * onde));

      b.mesh.scale.y = h;
      var n = Math.min(1, h / 3.2);
      b.mat.color.copy(cCreux).lerp(cCrete, n);
    }
    cx += (px - cx) * 0.05;
    groupe.rotation.y = -0.34 + cx * 0.28;
    renderer.render(scene, camera);
  }

  function tourne() {
    if (!visible) { boucle = null; return; }
    t += 0.014;
    dessine();
    boucle = requestAnimationFrame(tourne);
  }

  if (lent) {
    t = 1.4;
    dessine();
  } else if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (visible && !boucle) tourne();
    }, { threshold: 0.01 }).observe(host);
  } else {
    tourne();
  }

  window.addEventListener('resize', function () {
    W = host.clientWidth; H = host.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H);
    cadre();
    if (lent || !visible) dessine();
  });

});

sampleForm?.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const data=new FormData(sampleForm);
  const submitBtn=sampleForm.querySelector('button[type="submit"]');
  submitBtn.disabled=true;
  submitBtn.textContent='Sending…';
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
    submitBtn.textContent='Get my free sample';
  }
});
