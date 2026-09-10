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

document.addEventListener('DOMContentLoaded', function () {

  var ACCENT = '#d9ff2f';   // Touch Sound lime — fader/LED accent
  var PLAQUE = '#1a1b1f';
  var METAL  = '#8d9099';

  var host = document.getElementById('ts-console-3d');
  if (!host || !window.THREE) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    host.style.display = 'none';
    return;
  }

  var W = host.clientWidth, H = host.clientHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.domElement.style.display = 'block';
  host.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);

  var mPlaque = new THREE.MeshStandardMaterial({ color: PLAQUE, roughness: 0.62, metalness: 0.18 });
  var mCreux  = new THREE.MeshStandardMaterial({ color: 0x121317, roughness: 0.9, metalness: 0.05 });
  var mMetal  = new THREE.MeshStandardMaterial({ color: METAL, roughness: 0.3, metalness: 0.85 });
  var mCap    = new THREE.MeshStandardMaterial({ color: 0x34363f, roughness: 0.5, metalness: 0.3 });
  var mTrait  = new THREE.MeshStandardMaterial({
    color: ACCENT, roughness: 0.3, metalness: 0.6,
    emissive: ACCENT, emissiveIntensity: 0.4
  });

  var console3d = new THREE.Group();

  var plaque = new THREE.Mesh(new THREE.BoxGeometry(3.4, 4.1, 0.3), mPlaque);
  console3d.add(plaque);

  var bouton = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.2, 36), mCap);
  bouton.rotation.x = Math.PI / 2;
  bouton.position.set(0, 1.42, 0.24);
  var repere = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.1, 0.22), mTrait);
  repere.position.set(0, 0.11, 0.13);
  bouton.add(repere);
  console3d.add(bouton);

  var faders = [];
  [-1.05, 0, 1.05].forEach(function (x, n) {
    var rail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.5, 0.1), mCreux);
    rail.position.set(x, -0.62, 0.16);
    console3d.add(rail);

    var tige = new THREE.Mesh(new THREE.BoxGeometry(0.035, 2.5, 0.04), mMetal);
    tige.position.set(x, -0.62, 0.2);
    console3d.add(tige);

    var cap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.3, 0.34), mCap);
    cap.position.set(x, -0.62, 0.26);
    var trait = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.035, 0.03), mTrait);
    trait.position.z = 0.18;
    cap.add(trait);
    console3d.add(cap);

    var led = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 20),
      new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.2, roughness: 0.4 }));
    led.rotation.x = Math.PI / 2;
    led.position.set(x, 0.72, 0.17);
    console3d.add(led);

    faders.push({ cap: cap, led: led, niveau: 0.4 + n * 0.15, cible: 0.4 + n * 0.15 });
  });

  console3d.rotation.y = -0.3;
  console3d.rotation.x = 0.06;
  scene.add(console3d);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  var key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 4, 5.5);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0x9fb4d8, 0.45);
  fill.position.set(-4.5, 0, 3);
  scene.add(fill);
  var rim = new THREE.PointLight(ACCENT, 0.7, 12);
  rim.position.set(-1.5, -1.8, -3);
  scene.add(rim);

  function cadre() {
    var aspect = W / H;
    camera.aspect = aspect;
    var demiTan = Math.tan(Math.PI * 32 / 360);
    var zH = 2.35 / demiTan;
    var zW = 2.05 / (demiTan * aspect);
    camera.position.set(0, 0, Math.max(zH, zW) * 1.02);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }
  cadre();

  var lent = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t = 0, px = 0, cx = 0, visible = true, boucle = null, prochain = 0;

  window.addEventListener('mousemove', function (e) {
    px = (e.clientX / window.innerWidth) - 0.5;
  });

  function place() {
    for (var k = 0; k < faders.length; k++) {
      var f = faders[k];
      f.cap.position.y = -1.85 + f.niveau * 2.46;
      f.led.material.emissiveIntensity = 0.12 + f.niveau * 1.1;
    }
    bouton.rotation.z = Math.sin(t * 0.45) * 0.85;
    console3d.rotation.y = -0.3 + cx * 0.3;
  }

  function dessine() {
    if (t > prochain) {
      prochain = t + 1.6 + Math.random() * 1.8;
      for (var k = 0; k < faders.length; k++) {
        faders[k].cible = 0.28 + Math.random() * 0.6;
      }
    }
    for (var j = 0; j < faders.length; j++) {
      var f = faders[j];
      f.niveau += (f.cible - f.niveau) * 0.022;
    }
    cx += (px - cx) * 0.05;
    place();
    renderer.render(scene, camera);
  }

  function tourne() {
    if (!visible) { boucle = null; return; }
    t += 0.016;
    dessine();
    boucle = requestAnimationFrame(tourne);
  }

  if (lent) {
    faders[0].niveau = 0.62; faders[1].niveau = 0.44; faders[2].niveau = 0.71;
    place();
    renderer.render(scene, camera);
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
    if (lent || !visible) { place(); renderer.render(scene, camera); }
  });

});

