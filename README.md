# 🌸 Portfolio 3D Interactivo — Laura García Jancko

Portfolio personal desarrollado con **Three.js** y **Blender**, presentado como una habitación 3D interactiva.

---

## 🗂️ Estructura

```
/
├── index.html
├── main.js
├── style.css
├── models/
│   └── Habitacion3D.glb
├── img/
│   ├── yo.png
│   └── proyectos/
└── PortfolioWeb/
    └── index.html
```

---

## 🚀 Ejecutar en local

Requiere servidor local (no funciona con `file://`):

```bash
python3 -m http.server 8000
```
Abre [http://localhost:8000](http://localhost:8000)

---

## 🌐 GitHub Pages

1. Sube todos los archivos a la rama `main`
2. Ve a **Settings → Pages → Source → main**
3. La web se publicará en `https://<usuario>.github.io/<repositorio>/`

---

## 🎮 Controles

| Acción | Resultado |
|---|---|
| Arrastrar | Rotar cámara |
| Scroll | Zoom |
| Click en objetos | Interactuar |
| Botón ☀️/🌙 | Modo día / noche |
| ESC | Cerrar ventanas |

---

## 🛠️ Tecnologías

- [Three.js](https://threejs.org/) — Motor 3D WebGL
- [Blender](https://www.blender.org/) — Modelado y exportación GLB
- HTML5 / CSS3 / JavaScript vanilla

---

*Hecho con 🧡 por Laura García Jancko*
