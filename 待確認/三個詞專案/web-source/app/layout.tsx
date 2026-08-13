import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THREE WORDS · 10th Anniversary",
  description: "SECHSKIES〈세 단어 (THREE WORDS)〉發行十週年紀念頁：2016.10.07—2026.10.07。",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "THREE WORDS · 10th Anniversary",
    description: "現在、這裡、我們。十年後，再次相遇。",
    images: [{ url: "/og.png", width: 1536, height: 1024 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
