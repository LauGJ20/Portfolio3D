(function () {

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
  scene.background = new THREE.Color(0xfce8d5); // warm peach sky
  scene.fog = new THREE.FogExp2(0xfce8d5, 0.018);

  const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.01, 200);
  camera.position.set(0, 3, 8);

  // ─── WARM DAY LIGHTING ─────────────────────────────────────────
  // Soft ambient — bright warm day
  const ambient = new THREE.AmbientLight(0xfff4e0, 1.2);
  scene.add(ambient);

  // Main sun light — warm golden from upper left (like a window)
  const sunLight = new THREE.DirectionalLight(0xffdd99, 2.2);
  sunLight.position.set(-5, 12, 8);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -15;
  sunLight.shadow.camera.right = 15;
  sunLight.shadow.camera.top = 15;
  sunLight.shadow.camera.bottom = -15;
  sunLight.shadow.bias = -0.001;
  scene.add(sunLight);

  // Secondary warm fill from right — bounced light off plants/river
  const fillLight = new THREE.PointLight(0xffcc88, 1.0, 20);
  fillLight.position.set(6, 4, 3);
  scene.add(fillLight);

  // Soft green bounce from plants at edges
  const plantBounce = new THREE.PointLight(0xc8f0c0, 0.5, 12);
  plantBounce.position.set(-6, 2, -2);
  scene.add(plantBounce);

  // Water/river shimmer — soft cool-warm from below front
  const riverGlow = new THREE.PointLight(0xaaddff, 0.3, 10);
  riverGlow.position.set(0, 0.5, 6);
  scene.add(riverGlow);

  // Monitor glow (set after GLB load)
  const monitorLight = new THREE.PointLight(0xffaa66, 0, 5);
  scene.add(monitorLight);

  // ─── INTERACTIVE CONFIG ────────────────────────────────────────
  const interactiveConfig = {
    'MONITOR': {
      tooltip: '🖥️ Ver portfolio',
      emissiveColor: new THREE.Color(0xff9944),
      action: () => zoomToMonitor()
    },
    'MONITOR2': {
      tooltip: '🌐 Mi web',
      emissiveColor: new THREE.Color(0xff9944),
      action: () => window.open('https://github.com/LauGJ20/PORTFOLIO', '_blank')
    },
    'ARTSTATION': {
      tooltip: '🎨 ArtStation',
      emissiveColor: new THREE.Color(0xff6600),
      action: () => openFolderWindow('artstation')
    },
    'LINKEDIN': {
      tooltip: '💼 LinkedIn',
      emissiveColor: new THREE.Color(0x6688ff),
      action: () => openFolderWindow('linkedin')
    },
    'GMAIL': {
      tooltip: '💌 Contacto',
      emissiveColor: new THREE.Color(0xff4444),
      action: () => window.open('mailto:youremail@gmail.com', '_blank')
    },
    'MIPERSONAJE': {
      tooltip: '💬 Hablar con Lau',
      emissiveColor: new THREE.Color(0xffaacc),
      action: () => startDialogue()
    },
    'GATO': {
      tooltip: '🐱 Miau',
      emissiveColor: new THREE.Color(0xffddaa),
      action: () => startCatDialogue()
    }
  };

  // ─── DESKTOP INTERFACE ─────────────────────────────────────────
  const desktopOverlay  = document.getElementById('desktop-overlay');
  const desktopBackdrop = document.getElementById('desktop-backdrop');
  const taskbarClose    = document.getElementById('taskbar-close');
  const taskbarClock    = document.getElementById('taskbar-clock');

  // Clock
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    taskbarClock.textContent = `${h}:${m}`;
  }
  updateClock();
  setInterval(updateClock, 10000);

  // Tabs
  document.querySelectorAll('.taskbar-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.taskbar-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
      item.classList.add('active');
      const tab = document.getElementById('tab-' + item.dataset.tab);
      if (tab) tab.style.display = '';
    });
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

  // ─── FOLDER WINDOWS ────────────────────────────────────────────
  const windowPopup = document.getElementById('window-popup');
  const winTitle    = document.getElementById('win-title');
  const winBody     = document.getElementById('win-body');
  const winClose    = document.getElementById('win-close');

  const folderData = {
    artstation: {
      title: '🎨 ARTSTATION',
      html: `<p>Aquí puedes ver todos mis trabajos de arte 3D, personajes y entornos.</p>
             <div class="win-links">
               <a href="https://www.artstation.com/yourprofile" target="_blank" class="win-link">
                 <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px"><path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.085 1.202h13.971l-2.158-3.707H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.098-1.196H11.39l9.428 16.318 2.167 3.746c.634-.482 1.015-1.234 1.015-2.648zm-11.629 1.682l-5.517-9.564-5.517 9.564h11.034z"/></svg>
                 Ver mi ArtStation →
               </a>
             </div>`
    },
    linkedin: {
      title: '💼 LINKEDIN',
      html: `<p>Conéctate conmigo y echa un vistazo a mi experiencia profesional.</p>
             <div class="win-links">
               <a href="https://www.linkedin.com/in/yourprofile" target="_blank" class="win-link">
                 <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                 Ver mi LinkedIn →
               </a>
             </div>`
    },
    github: {
      title: '🌿 GITHUB',
      html: `<p>Todos mis proyectos de código, incluyendo este portfolio.</p>
             <div class="win-links">
               <a href="https://github.com/LauGJ20" target="_blank" class="win-link">
                 <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                 Ver mi GitHub →
               </a>
             </div>`
    },
    web: {
      title: '✨ MI WEB',
      html: `<p>Mi portfolio completo con todos mis proyectos y trabajos.</p>
             <div class="win-links">
               <a href="https://github.com/LauGJ20/PORTFOLIO" target="_blank" class="win-link">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                 Ir a mi web →
               </a>
             </div>`
    }
  };

  function openFolderWindow(key) {
    const d = folderData[key];
    winTitle.textContent = d.title;
    winBody.innerHTML    = d.html;
    windowPopup.classList.add('active');
  }
  winClose.addEventListener('click', () => windowPopup.classList.remove('active'));
  windowPopup.addEventListener('click', e => { if(e.target===windowPopup) windowPopup.classList.remove('active'); });

  // Folder icons in desktop
  document.querySelectorAll('.folder').forEach(f => {
    f.addEventListener('click', () => openFolderWindow(f.dataset.win));
  });

  // ─── TOAST ─────────────────────────────────────────────────────
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ══════════════════════════════════════════════════════════════
  //  OTOME DIALOGUE
  // ══════════════════════════════════════════════════════════════
  const otomeOverlay = document.getElementById('otome-overlay');
  const otomeBox     = document.getElementById('otome-box');
  const otomeText    = document.getElementById('otome-text');
  const otomeCursor  = document.getElementById('otome-cursor');
  const otomeNext    = document.getElementById('otome-next');
  const otomeChoices = document.getElementById('otome-choices');
  const otomeClose   = document.getElementById('otome-close');

  const dialogue = {
    intro_1: {
      text: '¡Hola! Soy Lau, artista 3D y desarrolladora. ¡Me alegra que hayas pasado por aquí! 🌸',
      next: 'intro_2'
    },
    intro_2: {
      text: 'Esta habitación la modelé yo misma en Blender. Cada objeto tiene algo especial... ¡puedes hacer click en ellos!',
      next: 'intro_3'
    },
    intro_3: {
      text: '¿De qué quieres que te hable? 🌼',
      choices: [
        { label: '1.  Vida laboral',  next: 'laboral_1'  },
        { label: '2.  Estudios',       next: 'estudios_1' },
        { label: '3.  Puntos fuertes', next: 'puntos_1'   }
      ]
    },
    laboral_1: {
      text: 'He trabajado en varios proyectos de arte 3D, desde modelado de personajes hasta entornos completos para videojuegos.',
      next: 'laboral_2'
    },
    laboral_2: {
      text: 'También tengo experiencia en desarrollo web, ¡que es lo que ves ahora mismo! Me encanta combinar arte y código. 💻',
      next: 'laboral_3'
    },
    laboral_3: {
      text: 'Puedes ver todos mis trabajos en ArtStation o en mi portfolio. ¿Quieres saber algo más?',
      choices: [
        { label: '1.  Cuéntame sobre tus estudios',     next: 'estudios_1' },
        { label: '2.  ¿Cuáles son tus puntos fuertes?', next: 'puntos_1'   },
        { label: '3.  ¡Ya me queda claro, gracias!',     next: 'bye'        }
      ]
    },
    estudios_1: {
      text: 'Estudié Diseño y Desarrollo de Videojuegos, donde aprendí desde modelado 3D hasta programación de mecánicas. 🎮',
      next: 'estudios_2'
    },
    estudios_2: {
      text: 'Además me he formado de manera autodidacta en Blender, Three.js y desarrollo frontend. ¡El aprendizaje no para nunca!',
      next: 'estudios_3'
    },
    estudios_3: {
      text: '¿Hay algo más que quieras saber? ✨',
      choices: [
        { label: '1.  Cuéntame tu experiencia laboral', next: 'laboral_1' },
        { label: '2.  ¿Cuáles son tus puntos fuertes?', next: 'puntos_1'  },
        { label: '3.  ¡Gracias por contarme!',           next: 'bye'       }
      ]
    },
    puntos_1: {
      text: 'Soy muy detallista con el arte, me gusta que cada modelo cuente una historia por sí solo. 🎨',
      next: 'puntos_2'
    },
    puntos_2: {
      text: 'También soy muy resolutiva. Si algo no funciona, busco la forma de hacerlo funcionar... ¡como este portfolio! 😄',
      next: 'puntos_3'
    },
    puntos_3: {
      text: 'Y sobre todo me apasiona lo que hago, y eso se nota en el resultado. ¿Te queda alguna duda? 🌟',
      choices: [
        { label: '1.  Cuéntame tu experiencia laboral', next: 'laboral_1'  },
        { label: '2.  Cuéntame sobre tus estudios',     next: 'estudios_1' },
        { label: '3.  ¡No, lo tienes todo claro!',       next: 'bye'        }
      ]
    },
    bye: {
      text: '¡Genial! Si tienes alguna pregunta no dudes en contactarme. ¡Espero verte pronto! 🌸👋',
      next: null
    }
  };

  let currentNode  = null;
  let typeInterval = null;
  let isTyping     = false;
  let fullText     = '';

  function startDialogue() {
    dialogueActive = true;
    otomeOverlay.classList.add('active');
    otomeBox.classList.add('active');
    showNode('intro_1');
  }

  function showNode(nodeId) {
    const node = dialogue[nodeId];
    if (!node) return;
    currentNode = nodeId;
    otomeChoices.classList.remove('active');
    otomeChoices.innerHTML = '';
    otomeNext.classList.remove('visible');
    otomeCursor.style.display = 'inline-block';
    typeText(node.text, () => {
      if (node.choices) showChoices(node.choices);
      else if (node.next) otomeNext.classList.add('visible');
      else { otomeNext.textContent = 'Cerrar ✕'; otomeNext.classList.add('visible'); }
    });
  }

  function typeText(text, onDone) {
    fullText = text; otomeText.textContent = ''; isTyping = true; let i = 0;
    clearInterval(typeInterval);
    typeInterval = setInterval(() => {
      otomeText.textContent += text[i]; i++;
      if (i >= text.length) {
        clearInterval(typeInterval); isTyping = false;
        otomeCursor.style.display = 'none';
        if (onDone) onDone();
      }
    }, 26);
  }

  function skipTyping() {
    clearInterval(typeInterval); isTyping = false;
    otomeText.textContent = fullText; otomeCursor.style.display = 'none';
    const node = dialogue[currentNode];
    if (node.choices) showChoices(node.choices);
    else if (node.next) otomeNext.classList.add('visible');
    else { otomeNext.textContent = 'Cerrar ✕'; otomeNext.classList.add('visible'); }
  }

  function showChoices(choices) {
    otomeChoices.innerHTML = choices.map(c =>
      `<button class="otome-choice" data-next="${c.next}">${c.label}</button>`
    ).join('');
    otomeChoices.classList.add('active');
    otomeChoices.querySelectorAll('.otome-choice').forEach(btn => {
      btn.addEventListener('click', () => { otomeChoices.classList.remove('active'); showNode(btn.dataset.next); });
    });
  }

  otomeBox.addEventListener('click', e => {
    if (e.target.closest('.otome-choice')) return;
    if (catMode) return; // gato solo responde con el botón
    if (isTyping) { skipTyping(); return; }
    const node = dialogue[currentNode];
    if (!node || node.choices) return;
    if (node.next) { otomeNext.classList.remove('visible'); showNode(node.next); }
    else closeDialogue();
  });
  otomeClose.addEventListener('click', e => {
    e.stopPropagation();
    catMode ? closeCatDialogue() : closeDialogue();
  });

  function closeDialogue() {
    clearInterval(typeInterval); isTyping = false;
    otomeBox.classList.remove('active');
    otomeOverlay.classList.remove('active');
    otomeNext.textContent = 'Continuar ▼';
    dialogueActive = false;
  }

  // ── Gato 🐱 ────────────────────────────────────────────────────
  let catMode = false;

  function startCatDialogue() {
    catMode = true;
    dialogueActive = true;
    document.getElementById('otome-name').textContent = 'Gato 🐱';
    // Restore wrap in case it was replaced by emoji div
    const wrap = document.getElementById('otome-portrait-wrap');
    wrap.innerHTML = '<img id="otome-portrait" src="img/gato.png" alt="Gato" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block"/>';
    document.getElementById('otome-portrait').onerror = function() {
      wrap.innerHTML = '<div style="font-size:52px;display:flex;align-items:center;justify-content:center;height:100%">🐱</div>';
    };
    otomeOverlay.classList.add('active');
    otomeBox.classList.add('active');
    showCatLine();
  }

  function showCatLine() {
    otomeChoices.classList.remove('active');
    otomeChoices.innerHTML = '';
    otomeNext.classList.remove('visible');
    otomeCursor.style.display = 'inline-block';
    typeText('Miau.', () => {
      otomeCursor.style.display = 'none';
      // Crear botón nuevo cada vez sin acumular listeners
      const btn = document.createElement('button');
      btn.className = 'otome-choice';
      btn.textContent = '🐾  Miau';
      btn.addEventListener('click', showCatLine, { once: true });
      otomeChoices.innerHTML = '';
      otomeChoices.appendChild(btn);
      otomeChoices.classList.add('active');
    });
  }

  function closeCatDialogue() {
    clearInterval(typeInterval);
    isTyping  = false;
    catMode   = false;
    dialogueActive = false;
    otomeBox.classList.remove('active');
    otomeOverlay.classList.remove('active');
    otomeChoices.classList.remove('active');
    otomeChoices.innerHTML = '';
    otomeNext.classList.remove('visible');
    otomeNext.textContent = 'Continuar ▼';
    // Restaurar retrato y nombre de Lau — recrear el img por si fue reemplazado
    const wrap = document.getElementById('otome-portrait-wrap');
    wrap.innerHTML = '<img id="otome-portrait" src="img/yo.png" alt="Lau" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block"/>';
    document.getElementById('otome-name').textContent = 'Lau ✿';
  }

  // ══════════════════════════════════════════════════════════════
  //  CAMERA ZOOM TO MONITOR → auto-open desktop
  // ══════════════════════════════════════════════════════════════
  let monitorMesh     = null;
  let cameraAnimating = false;
  let cameraMode      = 'orbit';
  const savedOrbit    = { theta: 0, phi: Math.PI / 5, r: 8 };

  function zoomToMonitor() {
    if (!monitorMesh || cameraAnimating) return;
    if (cameraMode === 'monitor') { openDesktop(); return; }

    const box    = new THREE.Box3().setFromObject(monitorMesh);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const dist   = Math.max(size.x, size.y) * 1.6;

    const targetPos  = new THREE.Vector3(center.x, center.y, center.z + dist);
    const targetLook = center.clone();

    animateCamera(targetPos, targetLook, 1100, () => {
      cameraMode = 'monitor';
      // Auto-open desktop after camera arrives
      setTimeout(() => openDesktop(), 150);
    });
  }

  function resetCamera() {
    if (cameraAnimating || cameraMode === 'orbit') return;
    const { theta, phi, r } = savedOrbit;
    const targetPos = new THREE.Vector3(
      orbitTarget.x + r * Math.sin(phi) * Math.sin(theta),
      orbitTarget.y + r * Math.cos(phi),
      orbitTarget.z + r * Math.sin(phi) * Math.cos(theta)
    );
    animateCamera(targetPos, orbitTarget.clone(), 900, () => { cameraMode = 'orbit'; });
  }

  function animateCamera(toPos, toLook, duration, onDone) {
    cameraAnimating = true;
    const fromPos  = camera.position.clone();
    const fromLook = new THREE.Vector3();
    camera.getWorldDirection(fromLook);
    fromLook.multiplyScalar(10).add(camera.position);
    const start = performance.now();
    function step(now) {
      const raw  = Math.min((now - start) / duration, 1);
      const ease = raw < 0.5 ? 2*raw*raw : -1+(4-2*raw)*raw;
      camera.position.lerpVectors(fromPos, toPos, ease);
      camera.lookAt(new THREE.Vector3().lerpVectors(fromLook, toLook, ease));
      if (raw < 1) requestAnimationFrame(step);
      else { camera.position.copy(toPos); camera.lookAt(toLook); cameraAnimating = false; if(onDone) onDone(); }
    }
    requestAnimationFrame(step);
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (dialogueActive) { catMode ? closeCatDialogue() : closeDialogue(); return; }
      if (desktopOverlay.classList.contains('active')) { closeDesktop(); return; }
      if (cameraMode === 'monitor') resetCamera();
    }
  });

  // ─── GLB LOAD ──────────────────────────────────────────────────
  const bar     = document.getElementById('bar');
  const loadPct = document.getElementById('load-pct');
  const interactiveMeshes = [];
  const meshByName = {};

  // Safety net — hide loading after 15s no matter what
  setTimeout(() => {
    const loadingEl = document.getElementById('loading');
    if (!loadingEl.classList.contains('hidden')) {
      loadingEl.classList.add('hidden');
      showToast('⚠️ Comprueba que Habitacion3D.glb está en la misma carpeta');
    }
  }, 15000);

  const loader = new THREE.GLTFLoader();
  loader.load(
    'Habitacion3D.glb',
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      model.traverse(obj => {
        if (!obj.isMesh) return;
        obj.castShadow    = true;
        obj.receiveShadow = true;

        const cfg = interactiveConfig[obj.name];
        if (!cfg) return;

        if (Array.isArray(obj.material)) {
          obj.material = obj.material.map(m => {
            const c = m.clone();
            c.emissive = cfg.emissiveColor.clone(); c.emissiveIntensity = 0.08; return c;
          });
        } else {
          obj.material = obj.material.clone();
          obj.material.emissive = cfg.emissiveColor.clone();
          obj.material.emissiveIntensity = 0.08;
        }
        interactiveMeshes.push(obj);
        meshByName[obj.name] = obj;
        if (obj.name === 'MONITOR') monitorMesh = obj;
      });

      // Auto-fit camera
      const box    = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const dist   = (Math.max(size.x, size.y, size.z) / (2 * Math.tan((camera.fov * Math.PI / 180) / 2))) * 1.35;

      orbitTarget.copy(center);
      spherical.r = dist; spherical.phi = Math.PI / 5;
      savedOrbit.r = dist;

      if (monitorMesh) {
        const mb = new THREE.Box3().setFromObject(monitorMesh);
        const mc = mb.getCenter(new THREE.Vector3());
        monitorLight.position.set(mc.x, mc.y, mc.z + size.z * 0.08);
        monitorLight.distance  = size.z * 1.2;
        monitorLight.intensity = 0.6;
      }

      setTimeout(() => {
        const loadingEl = document.getElementById('loading');
        loadingEl.classList.add('hidden');
        bar.style.width = '100%';
        loadPct.textContent = '100%';
        showToast('🌸 ¡Bienvenid@! Click en los objetos de la habitación');
      }, 300);
    },
    (xhr) => {
      if (xhr.total && xhr.total > 0) {
        const pct = Math.round(xhr.loaded / xhr.total * 100);
        bar.style.width = pct + '%';
        loadPct.textContent = pct + '%';
      } else {
        // Server doesn't send Content-Length — animate bar instead
        const kb = Math.round(xhr.loaded / 1024);
        loadPct.textContent = kb + ' KB...';
        bar.style.width = Math.min(90, (xhr.loaded / 20000)) + '%';
      }
    },
    (err) => { console.error(err); loadPct.textContent = 'Error cargando modelo'; }
  );

  // ─── EMISSIVE ──────────────────────────────────────────────────
  function setIntensity(mesh, v) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach(m => { if (m.emissive !== undefined) m.emissiveIntensity = v; });
  }

  // ─── RAYCASTER ─────────────────────────────────────────────────
  const raycaster    = new THREE.Raycaster();
  const mouse2d      = new THREE.Vector2();
  const tooltip      = document.getElementById('tooltip');
  let hoveredMesh    = null;
  let dialogueActive = false;

  function findInteractive(obj) {
    // Primero busca coincidencia exacta en el propio objeto
    if (interactiveConfig[obj.name]) return obj;
    // Luego sube por padres
    let cur = obj.parent;
    while (cur) {
      if (interactiveConfig[cur.name]) return cur;
      cur = cur.parent;
    }
    return null;
  }

  window.addEventListener('mousemove', e => {
    if (dialogueActive || desktopOverlay.classList.contains('active')) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse2d.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse2d.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse2d, camera);
    const hits = raycaster.intersectObjects(interactiveMeshes, true);
    if (hits.length) {
      const hit = findInteractive(hits[0].object);
      if (hit !== hoveredMesh) { if (hoveredMesh) setIntensity(hoveredMesh, 0.08); hoveredMesh = hit; }
      if (hit) {
        setIntensity(hit, 0.9);
        document.body.style.cursor = 'pointer';
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 16) + 'px';
        tooltip.style.top  = (e.clientY - 8) + 'px';
        tooltip.textContent = interactiveConfig[hit.name].tooltip;
      }
    } else {
      if (hoveredMesh) { setIntensity(hoveredMesh, 0.08); hoveredMesh = null; }
      document.body.style.cursor = isDragging ? 'grabbing' : 'auto';
      tooltip.style.display = 'none';
    }
  });

  window.addEventListener('click', () => {
    if (dragDist > 5 || dialogueActive) return;
    if (desktopOverlay.classList.contains('active')) return;
    if (hoveredMesh) interactiveConfig[hoveredMesh.name]?.action();
  });

  // ─── ORBIT ─────────────────────────────────────────────────────
  let isDragging  = false;
  let dragDist    = 0;
  let prevMouse   = { x:0, y:0 };
  const orbitTarget = new THREE.Vector3();
  const spherical   = { theta:0, phi:Math.PI/5, r:8 };

  renderer.domElement.addEventListener('mousedown', e => {
    if (dialogueActive || cameraMode === 'monitor' || desktopOverlay.classList.contains('active')) return;
    isDragging = true; dragDist = 0;
    prevMouse = { x:e.clientX, y:e.clientY };
    document.body.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => { isDragging = false; document.body.style.cursor = 'auto'; });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - prevMouse.x, dy = e.clientY - prevMouse.y;
    dragDist += Math.abs(dx) + Math.abs(dy);
    spherical.theta -= dx * 0.006;
    spherical.theta  = Math.max(-0.7, Math.min(0.7, spherical.theta));
    spherical.phi    = Math.max(0.2,  Math.min(1.1, spherical.phi - dy * 0.005));
    prevMouse = { x:e.clientX, y:e.clientY };
    savedOrbit.theta = spherical.theta; savedOrbit.phi = spherical.phi;
  });
  window.addEventListener('wheel', e => {
    if (cameraMode === 'monitor') return;
    spherical.r = Math.max(1, Math.min(30, spherical.r + e.deltaY * 0.014));
    savedOrbit.r = spherical.r;
  }, { passive:true });

  let lastTouch = null;
  renderer.domElement.addEventListener('touchstart', e => { lastTouch = e.touches[0]; dragDist = 0; }, { passive:true });
  renderer.domElement.addEventListener('touchmove', e => {
    if (!lastTouch || cameraMode === 'monitor') return;
    const t = e.touches[0];
    const dx = t.clientX - lastTouch.clientX, dy = t.clientY - lastTouch.clientY;
    dragDist += Math.abs(dx) + Math.abs(dy);
    spherical.theta -= dx * 0.006;
    spherical.theta  = Math.max(-0.7, Math.min(0.7, spherical.theta));
    spherical.phi    = Math.max(0.2,  Math.min(1.1, spherical.phi - dy * 0.005));
    lastTouch = t;
  }, { passive:true });

  function updateCamera() {
    if (cameraAnimating || cameraMode === 'monitor') return;
    const { theta, phi, r } = spherical;
    camera.position.set(
      orbitTarget.x + r*Math.sin(phi)*Math.sin(theta),
      Math.max(orbitTarget.y+0.3, orbitTarget.y+r*Math.cos(phi)),
      orbitTarget.z + r*Math.sin(phi)*Math.cos(theta)
    );
    camera.lookAt(orbitTarget);
  }

  // ══════════════════════════════════════════════════════════════
  //  DAY / NIGHT — declared BEFORE animate() so it can use them
  // ══════════════════════════════════════════════════════════════
  let isNight          = false;
  let dayNightProgress = 0;
  let dayNightTarget   = 0;

  const dayConfig = {
    bgColor:      new THREE.Color(0xfce8d5),
    ambientColor: new THREE.Color(0xfff4e0), ambientInt: 1.2,
    sunColor:     new THREE.Color(0xffdd99), sunInt:     2.2,
    fillColor:    new THREE.Color(0xffcc88), fillInt:    1.0,
    plantColor:   new THREE.Color(0xc8f0c0), plantInt:  0.5,
    riverColor:   new THREE.Color(0xaaddff), riverInt:  0.3,
  };
  const nightConfig = {
    bgColor:      new THREE.Color(0x0d0a18),
    ambientColor: new THREE.Color(0x1a1240), ambientInt: 0.35,
    sunColor:     new THREE.Color(0x050310), sunInt:     0.0,
    fillColor:    new THREE.Color(0xffaa55), fillInt:    1.6,
    plantColor:   new THREE.Color(0x220e40), plantInt:  0.25,
    riverColor:   new THREE.Color(0x4499ff), riverInt:  0.7,
  };

  function lerpLights(p) {
    const d = dayConfig, n = nightConfig;
    scene.background.lerpColors(d.bgColor, n.bgColor, p);
    scene.fog.color.copy(scene.background);
    ambient.color.lerpColors(d.ambientColor, n.ambientColor, p);
    ambient.intensity     = d.ambientInt + (n.ambientInt - d.ambientInt) * p;
    sunLight.color.lerpColors(d.sunColor, n.sunColor, p);
    sunLight.intensity    = d.sunInt    + (n.sunInt    - d.sunInt)    * p;
    fillLight.color.lerpColors(d.fillColor, n.fillColor, p);
    fillLight.intensity   = d.fillInt   + (n.fillInt   - d.fillInt)   * p;
    plantBounce.color.lerpColors(d.plantColor, n.plantColor, p);
    plantBounce.intensity = d.plantInt  + (n.plantInt  - d.plantInt)  * p;
    riverGlow.color.lerpColors(d.riverColor, n.riverColor, p);
    riverGlow.intensity   = d.riverInt  + (n.riverInt  - d.riverInt)  * p;
  }

  // ─── ANIMATE ───────────────────────────────────────────────────
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    // Day/night smooth transition
    if (Math.abs(dayNightProgress - dayNightTarget) > 0.001) {
      dayNightProgress += (dayNightTarget - dayNightProgress) * 0.035;
      lerpLights(dayNightProgress);
    }

    // Gentle pulse on interactive objects
    Object.entries(meshByName).forEach(([name, mesh]) => {
      if (mesh === hoveredMesh) return;
      setIntensity(mesh, 0.06 + Math.sin(t * 1.8 + name.charCodeAt(0) * 0.4) * 0.04);
    });

    // Light breathing — only when in day mode
    if (dayNightProgress < 0.5) {
      sunLight.intensity  = (dayConfig.sunInt  + Math.sin(t * 0.4) * 0.15)  * (1 - dayNightProgress * 2);
      fillLight.intensity = (dayConfig.fillInt + Math.sin(t * 0.6) * 0.1)   * (1 - dayNightProgress * 2) + nightConfig.fillInt * dayNightProgress * 2;
      riverGlow.intensity = (dayConfig.riverInt + Math.sin(t * 1.2) * 0.08) * (1 - dayNightProgress * 2);
    }

    updateCamera();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  // ── Toggle button events ────────────────────────────────────────
  const toggleBtn   = document.getElementById('day-night-toggle');
  const toggleTrack = document.getElementById('toggle-track');
  const toggleKnob  = document.getElementById('toggle-knob');
  const toggleLabel = document.getElementById('toggle-label');

  toggleBtn.addEventListener('click', () => {
    isNight = !isNight;
    dayNightTarget = isNight ? 1 : 0;
    if (isNight) {
      toggleTrack.classList.add('night');
      toggleBtn.classList.add('is-night');
      toggleKnob.textContent  = '🌙';
      toggleLabel.textContent = 'Noche';
    } else {
      toggleTrack.classList.remove('night');
      toggleBtn.classList.remove('is-night');
      toggleKnob.textContent  = '☀️';
      toggleLabel.textContent = 'Día';
    }
  });

})();
