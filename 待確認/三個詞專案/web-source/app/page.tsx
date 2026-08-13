"use client";

import { useState } from "react";

const moments = [
  { year: "2016.10.07", title: "重新相遇", text: "睽違十六年後，SECHSKIES 以〈세 단어 (THREE WORDS)〉帶回重逢的聲音。" },
  { year: "2026.10.07", title: "十年以後", text: "旋律走過十年，當時的感動仍停在現在、這裡、我們之間。" },
];

const stages = [
  {
    date: "2016.12.04",
    videoId: "8HTqr3Wp-R0",
    station: "SBS",
    program: "인기가요 · Inkigayo",
    note: "THREE WORDS · Goodbye Stage",
  },
];

export default function Home() {
  const [lit, setLit] = useState(false);

  function downloadPoster() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const glow = ctx.createRadialGradient(780, 300, 10, 780, 300, 900);
    glow.addColorStop(0, "#e0a16b");
    glow.addColorStop(.34, "#264765");
    glow.addColorStop(1, "#07101d");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1080, 1350);
    ctx.strokeStyle = "rgba(255,255,255,.45)";
    ctx.lineWidth = 2;
    [150, 390, 630].forEach((x, index) => {
      ctx.strokeRect(x, 180 + index * 70, 420, 660);
    });
    ctx.fillStyle = "#f5efe2";
    ctx.font = "700 106px Arial";
    ctx.fillText("THREE", 72, 980);
    ctx.fillText("WORDS", 72, 1085);
    ctx.fillStyle = "#efb53f";
    ctx.font = "700 36px Arial";
    ctx.fillText("10TH ANNIVERSARY", 76, 1155);
    ctx.fillStyle = "#f5efe2";
    ctx.font = "30px Arial";
    ctx.fillText("2016.10.07 — 2026.10.07", 76, 1225);
    ctx.font = "26px Arial";
    ctx.fillText("NOW · HERE · US", 76, 1285);
    const link = document.createElement("a");
    link.download = "three-words-10th-anniversary.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <main>
      <section className={`hero ${lit ? "isLit" : ""}`}>
        <nav>
          <span className="logo">3W<span>10</span></span>
          <span>2016 — 2026</span>
        </nav>

        <div className="light" aria-hidden="true" />
        <div className="frames" aria-hidden="true"><i /><i /><i /></div>
        <div className="noise" aria-hidden="true" />

        <div className="heroText">
          <p className="kicker">SECHSKIES · 세 단어</p>
          <h1><span>THREE</span><span className="outline">WORDS</span></h1>
          <div className="anniversary"><strong>10</strong><p>TH<br />ANNIVERSARY</p></div>
          <p className="dates">2016.10.07 <b>—</b> 2026.10.07</p>
          <div className="actions">
            <button className="primary" onClick={() => setLit(!lit)}>{lit ? "讓記憶停在這裡" : "點亮第十年的光"} <span>✦</span></button>
            <button className="secondary" onClick={downloadPoster}>下載 IG 紀念圖 ↓</button>
          </div>
        </div>
        <div className="threeDots"><b /><b /><b /></div>
      </section>

      <section className="statement">
        <p className="sectionTag">01 / TEN YEARS LATER</p>
        <div>
          <p className="hangul">지금 · 여기 · 우리</p>
          <h2>現在。這裡。我們。</h2>
          <p className="bigCopy">有些歌不只是被聽見，<br />而是替一段等待留下名字。</p>
        </div>
      </section>

      <section className="words">
        <p className="sectionTag">02 / THREE WORDS</p>
        <div className="wordGrid">
          <article><span>01</span><h3>NOW</h3><p>十年後的此刻，重新按下播放。</p></article>
          <article><span>02</span><h3>HERE</h3><p>回到那個讓我們再次相遇的地方。</p></article>
          <article><span>03</span><h3>US</h3><p>歌曲仍在，我們也仍然在這裡。</p></article>
        </div>
      </section>

      <section className="lyricsPreview">
        <div className="lyricsMeta">
          <p className="sectionTag">03 / LYRICS PREVIEW</p>
          <span>세 단어<br />THREE WORDS</span>
        </div>
        <div className="lyricsLines">
          <p>I just wanna be with you</p>
          <p>내가 사는 이유</p>
          <p>다시는 멀리 가지 않을게요</p>
          <p>I&apos;ll always be here for you</p>
          <p>세월이 지난 후</p>
          <a href="https://jekkinoopy.github.io/sechskies/extra/lyrics.html" target="_blank" rel="noreferrer">完整歌詞與歌曲資料 <span>↗</span></a>
        </div>
      </section>

      <section className="memory">
        <p className="sectionTag">04 / FROM THEN TO NOW</p>
        {moments.map((moment) => <article key={moment.year}><strong>{moment.year}</strong><div><h3>{moment.title}</h3><p>{moment.text}</p></div></article>)}
      </section>

      <section className="video">
        <div className="videoHeading">
          <p className="sectionTag">OFFICIAL MUSIC VIDEO</p>
          <h2>再聽一次，<br />十年前的三個詞。</h2>
          <a href="https://www.youtube.com/watch?v=m7Zt_p9S-yg" target="_blank" rel="noreferrer">在 YouTube 開啟 ↗</a>
        </div>
        <div className="videoFrame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/m7Zt_p9S-yg?rel=0"
            title="SECHSKIES - 세 단어 (THREE WORDS) Official Music Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      <section className="stageArchive">
        <div className="stageIntro">
          <p className="sectionTag">05 / MUSIC SHOW ARCHIVE</p>
          <h2>打歌舞台</h2>
          <p>把當年的舞台依日期收好，從十年前重新播放。</p>
        </div>
        <div className="stageTable" role="table" aria-label="THREE WORDS 打歌舞台列表">
          <div className="stageHead" role="row">
            <span role="columnheader">DATE</span>
            <span role="columnheader">VIDEO</span>
            <span role="columnheader">STATION</span>
          </div>
          {stages.map((stage) => (
            <div className="stageRow" role="row" key={stage.videoId}>
              <time role="cell" dateTime={stage.date}>{stage.date}</time>
              <a className="stageVideo" role="cell" href={`https://www.youtube.com/watch?v=${stage.videoId}`} target="_blank" rel="noreferrer">
                <span className="stageThumb">
                  <img src={`https://i.ytimg.com/vi/${stage.videoId}/hqdefault.jpg`} alt={`${stage.program} ${stage.note} 影片縮圖`} />
                  <b>▶</b>
                </span>
                <span><strong>{stage.note}</strong><small>WATCH ON YOUTUBE ↗</small></span>
              </a>
              <div className="station" role="cell"><strong>{stage.station}</strong><span>{stage.program}</span></div>
            </div>
          ))}
        </div>
      </section>

      <footer><span>FAN-MADE 10TH ANNIVERSARY TRIBUTE</span><span>SECHSKIES · THREE WORDS · 2016—2026</span></footer>
    </main>
  );
}
