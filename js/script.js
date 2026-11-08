

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Abrir y cerrar el menú
menuToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.textContent = isOpen ? "✕" : "☰";

});

// Cerrar menú al seleccionar una sección
const links = document.querySelectorAll(".nav-links a");

links.forEach((link) => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.textContent = "☰";

    });

});

// Actualizar año automáticamente
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();
