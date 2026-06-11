"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Users, Zap } from "lucide-react";
import type { Translations } from "@/i18n";

interface CommunityProps {
  t: Translations;
}

export default function Community({ t }: CommunityProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="community" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-xs font-mono text-accent tracking-[0.3em] uppercase">
            {t.community.title}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 tracking-wide mb-8">
            {t.community.subtitle}
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-10 sm:p-14 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/8 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-[#5865F2]/15 flex items-center justify-center mb-8 border border-[#5865F2]/20">
                <MessageCircle size={36} className="text-[#5865F2]" />
              </div>

              <p className="text-muted-light text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                {t.community.discord}
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {[
                  { icon: Users, text: "Active Chat" },
                  { icon: Zap, text: "Game Nights" },
                  { icon: MessageCircle, text: "Community" },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-muted-light font-mono"
                  >
                    <badge.icon size={12} className="text-accent" />
                    {badge.text}
                  </div>
                ))}
              </div>

              <a
                href="https://discord.gg/ZCWYcpDwDE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-display text-sm tracking-wider uppercase rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(88,101,242,0.4)] hover:-translate-y-0.5"
              >
                <MessageCircle size={18} />
                {t.community.btn}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
