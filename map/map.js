(() => {
    const canvas = document.getElementById("particles");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 4 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.y > canvas.height) this.y = 0;
            }
            draw() {
                ctx.fillStyle = "#FFDD00";
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 80; i += 1) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const particle of particles) {
                particle.update();
                particle.draw();
            }
            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        initParticles();
        animateParticles();
        window.addEventListener("resize", () => {
            resizeCanvas();
            initParticles();
        });
    }

    const tabs = Array.from(document.querySelectorAll(".tab-btn"));
    const cards = Array.from(document.querySelectorAll(".polaroid-card"));
    const searchInput = document.getElementById("itinerary-search");
    const itineraryList = document.querySelector(".itinerary-list");
    const detailPanel = document.getElementById("detail-panel");
    const detailDate = document.getElementById("detail-date");
    const detailTitle = document.getElementById("detail-title");
    const detailDesc = document.getElementById("detail-desc");
    const detailQuote = document.getElementById("detail-quote");
    const detailTag = document.getElementById("detail-tag");
    const detailLink = document.getElementById("detail-link");
    const detailImage = document.getElementById("detail-image");
    const memberMapFrame = document.getElementById("member-map");
    const mapEmbedSingle = document.getElementById("map-embed-single");
    const mapEmbedAll = document.getElementById("map-embed-all");
    const openMapLink = document.getElementById("open-map-link");
    const openMapLinksDual = document.getElementById("open-map-links-dual");
    const openMapLinkKo = document.getElementById("open-map-link-ko");
    const openMapLinkEun = document.getElementById("open-map-link-eun");
    const dayGroups = new Map();

    let currentMember = "all";
    let currentKeyword = "";
    const memberMaps = {
        eun: {
            embed: "https://www.google.com/maps/d/embed?mid=1VGZ76SPPjm3NWCBQe-hkm08oe5WPRJI&ehbc=2E312F",
            open: "https://www.google.com/maps/d/u/0/viewer?mid=1VGZ76SPPjm3NWCBQe-hkm08oe5WPRJI"
        },
        ko: {
            embed: "https://www.google.com/maps/d/embed?mid=1xpAsSoO8gNmMiW4x2sfkndISFTtjMQDw&hl=zh-TW&ehbc=2E312F",
            open: "https://www.google.com/maps/d/u/0/viewer?mid=1xpAsSoO8gNmMiW4x2sfkndISFTtjMQDw"
        }
    };
    const memberTripPrefix = {
        ko: "高高父子遊台灣",
        eun: "殷空少搭飛機去台灣高雄"
    };
    const memberSortOrder = { ko: 0, eun: 1 };

    function normalizeMember(member) {
        if (member === "kogo") return "ko";
        return member;
    }

    function getMemberLabel(member) {
        const normalized = normalizeMember(member);
        if (normalized === "eun") return "殷志源";
        if (normalized === "ko") return "高志溶";
        return "未分類";
    }

    function getDayToken(rawDate) {
        const match = String(rawDate || "").match(/Day\s*(\d+)/i);
        if (!match) return String(rawDate || "未分類");
        return "Day " + match[1];
    }

    function getGroupLabel(card) {
        const date = getDayToken(card.dataset.date || "未分類");
        const normalized = normalizeMember(card.dataset.member || "");
        const prefix = memberTripPrefix[normalized] || getMemberLabel(normalized);
        return prefix + "_" + date;
    }

    function setDualMapVisible(isAll) {
        if (mapEmbedSingle && mapEmbedAll) {
            mapEmbedSingle.hidden = isAll ? true : false;
            mapEmbedAll.hidden = isAll ? false : true;
            mapEmbedAll.setAttribute("aria-hidden", isAll ? "false" : "true");
        }
        if (openMapLink && openMapLinksDual) {
            openMapLink.hidden = isAll ? true : false;
            openMapLinksDual.hidden = isAll ? false : true;
        }
    }

    function updateMapByMember(member) {
        const normalized = normalizeMember(member);
        if (normalized === "all") {
            setDualMapVisible(true);
            if (openMapLinkKo) openMapLinkKo.href = memberMaps.ko.open;
            if (openMapLinkEun) openMapLinkEun.href = memberMaps.eun.open;
            return;
        }
        setDualMapVisible(false);
        const mapConfig = memberMaps[normalized];
        if (!mapConfig || !memberMapFrame) return;
        memberMapFrame.src = mapConfig.embed;
        if (openMapLink) openMapLink.href = mapConfig.open;
    }

    function getCardSearchText(card) {
        return [
            card.dataset.date || "",
            card.dataset.title || "",
            card.dataset.desc || "",
            card.dataset.tag || "",
        ].join(" ").toLowerCase();
    }

    function createDayGroup(dayLabel) {
        const group = document.createElement("section");
        group.className = "day-group";
        group.dataset.day = dayLabel;

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "day-toggle";
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = "<span>" + dayLabel + "</span><i class='fa-solid fa-chevron-down'></i>";

        const body = document.createElement("div");
        body.className = "day-cards";
        body.style.display = "none";

        group.appendChild(toggle);
        group.appendChild(body);
        itineraryList.insertBefore(group, detailPanel);
        dayGroups.set(dayLabel, { group, toggle, body });
        return dayGroups.get(dayLabel);
    }

    function setDayExpanded(dayGroup, shouldExpand) {
        dayGroup.toggle.setAttribute("aria-expanded", shouldExpand ? "true" : "false");
        dayGroup.body.style.display = shouldExpand ? "grid" : "none";
        dayGroup.group.classList.toggle("expanded", shouldExpand);
    }

    function initializeDayGroups() {
        const sortedCards = [...cards].sort((a, b) => {
            const memberA = normalizeMember(a.dataset.member || "");
            const memberB = normalizeMember(b.dataset.member || "");
            const memberDiff = (memberSortOrder[memberA] ?? 99) - (memberSortOrder[memberB] ?? 99);
            if (memberDiff !== 0) return memberDiff;

            const dayA = Number((getDayToken(a.dataset.date).match(/\d+/) || [999])[0]);
            const dayB = Number((getDayToken(b.dataset.date).match(/\d+/) || [999])[0]);
            return dayA - dayB;
        });

        sortedCards.forEach((card) => {
            const dayLabel = getGroupLabel(card);
            const dayGroup = dayGroups.get(dayLabel) || createDayGroup(dayLabel);
            dayGroup.body.appendChild(card);
        });
    }

    function updateDayGroupVisibility() {
        dayGroups.forEach(({ group, body, toggle }) => {
            const visibleCards = Array.from(body.querySelectorAll(".polaroid-card")).filter((card) => card.style.display !== "none");
            group.style.display = visibleCards.length ? "" : "none";
            if (!visibleCards.length) {
                setDayExpanded({ group, toggle, body }, false);
            }
        });
    }

    function ensureExpandedForCard(card) {
        const dayGroup = dayGroups.get(getGroupLabel(card));
        if (!dayGroup) return;
        setDayExpanded(dayGroup, true);
    }

    function setActiveCard(card, options = {}) {
        const { expandDay = true } = options;
        cards.forEach((item) => item.classList.remove("active"));
        card.classList.add("active");
        if (expandDay) {
            ensureExpandedForCard(card);
        }
        const mapKey = currentMember === "all" ? "all" : currentMember;
        updateMapByMember(mapKey);

        detailDate.textContent = card.dataset.date || "";
        detailTitle.textContent = card.dataset.title || "";
        detailDesc.textContent = card.dataset.desc || "";
        detailQuote.textContent = "「" + (card.dataset.quote || "") + "」";
        detailTag.textContent = card.dataset.tag || "";
        detailLink.href = card.dataset.link || "#";
        detailImage.src = card.querySelector("img").src;
        detailImage.alt = "節目截圖 - " + (card.dataset.title || "行程地點");
    }

    function applyFilter() {
        let firstVisible = null;
        cards.forEach((card) => {
            const cardMember = normalizeMember(card.dataset.member || "");
            const matchedMember = currentMember === "all" || cardMember === currentMember;
            const matchedKeyword = !currentKeyword || getCardSearchText(card).includes(currentKeyword);
            const matched = matchedMember && matchedKeyword;
            card.style.display = matched ? "" : "none";
            if (matched && !firstVisible) firstVisible = card;
        });
        updateDayGroupVisibility();
        const activeVisibleCard = cards.find((card) => card.classList.contains("active") && card.style.display !== "none");
        const fallbackCard = activeVisibleCard || firstVisible;
        if (fallbackCard) {
            setActiveCard(fallbackCard, { expandDay: false });
        } else {
            updateMapByMember(currentMember === "all" ? "all" : currentMember);
        }
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((item) => {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
            });
            tab.classList.add("active");
            tab.setAttribute("aria-pressed", "true");
            currentMember = normalizeMember(tab.dataset.member || "all");
            applyFilter();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            currentKeyword = event.target.value.trim().toLowerCase();
            applyFilter();
        });
    }

    itineraryList.addEventListener("click", (event) => {
        const toggle = event.target.closest(".day-toggle");
        if (!toggle) return;
        const group = toggle.closest(".day-group");
        if (!group) return;
        const dayGroup = dayGroups.get(group.dataset.day);
        if (!dayGroup) return;
        const isExpanded = dayGroup.toggle.getAttribute("aria-expanded") === "true";
        setDayExpanded(dayGroup, !isExpanded);
    });

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            setActiveCard(card, { expandDay: true });
            if (window.innerWidth < 920) {
                detailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    initializeDayGroups();
    applyFilter();
})();
