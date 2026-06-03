// 1.bind
let myQuery = document.querySelector("#concert-query");
let myMember = document.querySelector("#concert-member");
let myBtn = document.querySelector("#concert-search-btn");
let myResult = document.querySelector("#concert-search-result");

const SEARCH_LIST_MAX = 12;

function getTrackContext(trackEl) {
    const venueBlock = trackEl.closest(".track-list")?.parentElement;
    const tourCard = trackEl.closest(".con-1, .con-2, .con-3, .con-4");
    return {
        trackName: trackEl.textContent.trim(),
        tourTitle: tourCard?.querySelector(".title")?.textContent.trim().replace(/\s+/g, " ") || "",
        location: venueBlock?.querySelector(".location")?.textContent.trim() || ""
    };
}

function findMatchingTracks(keyword, member) {
    const tracks = document.querySelectorAll(".track-item .track");
    const k = keyword.trim().toLowerCase();
    const m = member.trim().toLowerCase();
    const hits = [];

    tracks.forEach(function (trackEl) {
        const text = trackEl.textContent.toLowerCase();
        const matchKeyword = !k || text.includes(k);
        const matchMember = !m || text.includes(m);
        if (matchKeyword && matchMember) {
            hits.push({
                el: trackEl.closest(".track-item"),
                ...getTrackContext(trackEl)
            });
        }
    });

    return hits;
}

function clearSearchHighlights() {
    document.querySelectorAll(".track-item.is-search-hit").forEach(function (item) {
        item.classList.remove("is-search-hit");
    });
}

function renderSearchResults(getQuery, getMember, hits) {
    if (!myResult) return;

    clearSearchHighlights();

    const summary = document.createElement("p");
    summary.className = "concert-search-summary";

    if (!hits.length) {
        summary.textContent = `關鍵字「${getQuery || "（未填）"}」${getMember.trim() ? `、成員「${getMember}」` : ""}：沒有比對到曲目，請換字再試。`;
        myResult.replaceChildren(summary);
        return;
    }

    if (getMember.trim()) {
        summary.textContent = `關鍵字「${getQuery || "（未填）"}」、成員「${getMember}」：共 ${hits.length} 筆，以下列出前 ${Math.min(hits.length, SEARCH_LIST_MAX)} 筆。`;
    } else {
        summary.textContent = `關鍵字「${getQuery}」：共 ${hits.length} 筆，以下列出前 ${Math.min(hits.length, SEARCH_LIST_MAX)} 筆。`;
    }

    const list = document.createElement("ul");
    list.className = "concert-search-hits";

    hits.slice(0, SEARCH_LIST_MAX).forEach(function (hit) {
        if (hit.el) hit.el.classList.add("is-search-hit");

        const li = document.createElement("li");
        const trackLine = document.createElement("span");
        trackLine.className = "hit-track";
        trackLine.textContent = hit.trackName;

        const metaLine = document.createElement("span");
        metaLine.className = "hit-meta";
        metaLine.textContent = [hit.tourTitle, hit.location].filter(Boolean).join(" · ");

        li.appendChild(trackLine);
        if (metaLine.textContent) li.appendChild(metaLine);
        list.appendChild(li);
    });

    if (hits.length > SEARCH_LIST_MAX) {
        const more = document.createElement("li");
        more.className = "hit-more";
        more.textContent = `另有 ${hits.length - SEARCH_LIST_MAX} 筆未顯示，請縮小關鍵字。`;
        list.appendChild(more);
    }

    myResult.replaceChildren(summary, list);

    const firstHit = hits[0]?.el;
    if (firstHit) {
        firstHit.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

// 2.action
if (myBtn && myResult) {
    myBtn.addEventListener("click", function () {
        let getQuery = myQuery ? myQuery.value : "";
        let getMember = myMember ? myMember.value : "";

        if (!getQuery.trim() && !getMember.trim()) {
            myResult.replaceChildren();
            const summary = document.createElement("p");
            summary.className = "concert-search-summary";
            summary.textContent = "請至少輸入曲目／場次，或成員其中一項。";
            myResult.appendChild(summary);
            clearSearchHighlights();
            return;
        }

        const hits = findMatchingTracks(getQuery, getMember);
        renderSearchResults(getQuery, getMember, hits);
    });
}
