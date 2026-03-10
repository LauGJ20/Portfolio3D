// Datos de proyectos
const projectsData = {
    pusheen: {
        title: "Pusheen Gamer",
        img: "src/Proyectos/PusheenGamer.jpg",
        text: "Una interpretación en 3D de Pusheen con un toque gamer, completamente modelada y renderizada en Blender. Este proyecto combina un diseño lindo y estilizado con detalles de videojuegos, presentando texturas y luces simples que resaltan el volumen y la personalidad del personaje."
    },
    cocina: {
        title: "Cocina",
        img: "src/Proyectos/Cocina.jpg",
        text: "Una cocina moderna en 3D, completamente modelada y renderizada en Blender. El proyecto se centra en materiales realistas, modelado detallado de muebles y electrodomésticos, y una iluminación que resalta texturas y reflejos."
    },
    // Continua con los demás proyectos
};

// Elementos del modal
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalImg = document.getElementById("modal-img");
const modalText = document.getElementById("modal-text");
const closeBtn = document.querySelector(".close-btn");

// Abrir modal
document.querySelectorAll(".project-link").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const modalKey = this.getAttribute("data-modal");
        const data = projectsData[modalKey];
        
        modalTitle.textContent = data.title;
        modalImg.src = data.img;
        modalImg.alt = data.title;
        modalText.textContent = data.text;
        
        modal.style.display = "flex";
    });
});

// Cerrar modal
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});