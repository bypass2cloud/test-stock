import { NextResponse } from "next/server";

const quoteNames: Record<string, { name: string; color: string }> = {
  "005930": { name: "삼성전자", color: "#2563eb" },
  "000660": { name: "SK하이닉스", color: "#7c3aed" },
  "035420": { name: "NAVER", color: "#ef4444" },
};
type KisQuote = { stck_prpr?: string; prdy_ctrt?: string; prdy_vrss_sign?: string; hts_kor_isnm?: string };
let cachedToken: { value: string; expiresAt: number } | null = null;
async function kisFailure(response: Response, fallback: string) {
  const raw = await response.text();
  try {
    const payload = JSON.parse(raw) as { msg1?: string; error_description?: string; error?: string };
    return payload.msg1 || payload.error_description || payload.error || `${fallback} (${response.status})`;
  } catch { return `${fallback} (${response.status})`; }
}
async function accessToken(appKey: string, appSecret: string, baseUrl: string) {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  const response = await fetch(`${baseUrl}/oauth2/tokenP`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ grant_type: "client_credentials", appkey: appKey, appsecret: appSecret }) });
  if (!response.ok) throw new Error(await kisFailure(response, "인증 토큰을 발급하지 못했습니다"));
  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) throw new Error("인증 토큰이 비어 있습니다.");
  cachedToken = { value: body.access_token, expiresAt: Date.now() + 23 * 60 * 60 * 1000 };
  return body.access_token;
}
export async function GET(request: Request) {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;
  if (!appKey || !appSecret) return NextResponse.json({ configured: false, message: "KIS API 키를 설정하면 실시간 시세를 표시합니다." }, { status: 503 });
  const baseUrl = process.env.KIS_BASE_URL || "https://openapi.koreainvestment.com:9443";
  const requested = new URL(request.url).searchParams.get("symbols") || "005930,000660,035420";
  const symbols = requested.split(",").map((value) => value.trim()).filter((value) => /^\d{6}$/.test(value)).slice(0, 10);
  try {
    const token = await accessToken(appKey, appSecret, baseUrl);
    const quotes = [];
    for (const [index, symbol] of symbols.entries()) {
      if (index > 0) await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await fetch(`${baseUrl}/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${symbol}`, { headers: { authorization: `Bearer ${token}`, appkey: appKey, appsecret: appSecret, tr_id: "FHKST01010100" } });
      if (!response.ok) throw new Error(await kisFailure(response, `${symbol} 시세를 불러오지 못했습니다`));
      const body = (await response.json()) as { output?: KisQuote; rt_cd?: string; msg1?: string };
      if (body.rt_cd !== "0" || !body.output) throw new Error(body.msg1 || `${symbol} 시세 응답 오류`);
      const output = body.output;
      const rate = Number(output.prdy_ctrt || 0);
      const sign = output.prdy_vrss_sign === "5" || output.prdy_vrss_sign === "4" ? -1 : 1;
      quotes.push({ code: symbol, name: output.hts_kor_isnm || quoteNames[symbol]?.name || symbol, price: Number(output.stck_prpr || 0).toLocaleString("ko-KR"), change: `${sign < 0 ? "−" : "+"}${Math.abs(rate).toFixed(2)}%`, color: quoteNames[symbol]?.color || "#2563eb" });
    }
    return NextResponse.json({ configured: true, updatedAt: new Date().toISOString(), quotes }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "시세를 불러오지 못했습니다.";
    return NextResponse.json({ configured: true, message }, { status: 502 });
  }
}
