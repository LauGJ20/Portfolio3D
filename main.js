document.addEventListener('DOMContentLoaded', function () {

  // ─── RENDERER ──────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5e6d0);
  scene.fog = new THREE.FogExp2(0xf5e6d0, 0.018);

  const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.01, 200);
  camera.position.set(0, 3, 8);

  // ─── LIGHTING ──────────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0xfff8ec, 0.9);
  scene.add(ambient);

  const sunLight = new THREE.DirectionalLight(0xffe8b0, 1.6);
  sunLight.position.set(-5, 12, 8);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -15; sunLight.shadow.camera.right = 15;
  sunLight.shadow.camera.top = 15;   sunLight.shadow.camera.bottom = -15;
  sunLight.shadow.bias = -0.001;
  scene.add(sunLight);

  const fillLight   = new THREE.PointLight(0xffd9a0, 0.6, 20); fillLight.position.set(6, 4, 3);    scene.add(fillLight);
  const plantBounce = new THREE.PointLight(0xd4eec8, 0.3, 12); plantBounce.position.set(-6, 2, -2); scene.add(plantBounce);
  const riverGlow   = new THREE.PointLight(0xc8e0f0, 0.2, 15); riverGlow.position.set(0, -1, 6);   scene.add(riverGlow);

  // ─── INTERACTIVE CONFIG ────────────────────────────────────────
  const interactiveConfig = {
    'MONITOR':     { tooltip:'🖥️ Ver portfolio',   emissiveColor: new THREE.Color(0xff9944), action: () => zoomToMonitor()  },
    'MONITOR2':    { tooltip:'🖼️ Proyectos web',   emissiveColor: new THREE.Color(0xff9944), action: () => zoomToMonitor2() },
    'ARTSTATION':  { tooltip:'🎨 ArtStation',       emissiveColor: new THREE.Color(0xff6600), action: () => openFolderWindow('artstation') },
    'LINKEDIN':    { tooltip:'💼 LinkedIn',         emissiveColor: new THREE.Color(0x6688ff), action: () => openFolderWindow('linkedin')   },
    'GMAIL':       { tooltip:'💌 Contacto',         emissiveColor: new THREE.Color(0xff4444), action: () => window.open('mailto:laugjan20@gmail.com','_blank') },
    'MIPERSONAJE': { tooltip:'💬 Hablar con Lau',  emissiveColor: new THREE.Color(0xffaacc), action: () => startDialogue()  },
    'GATO':        { tooltip:'🐱 Miau',             emissiveColor: new THREE.Color(0xffddaa), action: () => startCatDialogue() },
    'Gmail':       { tooltip:'💌 Contacto',         emissiveColor: new THREE.Color(0xff4444), action: () => window.open('mailto:laugjan20@gmail.com','_blank') },
    'ArtStation':  { tooltip:'🎨 ArtStation',       emissiveColor: new THREE.Color(0xff6600), action: () => openFolderWindow('artstation') },
    'Linkedin':    { tooltip:'💼 LinkedIn',         emissiveColor: new THREE.Color(0x6688ff), action: () => openFolderWindow('linkedin')   },
  };

  // ─── DESKTOP 1 ─────────────────────────────────────────────────
  const desktopOverlay  = document.getElementById('desktop-overlay');
  const desktopBackdrop = document.getElementById('desktop-backdrop');
  const taskbarClose    = document.getElementById('taskbar-close');

  const taskbarClock = document.getElementById('taskbar-clock');
  setInterval(() => {
    const n = new Date();
    taskbarClock.textContent = String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
  }, 1000);

  document.querySelectorAll('.taskbar-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.taskbar-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
      const map = { projects:'tab-projects', about:'tab-about', contact:'tab-contact' };
      const id = map[item.dataset.tab];
      if (id) document.getElementById(id).style.display = 'block';
    });
  });

  document.querySelectorAll('.folder').forEach(f => {
    f.addEventListener('click', () => openFolderWindow(f.dataset.win));
  });

  function openDesktop() {
    desktopBackdrop.classList.add('active');
    desktopOverlay.classList.add('active');
  }
  function closeDesktop() {
    desktopBackdrop.classList.remove('active');
    desktopOverlay.classList.remove('active');
    if (cameraMode === 'monitor') resetCamera();
  }
  taskbarClose.addEventListener('click', closeDesktop);

  // ─── DESKTOP 2 ─────────────────────────────────────────────────
  const d2Backdrop = document.getElementById('d2-backdrop');
  const d2Overlay  = document.getElementById('d2-overlay');
  const d2Close    = document.getElementById('d2-close');

  document.querySelectorAll('.d2-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.d2-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.d2-content').forEach(c => c.style.display = 'none');
      document.getElementById(tab.dataset.tab).style.display = 'block';
    });
  });

  function openD2() {
    d2Backdrop.style.display = '';
    d2Overlay.style.display  = '';
    d2Backdrop.classList.add('active');
    d2Overlay.classList.add('active');
  }
  function closeD2() {
    d2Backdrop.classList.remove('active');
    d2Overlay.classList.remove('active');
    d2Backdrop.style.display = 'none';
    d2Overlay.style.display  = 'none';
    if (cameraMode === 'monitor2') resetCamera();
  }
  d2Close.addEventListener('click', closeD2);

  // ─── FOLDER WINDOWS ────────────────────────────────────────────
  const windowPopup = document.getElementById('window-popup');
  const winTitle    = document.getElementById('win-title');
  const winBody     = document.getElementById('win-body');
  const winClose    = document.getElementById('win-close');

  const folderData = {
    artstation: {
      title: '🎨 ARTSTATION',
      html: `<p>Todos mis trabajos de arte 3D, personajes y entornos.</p>
             <div class="win-links">
               <a href="https://www.artstation.com/lau_garjan" target="_blank" class="win-link" style="text-decoration:none">
                 <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px"><path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.085 1.202h13.971l-2.158-3.707H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.098-1.196H11.39l9.428 16.318 2.167 3.746c.634-.482 1.015-1.234 1.015-2.648zm-11.629 1.682l-5.517-9.564-5.517 9.564h11.034z"/></svg>
                 Ver mi ArtStation →
               </a>
             </div>`
    },
    linkedin: {
      title: '💼 LINKEDIN',
      html: `<p>Mi experiencia y trayectoria profesional.</p>
             <div class="win-links">
               <a href="https://www.linkedin.com/in/laura-garc%C3%ADa-jancko/" target="_blank" class="win-link" style="text-decoration:none">
                 <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                 Ver mi LinkedIn →
               </a>
             </div>`
    },
    web: {
      title: '🌐 MI WEB',
      html: `<p>Mi portfolio web completo.</p>
             <div class="win-links">
               <a href="PortfolioWeb/index.html" target="_blank" class="win-link" style="text-decoration:none">🌐 Abrir mi web →</a>
             </div>`
    }
  };

  function openFolderWindow(key) {
    const data = folderData[key]; if (!data) return;
    winTitle.textContent = data.title;
    winBody.innerHTML    = data.html;
    windowPopup.classList.add('active');
  }
  winClose.addEventListener('click', () => windowPopup.classList.remove('active'));
  windowPopup.addEventListener('click', e => { if (e.target === windowPopup) windowPopup.classList.remove('active'); });

  // ─── LOADING ───────────────────────────────────────────────────
  const bar     = document.getElementById('bar');
  const loadPct = document.getElementById('load-pct');
  const interactiveMeshes = [];
  const meshByName = {};

  setTimeout(() => {
    const el = document.getElementById('loading');
    if (!el.classList.contains('hidden')) {
      el.classList.add('hidden');
      showToast('⚠️ Comprueba que Habitacion3D.glb está en la carpeta');
    }
  }, 15000);

  // ─── TOAST ─────────────────────────────────────────────────────
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
  }

  // ─── LOAD GLB ──────────────────────────────────────────────────
  const loader = new THREE.GLTFLoader();
  loader.load('models/Habitacion3D.glb',
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      model.traverse(obj => {
        if (!obj.isMesh) return;
        obj.castShadow = true; obj.receiveShadow = true;
        if (/^Plane(\.\d+)?$/.test(obj.name) && !interactiveConfig[obj.name]) { obj.visible = false; return; }
        if (interactiveConfig[obj.name] || interactiveConfig[obj.parent?.name]) {
          const configKey = interactiveConfig[obj.name] ? obj.name : obj.parent.name;
          const cfg  = interactiveConfig[configKey];
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(m => {
            if (m && m.emissive !== undefined) { m.emissive = cfg.emissiveColor; m.emissiveIntensity = 0.06; }
          });
          interactiveMeshes.push(obj);
          meshByName[configKey] = meshByName[configKey] || obj;
        }
      });

      // Asignar monitores usando getObjectByName (busca Object3D aunque no sea mesh)
      monitorMesh  = model.getObjectByName('MONITOR');
      monitor2Mesh = model.getObjectByName('MONITOR2');

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      orbitTarget.copy(center);
      savedOrbit.target = center.clone();

      setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        bar.style.width = '100%'; loadPct.textContent = '100%';
        showToast('🌸 ¡Bienvenid@! Click en los objetos de la habitación');
      }, 300);
    },
    (xhr) => {
      if (xhr.total > 0) { const p = Math.round(xhr.loaded/xhr.total*100); bar.style.width=p+'%'; loadPct.textContent=p+'%'; }
      else { const kb=Math.round(xhr.loaded/1024); loadPct.textContent=kb+' KB...'; bar.style.width=Math.min(90,xhr.loaded/20000)+'%'; }
    },
    (err) => { console.error(err); loadPct.textContent='Error cargando modelo'; }
  );

  // ─── EMISSIVE ──────────────────────────────────────────────────
  function setIntensity(mesh, v) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach(m => { if (m && m.emissive !== undefined) m.emissiveIntensity = v; });
  }

  // ─── RAYCASTER ─────────────────────────────────────────────────
  const raycaster    = new THREE.Raycaster();
  const mouse2d      = new THREE.Vector2();
  const tooltip      = document.getElementById('tooltip');
  let hoveredMesh    = null;
  let dialogueActive = false;

  function findInteractive(obj) {
    if (interactiveConfig[obj.name]) return obj;
    let cur = obj.parent;
    while (cur) { if (interactiveConfig[cur.name]) return cur; cur = cur.parent; }
    return null;
  }

  function getInteractiveHit(clientX, clientY) {
    mouse2d.x =  (clientX / window.innerWidth)  * 2 - 1;
    mouse2d.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse2d, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    for (const h of hits) {
      const found = findInteractive(h.object);
      if (found) return found;
    }
    return null;
  }

  window.addEventListener('mousemove', e => {
    if (dialogueActive || desktopOverlay.classList.contains('active') || d2Overlay.classList.contains('active')) return;
    const hit = getInteractiveHit(e.clientX, e.clientY);
    if (hit !== hoveredMesh) {
      if (hoveredMesh) setIntensity(hoveredMesh, 0.08);
      hoveredMesh = hit;
    }
    if (hit) {
      setIntensity(hit, 0.9);
      document.body.style.cursor = 'pointer';
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX + 16) + 'px';
      tooltip.style.top  = (e.clientY - 8)  + 'px';
      tooltip.textContent = interactiveConfig[hit.name].tooltip;
    } else {
      document.body.style.cursor = isDragging ? 'grabbing' : 'auto';
      tooltip.style.display = 'none';
    }
  });

  window.addEventListener('click', e => {
    if (dragDist > 5 || dialogueActive) return;
    if (desktopOverlay.classList.contains('active') || d2Overlay.classList.contains('active')) return;
    const hit = getInteractiveHit(e.clientX, e.clientY);
    if (hit) interactiveConfig[hit.name]?.action();
  });

  // ─── ORBIT ─────────────────────────────────────────────────────
  let isDragging = false, dragDist = 0;
  let prevMouse  = { x:0, y:0 };
  const orbitTarget = new THREE.Vector3();
  const spherical   = { theta:0, phi:Math.PI/5, r:8 };

  window.addEventListener('mousedown', () => { dragDist = 0; });
  renderer.domElement.addEventListener('mousedown', e => {
    if (dialogueActive || cameraMode==='monitor' || cameraMode==='monitor2' || desktopOverlay.classList.contains('active') || d2Overlay.classList.contains('active')) return;
    isDragging = true; prevMouse = {x:e.clientX, y:e.clientY};
    document.body.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => { isDragging = false; document.body.style.cursor = 'auto'; });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevMouse.x, dy = e.clientY - prevMouse.y;
    dragDist += Math.abs(dx) + Math.abs(dy);
    spherical.theta = Math.max(-0.3, Math.min(1.2, spherical.theta - dx * 0.006));
    spherical.phi   = Math.max(0.2,  Math.min(1.1, spherical.phi   - dy * 0.005));
    prevMouse = {x:e.clientX, y:e.clientY};
    savedOrbit.theta = spherical.theta; savedOrbit.phi = spherical.phi;
  });
  window.addEventListener('wheel', e => {
    if (cameraMode==='monitor' || cameraMode==='monitor2') return;
    spherical.r = Math.max(1, Math.min(30, spherical.r + e.deltaY * 0.014));
    savedOrbit.r = spherical.r;
  }, { passive:true });

  // ─── CAMERA ────────────────────────────────────────────────────
  let monitorMesh = null, monitor2Mesh = null, cameraAnimating = false, cameraMode = 'orbit';
  const savedOrbit = { theta:0, phi:Math.PI/5, r:8, target:null };

  function animateCamera(toPos, toLook, dur, onDone) {
    const startPos = camera.position.clone(), startLook = orbitTarget.clone(), start = performance.now();
    cameraAnimating = true;
    function tick(now) {
      let p = Math.min(1,(now-start)/dur);
      p = p<0.5 ? 2*p*p : -1+(4-2*p)*p;
      camera.position.lerpVectors(startPos, toPos, p);
      orbitTarget.lerpVectors(startLook, toLook, p);
      camera.lookAt(orbitTarget);
      if (p<1) requestAnimationFrame(tick);
      else { cameraAnimating=false; if(onDone) onDone(); }
    }
    requestAnimationFrame(tick);
  }

  function zoomToMonitor() {
    if (!monitorMesh || cameraAnimating) return;
    if (cameraMode==='monitor') { openDesktop(); return; }
    const box=new THREE.Box3().setFromObject(monitorMesh), center=box.getCenter(new THREE.Vector3()), size=box.getSize(new THREE.Vector3());
    const toPos = new THREE.Vector3(center.x, center.y, center.z + Math.max(size.x,size.y)*1.6);
    savedOrbit.theta=spherical.theta; savedOrbit.phi=spherical.phi; savedOrbit.r=spherical.r;
    cameraMode='monitor';
    animateCamera(toPos, center, 1100, () => setTimeout(openDesktop, 150));
  }

  function zoomToMonitor2() {
    if (!monitor2Mesh || cameraAnimating) return;
    if (cameraMode==='monitor2') { openD2(); return; }
    const box=new THREE.Box3().setFromObject(monitor2Mesh), center=box.getCenter(new THREE.Vector3()), size=box.getSize(new THREE.Vector3());
    const toPos = new THREE.Vector3(center.x, center.y, center.z + Math.max(size.x,size.y)*1.6);
    savedOrbit.theta=spherical.theta; savedOrbit.phi=spherical.phi; savedOrbit.r=spherical.r;
    cameraMode='monitor2';
    animateCamera(toPos, center, 1100, () => setTimeout(openD2, 150));
  }

  function resetCamera() {
    cameraMode = 'orbit';
    const {theta,phi,r} = savedOrbit;
    spherical.theta=theta; spherical.phi=phi; spherical.r=r;
    if (savedOrbit.target) orbitTarget.copy(savedOrbit.target);
    const toPos = new THREE.Vector3(
      orbitTarget.x + r*Math.sin(phi)*Math.sin(theta),
      Math.max(orbitTarget.y+0.3, orbitTarget.y+r*Math.cos(phi)),
      orbitTarget.z + r*Math.sin(phi)*Math.cos(theta)
    );
    animateCamera(toPos, orbitTarget.clone(), 900, null);
  }

  function updateCamera() {
    if (cameraAnimating || cameraMode==='monitor' || cameraMode==='monitor2') return;
    const {theta,phi,r} = spherical;
    camera.position.set(
      orbitTarget.x + r*Math.sin(phi)*Math.sin(theta),
      Math.max(orbitTarget.y+0.3, orbitTarget.y+r*Math.cos(phi)),
      orbitTarget.z + r*Math.sin(phi)*Math.cos(theta)
    );
    camera.lookAt(orbitTarget);
  }

  // ─── DAY/NIGHT ─────────────────────────────────────────────────
  let isNight=false, dayNightProgress=0, dayNightTarget=0;

  // ══════════════════════════════════════════════════════════════
  //  🎨 ILUMINACIÓN — EDITA AQUÍ A TU GUSTO
  //  Intensidades: 0.0=apagado | 1.0=normal | 2.0=muy brillante
  //  Colores hex: https://www.rapidtables.com/convert/color/hex-to-rgb.html
  // ══════════════════════════════════════════════════════════════
  const dayC = {
    bg:     new THREE.Color(0xf5e6d0),
    ambC:   new THREE.Color(0xfff8ec),  ambI:  0.9,
    sunC:   new THREE.Color(0xffe8b0),  sunI:  1.6,
    fillC:  new THREE.Color(0xffd9a0),  fillI: 0.6,
    plantC: new THREE.Color(0xd4eec8),  plantI:0.3,
    riverC: new THREE.Color(0xc8e0f0),  riverI:0.2
  };
  const nightC = {
    bg:     new THREE.Color(0x0a0714),
    ambC:   new THREE.Color(0x1e0d35),  ambI:  0.4,
    sunC:   new THREE.Color(0x030208),  sunI:  0.0,
    fillC:  new THREE.Color(0x7744cc),  fillI: 1.4,
    plantC: new THREE.Color(0x3d1a6e),  plantI:0.5,
    riverC: new THREE.Color(0x5533aa),  riverI:0.6
  };

  function lerpLights(p) {
    scene.background.lerpColors(dayC.bg, nightC.bg, p);
    scene.fog.color.copy(scene.background);
    ambient.color.lerpColors(dayC.ambC, nightC.ambC, p);
    ambient.intensity     = dayC.ambI   + (nightC.ambI   - dayC.ambI)   * p;
    sunLight.color.lerpColors(dayC.sunC, nightC.sunC, p);
    sunLight.intensity    = dayC.sunI   + (nightC.sunI   - dayC.sunI)   * p;
    fillLight.color.lerpColors(dayC.fillC, nightC.fillC, p);
    fillLight.intensity   = dayC.fillI  + (nightC.fillI  - dayC.fillI)  * p;
    plantBounce.color.lerpColors(dayC.plantC, nightC.plantC, p);
    plantBounce.intensity = dayC.plantI + (nightC.plantI - dayC.plantI) * p;
    riverGlow.color.lerpColors(dayC.riverC, nightC.riverC, p);
    riverGlow.intensity   = dayC.riverI + (nightC.riverI - dayC.riverI) * p;
  }

  // ─── ANIMATE ───────────────────────────────────────────────────
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;
    if (Math.abs(dayNightProgress - dayNightTarget) > 0.001) {
      dayNightProgress += (dayNightTarget - dayNightProgress) * 0.035;
      lerpLights(dayNightProgress);
    }
    Object.entries(meshByName).forEach(([name,mesh]) => {
      if (mesh === hoveredMesh) return;
      setIntensity(mesh, 0.06 + Math.sin(t*1.8 + name.charCodeAt(0)*0.4)*0.04);
    });
    if (dayNightProgress < 0.5) {
      const d = 1 - dayNightProgress * 2;
      sunLight.intensity  = (dayC.sunI   + Math.sin(t*0.4)*0.15) * d;
      fillLight.intensity = (dayC.fillI  + Math.sin(t*0.6)*0.1)  * d + nightC.fillI * dayNightProgress * 2;
      riverGlow.intensity = (dayC.riverI + Math.sin(t*1.2)*0.08) * d;
    }
    updateCamera();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  // ─── DAY/NIGHT TOGGLE ──────────────────────────────────────────
  const toggleBtn  = document.getElementById('day-night-toggle');
  const toggleTrack = document.getElementById('toggle-track');
  const toggleKnob = document.getElementById('toggle-knob');
  toggleBtn.addEventListener('click', () => {
    isNight = !isNight; dayNightTarget = isNight ? 1 : 0;
    toggleTrack.classList.toggle('night', isNight);
    toggleKnob.textContent = isNight ? '🌙' : '☀️';
  });

  // ─── ESC ───────────────────────────────────────────────────────
  window.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (dialogueActive)                              { catMode ? closeCatDialogue() : closeDialogue(); return; }
    if (desktopOverlay.classList.contains('active')) { closeDesktop(); return; }
    if (d2Overlay.classList.contains('active'))      { closeD2(); return; }
    if (windowPopup.classList.contains('active'))    { windowPopup.classList.remove('active'); return; }
  });

  // ══════════════════════════════════════════════════════════════
  //  OTOME DIALOGUE
  // ══════════════════════════════════════════════════════════════
  const otomeOverlay = document.getElementById('otome-overlay');
  const otomeBox     = document.getElementById('otome-box');
  const otomeClose   = document.getElementById('otome-close');
  const otomeText    = document.getElementById('otome-text');
  const otomeCursor  = document.getElementById('otome-cursor');
  const otomeNext    = document.getElementById('otome-next');
  const otomeChoices = document.getElementById('otome-choices');

  let currentNode=null, isTyping=false, typeInterval=null, fullText='', catMode=false;

  const dialogue = {
    intro_1: { text: '¡Hola! Soy Lau, artista 3D. ¡Me alegra que pases por aquí! 🌸', next: 'intro_2' },
    intro_2: { text: 'Esta habitación la modelé yo misma en Blender. Cada objeto tiene algo especial... ¡puedes hacer click en ellos!', next: 'intro_3' },
    intro_3: {
      text: '¿Qué quieres que te cuente sobre mí? 🌼',
      choices: [
        { label: '1.  ¿Qué experiencia laboral tienes?',        next: 'laboral_1'  },
        { label: '2.  Cuéntame sobre tus estudios',             next: 'estudios_1' },
        { label: '3.  ¿Cuáles son tus puntos fuertes?',         next: 'puntos_1'   },
        { label: '4.  ¿Qué te gusta hacer en tu tiempo libre?', next: 'tiempo_1'   }
      ]
    },
    laboral_1: { text: 'He trabajado en varios proyectos de arte 3D, desde modelado de personajes hasta entornos completos, ¡además me encanta el concept art!', next: 'laboral_2' },
    laboral_2: { text: 'También tengo experiencia en desarrollo web, ¡que es lo que ves ahora mismo! Me encanta combinar arte y código. 💻', next: 'laboral_3' },
    laboral_3: {
      text: 'Puedes ver todos mis trabajos en ArtStation o en mi portfolio. ¿Quieres saber algo más?',
      choices: [
        { label: '1.  ¿Qué experiencia laboral tienes?',        next: 'laboral_1'  },
        { label: '2.  Cuéntame sobre tus estudios',             next: 'estudios_1' },
        { label: '3.  ¿Cuáles son tus puntos fuertes?',         next: 'puntos_1'   },
        { label: '4.  ¿Qué te gusta hacer en tu tiempo libre?', next: 'tiempo_1'   },
        { label: '5.  ¡Ya me queda claro, gracias!',            next: 'bye'        }
      ]
    },
    estudios_1: { text: 'Primero hice un Grado medio de Asistencia al producto gráfico interactivo, donde empezó a apasionarme el arte y el diseño en general, ¡Adobe no dejó de acompañarme!', next: 'estudios_2' },
    estudios_2: { text: 'Además estudié un Grado superior de Animación 3D, Juegos y Entornos Interactivos, donde aprendí desde modelado 3D hasta programación para crear esta web. ¡El aprendizaje no para nunca! 🎮', next: 'estudios_3' },
    estudios_3: {
      text: '¿Hay algo más que quieras saber? ✨',
      choices: [
        { label: '1.  ¿Qué experiencia laboral tienes?',        next: 'laboral_1'  },
        { label: '2.  Cuéntame sobre tus estudios',             next: 'estudios_1' },
        { label: '3.  ¿Cuáles son tus puntos fuertes?',         next: 'puntos_1'   },
        { label: '4.  ¿Qué te gusta hacer en tu tiempo libre?', next: 'tiempo_1'   },
        { label: '5.  ¡Gracias por contarme!',                  next: 'bye'        }
      ]
    },
    puntos_1: { text: 'Soy muy detallista con el arte, me gusta que cada modelo cuente una historia por sí solo. 🎨', next: 'puntos_2' },
    puntos_2: { text: 'También soy muy resolutiva. Si algo no funciona, busco la forma de hacerlo funcionar... ¡como este portfolio! 😄', next: 'puntos_3' },
    puntos_3: {
      text: 'Y sobre todo me apasiona lo que hago, y eso se nota en el resultado. ¿Te queda alguna duda? 🌟',
      choices: [
        { label: '1.  ¿Qué experiencia laboral tienes?',        next: 'laboral_1'  },
        { label: '2.  Cuéntame sobre tus estudios',             next: 'estudios_1' },
        { label: '3.  ¿Cuáles son tus puntos fuertes?',         next: 'puntos_1'   },
        { label: '4.  ¿Qué te gusta hacer en tu tiempo libre?', next: 'tiempo_1'   },
        { label: '5.  ¡No, lo tengo todo claro!',               next: 'bye'        }
      ]
    },
    tiempo_1: { text: 'Me encanta todo lo artístico y manual, por ejemplo el crochet es uno de mis principales hobbies, o la cerámica también. 🎨', next: 'tiempo_2' },
    tiempo_2: { text: 'También me gusta la música y los animales, me encantan todas las especies, mi animal favorito es el hurón. :D', next: 'tiempo_3' },
    tiempo_3: {
      text: 'En general me apasiona el arte y la naturaleza. ¿Te queda alguna duda? 🌟',
      choices: [
        { label: '1.  ¿Qué experiencia laboral tienes?',        next: 'laboral_1'  },
        { label: '2.  Cuéntame sobre tus estudios',             next: 'estudios_1' },
        { label: '3.  ¿Cuáles son tus puntos fuertes?',         next: 'puntos_1'   },
        { label: '4.  ¿Qué te gusta hacer en tu tiempo libre?', next: 'tiempo_1'   },
        { label: '5.  ¡No, lo tengo todo claro!',               next: 'bye'        }
      ]
    },
    bye: { text: '¡Genial! Si tienes alguna pregunta no dudes en contactarme. ¡Ha sido un placer! 🌸👋', next: null }
  };

  function startDialogue() {
    catMode=false; dialogueActive=true;
    document.getElementById('otome-name').textContent = 'Lau ✿';
    document.getElementById('otome-portrait-wrap').innerHTML = '<img id="otome-portrait" src="img/yo.png" alt="Lau" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block"/>';
    otomeOverlay.classList.add('active'); otomeBox.classList.add('active');
    showNode('intro_1');
  }

  function showNode(nodeId) {
    const node = dialogue[nodeId]; if (!node) return;
    currentNode = nodeId;
    otomeChoices.classList.remove('active'); otomeChoices.innerHTML='';
    otomeNext.classList.remove('visible'); otomeCursor.style.display='inline-block';
    typeText(node.text, () => {
      if (node.choices) showChoices(node.choices);
      else if (node.next) otomeNext.classList.add('visible');
      else { otomeNext.textContent='Cerrar ✕'; otomeNext.classList.add('visible'); }
    });
  }

  function typeText(text, onDone) {
    fullText=text; otomeText.textContent=''; isTyping=true; let i=0;
    clearInterval(typeInterval);
    typeInterval = setInterval(() => {
      otomeText.textContent += text[i]; i++;
      if (i>=text.length) { clearInterval(typeInterval); isTyping=false; otomeCursor.style.display='none'; if(onDone) onDone(); }
    }, 26);
  }

  function skipTyping() {
    clearInterval(typeInterval); isTyping=false; otomeText.textContent=fullText; otomeCursor.style.display='none';
    const node=dialogue[currentNode];
    if(node.choices) showChoices(node.choices);
    else if(node.next) otomeNext.classList.add('visible');
    else { otomeNext.textContent='Cerrar ✕'; otomeNext.classList.add('visible'); }
  }

  function showChoices(choices) {
    otomeChoices.innerHTML = choices.map(c=>`<button class="otome-choice" data-next="${c.next}">${c.label}</button>`).join('');
    otomeChoices.classList.add('active');
    otomeChoices.querySelectorAll('.otome-choice').forEach(btn => {
      btn.addEventListener('click', () => { otomeChoices.classList.remove('active'); showNode(btn.dataset.next); });
    });
  }

  otomeBox.addEventListener('click', e => {
    if (e.target.closest('.otome-choice') || catMode) return;
    if (isTyping) { skipTyping(); return; }
    const node=dialogue[currentNode];
    if (!node||node.choices) return;
    if (node.next) { otomeNext.classList.remove('visible'); showNode(node.next); } else closeDialogue();
  });

  otomeClose.addEventListener('click', e => { e.stopPropagation(); catMode ? closeCatDialogue() : closeDialogue(); });

  function closeDialogue() {
    clearInterval(typeInterval); isTyping=false;
    otomeBox.classList.remove('active'); otomeOverlay.classList.remove('active');
    otomeNext.textContent='Continuar ▼'; dialogueActive=false;
  }

  // ─── GATO ──────────────────────────────────────────────────────
  function startCatDialogue() {
    catMode=true; dialogueActive=true;
    document.getElementById('otome-name').textContent='Gato 🐱';
    const wrap=document.getElementById('otome-portrait-wrap');
    wrap.innerHTML='<img src="img/gato.png" alt="Gato" style="width:100%;height:100%;object-fit:cover;display:block"/>';
    wrap.querySelector('img').onerror=()=>{ wrap.innerHTML='<div style="font-size:52px;display:flex;align-items:center;justify-content:center;height:100%">🐱</div>'; };
    otomeOverlay.classList.add('active'); otomeBox.classList.add('active');
    showCatLine();
  }

  function showCatLine() {
    otomeChoices.classList.remove('active'); otomeChoices.innerHTML='';
    otomeNext.classList.remove('visible'); otomeCursor.style.display='inline-block';
    typeText('Miau.', () => {
      otomeCursor.style.display='none';
      const btn=document.createElement('button'); btn.className='otome-choice'; btn.textContent='🐾 Miau';
      btn.addEventListener('click', showCatLine, {once:true});
      otomeChoices.innerHTML=''; otomeChoices.appendChild(btn); otomeChoices.classList.add('active');
    });
  }

  function closeCatDialogue() {
    clearInterval(typeInterval); isTyping=false; catMode=false; dialogueActive=false;
    otomeBox.classList.remove('active'); otomeOverlay.classList.remove('active');
    otomeChoices.classList.remove('active'); otomeChoices.innerHTML='';
    otomeNext.classList.remove('visible'); otomeNext.textContent='Continuar ▼';
    document.getElementById('otome-portrait-wrap').innerHTML='<img id="otome-portrait" src="img/yo.png" alt="Lau" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block"/>';
    document.getElementById('otome-name').textContent='Lau ✿';
  }

});
