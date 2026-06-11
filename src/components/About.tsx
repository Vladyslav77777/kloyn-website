"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Video, Users, Eye, Gamepad2, ExternalLink } from "lucide-react";
import type { Translations } from "@/i18n";

interface AboutProps {
  t: Translations;
}

const stats = [
  { icon: Video, value: "572", key: "videos" as const },
  { icon: Users, value: "155", key: "subscribers" as const },
  { icon: Eye, value: "45K+", key: "views" as const },
  { icon: Gamepad2, value: "20+", key: "games" as const },
];

export default function About({ t }: AboutProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-accent tracking-[0.3em] uppercase">
            {t.about.title}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 tracking-wide">
            {t.about.name}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Clickable avatar card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <a
              href="https://www.youtube.com/@kloyn_gaming"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative w-full aspect-square max-w-md mx-auto group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/20 to-gold/10 blur-xl transition-opacity duration-500 group-hover:opacity-80" />
              <div className="relative glass-card rounded-2xl overflow-hidden aspect-square cursor-pointer">
                <img
                  src="/images/avatar.jpg"
                  alt="KLOYN"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent p-6 transition-all duration-500 group-hover:from-[#0a0a0a]/90">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-2xl text-foreground tracking-wider">
                        KLOYN
                      </p>
                      <p className="text-sm text-muted mt-1 font-mono">@kloyn_gaming</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                      <ExternalLink size={16} className="text-accent" />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <p className="text-lg text-muted-light leading-relaxed mb-10">
              {t.about.bio}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="glass-card rounded-xl p-5 text-center"
                >
                  <stat.icon size={20} className="text-accent mx-auto mb-3" />
                  <div className="font-display text-2xl text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted mt-1 font-mono tracking-wider uppercase">
                    {t.about.stats[stat.key]}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
