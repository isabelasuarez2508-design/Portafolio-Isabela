document.documentElement.classList.add("js");
document.body && document.body.classList.add("is-loading");

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;

    /* Año del footer*/
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    /* Menú móvil */
    const toggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (toggle && navLinks) {
        const setMenu = (open) => {
            navLinks.classList.toggle("active", open);
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
        };

        toggle.addEventListener("click", () => {
            setMenu(!navLinks.classList.contains("active"));
        });

        navLinks.querySelectorAll("a").forEach((link) =>
            link.addEventListener("click", () => setMenu(false))
        );

        document.addEventListener("click", (e) => {
            if (!navLinks.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
        });
    }

    /*Header con fondo al hacer scroll*/
    const header = document.querySelector(".header");

    const onScroll = () => {
        const scrollTop = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (header) header.classList.toggle("scrolled", scrollTop > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Enlace activo según la sección visible*/
    const links = [...document.querySelectorAll(".nav-links a")];
    const sections = links
        .map((a) => document.querySelector(a.getAttribute("href")))
        .filter(Boolean);

    if ("IntersectionObserver" in window) {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        links.forEach((a) =>
                            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
                        );
                    }
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );
        sections.forEach((s) => spy.observe(s));
    }

    /* Animaciones de aparición al hacer scroll */
    const addReveal = (selector, { stagger = 0, side = "" } = {}) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add("reveal");
            if (side) el.classList.add("reveal-" + side);
            if (stagger) el.style.setProperty("--delay", i * stagger + "s");
        });
    };

    addReveal(".section-label");
    addReveal(".section-title");
    addReveal(".section-description");
    addReveal(".about-initials", { side: "left" });
    addReveal(".about-text p, .about-text h3", { stagger: 0.12 });
    addReveal(".tech-card", { stagger: 0.07 });
    addReveal(".tech-note");
    addReveal(".project-card");
    addReveal(".more-projects");
    addReveal(".education-card", { stagger: 0.15 });
    addReveal(".certification-card", { stagger: 0.15 });
    addReveal(".contact-content");

    if ("IntersectionObserver" in window && !reduceMotion) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
        );
        document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    } else {
        document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    }

    /* Hero: entrada escalonada */
    document
        .querySelectorAll("#inicio .eyebrow, #inicio h1, #inicio h2, #inicio .hero-text > p, #inicio .hero-buttons, #inicio .hero-social")
        .forEach((el, i) => {
            el.classList.add("reveal");
            el.style.setProperty("--delay", (reduceMotion ? 0.15 : 1.15) + i * 0.14 + "s");
            requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("visible")));
        });

    /* Efecto máquina de escribir en el subtítulo */
    const subtitle = document.querySelector("#inicio h2");
    if (subtitle && !reduceMotion) {
        const text = subtitle.textContent.trim();
        subtitle.setAttribute("aria-label", text);
        subtitle.textContent = "";
        subtitle.classList.add("type-caret");
        let i = 0;
        setTimeout(function type() {
            subtitle.textContent = text.slice(0, ++i);
            if (i < text.length) setTimeout(type, 45);
        }, reduceMotion ? 0 : 2000);
    }

    /*Tarjetas: inclinación 3D*/
    if (!isTouch && !reduceMotion) {
        document
            .querySelectorAll(".tech-card, .project-card, .education-card, .certification-card")
            .forEach((card) => {
                card.addEventListener("mousemove", (e) => {
                    const r = card.getBoundingClientRect();
                    const x = e.clientX - r.left;
                    const y = e.clientY - r.top;
                    card.style.setProperty("--mx", x + "px");
                    card.style.setProperty("--my", y + "px");
                    card.style.setProperty("--ry", ((x / r.width) - 0.5) * 8 + "deg");
                    card.style.setProperty("--rx", (0.5 - (y / r.height)) * 8 + "deg");
                });
                card.addEventListener("mouseleave", () => {
                    card.style.setProperty("--rx", "0deg");
                    card.style.setProperty("--ry", "0deg");
                });
            });
    }

    /* Partículas conectadas de fondo */
    if (!reduceMotion) {
        const canvas = document.createElement("canvas");
        canvas.id = "particles";
        document.body.prepend(canvas);
        const ctx = canvas.getContext("2d");

        let w, h, particles = [];
        const mouse = { x: null, y: null };

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            const count = Math.min(85, Math.floor((w * h) / 20000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                r: Math.random() * 1.8 + 0.6,
            }));
        };
        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener("mouseout", () => { mouse.x = mouse.y = null; });

        const colors = ["139,92,246", "236,72,153", "34,211,238"];

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colors[i % 3]}, 0.8)`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const d = Math.hypot(p.x - q.x, p.y - q.y);
                    if (d < 120) {
                        ctx.strokeStyle = `rgba(${colors[i % 3]}, ${0.18 * (1 - d / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null) {
                    const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                    if (d < 160) {
                        ctx.strokeStyle = `rgba(255,255,255, ${0.35 * (1 - d / 160)})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        p.x -= (mouse.x - p.x) * 0.002;
                        p.y -= (mouse.y - p.y) * 0.002;
                    }
                }
            });

            requestAnimationFrame(draw);
        };
        draw();
    }

    /*Pantalla de carga*/
    document.body.classList.remove("is-loading");
    if (!reduceMotion) {
        document.body.classList.add("is-loading");
        const loader = document.createElement("div");
        loader.id = "loader";
        loader.setAttribute("aria-hidden", "true");
        loader.innerHTML = '<div class="loader-logo">IS</div><div class="loader-bar"></div>';
        document.body.appendChild(loader);
        setTimeout(() => {
            loader.classList.add("hide");
            document.body.classList.remove("is-loading");
            setTimeout(() => loader.remove(), 1000);
        }, 1250);
    }

    /*Hero: indicador de scroll*/
    const hero = document.getElementById("inicio");
    if (hero && !reduceMotion) {
        const hint = document.createElement("div");
        hint.className = "scroll-hint";
        hint.setAttribute("aria-hidden", "true");
        hero.appendChild(hint);
    }

    /* Parallax de los orbes al hacer scroll */
    if (!reduceMotion) {
        window.addEventListener("scroll", () => {
            document.documentElement.style.setProperty("--sy", window.scrollY);
        }, { passive: true });
    }

    /*Botones: ripple al hacer clic + efecto magnético*/
    document.querySelectorAll(".btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            if (reduceMotion) return;
            const r = btn.getBoundingClientRect();
            const size = Math.max(r.width, r.height);
            const dot = document.createElement("span");
            dot.className = "ripple";
            dot.style.width = dot.style.height = size + "px";
            dot.style.left = e.clientX - r.left - size / 2 + "px";
            dot.style.top = e.clientY - r.top - size / 2 + "px";
            btn.appendChild(dot);
            setTimeout(() => dot.remove(), 700);
        });

        if (!isTouch && !reduceMotion) {
            btn.addEventListener("mousemove", (e) => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * 0.22;
                const y = (e.clientY - r.top - r.height / 2) * 0.32;
                btn.style.translate = `${x}px ${y}px`;
            });
            btn.addEventListener("mouseleave", () => { btn.style.translate = ""; });
        }
    });

    /*Tecnologías: ícono de cada herramienta al lado*/
    const techIcons = {
        "HTML5": "devicon-html5-plain colored",
        "CSS3": "devicon-css3-plain colored",
        "JavaScript": "devicon-javascript-plain colored",
        "Node.js": "devicon-nodejs-plain colored",
        "Python": "devicon-python-plain colored",
        "SQLite": "devicon-sqlite-plain colored",
        "Git y GitHub": "devicon-git-plain colored",
        "Flask": "devicon-flask-original icon-white",
        "React": "devicon-react-original colored"
    };
    document.querySelectorAll(".tech-card").forEach((card) => {
        const title = card.querySelector("h3");
        const cls = title && techIcons[title.textContent.trim()];
        if (!cls) return;
        const icon = document.createElement("div");
        icon.className = "tech-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = '<i class="' + cls + '"></i>';
        if (title.textContent.trim() === "Git y GitHub") {
            icon.innerHTML += '<i class="devicon-github-original icon-white"></i>';
            icon.classList.add("double");
        }
        const body = document.createElement("div");
        body.className = "tech-body";
        while (card.firstChild) body.appendChild(card.firstChild);
        card.append(icon, body);
    });
});