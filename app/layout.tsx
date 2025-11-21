import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://digitexa.biz.id'),
  title: "TopUpKilat - Top Up Game & E-Wallet Tercepat",
  description: "Top up game favorit dan e-wallet dalam hitungan menit. Bayar via QRIS, e-wallet, atau transfer bank. Harga transparan, proses otomatis!",
  keywords: "top up game, top up ml, top up ff, top up pubg, top up genshin, e-wallet, shopeepay, dana, ovo, gopay",
  authors: [{ name: "TopUpKilat" }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/logo.png',
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://digitexa.biz.id",
    title: "TopUpKilat - Top Up Game & E-Wallet Tercepat",
    description: "Top up game favorit dan e-wallet dalam hitungan menit",
    siteName: "TopUpKilat",
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'TopUpKilat Logo' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
