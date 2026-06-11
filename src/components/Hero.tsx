"use client";

import { motion } from "framer-motion";
import { Play, MessageCircle, ChevronDown } from "lucide-react";
import type { Translations } from "@/i18n";

interface HeroProps {
  t: Translations;
}

const gameIcons = [
  { name: "Dead Space", x: "8%", y: "15%", delay: 0, size: "text-[10px]" },
  { name: "Alan Wake", x: "85%", y: "20%", delay: 1.2, size: "text-[10px]" },
  { name: "Life is Strange", x: "5%", y: "55%", delay: 0.6, size: "text-[9px]" },
  { name: "Until Dawn", x: "90%", y: "50%", delay: 1.8, size: "text-[10px]" },
  { name: "NFS", x: "12%", y: "80%", delay: 2.4, size: "text-[11px]" },
  { name: "Horizon", x: "88%", y: "75%", delay: 0.3, size: "text-[10px]" },
  { name: "Assassin's Creed", x: "15%", y: "35%", delay: 1.5, size: "text-[9px]" },
  { name: "Far Cry 5", x: "82%", y: "35%", delay: 2.1, size: "text-[10px]" },
  { name: "Walking Dead", x: "10%", y: "70%", delay: 0.9, size: "text-[9px]" },
  { name: "Dying Light", x: "87%", y: "65%", delay: 2.7, size: "text-[10px]" },
  { name: "Wolf Among Us", x: "6%", y: "45%", delay: 1.0, size: "text-[9px]" },
  { name: "Dark Pictures", x: "92%", y: "42%", delay: 3.0, size: "text-[9px]" },
];

export default function Hero({ t }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Banner background */}
      <div className="absolute inset-0">
        <img
          src="/images/banner.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#0a0a0a]" />
      </div>

      <div className="hero-gradient" />

      {/* Floating game icons */}
      {gameIcons.map((game, i) => (
        <motion.div
          key={game.name}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.5, 0.3, 0.5, 0],
            scale: [0.5, 1, 0.9, 1, 0.5],
            y: [0, -15, 5, -10, 0],
          }}
          transition={{
            duration: 8 + i * 0.5,
            repeat: Infinity,
            delay: game.delay,
            ease: "easeInOut",
          }}
          className="absolute pointer-events-none z-[1]"
          style={{ left: game.x, top: game.y }}
        >
          <div className="px-3 py-1.5 rounded border border-white/5 bg-white/[0.03] backdrop-blur-sm">
            <span className={`font-mono ${game.size} text-white/25 tracking-wider uppercase whitespace-nowrap`}>
              {game.name}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[100px] animate-float"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-xs font-mono text-muted-light tracking-wider uppercase">
            Content Creator & Gamer
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-[0.04em] mb-6 leading-none"
        >
          <span className="gradient-text">KLOYN</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-lg sm:text-xl text-muted-light font-light tracking-widest uppercase mb-4 font-display"
        >
          {t.hero.tagline}
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-base text-muted max-w-xl mx-auto mb-10"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="https://www.youtube.com/@kloyn_gaming"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <Play size={16} fill="currentColor" />
            {t.hero.cta}
          </a>
          <a
            href="https://discord.gg/ZCWYcpDwDE"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <MessageCircle size={16} />
            {t.hero.ctaSecondary}
          </a>
        </motion.div>

        {/* Scroll indicator - below buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border border-muted/20 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [0.2, 0.8, 0.2], y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown size={14} className="text-muted/40" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
