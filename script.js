/* ==========================================================================
   CYBERPUNK INTERFACE CORE CONTROLLER MATRIX
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize system subsystems
    initThemeEngine();
    initLanguageMatrix();
    initSearchDiagnostics();
    initScrollTelemetry();
});

/* --------------------------------------------------------------------------
   1. THEME MATRIX ENGINE (Light / Dark Deck Switcher)
   -------------------------------------------------------------------------- */
function initThemeEngine() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;

    // Check system preference or local storage node
    const activeTheme = localStorage.getItem("cyber-theme") || "dark-theme";
    document.body.className = activeTheme;
    updateThemeIcon(activeTheme);

    themeToggle.addEventListener("click", () => {
        if (document.body.classList.contains("dark-theme")) {
            document.body.className = "light-theme";
            localStorage.setItem("cyber-theme", "light-theme");
            updateThemeIcon("light-theme");
        } else {
            document.body.className = "dark-theme";
            localStorage.setItem("cyber-theme", "dark-theme");
            updateThemeIcon("dark-theme");
        }
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.textContent = theme === "dark-theme" ? "🌙" : "☀️";
    }
}

/* --------------------------------------------------------------------------
   2. LANGUAGE MATRIX CONTROLLER (EN / BM Translation Relocation)
   -------------------------------------------------------------------------- */
function initLanguageMatrix() {
    const langSwitch = document.getElementById("lang-switch");
    if (!langSwitch) return;

    // Detect cache payload or set fallback
    const preferredLang = localStorage.getItem("cyber-lang") || "en";
    langSwitch.value = preferredLang;
    translateInterface(preferredLang);

    langSwitch.addEventListener("change", (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem("cyber-lang", selectedLang);
        translateInterface(selectedLang);
    });
}

function translateInterface(lang) {
    // Select elements targeting custom data attributes
    const elements = document.querySelectorAll("[data-en], [data-bm]");
    
    elements.forEach(el => {
        const textTranslation = el.getAttribute(`data-${lang}`);
        if (!textTranslation) return;

        // Special handling for elements containing inner tags or pure text nodes
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = textTranslation;
        } else {
            // Check if element has child HTML elements we want to preserve (like inside buttons)
            const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) {
                textNode.textContent = textTranslation;
            } else {
                el.textContent = textTranslation;
            }
        }
    });

    // Dynamically re-render back-glow section elements titles
    const titles = document.querySelectorAll(".section-title");
    titles.forEach(title => {
        const rawBgText = title.getAttribute("data-bg-text");
        if (rawBgText) {
            title.setAttribute("data-bg-text", rawBgText);
        }
    });
}

/* --------------------------------------------------------------------------
   3. SKILL FILTER & SEARCH DIAGNOSTICS
   -------------------------------------------------------------------------- */
function initSearchDiagnostics() {
    const searchBar = document.getElementById("skill-search");
    const skillCards = document.querySelectorAll(".skill-card");

    if (!searchBar) return;

    searchBar.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        skillCards.forEach(card => {
            const heading = card.querySelector("h3").textContent.toLowerCase();
            const items = Array.from(card.querySelectorAll(".skill-item"))
                               .map(li => li.textContent.toLowerCase());
            
            // Evaluates text payload hits
            const matchHeading = heading.includes(query);
            const matchItems = items.some(item => item.includes(query));

            if (matchHeading || matchItems || query === "") {
                card.style.display = "block";
                card.style.opacity = "1";
                card.style.transform = "scale(1)";
            } else {
                card.style.opacity = "0";
                card.style.transform = "scale(0.95)";
                // Delays display extraction for smoother visual animations
                setTimeout(() => {
                    if(card.style.opacity === "0") card.style.display = "none";
                }, 200);
            }
        });
    });
}

/* --------------------------------------------------------------------------
   4. SCROLL TELEMETRY & ANIMATION REVEAL ENGINE
   -------------------------------------------------------------------------- */
function initScrollTelemetry() {
    const scrollElements = document.querySelectorAll(".scroll-reveal");
    const navItems = document.querySelectorAll(".nav-item");

    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                
                // Active Section Tracking Link Highlights
                const currentSectionId = entry.target.getAttribute("id");
                navItems.forEach(item => {
                    if (item.getAttribute("href") === `#${currentSectionId}`) {
                        item.classList.add("active");
                    } else {
                        item.classList.remove("active");
                    }
                });
            }
        });
    };

    const telemetryObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15, // Triggers when 15% of target is visible
        rootMargin: "-10% 0px -20% 0px"
    });

    scrollElements.forEach(el => telemetryObserver.observe(el));
}