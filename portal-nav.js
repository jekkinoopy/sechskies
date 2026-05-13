(() => {
    /** 全站導覽 HTML — 僅修改此字串即可同步所有頁面 */
    const PORTAL_NAV_INNER_HTML = `
<a class="logo" href="index.html"><img src="./img/logov.svg" alt="SECHSKIES Logo"></a>
<ul>
    <li><a href="index.html#origin">淪陷瞬間</a>
        <ul class="portal-submenu">
            <li><a href="index.html#start">好奇的開端</a></li>
            <li><a href="index.html#mission">成立的初衷</a></li>
            <li><a href="index.html#timeline">跨時空軌跡</a></li>
            <li><a href="index.html#story">傳奇的轉折</a></li>
            <li><a href="chronicle.html">傳奇紀實長卷</a></li>
            <li><a href="ssg2-ebook.html">六六歌2 電子書</a></li>
        </ul>
    </li>
    <li><a href="jiwon.html">瘋子與天才</a>
        <ul class="portal-submenu">
            <li><a href="jiwon.html#variety">瘋狂出演中</a></li>
            <li><a href="jiwon.html#stage">隊長的氣場</a></li>
        </ul>
    </li>
    <li><a href="sunghoon.html">消失的真相</a>
        <ul class="portal-submenu">
            <li><a href="sunghoon.html#truth">還原那場雨</a></li>
            <li><a href="sunghoon.html#voice">被掩蓋的主唱</a></li>
        </ul>
    </li>
    <li><a href="concert.html">現場的震撼</a>
        <ul class="portal-submenu">
            <li><a href="concert.html#stage-now">永恆的重逢</a></li>
            <li><a href="concert.html#stage-past">燦爛的最初</a></li>
        </ul>
    </li>
    <li><a href="archive.html">黃色留聲機</a>
        <ul class="portal-submenu">
            <li><a href="archive.html#new">啟動新篇章</a></li>
            <li><a href="archive.html#classic">輝煌全盛期</a></li>
        </ul>
    </li>
    <li><a href="map.html">聖地巡禮</a>
        <ul class="portal-submenu">
            <li><a href="map.html#taipei">台北聖地</a></li>
            <li><a href="map.html#global">海外遠征</a></li>
        </ul>
    </li>
</ul>
`.trim();

    document.querySelectorAll("nav.portal-nav[data-portal-nav]").forEach((nav) => {
        nav.innerHTML = PORTAL_NAV_INNER_HTML;
    });

    const navs = Array.from(document.querySelectorAll(".portal-nav"));
    if (!navs.length) return;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navs.forEach((nav) => {
        const items = Array.from(nav.querySelectorAll("li"));
        const soonLinks = Array.from(nav.querySelectorAll('a[data-coming-soon="true"]'));

        soonLinks.forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
            });
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
                if (window.innerWidth <= 1024) {
                    event.preventDefault();
                    item.classList.toggle("open");
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
            const href = link.getAttribute("href");
            if (!href) return;
            const [file] = href.split("#");
            if (file === currentPage) {
                link.classList.add("nav-current");
            }
        });
    });
})();
