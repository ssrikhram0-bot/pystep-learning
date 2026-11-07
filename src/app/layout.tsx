import type { Metadata, Viewport } from "next";
import { Prompt, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "../context/GameContext";

const promptFont = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "PyStep — Python Code Learning & Game",
  description: "เรียนรู้การเขียนโค้ดภาษา Python แบบ Step-by-Step พร้อม Interactive Code Editor และมินิเกมสุดสนุก รองรับมือถือ แท็บเล็ต โน้ตบุ๊ก และคอมพิวเตอร์",
  applicationName: "PyStep",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PyStep",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${promptFont.variable} ${jetbrainsMono.variable}`}>
      <body className={`${promptFont.className} antialiased`}>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
