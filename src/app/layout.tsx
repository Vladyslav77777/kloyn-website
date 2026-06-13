import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KLOYN — Gaming · Stories · Emotions",
  description:
    "Welcome to the world of KLOYN. Gaming content creator specializing in story-driven games, horror, and adventure. Join the community.",
  keywords: [
    "KLOYN",
    "gaming",
    "let's play",
    "Life Is Strange",
    "Dead Space",
    "Firewatch",
    "content creator",
    "streamer",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  openGraph: {
    title: "KLOYN — Gaming · Stories · Emotions",
    description:
      "Welcome to the world of KLOYN. Gaming content creator specializing in story-driven games.",
    type: "website",
    url: "https://kloyn-gaming.vercel.app",
    siteName: "KLOYN",
    images: ["/images/avatar.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "KLOYN — Gaming · Stories · Emotions",
    description:
      "Welcome to the world of KLOYN. Gaming content creator specializing in story-driven games.",
    images: ["/images/avatar.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
