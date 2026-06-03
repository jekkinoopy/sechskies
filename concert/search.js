// 1.bind
let myQuery = document.querySelector("#concert-query");
let myMember = document.querySelector("#concert-member");
let myBtn = document.querySelector("#concert-search-btn");
let mySpan = document.querySelector("#concert-search-result");

console.log("myQuery", myQuery);
console.log("myMember", myMember);
console.log("myBtn", myBtn);
console.log("mySpan", mySpan);

function countMatchingTracks(keyword, member) {
    const tracks = document.querySelectorAll(".track-item .track");
    const k = keyword.trim().toLowerCase();
    const m = member.trim().toLowerCase();
    let count = 0;

    tracks.forEach(function (trackEl) {
        const text = trackEl.textContent.toLowerCase();
        const matchKeyword = !k || text.includes(k);
        const matchMember = !m || text.includes(m);
        if (matchKeyword && matchMember) {
            count += 1;
        }
    });

    return count;
}

// 2.action
if (myBtn && mySpan) {
    myBtn.addEventListener("click", function () {
        console.log("myBtn", myBtn);

        // 1.抓 input
        let getQuery = myQuery ? myQuery.value : "";
        let getMember = myMember ? myMember.value : "";
        console.log("getQuery", getQuery);
        console.log("getMember", getMember);

        if (!getQuery.trim() && !getMember.trim()) {
            mySpan.innerText = "請至少輸入曲目／場次，或成員其中一項。";
            return;
        }

        const count = countMatchingTracks(getQuery, getMember);

        // 2.組成 text
        let tmpText;
        if (getMember.trim()) {
            tmpText = `關鍵字「${getQuery || "（未填）"}」、成員「${getMember}」：在巡迴歌單中共 ${count} 筆曲目。`;
        } else {
            tmpText = `關鍵字「${getQuery}」：在巡迴歌單中共 ${count} 筆曲目。`;
        }
        console.log("tmpText", tmpText);

        // 3.顯示在 span
        mySpan.innerText = tmpText;
    });
}
