import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "시그널 | 한국 주식 투자 분석",
  description: "한국 주식 투자자를 위한 포트폴리오, 관심종목, 공시·뉴스 대시보드",
  openGraph: { title: "시그널 | 한국 주식 투자 분석", description: "한국 주식 투자자를 위한 포트폴리오, 관심종목, 공시·뉴스 대시보드", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "시그널 | 한국 주식 투자 분석", description: "한국 주식 투자자를 위한 포트폴리오, 관심종목, 공시·뉴스 대시보드", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
