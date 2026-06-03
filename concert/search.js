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

function scrollToSearchResults() {
    if (!myResult) return;
    myResult.scrollIntoView({ behavior: "smooth", block: "start" });
}

function jumpToTrackHit(hit) {
    if (!hit?.el) return;

    clearSearchHighlights();
    expandVenueForTrackItem(hit.el);
    hit.el.classList.add("is-search-hit");
    hit.el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setActiveSearchListItem(list, activeLi) {
    if (!list) return;
    list.querySelectorAll(".concert-search-hit-jump").forEach(function (item) {
        item.classList.remove("is-active");
    });
    if (activeLi) activeLi.classList.add("is-active");
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
        summary.textContent = `曲目或場次「${getQuery || "（未填）"}」、成員「${getMember}」：共 ${hits.length} 筆。點任一列可跳到歌單。`;
    } else {
        summary.textContent = `曲目或場次「${getQuery}」：共 ${hits.length} 筆。點任一列可跳到歌單。`;
    }

    const list = document.createElement("ul");
    list.className = "concert-search-hits";

    hits.slice(0, SEARCH_LIST_MAX).forEach(function (hit) {
        if (hit.el) hit.el.classList.add("is-search-hit");

        const li = document.createElement("li");
        li.className = "concert-search-hit-jump";
        li.setAttribute("role", "button");
        li.setAttribute("tabindex", "0");
        li.setAttribute("aria-label", `跳到曲目：${hit.trackName}`);

        const trackLine = document.createElement("span");
        trackLine.className = "hit-track";
        trackLine.textContent = hit.trackName;

        const metaLine = document.createElement("span");
        metaLine.className = "hit-meta";
        metaLine.textContent = [hit.tourTitle, hit.location].filter(Boolean).join(" · ");

        li.appendChild(trackLine);
        if (metaLine.textContent) li.appendChild(metaLine);

        li.addEventListener("click", function () {
            jumpToTrackHit(hit);
        });
        li.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                jumpToTrackHit(hit);
            }
        });

        list.appendChild(li);
    });

    if (hits.length > SEARCH_LIST_MAX) {
        const more = document.createElement("li");
        more.className = "hit-more";
        more.textContent = `另有 ${hits.length - SEARCH_LIST_MAX} 筆未顯示，請縮小曲目或場次。`;
        list.appendChild(more);
    }

    myResult.replaceChildren(summary, list);

    jumpToTrackHit(hits[0]);
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
