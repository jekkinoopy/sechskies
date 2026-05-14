(() => {
    const hubButtons = Array.from(document.querySelectorAll("[data-totoga-hub]"));
    const hubPanels = Array.from(document.querySelectorAll("[data-totoga-panel]"));

    function setHubPanel(name) {
        if (!hubButtons.length || !hubPanels.length) return;
        hubButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.totogaHub === name));
        hubPanels.forEach((panel) => {
            panel.hidden = panel.dataset.totogaPanel !== name;
        });
    }

    hubButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const name = button.dataset.totogaHub;
            if (name) setHubPanel(name);
        });
    });

    const reader = document.getElementById("totoga2-reader");
    const chapters = reader ? Array.from(reader.querySelectorAll(".chronicle-chapter")) : [];
    const modeButtons = Array.from(document.querySelectorAll("[data-totoga-reader-mode]"));
    const pager = document.getElementById("totoga2-pager");
    const prevBtn = document.getElementById("totoga2-prev");
    const nextBtn = document.getElementById("totoga2-next");
    const indicator = document.getElementById("totoga2-chapter-indicator");
    const hasPager = Boolean(pager && prevBtn && nextBtn && indicator);

    let currentIndex = 0;

    function updatePagedView() {
        if (!hasPager) return;
        chapters.forEach((chapter, index) => {
            chapter.style.display = index === currentIndex ? "" : "none";
            chapter.classList.toggle("active", index === currentIndex);
        });
        indicator.textContent = `${currentIndex + 1} / ${chapters.length}`;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === chapters.length - 1;
    }

    function setReaderMode(mode) {
        if (!reader) return;
        reader.dataset.mode = mode;
        modeButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.totogaReaderMode === mode));
        if (mode === "paged" && hasPager) {
            pager.hidden = false;
            updatePagedView();
        } else {
            if (pager) pager.hidden = true;
            chapters.forEach((chapter) => {
                chapter.style.display = "";
                chapter.classList.remove("active");
            });
        }
    }

    modeButtons.forEach((button) => {
        button.addEventListener("click", () => setReaderMode(button.dataset.totogaReaderMode));
    });

    if (hasPager) {
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
    }

    if (hubButtons.length > 0) {
        const initialHub =
            hubButtons.find((b) => b.classList.contains("active"))?.dataset.totogaHub ||
            hubButtons[0]?.dataset.totogaHub ||
            "video";
        setHubPanel(initialHub);
    } else {
        hubPanels.forEach((panel) => {
            panel.hidden = false;
        });
    }

    if (reader) {
        setReaderMode("scroll");
    }

    function applyLocationHashNavigation() {
        const hash = (location.hash || "").slice(1);
        if (hash === "ebook" && hubButtons.length > 0) {
            setHubPanel("ebook");
            return;
        }
        if (hash && document.getElementById(hash)) {
            if (hubButtons.length > 0) setHubPanel("reader");
            setReaderMode("scroll");
            if (pager) pager.hidden = true;
            requestAnimationFrame(() => {
                document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    }

    applyLocationHashNavigation();
    window.addEventListener("hashchange", applyLocationHashNavigation);
})();