document.addEventListener('DOMContentLoaded', function () {

  var ACCENT = '#d9ff2f';   // anneau lime autour des écouteurs
  var CORPS  = '#1c1d22';
  var METAL  = '#8d9099';

  var host = document.getElementById('ts-casque-3d');
  if (!host || !window.THREE) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    host.style.display = 'none';
    return;
  }

  var W = host.clientWidth, H = host.clientHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.domElement.style.display = 'block';
  host.appendChild(renderer.domElement);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
  camera.position.set(0, 0, W < 620 ? 7.4 : 6.4);

  var mCorps = new THREE.MeshStandardMaterial({ color: CORPS, roughness: 0.55, metalness: 0.2 });
  var mMousse = new THREE.MeshStandardMaterial({ color: 0x121317, roughness: 0.95, metalness: 0 });
  var mMetal = new THREE.MeshStandardMaterial({ color: METAL, roughness: 0.28, metalness: 0.9 });
  var mAccent = new THREE.MeshStandardMaterial({
    color: ACCENT, roughness: 0.32, metalness: 0.75,
    emissive: ACCENT, emissiveIntensity: 0.18
  });

  var casque = new THREE.Group();

  var arceau = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.105, 18, 80, Math.PI), mCorps);
  casque.add(arceau);

  var coussin = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.085, 14, 60, Math.PI * 0.72), mMousse);
  coussin.rotation.z = Math.PI * 0.14;
  casque.add(coussin);

  [-1, 1].forEach(function (s) {
    var tige = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.5, 16), mMetal);
    tige.position.set(s * 1.15, -0.22, 0);
    casque.add(tige);

    var coque = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.64, 0.4, 48), mCorps);
    coque.rotation.z = Math.PI / 2;
    coque.position.set(s * 1.13, -0.6, 0);
    casque.add(coque);

    var mousse = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.15, 16, 44), mMousse);
    mousse.rotation.y = Math.PI / 2;
    mousse.position.set(s * 0.93, -0.6, 0);
    casque.add(mousse);

    var anneau = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.032, 12, 60), mAccent);
    anneau.rotation.y = Math.PI / 2;
    anneau.position.set(s * 1.33, -0.6, 0);
    casque.add(anneau);
  });

  casque.position.y = 0.35;
  scene.add(casque);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  var key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(3.5, 4.5, 5);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0x9fb4d8, 0.5);
  fill.position.set(-5, 0.5, 2.5);
  scene.add(fill);
  var rim = new THREE.PointLight(ACCENT, 0.9, 14);
  rim.position.set(-1.5, -1.5, -3.5);
  scene.add(rim);

  var lent = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t = 0, px = 0, py = 0, cx = 0, cy = 0, visible = true, boucle = null;

  window.addEventListener('mousemove', function (e) {
    px = (e.clientX / window.innerWidth) - 0.5;
    py = (e.clientY / window.innerHeight) - 0.5;
  });

  function dessine() {
    t += 0.01;
    cx += (px - cx) * 0.05;
    cy += (py - cy) * 0.05;
    casque.rotation.y = Math.sin(t * 0.5) * 0.5 + cx * 0.5;
    casque.rotation.x = 0.05 + Math.sin(t * 0.33) * 0.05 - cy * 0.25;
    casque.position.y = 0.35 + Math.sin(t * 0.8) * 0.06;
    renderer.render(scene, camera);
  }

  function tourne() {
    if (!visible) { boucle = null; return; }
    dessine();
    boucle = requestAnimationFrame(tourne);
  }

  if (lent) {
    casque.rotation.y = -0.35;
    renderer.render(scene, camera);
  } else if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !boucle) tourne();
    }, { threshold: 0.01 }).observe(host);
  } else {
    tourne();
  }

  window.addEventListener('resize', function () {
    W = host.clientWidth; H = host.clientHeight;
    if (!W || !H) return;
    camera.aspect = W / H;
    camera.position.z = W < 620 ? 7.4 : 6.4;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
    if (lent || !visible) renderer.render(scene, camera);
  });

});

