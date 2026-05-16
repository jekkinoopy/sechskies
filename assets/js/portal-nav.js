(() => {
    /**
     * ── 導覽「尚未開放」連結 ─────────────────────────────────────────
     * 【兩個世界】① 僅 `extra/site-guide.html`：`<nav data-portal-nav-all-open>` 頂欄全可點；`main.site-guide-main` 內 `<a>` 不改寫。
     *    ② 其餘每一頁：頂欄＋**頁內所有連結**（含 totoga2 分頁列、首頁內文）皆依 COMING_SOON／INDEX 白名單鎖定。
     * 【totoga2】頂欄四入口：時間軸（`totoga2-copy-timeline.html`）、圖文好讀版（`totoga2.html`）在 Set；電子書／影片可點。未同意不得從 Set 刪除或擅自開放。
     * 【硬規則】檔案在 repo ≠ 可開放；未同意不得從 Set 刪名、不得擴白名單、不得在模板新增可點項。
     * 【未公開】href 改 #、不可點。頂欄與頁內按鈕：NAV_SOON_PHRASES 滑過隨機氣泡（同 ::after）；無障礙 aria「尚無開放」；不加可見「（籌備中）」文字後綴。
     * 【totoga2 開放】`extra/totoga2-copy-ebook.html`、`extra/totoga2-video.html` 可點；`totoga2-copy-timeline.html` 與 `fallen/totoga2.html` 在 Set 內。
     * 頂欄勿加 `portal-nav__sub`（站主未要求）；曾用副標見 `.cursor/portal-nav-optimization-backlog.md`。
     * 完整條文：`.cursor/rules/portal-nav-rules.mdc` + `user-scope-and-nav.mdc`
     */
    const NAV_SOON_PHRASES = [
        "奇蹟醞釀中",
        "感動載入中",
        "初心校準中",
        "黃海漫延中",
        "傳奇編排中",
        "夢想航行中",
    ];

    /** 主選單欄 `mouseleave` 後延遲關閉（ms），方便移入子選單或右側飛出層，避免略偏就關閉 */
    const SUBMENU_CLOSE_DELAY_MS = 650;

    function pickSoonPhrase() {
        return NAV_SOON_PHRASES[Math.floor(Math.random() * NAV_SOON_PHRASES.length)];
    }

    /** 籌備中連結：滑過／聚焦時隨機一句（氣泡與 title 同步，頂欄與頁內按鈕共用） */
    function rollSoonLabel(link) {
        const p = pickSoonPhrase();
        link.style.setProperty("--portal-nav-soon-msg", JSON.stringify(p));
        link.setAttribute("title", p);
    }

    const COMING_SOON_PAGES = new Set([
        "albums.html",
        "map.html",
        "member.html",
        "minister.html",
        "minister_ge.html",
        "totoga2.html",
        "totoga2-copy-timeline.html",
        "variety.html",
    ]);

    /**
     * 首頁僅下列錨點可點；其餘（如 #story）維持籌備中，須站主同意後才可加入。
     * 空字串：連到 index.html 且無 # 片段時視為可點（淪陷瞬間主項）。
     */
    const INDEX_NAV_OPEN_HASHES = new Set(["", "#origin", "#start", "#mission", "#timeline"]);

    function normalizePageKey(href) {
        if (!href || href === "#") return "";
        const core = href.split("#")[0].split("?")[0];
        const parts = core.split("/").filter(Boolean);
        const last = parts.length ? parts[parts.length - 1] : "";
        return last.toLowerCase();
    }

    /** 比照原邏輯：取 href 前半與網址列檔名比對 */
    function hrefMatchesCurrentPage(href, currentPage) {
        if (!href || href === "#") return false;
        const [filePart] = href.split("#");
        const base = filePart.split("/").pop();
        return base === currentPage;
    }

    /** 取得 #fragment（含 #）；若無錨點則回傳空字串 */
    function anchorFromHref(href) {
        const i = href.indexOf("#");
        if (i < 0) return "";
        return href.slice(i).split("?")[0];
    }

    function markLinkComingSoon(link, originalHref) {
        const labelEl = link.querySelector(".portal-nav__label");
        const visibleTitle = labelEl ? labelEl.textContent.trim() : link.textContent.trim();
        link.setAttribute("data-coming-soon", "true");
        link.setAttribute("aria-disabled", "true");
        link.setAttribute("aria-label", `${visibleTitle}，尚無開放`);

        const onSoonInteract = () => rollSoonLabel(link);
        link.addEventListener("pointerenter", onSoonInteract);
        link.addEventListener("focus", onSoonInteract);
        link.addEventListener("touchstart", onSoonInteract, { passive: true });

        if (!link.dataset.originalHref) {
            link.dataset.originalHref = originalHref;
        }

        link.setAttribute("href", "#");
        link.dataset.portalNavSoonRoll = "1";
    }

    function linkShouldBeComingSoon(href, pageKey, pageKeysSoon) {
        if (pageKeysSoon.has(pageKey)) {
            return true;
        }
        if (pageKey === "index.html") {
            const frag = anchorFromHref(href);
            return !INDEX_NAV_OPEN_HASHES.has(frag);
        }
        return false;
    }

    function getPageKeysSoon() {
        return new Set([...COMING_SOON_PAGES].map((p) => normalizePageKey(String(p))).filter(Boolean));
    }

    /** 將籌備中規則套用至容器內錨點（頂欄或整頁；`site-guide` 主文除外） */
    function applyComingSoonToAnchorElements(container) {
        if (!container) return;
        const pageKeysSoon = getPageKeysSoon();

        container.querySelectorAll("a[href]").forEach((link) => {
            if (link.classList.contains("logo")) return;
            if (link.getAttribute("data-coming-soon") === "true") return;

            const href = link.getAttribute("href");
            if (!href || href === "#") return;
            if (/^https?:\/\//i.test(href)) return;

            const pageKey = normalizePageKey(href);
            if (!pageKey) return;

            if (!linkShouldBeComingSoon(href, pageKey, pageKeysSoon)) return;

            markLinkComingSoon(link, href);
        });
    }

    /** 訪客頁：頁內連結與頂欄同一套 COMING_SOON；僅 site-guide 的 main.site-guide-main 跳過（頂欄 all-open 不影響此條） */
    function applyComingSoonSiteWide() {
        const siteGuideMain = document.querySelector("main.site-guide-main");
        document.querySelectorAll("a[href]").forEach((link) => {
            if (link.closest("nav.portal-nav")) return;
            if (siteGuideMain && siteGuideMain.contains(link)) return;
            if (link.classList.contains("logo")) return;

            const href = link.getAttribute("href");
            if (!href || href === "#") return;
            if (/^https?:\/\//i.test(href)) return;

            const pageKey = normalizePageKey(href);
            if (!pageKey) return;

            const pageKeysSoon = getPageKeysSoon();
            if (!linkShouldBeComingSoon(href, pageKey, pageKeysSoon)) return;

            markLinkComingSoon(link, href);
        });
    }

    function blockNavigation(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function bindComingSoonBlockers() {
        document.querySelectorAll('a[data-coming-soon="true"]').forEach((link) => {
            if (link.dataset.portalNavSoonBound === "1") return;
            link.dataset.portalNavSoonBound = "1";
            link.addEventListener("click", blockNavigation);
            link.addEventListener("auxclick", blockNavigation);
        });
    }

    /** 將籌備中規則套用至單一導覽列（含頂層 li 樣式） */
    function applyComingSoonToNav(nav) {
        applyComingSoonToAnchorElements(nav);

        nav.querySelectorAll(":scope > ul > li").forEach((li) => {
            const trigger = li.querySelector(":scope > a[href]");
            if (!trigger || trigger.classList.contains("logo")) return;
            if (trigger.getAttribute("data-coming-soon") === "true") {
                li.classList.add("coming-soon");
            }
        });
    }

    /**
     * 站根與 `portal-nav.js` 同層；依腳本路徑與當前頁路徑計算回到站根的相對前綴（如 `../`）。
     * 子資料夾內頁面之導覽連結必須帶此前綴，否則 `./assets/images`、`index.html` 會錯層。
     */
    function portalNavRootPrefix() {
        const el =
            document.currentScript ||
            Array.from(document.querySelectorAll("script[src*='portal-nav.js']")).find((s) => s.src);
        if (!el?.src) return "./";
        try {
            const scriptPathname = new URL(el.src, window.location.href).pathname;
            const scriptDirSegs = scriptPathname.split("/").filter(Boolean);
            scriptDirSegs.pop();
            const pageDirSegs = window.location.pathname.split("/").filter(Boolean);
            pageDirSegs.pop();
            let i = 0;
            const a = scriptDirSegs;
            const b = pageDirSegs;
            while (i < a.length && i < b.length && a[i] === b[i]) {
                i += 1;
            }
            const ups = b.length - i;
            return ups > 0 ? "../".repeat(ups) : "./";
        } catch {
            return "./";
        }
    }

    /** 全站導覽 HTML — `rp` 為站根相對前綴；僅修改此模板即可同步所有頁面
     * 五主項：淪陷瞬間（全員發瘋巢狀）、完整的六顆（member）、現場的震撼、黃色留聲機、Yellow Note（minister、map）；variety 僅經淪陷子選單進入。 */
    function buildPortalNavInnerHTML(rp) {
        return `
<a class="logo" target="_blank" rel="noopener noreferrer" href="${rp}index.html"><img src="${rp}assets/images/logov.svg" alt="SECHSKIES Logo"></a>
<ul>
    <li><a target="_blank" rel="noopener noreferrer" href="${rp}index.html"><span class="portal-nav__label">淪陷瞬間</span></a>
        <ul class="portal-submenu">
            <li class="portal-nav__subgroup">
                <span class="portal-nav__subgroup-head"><span class="portal-nav__label">傳奇的轉折</span></span>
                <ul class="portal-submenu-nested" aria-label="傳奇的轉折">
                    <li><a target="_blank" rel="noopener noreferrer" href="${rp}extra/totoga2-copy-timeline.html"><span class="portal-nav__label">時間軸</span></a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="${rp}extra/totoga2-copy-ebook.html"><span class="portal-nav__label">電子書</span></a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="${rp}fallen/totoga2.html"><span class="portal-nav__label">圖文好讀版</span></a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="${rp}extra/totoga2-video.html"><span class="portal-nav__label">影片</span></a></li>
                </ul>
            </li>
            <li class="portal-nav__subgroup">
                <span class="portal-nav__subgroup-head"><span class="portal-nav__label">全員發瘋</span></span>
                <ul class="portal-submenu-nested" aria-label="全員發瘋">
                    <li><a target="_blank" rel="noopener noreferrer" href="${rp}variety/variety.html#variety"><span class="portal-nav__label">隊長帶弟弟</span></a></li>
                    <li class="portal-nav__subgroup portal-nav__subgroup--nested">
                        <span class="portal-nav__subgroup-head portal-nav__subgroup-head--nested"><span class="portal-nav__label">各自暴走</span></span>
                        <ul class="portal-submenu-nested portal-submenu-nested--tier3" aria-label="各自暴走">
                            <li><a target="_blank" rel="noopener noreferrer" href="${rp}variety/NJTW/NJTW5.html"><span class="portal-nav__label">新西遊記</span></a></li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
    <li><a target="_blank" rel="noopener noreferrer" href="${rp}member/member.html"><span class="portal-nav__label">完整的六顆</span></a></li>
    <li><a target="_blank" rel="noopener noreferrer" href="${rp}concert/concert.html"><span class="portal-nav__label">現場的震撼</span></a>
        <ul class="portal-submenu">
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}concert/concert.html"><span class="portal-nav__label">集結水晶</span></a></li>
            <li><a href="#" data-coming-soon="true" aria-disabled="true" aria-label="隊長的氣場，尚無開放"><span class="portal-nav__label">隊長的氣場</span></a></li>
        </ul>
    </li>
    <li><a target="_blank" rel="noopener noreferrer" href="${rp}albums/albums.html"><span class="portal-nav__label">黃色留聲機</span></a>
        <ul class="portal-submenu">
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}albums/albums.html#new"><span class="portal-nav__label">啟動新篇章</span></a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}albums/albums.html#classic"><span class="portal-nav__label">輝煌全盛期</span></a></li>
        </ul>
    </li>
    <li><a target="_blank" rel="noopener noreferrer" href="${rp}yellow-note/map.html"><span class="portal-nav__label">Yellow Note</span></a>
        <ul class="portal-submenu">
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}yellow-note/minister.html"><span class="portal-nav__label">視覺進化論</span></a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}yellow-note/map.html"><span class="portal-nav__label">聖地巡禮</span></a></li>
        </ul>
    </li>
</ul>
`.trim();
    }

    const rootPrefix = portalNavRootPrefix();
    document.querySelectorAll("nav.portal-nav[data-portal-nav]").forEach((nav) => {
        nav.innerHTML = buildPortalNavInnerHTML(rootPrefix);
        if (!nav.hasAttribute("data-portal-nav-all-open")) {
            applyComingSoonToNav(nav);
        }
    });

    applyComingSoonSiteWide();
    bindComingSoonBlockers();

    const navs = Array.from(document.querySelectorAll(".portal-nav"));
    if (!navs.length) return;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navs.forEach((nav) => {
        /* 僅頂層主欄；子選單內巢狀 li 不綁 open，否則會關閉整欄下拉 */
        const items = Array.from(nav.querySelectorAll(":scope > ul > li"));

        items.forEach((item) => {
            const trigger = item.querySelector(":scope > a");
            const submenu = item.querySelector(":scope > .portal-submenu");
            if (!trigger || !submenu) return;

            let closeTimer = null;

            const openItem = () => {
                if (closeTimer) window.clearTimeout(closeTimer);
                items.forEach((other) => {
                    if (other !== item) other.classList.remove("open");
                });
                item.classList.add("open");
            };

            const cancelClose = () => {
                if (closeTimer) {
                    window.clearTimeout(closeTimer);
                    closeTimer = null;
                }
            };

            const scheduleClose = () => {
                cancelClose();
                closeTimer = window.setTimeout(() => item.classList.remove("open"), SUBMENU_CLOSE_DELAY_MS);
            };

            const leaveUnlessStillInside = (event) => {
                const next = event.relatedTarget;
                if (next instanceof Node && item.contains(next)) return;
                scheduleClose();
            };

            item.addEventListener("mouseenter", openItem);
            item.addEventListener("mouseleave", leaveUnlessStillInside);
            submenu.addEventListener("mouseenter", cancelClose);
            submenu.addEventListener("mouseleave", leaveUnlessStillInside);
            item.querySelectorAll(".portal-submenu-nested").forEach((panel) => {
                panel.addEventListener("mouseenter", cancelClose);
                panel.addEventListener("mouseleave", leaveUnlessStillInside);
            });
            trigger.addEventListener("focus", openItem);

            trigger.addEventListener("click", (event) => {
                const isSoon = trigger.getAttribute("data-coming-soon") === "true";

                if (window.innerWidth <= 767) {
                    event.preventDefault();
                    if (!isSoon && !item.classList.contains("coming-soon")) {
                        item.classList.toggle("open");
                    }
                    return;
                }

                if (isSoon) {
                    event.preventDefault();
                }
            });
        });

        document.addEventListener("click", (event) => {
            if (!nav.contains(event.target)) {
                items.forEach((item) => item.classList.remove("open"));
            }
        });

        const navLinks = Array.from(nav.querySelectorAll("a[href]")).filter((link) => !link.classList.contains("logo"));
        navLinks.forEach((link) => {
            const fallback = link.getAttribute("href");
            const source = link.dataset.originalHref || fallback;
            if (!source || source === "#") return;
            if (hrefMatchesCurrentPage(source, currentPage)) {
                link.classList.add("nav-current");
            }
        });
    });
})();
