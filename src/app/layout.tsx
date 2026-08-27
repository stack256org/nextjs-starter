import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/provider";
import { getThemePreference } from "@/lib/theme/server";
import { themeAttribute } from "@/lib/theme/config";
import { APP_URL } from "@/lib/auth/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "A Next.js starter with TypeScript, Drizzle ORM on PostgreSQL, a pgBoss job queue, BetterAuth, and a Headless UI component set styled with DaisyUI.";

export const metadata: Metadata = {
  // Makes the relative og:image below resolve to an absolute URL, which
  // social platforms require.
  metadataBase: new URL(APP_URL),
  title: {
    default: "Next.js Starter",
    template: "%s",
  },
  description: DESCRIPTION,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    siteName: "Next.js Starter",
    title: "Next.js Starter",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Starter",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  // Tells the browser to paint form controls and scrollbars for the active
  // theme before React hydrates.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#111417" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Read on the server so `data-theme` is in the first byte of HTML — no
  // flash of the wrong theme, and no inline script to produce one.
  const theme = await getThemePreference();

  return (
    <html
      lang="en"
      // Absent for "system", which lets the prefers-color-scheme rules in
      // globals.css resolve the theme with no JavaScript at all.
      data-theme={themeAttribute(theme)}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // globals.css sets `scroll-behavior: smooth`; this tells Next to opt
      // route transitions out of it so navigation doesn't animate the scroll.
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col">
        <a href="#main" className="skip-link btn btn-primary btn-sm">
          Skip to content
        </a>
        <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
