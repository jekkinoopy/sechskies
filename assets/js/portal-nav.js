(() => {
    /**
     * ── 導覽「尚未開放」連結 ─────────────────────────────────────────
     * ① 頂欄 `buildPortalNavInnerHTML`：僅列站主同意掛在頂欄的分類（**不含**未同意的頁，例如 `member`「六顆水晶」）。
     * ② `COMING_SOON_PAGES`／`INDEX_NAV_OPEN_HASHES`：在 Set／白名單外＝籌備中（`href` 改 `#`）。
     * ③ **唯一例外**：`extra/site-guide.html` 的 `<nav data-portal-nav data-portal-nav-all-open>` **不套用**籌備中（索引頁預覽用，頂欄連結全可點）；**其他任何頁**不得加 `data-portal-nav-all-open`。
     * ④ 文案 NAV_SOON_PHRASES：滑過／聚焦時隨機一句；無障礙固定「尚無開放」。
     *
     * ⚠️ 站主規則（必守）：未經站主**逐項口頭／文字同意**，不得自行
     *    從 COMING_SOON_PAGES 移除檔名、擴充 INDEX_NAV_OPEN_HASHES、或在導覽模板新增／改為可點連結。
     *    「頁面已存在」≠ 可開放導覽。
     * 完整條文與檢查清單：`.cursor/rules/portal-nav-rules.mdc`（Cursor 會讀取）。
     */
    const NAV_SOON_PHRASES = ["奇蹟醞釀中", // 頁面準備中，呼應黃色奇蹟的誕生
        "感動載入中", // 資料讀取中，連結入坑時的悸動
        "初心校準中", // 結構調整中，呼應 LOGO 的六人設計核心
        "黃海漫延中", // 視覺填充中，發想自黃色海洋填滿漆黑的過程
        "傳奇編排中", // 內容整理中，記錄 1999 年榮譽與歷史軌跡
        "夢想航行中", // 未來規劃中，期待水晶男孩的下一個十年
    ];

    function pickSoonPhrase() {
        return NAV_SOON_PHRASES[Math.floor(Math.random() * NAV_SOON_PHRASES.length)];
    }

    /** 每次互動重抽，讀者沿導覽滑動時會交錯看到不同字樣 */
    function rollSoonLabel(link) {
        const p = pickSoonPhrase();
        link.style.setProperty("--portal-nav-soon-msg", JSON.stringify(p));
        link.setAttribute("title", p);
    }

    const COMING_SOON_PAGES = new Set([
        "variety.html",
        "njtw5.html",
        "concert.html",
        "albums.html",
        "map.html",
        "minister.html",
        "minister_ge.html",
    ]);

    /** 首頁僅下列錨點可點；其餘（如 #story）維持籌備中，須站主同意後才可加入 */
    const INDEX_NAV_OPEN_HASHES = new Set(["#origin", "#start", "#mission", "#timeline"]);

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

    /** 將籌備中規則套用至單一導覽列 */
    function applyComingSoonToNav(nav) {
        const pageKeysSoon = new Set(
            [...COMING_SOON_PAGES].map((p) => normalizePageKey(String(p))).filter(Boolean),
        );

        nav.querySelectorAll('a[href]').forEach((link) => {
            if (link.classList.contains("logo")) return;

            const href = link.getAttribute("href");
            if (!href || href === "#") return;

            const pageKey = normalizePageKey(href);
            if (!pageKey) return;

            if (!linkShouldBeComingSoon(href, pageKey, pageKeysSoon)) return;

            markLinkComingSoon(link, href);
        });

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

    /** 全站導覽 HTML — `rp` 為站根相對前綴；僅修改此模板即可同步所有頁面 */
    function buildPortalNavInnerHTML(rp) {
        return `
<a class="logo" target="_blank" rel="noopener noreferrer" href="${rp}index.html"><img src="${rp}assets/images/logov.svg" alt="SECHSKIES Logo"></a>
<ul>
    <li><a target="_blank" rel="noopener noreferrer" href="${rp}index.html#origin"><span class="portal-nav__label">淪陷瞬間</span><span class="portal-nav__sub">六顆永恆的水晶 · 左右命運的傳奇</span></a>
        <ul class="portal-submenu">
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}index.html#start"><span class="portal-nav__label">好奇的開端</span><span class="portal-nav__sub">從好奇觀看到淪陷的起點</span></a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}index.html#mission"><span class="portal-nav__label">成立的初衷</span><span class="portal-nav__sub">推廣部與黃色奇蹟</span></a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}index.html#timeline"><span class="portal-nav__label">跨時空軌跡</span><span class="portal-nav__sub">年表與作品節點</span></a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}index.html#story"><span class="portal-nav__label">傳奇的轉折</span><span class="portal-nav__sub">重逢與敘事主線</span></a></li>
        </ul>
    </li>
    <li><a target="_blank" rel="noopener noreferrer" href="${rp}variety/variety.html"><span class="portal-nav__label">瘋子與天才</span><span class="portal-nav__sub">EUN JI-WON × VARIETY GRAVITY</span></a>
        <ul class="portal-submenu">
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}variety/variety.html#variety"><span class="portal-nav__label">瘋狂出演中</span><span class="portal-nav__sub">綜藝鏡頭與名場面</span></a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}variety/variety.html#stage"><span class="portal-nav__label">隊長的氣場</span><span class="portal-nav__sub">控場與隊內互動</span></a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}variety/NJTW/NJTW5.html"><span class="portal-nav__label">新西遊記</span><span class="portal-nav__sub">成員介紹 · MEMBER GUIDE</span></a></li>
        </ul>
    </li>
    <li><a target="_blank" rel="noopener noreferrer" href="${rp}concert/concert.html"><span class="portal-nav__label">現場的震撼</span><span class="portal-nav__sub">SECHSKIES CONCERT ARCHIVE</span></a>
        <ul class="portal-submenu">
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}concert/concert.html#stage-now"><span class="portal-nav__label">永恆的重逢</span><span class="portal-nav__sub">近年與重聚舞台</span></a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}concert/concert.html#stage-past"><span class="portal-nav__label">燦爛的最初</span><span class="portal-nav__sub">全盛期經典場次</span></a></li>
        </ul>
    </li>
    <li><a target="_blank" rel="noopener noreferrer" href="${rp}albums/albums.html"><span class="portal-nav__label">黃色留聲機</span><span class="portal-nav__sub">YELLOW PHONOGRAPH</span></a>
        <ul class="portal-submenu">
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}albums/albums.html#new"><span class="portal-nav__label">啟動新篇章</span><span class="portal-nav__sub">重啟後作品與單曲</span></a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}albums/albums.html#classic"><span class="portal-nav__label">輝煌全盛期</span><span class="portal-nav__sub">1997–1999 年表</span></a></li>
        </ul>
    </li>
    <li><a target="_blank" rel="noopener noreferrer" href="${rp}map/map.html"><span class="portal-nav__label">聖地巡禮</span><span class="portal-nav__sub">SECHSKIES TAIWAN ARCHIVE</span></a>
        <ul class="portal-submenu">
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}map/map.html#taipei"><span class="portal-nav__label">台北聖地</span><span class="portal-nav__sub">行程與地點整理</span></a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="${rp}map/map.html#global"><span class="portal-nav__label">海外遠征</span><span class="portal-nav__sub">跨國足跡</span></a></li>
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

    const navs = Array.from(document.querySelectorAll(".portal-nav"));
    if (!navs.length) return;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navs.forEach((nav) => {
        const items = Array.from(nav.querySelectorAll("li"));
        const soonLinks = Array.from(nav.querySelectorAll('a[data-coming-soon="true"]'));

        const blockNavigation = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        soonLinks.forEach((link) => {
            link.addEventListener("click", blockNavigation);
            link.addEventListener("auxclick", blockNavigation);
        });

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

            const scheduleClose = () => {
                closeTimer = window.setTimeout(() => item.classList.remove("open"), 180);
            };

            item.addEventListener("mouseenter", openItem);
            item.addEventListener("mouseleave", scheduleClose);
            trigger.addEventListener("focus", openItem);

            trigger.addEventListener("click", (event) => {
                const isSoon = trigger.getAttribute("data-coming-soon") === "true";

                if (window.innerWidth <= 1024) {
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

        const topLevelLinks = Array.from(nav.querySelectorAll(":scope > ul > li > a[href]"));
        topLevelLinks.forEach((link) => {
            const fallback = link.getAttribute("href");
            const source = link.dataset.originalHref || fallback;
            if (!source || source === "#") return;
            if (hrefMatchesCurrentPage(source, currentPage)) {
                link.classList.add("nav-current");
            }
        });
    });
})();
