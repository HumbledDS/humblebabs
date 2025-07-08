import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HumbleBabs - Portfolio",
  description: "Full-stack developer specializing in AI, Cloud, and Data solutions. Building innovative digital experiences with modern technologies.",
  keywords: ["developer", "portfolio", "AI", "cloud", "data", "full-stack", "next.js", "react"],
  authors: [{ name: "HumbleBabs" }],
  creator: "HumbleBabs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://humblebabs.com",
    title: "HumbleBabs - Portfolio",
    description: "Full-stack developer specializing in AI, Cloud, and Data solutions.",
    siteName: "HumbleBabs Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "HumbleBabs - Portfolio",
    description: "Full-stack developer specializing in AI, Cloud, and Data solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-20">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}