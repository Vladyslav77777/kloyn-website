"use client";

import { useState } from "react";
import { type Locale, translations } from "@/i18n";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedVideos from "@/components/FeaturedVideos";
import SocialHub from "@/components/SocialHub";
import Categories from "@/components/Categories";
import Community from "@/components/Community";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const t = translations[locale];

  return (
    <>
      <ParticleBackground />
      <div className="noise-overlay" />
      <Navbar t={t} locale={locale} onLocaleChange={setLocale} />
      <main>
        <Hero t={t} />
        <div className="section-divider" />
        <About t={t} />
        <div className="section-divider" />
        <FeaturedVideos t={t} />
        <div className="section-divider" />
        <SocialHub t={t} />
        <div className="section-divider" />
        <Categories t={t} />
        <div className="section-divider" />
        <Community t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
