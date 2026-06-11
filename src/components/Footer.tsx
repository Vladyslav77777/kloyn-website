"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart } from "lucide-react";
import type { Translations } from "@/i18n";

interface FooterProps {
  t: Translations;
}

export default function Footer({ t }: FooterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer className="relative py-16 px-6" ref={ref}>
      <div className="section-divider mb-16" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="font-display text-2xl tracking-[0.1em] text-foreground mb-6">
          KLOYN
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {[
            { name: "YouTube", url: "https://www.youtube.com/@kloyn_gaming" },
            { name: "Discord", url: "https://discord.gg/ZCWYcpDwDE" },
            { name: "Instagram", url: "https://www.instagram.com/ladislav_v_/" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-accent transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          <span>{t.footer.made}</span>
          <Heart size={12} className="text-accent" fill="currentColor" />
          <span>·</span>
          <span>© 2026 KLOYN. {t.footer.rights}</span>
        </div>
      </motion.div>
    </footer>
  );
}
