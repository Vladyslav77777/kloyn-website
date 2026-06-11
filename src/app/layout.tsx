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
    "Minecraft",
    "content creator",
    "streamer",
  ],
  openGraph: {
    title: "KLOYN — Gaming · Stories · Emotions",
    description:
      "Welcome to the world of KLOYN. Gaming content creator specializing in story-driven games.",
    type: "website",
    url: "https://kloyn.com",
    siteName: "KLOYN",
  },
  twitter: {
    card: "summary_large_image",
    title: "KLOYN — Gaming · Stories · Emotions",
    description:
      "Welcome to the world of KLOYN. Gaming content creator specializing in story-driven games.",
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
