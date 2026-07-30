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

    const searchInput = document.getElementById("itinerary-search");

    /**
     * 每個 .region-panel（例如 #taipei、#global）都是獨立的地區區塊，各自的
     * member-tabs／地圖／地點卡片互不影響。新增行程時只要在對應 .region-panel
     * 裡加一顆 .tab-btn（帶 data-trip-name / data-map-embed / data-map-open，
     * 沒有地圖就不要寫 data-map-embed），以及對應的 .polaroid-card，不需要動這支
     * 檔案。「全部行程」的地圖會依當時有設定地圖的 tab 自動組出來；完全沒有
     * 設定地圖的行程，地圖區塊會自動收起來，只留卡片列表。
     */
    function initRegionController(panel) {
        const tabs = Array.from(panel.querySelectorAll(":scope > .member-tabs .tab-btn"));
        const cards = Array.from(panel.querySelectorAll(".polaroid-card"));
        const itineraryList = panel.querySelector(".itinerary-list");
        const detailPanel = panel.querySelector(".detail-panel");
        const detailImage = panel.querySelector(".detail-photo img");
        const detailDate = panel.querySelector(".detail-content .date");
        const detailTitle = panel.querySelector(".detail-content h3");
        const detailDesc = panel.querySelector(".detail-content p");
        const detailQuote = panel.querySelector(".detail-content blockquote");
        const detailTag = panel.querySelector(".detail-content .tag");
        const detailLink = panel.querySelector(".detail-content .detail-link");

        const mapSticky = panel.querySelector(".map-sticky");
        const mapEmbedSingle = mapSticky ? mapSticky.querySelector(".map-embed-single") : null;
        const memberMapFrame = mapEmbedSingle ? mapEmbedSingle.querySelector(".map-my-maps-frame") : null;
        const mapEmbedEmpty = mapSticky ? mapSticky.querySelector(".map-embed-empty") : null;
        const mapEmbedAll = mapSticky ? mapSticky.querySelector(".map-embed-all") : null;
        const openMapLink = mapSticky ? mapSticky.querySelector(".map-link") : null;
        const openMapLinksDual = mapSticky ? mapSticky.querySelector(".map-links-dual") : null;

        const dayGroups = new Map();

        /* 舊資料裡卡片用 data-member="kogo"，tab 用 data-member="ko"；新地區請直接讓兩邊字串一致，不需要這個對照 */
        function normalizeMember(member) {
            if (member === "kogo") return "ko";
            return member;
        }

        const tripConfig = {};
        tabs.forEach((tab) => {
            const member = normalizeMember(tab.dataset.member || "");
            if (!member || member === "all") return;
            tripConfig[member] = {
                tripName: tab.dataset.tripName || tab.textContent.trim(),
                memberLabel: tab.dataset.memberLabel || tab.textContent.trim(),
                sortOrder: Number.isFinite(Number(tab.dataset.sortOrder)) ? Number(tab.dataset.sortOrder) : 99,
                mapEmbed: tab.dataset.mapEmbed || "",
                mapOpen: tab.dataset.mapOpen || "",
            };
        });

        const initialTab = tabs.find((tab) => tab.classList.contains("active")) || tabs[0];
        let currentMember = initialTab ? normalizeMember(initialTab.dataset.member || "all") : "all";
        let currentKeyword = "";

        function getMemberLabel(member) {
            return (tripConfig[member] && tripConfig[member].memberLabel) || "未分類";
        }

        function getDayToken(rawDate) {
            const match = String(rawDate || "").match(/Day\s*(\d+)/i);
            if (!match) return String(rawDate || "未分類");
            return "Day " + match[1];
        }

        function getGroupLabel(card) {
            const date = getDayToken(card.dataset.date || "未分類");
            const member = normalizeMember(card.dataset.member || "");
            const prefix = (tripConfig[member] && tripConfig[member].tripName) || getMemberLabel(member);
            return prefix + "_" + date;
        }

        function tripsWithMaps() {
            return Object.keys(tripConfig)
                .filter((member) => tripConfig[member].mapEmbed)
                .sort((a, b) => tripConfig[a].sortOrder - tripConfig[b].sortOrder);
        }

        function buildMapPairs(members) {
            if (!mapEmbedAll) return;
            mapEmbedAll.innerHTML = "";
            members.forEach((member) => {
                const trip = tripConfig[member];
                const pair = document.createElement("div");
                pair.className = "map-embed-pair";

                const label = document.createElement("p");
                label.className = "map-embed-label";
                label.textContent = trip.tripName;

                const iframe = document.createElement("iframe");
                iframe.className = "map-my-maps-frame";
                iframe.loading = "lazy";
                iframe.referrerPolicy = "no-referrer-when-downgrade";
                iframe.title = trip.tripName + " 踩點地圖";
                iframe.src = trip.mapEmbed;

                pair.appendChild(label);
                pair.appendChild(iframe);
                mapEmbedAll.appendChild(pair);
            });
        }

        function buildOpenLinksDual(members) {
            if (!openMapLinksDual) return;
            openMapLinksDual.innerHTML = "";
            members.forEach((member) => {
                const trip = tripConfig[member];
                if (!trip.mapOpen) return;
                const a = document.createElement("a");
                a.className = "map-link";
                a.target = "_blank";
                a.href = trip.mapOpen;
                a.textContent = "開啟「" + trip.tripName + "」My Maps";
                openMapLinksDual.appendChild(a);
            });
        }

        function updateMapByMember(member) {
            if (!mapSticky) return;
            if (!Object.keys(tripConfig).length) {
                mapSticky.hidden = true;
                return;
            }
            mapSticky.hidden = false;

            if (member === "all") {
                const withMaps = tripsWithMaps();
                if (mapEmbedSingle) mapEmbedSingle.hidden = true;
                if (openMapLink) openMapLink.hidden = true;
                if (mapEmbedAll) {
                    buildMapPairs(withMaps);
                    mapEmbedAll.hidden = withMaps.length === 0;
                }
                if (openMapLinksDual) {
                    buildOpenLinksDual(withMaps);
                    openMapLinksDual.hidden = withMaps.length === 0;
                }
                if (mapEmbedEmpty) mapEmbedEmpty.hidden = withMaps.length > 0;
                return;
            }

            const trip = tripConfig[member];
            const hasMap = !!(trip && trip.mapEmbed);
            if (mapEmbedAll) mapEmbedAll.hidden = true;
            if (openMapLinksDual) openMapLinksDual.hidden = true;
            if (mapEmbedSingle) mapEmbedSingle.hidden = !hasMap;
            if (memberMapFrame && hasMap) memberMapFrame.src = trip.mapEmbed;
            if (openMapLink) {
                openMapLink.hidden = !hasMap;
                if (hasMap) openMapLink.href = trip.mapOpen || "#";
            }
            if (mapEmbedEmpty) mapEmbedEmpty.hidden = hasMap;
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
            itineraryList.appendChild(group);
            dayGroups.set(dayLabel, { group, toggle, body });
            return dayGroups.get(dayLabel);
        }

        function setDayExpanded(dayGroup, shouldExpand) {
            dayGroup.toggle.setAttribute("aria-expanded", shouldExpand ? "true" : "false");
            dayGroup.body.style.display = shouldExpand ? "grid" : "none";
            dayGroup.group.classList.toggle("expanded", shouldExpand);
        }

        function initializeDayGroups() {
            if (!itineraryList || !cards.length) return;
            const sortedCards = [...cards].sort((a, b) => {
                const memberA = normalizeMember(a.dataset.member || "");
                const memberB = normalizeMember(b.dataset.member || "");
                const sortA = (tripConfig[memberA] && tripConfig[memberA].sortOrder) ?? 99;
                const sortB = (tripConfig[memberB] && tripConfig[memberB].sortOrder) ?? 99;
                if (sortA !== sortB) return sortA - sortB;

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
            updateMapByMember(currentMember === "all" ? "all" : currentMember);

            if (!detailPanel) return;
            if (detailDate) detailDate.textContent = card.dataset.date || "";
            if (detailTitle) detailTitle.textContent = card.dataset.title || "";
            if (detailDesc) detailDesc.textContent = card.dataset.desc || "";
            if (detailQuote) detailQuote.textContent = "「" + (card.dataset.quote || "") + "」";
            if (detailTag) detailTag.textContent = card.dataset.tag || "";
            if (detailLink) detailLink.href = card.dataset.link || "#";
            const cardImg = card.querySelector("img");
            if (detailImage && cardImg) {
                detailImage.src = cardImg.src;
                detailImage.alt = "節目截圖 - " + (card.dataset.title || "行程地點");
            }
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

        if (itineraryList) {
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
        }

        cards.forEach((card) => {
            card.addEventListener("click", () => {
                setActiveCard(card, { expandDay: true });
                if (window.innerWidth < 920 && detailPanel) {
                    detailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });

        initializeDayGroups();
        applyFilter();

        return {
            setKeyword(keyword) {
                currentKeyword = keyword;
                applyFilter();
            },
        };
    }

    const regionPanels = Array.from(document.querySelectorAll(".region-panel"));
    const controllers = regionPanels.map((panel) => initRegionController(panel));

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            const keyword = event.target.value.trim().toLowerCase();
            controllers.forEach((controller) => controller.setKeyword(keyword));
        });
    }

    const regionTabs = Array.from(document.querySelectorAll("[data-region-tabs] .region-tab-btn"));
    if (regionTabs.length && regionPanels.length) {
        regionTabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const region = tab.dataset.region;
                regionPanels.forEach((panel) => {
                    panel.hidden = panel.dataset.regionPanel !== region;
                });
                regionTabs.forEach((item) => {
                    const isActive = item === tab;
                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-pressed", isActive ? "true" : "false");
                });
            });
        });
    }
})();