document.addEventListener('DOMContentLoaded', function () {

  var BULLE_G = '#7c5cff';
  var BULLE_D = '#d9ff2f';   // bulle de droite — lime Touch Sound
  var MUR     = '#2a2b30';
  var BOIS    = '#6b4a28';

  var host = document.getElementById('ts-micros-3d');
  if (!host || !window.THREE) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    host.style.display = 'none';
    return;
  }

  var W = host.clientWidth, H = host.clientHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  host.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);

  function texture(w, h, dessine) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    dessine(c.getContext('2d'), w, h);
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  var texMur = texture(256, 256, function (g, w, h) {
    g.fillStyle = MUR; g.fillRect(0, 0, w, h);
    for (var i = 0; i < 900; i++) {
      var x = Math.random() * w, y = Math.random() * h, r = 4 + Math.random() * 26;
      g.globalAlpha = 0.05 + Math.random() * 0.08;
      g.fillStyle = Math.random() > 0.5 ? '#000' : '#b6a6c9';
      g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
    }
    g.globalAlpha = 1;
  });

  var texBois = texture(512, 256, function (g, w, h) {
    g.fillStyle = BOIS; g.fillRect(0, 0, w, h);
    for (var y = 0; y < h; y += 34) {
      g.fillStyle = 'rgba(0,0,0,0.22)';
      g.fillRect(0, y, w, 2);
    }
    for (var i = 0; i < 700; i++) {
      var yy = Math.random() * h, l = 30 + Math.random() * 180;
      g.strokeStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.10)' : 'rgba(255,210,150,0.10)';
      g.lineWidth = 0.6 + Math.random() * 1.6;
      g.beginPath(); g.moveTo(Math.random() * w, yy);
      g.lineTo(Math.random() * w + l, yy + (Math.random() - 0.5) * 4); g.stroke();
    }
  });
  texBois.repeat.set(2, 1.4);

  var mur = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 16),
    new THREE.MeshStandardMaterial({ map: texMur, roughness: 0.95, metalness: 0 })
  );
  mur.position.set(0, 6, -3);
  mur.receiveShadow = true;
  scene.add(mur);

  var sol = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 16),
    new THREE.MeshStandardMaterial({ map: texBois, roughness: 0.42, metalness: 0.05 })
  );
  sol.rotation.x = -Math.PI / 2;
  sol.position.set(0, 0, 5);
  sol.receiveShadow = true;
  scene.add(sol);

  var mSombre = new THREE.MeshStandardMaterial({ color: 0x24262c, roughness: 0.65, metalness: 0.35 });
  var mChrome = new THREE.MeshStandardMaterial({ color: 0xcfd3d8, roughness: 0.22, metalness: 0.95 });
  var mGrille = new THREE.MeshStandardMaterial({ color: 0x35373f, roughness: 0.8, metalness: 0.3 });
  var mRotule = new THREE.MeshStandardMaterial({ color: 0x6c4ff0, roughness: 0.35, metalness: 0.5 });

  function micro(sens) {
    var pied = new THREE.Group();

    var socle = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.48, 0.08, 40), mSombre);
    socle.position.y = 0.04;
    socle.castShadow = true; socle.receiveShadow = true;
    pied.add(socle);

    var r1 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 16), mRotule);
    r1.position.y = 0.13; r1.castShadow = true;
    pied.add(r1);

    var brasBas = new THREE.Group();
    brasBas.position.y = 0.13;
    var t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.95, 18), mSombre);
    t1.position.y = 0.475; t1.castShadow = true;
    brasBas.add(t1);
    brasBas.rotation.z = sens * 0.30;
    pied.add(brasBas);

    var r2 = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 16), mRotule);
    r2.position.y = 0.95; r2.castShadow = true;
    brasBas.add(r2);

    var brasHaut = new THREE.Group();
    brasHaut.position.y = 0.95;
    var t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.85, 18), mSombre);
    t2.position.y = 0.425; t2.castShadow = true;
    brasHaut.add(t2);
    brasHaut.rotation.z = sens * -0.62;
    brasBas.add(brasHaut);

    var r3 = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 16), mRotule);
    r3.position.y = 0.85; r3.castShadow = true;
    brasHaut.add(r3);

    var tete = new THREE.Group();
    tete.position.y = 0.85;
    var corps = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.5, 28), mChrome);
    corps.castShadow = true;
    tete.add(corps);
    var bas = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 18), mChrome);
    bas.position.y = -0.25; bas.castShadow = true;
    tete.add(bas);
    var haut = new THREE.Mesh(new THREE.SphereGeometry(0.175, 24, 18), mGrille);
    haut.position.y = 0.25; haut.scale.y = 1.5; haut.castShadow = true;
    tete.add(haut);
    var bague = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.022, 10, 32), mRotule);
    bague.rotation.x = Math.PI / 2; bague.position.y = 0.1;
    tete.add(bague);

    tete.rotation.z = sens * -0.55;
    brasHaut.add(tete);

    pied.userData = { brasBas: brasBas, brasHaut: brasHaut, tete: tete, sens: sens };
    return pied;
  }

  var microG = micro(-1); microG.position.set(-1.45, 0, 0.4); microG.rotation.y = 0.30;
  var microD = micro(1);  microD.position.set(1.45, 0, 0.4);  microD.rotation.y = -0.30;
  scene.add(microG, microD);

  function rectArrondi(w, h, r) {
    var s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return s;
  }

  function bulle(couleur, sens) {
    var g = new THREE.Group();
    var mat = new THREE.MeshStandardMaterial({ color: couleur, roughness: 0.38, metalness: 0.1 });
    var opt = { depth: 0.16, bevelEnabled: true, bevelSize: 0.045, bevelThickness: 0.045, bevelSegments: 3, curveSegments: 14 };

    var corps = new THREE.Mesh(new THREE.ExtrudeGeometry(rectArrondi(1.25, 0.8, 0.2), opt), mat);
    corps.castShadow = true;
    g.add(corps);

    var q = new THREE.Shape();
    q.moveTo(0, 0);
    q.lineTo(sens * 0.30, 0.30);
    q.lineTo(sens * -0.02, 0.32);
    q.lineTo(0, 0);
    var pointe = new THREE.Mesh(new THREE.ExtrudeGeometry(q, opt), mat);
    pointe.position.set(sens * 0.25, -0.62, 0);
    pointe.castShadow = true;
    g.add(pointe);

    var mPoint = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.5, emissive: 0xffffff, emissiveIntensity: 0.25
    });
    var points = [];
    for (var i = 0; i < 3; i++) {
      var p = new THREE.Mesh(new THREE.SphereGeometry(0.082, 18, 14), mPoint);
      p.position.set((i - 1) * 0.30, 0, 0.23);
      g.add(p);
      points.push(p);
    }

    g.userData = { mat: mat, points: points, couleur: new THREE.Color(couleur) };
    return g;
  }

  var bulleG = bulle(BULLE_G, 1);
  bulleG.position.set(-2.55, 2.45, 0.7);
  bulleG.rotation.y = 0.28;
  var bulleD = bulle(BULLE_D, -1);
  bulleD.position.set(2.55, 2.15, 0.7);
  bulleD.rotation.y = -0.28;
  scene.add(bulleG, bulleD);

  var grisMur = new THREE.Color(MUR);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  var key = new THREE.DirectionalLight(0xfff2e0, 1.15);
  key.position.set(3.5, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -7; key.shadow.camera.right = 7;
  key.shadow.camera.top = 7; key.shadow.camera.bottom = -2;
  key.shadow.camera.near = 1; key.shadow.camera.far = 20;
  key.shadow.bias = -0.0012;
  scene.add(key);
  var fill = new THREE.DirectionalLight(0x9fb4d8, 0.4);
  fill.position.set(-5, 2, 4);
  scene.add(fill);

  function cadre() {
    var aspect = W / H;
    camera.aspect = aspect;
    var demiTan = Math.tan(Math.PI * 32 / 360);
    var z = 3.75 / (demiTan * aspect);
    camera.position.set(0, 1.6, Math.min(16, Math.max(7.4, z)));
    camera.lookAt(0, 1.2, 0);
    camera.updateProjectionMatrix();
  }
  cadre();

  var lent = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t = 0, visible = true, boucle = null;

  function anime(m, phase) {
    var d = m.userData;
    d.brasBas.rotation.z = d.sens * (0.30 + Math.sin(t * 0.9 + phase) * 0.055);
    d.brasHaut.rotation.z = d.sens * (-0.62 + Math.sin(t * 1.15 + phase + 0.7) * 0.07);
    d.tete.rotation.z = d.sens * (-0.55 + Math.sin(t * 1.4 + phase) * 0.09);
    m.position.y = Math.abs(Math.sin(t * 1.1 + phase)) * 0.025;
  }

  function animeBulle(b, actif, phase) {
    var d = b.userData;
    var cible = actif ? 1 : 0.84;
    b.scale.setScalar(b.scale.x + (cible - b.scale.x) * 0.08);
    d.mat.color.lerp(actif ? d.couleur : grisMur, 0.06);
    for (var i = 0; i < 3; i++) {
      var p = d.points[i];
      if (actif) {
        var f = Math.max(0, Math.sin((t * 2.3 + i * 0.36) % 1.6));
        p.scale.setScalar(0.7 + f * 0.5);
        p.position.y = f * 0.07;
      } else {
        p.scale.setScalar(0.72);
        p.position.y = 0;
      }
    }
    b.position.y = (b === bulleG ? 2.45 : 2.15) + Math.sin(t * 1.25 + phase) * 0.075;
  }

  function dessine() {
    anime(microG, 0);
    anime(microD, 2.1);
    var tourDeParole = Math.floor(t / 2.8) % 2 === 0;
    animeBulle(bulleG, tourDeParole, 0);
    animeBulle(bulleD, !tourDeParole, 1.6);
    renderer.render(scene, camera);
  }

  function tourne() {
    if (!visible) { boucle = null; return; }
    t += 0.016;
    dessine();
    boucle = requestAnimationFrame(tourne);
  }

  if (lent) {
    t = 0.8;
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
