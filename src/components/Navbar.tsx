"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { type Locale, type Translations } from "@/i18n";

interface NavbarProps {
  t: Translations;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const navItems = ["about", "videos", "social", "categories", "community"] as const;

export default function Navbar({ t, locale, onLocaleChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10, 10, 10, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.03)" : "1px solid transparent",
        boxShadow: "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-xl tracking-[0.1em] text-foreground hover:text-accent transition-colors"
        >
          KLOYN
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="text-sm text-muted-light hover:text-accent transition-colors font-medium tracking-wide cursor-pointer"
            >
              {t.nav[item]}
            </button>
          ))}
          <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mx-4 mb-4 rounded-lg overflow-hidden"
          style={{
            background: "rgba(10, 10, 10, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="p-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="text-left text-sm text-muted-light hover:text-accent transition-colors py-2 cursor-pointer"
              >
                {t.nav[item]}
              </button>
            ))}
            <div className="pt-2 border-t border-border">
              <LanguageSwitcher locale={locale} onChange={onLocaleChange} />
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
