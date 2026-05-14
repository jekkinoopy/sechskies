(() => {
    /**
     * ── 導覽「尚未開放」連結 ─────────────────────────────────────────
     * ① 整個檔案先關：COMING_SOON_PAGES（目前已含志源頁／演唱會／典藏／地圖／視覺進化論等）。
     * ② index.html 細到錨點：INDEX_NAV_OPEN_HASHES。
     * ③ 文案 NAV_SOON_PHRASES：每次「滑過或鍵盤聚焦」連結時隨機擇一句（不交錯只靠重整）。
     *    浮層、title 與該次互動同步；無障礙用語固定為「尚無開放」（避免標籤隨機跳動）。
     * 要調整詞句：改 NAV_SOON_PHRASES 即可。
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
        "jiwon.html",
        "concert.html",
        "albums.html",
        "map.html",
        "minister.html",
        "minister_ge.html",
    ]);

    /** 目前先開：淪陷瞬間 #origin + 子選單三項 #start / #mission / #timeline */
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
        const visibleTitle = link.textContent.trim();
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
     * 子資料夾內頁面之導覽連結必須帶此前綴，否則 `./img`、`index.html` 會錯層。
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
<a class="logo" href="${rp}index.html"><img src="${rp}img/logov.svg" alt="SECHSKIES Logo"></a>
<ul>
    <li><a href="${rp}index.html#origin">淪陷瞬間</a>
        <ul class="portal-submenu">
            <li><a href="${rp}index.html#start">好奇的開端</a></li>
            <li><a href="${rp}index.html#mission">成立的初衷</a></li>
            <li><a href="${rp}index.html#timeline">跨時空軌跡</a></li>
            <li><a href="${rp}index.html#story">傳奇的轉折</a></li>
        </ul>
    </li>
    <li><a href="${rp}jiwon/jiwon.html">瘋子與天才</a>
        <ul class="portal-submenu">
            <li><a href="${rp}jiwon/jiwon.html#variety">瘋狂出演中</a></li>
            <li><a href="${rp}jiwon/jiwon.html#stage">隊長的氣場</a></li>
        </ul>
    </li>
    <li><a href="${rp}concert/concert.html">現場的震撼</a>
        <ul class="portal-submenu">
            <li><a href="${rp}concert/concert.html#stage-now">永恆的重逢</a></li>
            <li><a href="${rp}concert/concert.html#stage-past">燦爛的最初</a></li>
        </ul>
    </li>
    <li><a href="${rp}albums/albums.html">黃色留聲機</a>
        <ul class="portal-submenu">
            <li><a href="${rp}albums/albums.html#new">啟動新篇章</a></li>
            <li><a href="${rp}albums/albums.html#classic">輝煌全盛期</a></li>
        </ul>
    </li>
    <li><a href="${rp}map/map.html">聖地巡禮</a>
        <ul class="portal-submenu">
            <li><a href="${rp}map/map.html#taipei">台北聖地</a></li>
            <li><a href="${rp}map/map.html#global">海外遠征</a></li>
        </ul>
    </li>
</ul>
`.trim();
    }

    const rootPrefix = portalNavRootPrefix();
    document.querySelectorAll("nav.portal-nav[data-portal-nav]").forEach((nav) => {
        nav.innerHTML = buildPortalNavInnerHTML(rootPrefix);
        applyComingSoonToNav(nav);
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
