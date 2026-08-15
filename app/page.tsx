"use client";

import { useEffect, useMemo, useState } from "react";

const holdings = [
  { code: "005930", name: "삼성전자", price: "78,400", change: "+1.42%", value: "3,920,000", gain: "+8.14%", color: "#2563eb" },
  { code: "000660", name: "SK하이닉스", price: "214,500", change: "+3.12%", value: "2,145,000", gain: "+18.86%", color: "#7c3aed" },
  { code: "035420", name: "NAVER", price: "184,900", change: "−0.54%", value: "1,849,000", gain: "−2.67%", color: "#ef4444" },
];
const news = [
  { time: "10:14", tag: "공시", title: "삼성전자, 2분기 잠정실적 발표 예정", detail: "8월 28일 실적 컨퍼런스콜", tone: "blue" },
  { time: "09:42", tag: "뉴스", title: "반도체 업황 회복 기대감에 대형주 강세", detail: "외국인 순매수 1,820억 원", tone: "violet" },
  { time: "어제", tag: "리포트", title: "NAVER 목표주가 하향 조정", detail: "광고 회복 속도 주시", tone: "orange" },
];

export default function Home() {
  const [tab, setTab] = useState("대시보드");
  const [watching, setWatching] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [liveQuotes, setLiveQuotes] = useState(holdings);
  const [quoteStatus, setQuoteStatus] = useState("데모 데이터");
  const searched = useMemo(() => liveQuotes.find((item) => item.name.includes(query) || item.code.includes(query)), [query, liveQuotes]);
  function showToast(message: string) { setToast(message); window.setTimeout(() => setToast(""), 2200); }
  async function refreshQuotes() {
    setQuoteStatus("불러오는 중");
    try {
      const response = await fetch("/api/quotes?symbols=005930,000660,035420");
      const data = await response.json() as { message?: string; quotes?: typeof holdings };
      if (!response.ok || !data.quotes) throw new Error(data.message || "시세를 불러오지 못했습니다.");
      setLiveQuotes(data.quotes.map((quote, index) => ({ ...holdings[index], ...quote })));
      setQuoteStatus("KIS 실시간 시세");
    } catch (error) { setQuoteStatus("데모 데이터"); showToast(error instanceof Error ? error.message : "시세를 불러오지 못했습니다."); }
  }
  useEffect(() => { void refreshQuotes(); }, []);

  return <main>
    <aside className="sidebar"><div className="brand"><span className="brand-mark">ㅅ</span><span>시그널</span></div><p className="brand-caption">KOREA STOCKS</p>
      <nav>{["대시보드", "관심종목", "포트폴리오", "공시 · 뉴스"].map((item) => <button key={item} onClick={() => setTab(item)} className={tab === item ? "nav-item active" : "nav-item"}><span>{item === "대시보드" ? "◫" : item === "관심종목" ? "☆" : item === "포트폴리오" ? "◔" : "▤"}</span>{item}</button>)}</nav>
      <div className="sidebar-bottom"><button className="new-note" onClick={() => showToast("새 투자 노트를 열었습니다.")}>＋ 투자 노트</button><p>데이터는 투자 참고용이며<br />투자 권유가 아닙니다.</p></div>
    </aside>
    <section className="content"><header><div><p className="eyebrow">2026년 8월 15일 · 금요일</p><h1>{tab === "대시보드" ? "좋은 아침이에요, 해리님" : tab}</h1></div><div className="header-actions"><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="종목명 또는 코드 검색" /></label><button aria-label="알림" className="icon-button" onClick={() => showToast("새 알림이 없습니다.")}>♧</button><div className="avatar">H</div></div></header>
      {query && <div className="search-result">{searched ? <><b>{searched.name}</b> · {searched.code} <span className="up">{searched.change}</span></> : "검색 결과가 없습니다."}</div>}
      <section className="market-strip"><div><span>코스피</span><strong>2,734.36</strong><em className="up">+0.86%</em></div><i/><div><span>코스닥</span><strong>885.72</strong><em className="up">+1.24%</em></div><i/><div><span>원/달러</span><strong>1,372.80</strong><em className="down">+0.17%</em></div><p>장 마감까지 <b>05:42:18</b></p></section>
      <section className="hero-grid"><article className="portfolio-card"><div className="card-top"><div><p>내 포트폴리오</p><h2>₩ 8,214,000</h2><span className="portfolio-rise">▲ ₩ 642,000 <b>+8.48%</b></span></div><button onClick={() => setTab("포트폴리오")}>자세히 보기 →</button></div><div className="chart-wrap"><div className="chart-labels"><span>8.6M</span><span>8.2M</span><span>7.8M</span></div><svg viewBox="0 0 620 150" role="img" aria-label="포트폴리오 수익 추이"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#60a5fa" stopOpacity=".35"/><stop offset="1" stopColor="#60a5fa" stopOpacity="0"/></linearGradient></defs><path d="M0,122 C35,112 52,121 81,99 S126,112 151,76 S198,96 222,86 S256,50 281,63 S323,91 351,66 S395,77 428,33 S475,66 505,43 S554,45 620,10 L620,150 L0,150Z" fill="url(#area)"/><path d="M0,122 C35,112 52,121 81,99 S126,112 151,76 S198,96 222,86 S256,50 281,63 S323,91 351,66 S395,77 428,33 S475,66 505,43 S554,45 620,10" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/></svg><div className="months"><span>3월</span><span>4월</span><span>5월</span><span>6월</span><span>7월</span><span>8월</span></div></div></article><article className="insight-card"><div className="sparkle">✦</div><p className="eyebrow">오늘의 AI 인사이트</p><h3>반도체, 실적 개선의<br/>초입을 지나는 중</h3><p>메모리 가격 반등과 출하량 증가가 동시에 나타나고 있어요.</p><button onClick={() => showToast("AI 분석은 준비 중입니다.")}>분석 읽기 →</button><span className="orb orb-one"/><span className="orb orb-two"/></article></section>
      <section className="section-heading"><div><p className="eyebrow">WATCHLIST · <span className={quoteStatus === "KIS 실시간 시세" ? "live-status" : ""}>{quoteStatus}</span></p><h2>관심종목</h2></div><div className="quote-actions"><button className="text-button" onClick={() => void refreshQuotes()}>↻ 새로고침</button><button className="text-button" onClick={() => setWatching(!watching)}>{watching ? "관심종목 닫기" : "종목 추가 ＋"}</button></div></section>{watching && <div className="add-stock"><input placeholder="예: 005930 또는 삼성전자" /><button onClick={() => {setWatching(false); showToast("관심종목에 추가했습니다.");}}>추가</button></div>}
      <section className="stock-table"><div className="table-head"><span>종목</span><span>현재가</span><span>등락률</span><span>평가금액</span><span>수익률</span><span/></div>{liveQuotes.map((item) => <div className="stock-row" key={item.code}><span className="stock-name"><b className="stock-icon" style={{background:item.color}}>{item.name[0]}</b><span><strong>{item.name}</strong><small>{item.code}</small></span></span><strong>{item.price}<small>원</small></strong><b className={item.change.startsWith("−") ? "down" : "up"}>{item.change}</b><span>{item.value}<small>원</small></span><b className={item.gain.startsWith("−") ? "down" : "up"}>{item.gain}</b><button onClick={() => showToast(`${item.name} 상세 분석을 준비 중입니다.`)}>›</button></div>)}</section>
      <section className="lower-grid"><article className="news-card"><div className="section-heading"><div><p className="eyebrow">MARKET PULSE</p><h2>공시 · 뉴스</h2></div><button className="text-button" onClick={() => setTab("공시 · 뉴스")}>전체 보기 →</button></div>{news.map((item) => <div className="news-row" key={item.title}><time>{item.time}</time><span className={`tag ${item.tone}`}>{item.tag}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></div>)}</article><article className="note-card"><p className="eyebrow">INVESTMENT NOTE</p><h3>이번 분기 투자 가설을<br/>점검할 시간이에요.</h3><p>매수 이유와 리스크를 기록하면 감정적인 판단을 줄일 수 있어요.</p><button onClick={() => showToast("투자 노트를 작성해보세요.")}>노트 작성하기</button></article></section>
    </section>{toast && <div className="toast">✓ {toast}</div>}</main>;
}
