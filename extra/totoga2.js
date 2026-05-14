(() => {
    const hubButtons = Array.from(document.querySelectorAll("[data-totoga-hub]"));
    const hubPanels = Array.from(document.querySelectorAll("[data-totoga-panel]"));

    function setHubPanel(name) {
        hubButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.totogaHub === name));
        hubPanels.forEach((panel) => {
            panel.hidden = panel.dataset.totogaPanel !== name;
        });
    }

    hubButtons.forEach((btn) => {
        btn.addEventListener("click", () => setHubPanel(btn.dataset.totogaHub));
    });

    const reader = document.getElementById("totoga2-reader");
    if (!reader) return;

    const chapters = Array.from(reader.querySelectorAll(".chronicle-chapter"));
    const modeButtons = Array.from(document.querySelectorAll("[data-totoga-reader-mode]"));
    const pager = document.getElementById("totoga2-pager");
    const prevBtn = document.getElementById("totoga2-prev");
    const nextBtn = document.getElementById("totoga2-next");
    const indicator = document.getElementById("totoga2-chapter-indicator");
    if (!pager || !prevBtn || !nextBtn || !indicator) return;

    let currentIndex = 0;

    function updatePagedView() {
        chapters.forEach((chapter, index) => {
            chapter.style.display = index === currentIndex ? "" : "none";
            chapter.classList.toggle("active", index === currentIndex);
        });
        indicator.textContent = `${currentIndex + 1} / ${chapters.length}`;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === chapters.length - 1;
    }

    function setReaderMode(mode) {
        reader.dataset.mode = mode;
        modeButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.totogaReaderMode === mode));
        if (mode === "paged") {
            pager.hidden = false;
            updatePagedView();
        } else {
            pager.hidden = true;
            chapters.forEach((chapter) => {
                chapter.style.display = "";
                chapter.classList.remove("active");
            });
        }
    }

    modeButtons.forEach((button) => {
        button.addEventListener("click", () => setReaderMode(button.dataset.totogaReaderMode));
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updatePagedView();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < chapters.length - 1) {
            currentIndex += 1;
            updatePagedView();
        }
    });

    const initialHub =
        hubButtons.find((b) => b.classList.contains("active"))?.dataset.totogaHub ||
        hubButtons[0]?.dataset.totogaHub ||
        "video";
    setHubPanel(initialHub);
    setReaderMode("scroll");

    function applyLocationHashNavigation() {
        const hash = (location.hash || "").slice(1);
        if (hash === "ebook") {
            setHubPanel("ebook");
            return;
        }
        if (hash && document.getElementById(hash)) {
            setHubPanel("reader");
            setReaderMode("scroll");
            pager.hidden = true;
            requestAnimationFrame(() => {
                document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    }

    applyLocationHashNavigation();
    window.addEventListener("hashchange", applyLocationHashNavigation);
})();
