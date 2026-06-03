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

function expandVenueForTrackItem(trackItem) {
    const venueBlock = trackItem?.closest(".track-list")?.parentElement;
    const expand = venueBlock?.querySelector(".expand-trigger");
    if (expand) {
        expand.checked = true;
    }
}

function jumpToTrackHit(hit) {
    if (!hit?.el) return;

    clearSearchHighlights();
    expandVenueForTrackItem(hit.el);
    hit.el.classList.add("is-search-hit");
    hit.el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setActiveSearchHit(container, activeEl) {
    if (!container) return;
    container.querySelectorAll(".concert-search-hit-jump").forEach(function (item) {
        item.classList.remove("is-active");
    });
    if (activeEl) activeEl.classList.add("is-active");
}

function createSearchHitVenue(hit) {
    const venue = document.createElement("div");
    venue.className = "con-yk-1";

    const locText = [hit.tourTitle, hit.location].filter(Boolean).join(" · ");
    if (locText) {
        const loc = document.createElement("span");
        loc.className = "location";
        loc.textContent = locText;
        venue.appendChild(loc);
    }

    const trackList = document.createElement("div");
    trackList.className = "track-list";
    const trackItem = document.createElement("div");
    trackItem.className = "track-item";
    const trackSpan = document.createElement("span");
    trackSpan.className = "track";
    trackSpan.textContent = hit.trackName;
    trackItem.appendChild(trackSpan);
    trackList.appendChild(trackItem);
    venue.appendChild(trackList);

    return venue;
}

function bindSearchHitJump(venueEl, hit, container) {
    venueEl.classList.add("concert-search-hit-jump");
    venueEl.setAttribute("role", "button");
    venueEl.setAttribute("tabindex", "0");
    venueEl.setAttribute("aria-label", `跳到曲目：${hit.trackName}`);

    function go() {
        setActiveSearchHit(container, venueEl);
        jumpToTrackHit(hit);
    }

    venueEl.addEventListener("click", go);
    venueEl.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            go();
        }
    });
}

function renderSearchResults(getQuery, getMember, hits) {
    if (!myResult) return;

    clearSearchHighlights();

    const summary = document.createElement("p");
    summary.className = "concert-search-summary";

    if (!hits.length) {
        summary.textContent = `曲目或場次「${getQuery || "（未填）"}」${getMember.trim() ? `、成員「${getMember}」` : ""}：沒有比對到曲目，請換字再試。`;
        myResult.replaceChildren(summary);
        return;
    }

    if (getMember.trim()) {
        summary.textContent = `曲目或場次「${getQuery || "（未填）"}」、成員「${getMember}」：共 ${hits.length} 筆。請點列表中的場次，再跳到下方歌單。`;
    } else {
        summary.textContent = `曲目或場次「${getQuery}」：共 ${hits.length} 筆。請點列表中的場次，再跳到下方歌單。`;
    }

    const hitsWrap = document.createElement("div");
    hitsWrap.className = "concert-search-hits";

    const mirrorCard = document.createElement("div");
    mirrorCard.className = "con-1 concert-search-mirror-card";

    hits.slice(0, SEARCH_LIST_MAX).forEach(function (hit) {
        const venue = createSearchHitVenue(hit);
        bindSearchHitJump(venue, hit, mirrorCard);
        mirrorCard.appendChild(venue);
    });

    hitsWrap.appendChild(mirrorCard);

    if (hits.length > SEARCH_LIST_MAX) {
        const more = document.createElement("p");
        more.className = "concert-search-more";
        more.textContent = `另有 ${hits.length - SEARCH_LIST_MAX} 筆未顯示，請縮小曲目或場次。`;
        hitsWrap.appendChild(more);
    }

    myResult.replaceChildren(summary, hitsWrap);
}

function runSearch() {
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
}

function handleSearchEnter(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    runSearch();
}

// 2.action
if (myBtn && myResult) {
    myBtn.addEventListener("click", runSearch);

    if (myQuery) {
        myQuery.addEventListener("keydown", handleSearchEnter);
    }
    if (myMember) {
        myMember.addEventListener("keydown", handleSearchEnter);
    }
}
