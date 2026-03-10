# 🌸 Portfolio 3D Interactivo — Laura García Jancko

Portfolio personal desarrollado con **Three.js** y **Blender**, presentado como una habitación 3D interactiva con estética *dopamine/melocotón*.

---

## 🗂️ Estructura del repositorio

```
/
├── index.html              # Página principal
├── main.js                 # Lógica Three.js e interactividad
├── style.css               # Estilos y UI
├── README.md               # Este archivo
├── models/
│   └── Habitacion3D.glb    # Modelo 3D de la habitación (Blender)
├── img/
│   ├── yo.png              # Retrato para el diálogo otome
│   ├── gato.png            # Imagen del gato (opcional)
│   └── proyectos/
│       ├── Cocina.jpg
│       ├── PusheenGamer.jpg
│       ├── CasaEncantada_copia.jpg
│       ├── CasaGnomo.jpg
│       └── Habitacion.jpg
└── PortfolioWeb/
    └── index.html          # Web portfolio (cargada en MONITOR2 como iframe)
```

---

## 🚀 Despliegue local

Este proyecto usa Three.js con carga de archivos GLB, por lo que **no puede abrirse directamente como `file://`**. Es necesario servirlo con un servidor local.

### Opción 1 — Python (recomendado)
```bash
python3 -m http.server 8000
```
Abre en el navegador: [http://localhost:8000](http://localhost:8000)

### Opción 2 — Node.js
```bash
npx serve .
```

### Opción 3 — VS Code
Instala la extensión **Live Server** y haz clic en *Go Live*.

---

## 🌐 Despliegue en GitHub Pages

1. Sube todos los archivos al repositorio en la rama `main`.
2. Ve a **Settings → Pages**.
3. En *Source*, selecciona la rama `main` y carpeta `/root`.
4. GitHub Pages publicará la web en: `https://<usuario>.github.io/<repositorio>/`

> ⚠️ Asegúrate de que el archivo `Habitacion3D.glb` está subido — puede tardar por su tamaño.

---

## 🎮 Cómo navegar

| Acción | Resultado |
|---|---|
| **Arrastrar** con el ratón | Rotar la cámara |
| **Scroll** | Zoom |
| **Click en MONITOR** | Abre el portfolio (LAU OS) |
| **Click en MONITOR2** | Abre la web portfolio en iframe |
| **Click en MIPERSONAJE** | Diálogo otome con información sobre mí |
| **Click en GATO** | 🐱 Miau |
| **Click en ARTSTATION** | Abre ArtStation |
| **Click en LINKEDIN** | Abre LinkedIn |
| **Click en GMAIL** | Abre cliente de correo |
| **Botón ☀️/🌙** | Alterna entre modo día y noche |
| **ESC** | Cierra cualquier ventana abierta |

---

## 🛠️ Tecnologías

- [Three.js r158](https://threejs.org/) — Motor 3D WebGL
- [Blender](https://www.blender.org/) — Modelado y exportación GLB
- HTML5 / CSS3 / JavaScript vanilla
- Fuentes: Baloo 2, Nunito, Press Start 2P (Google Fonts)

---

## ✏️ Comentarios técnicos

- El modelo se exporta desde Blender en formato **GLB** (binario embebido), lo que incluye geometría, materiales y texturas en un solo archivo.
- La iluminación es completamente dinámica: luz ambiental, direccional (sol) y tres point lights con transición suave día/noche mediante lerp.
- El sistema de clicks usa un **Raycaster** de Three.js que recorre el árbol de objetos de la escena y sube por los nodos padre para identificar objetos interactivos.
- El diálogo otome tiene un sistema de nodos con ramificación y typewriter effect.

---

*Hecho con 🧡 por Laura García Jancko*
