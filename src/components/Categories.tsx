"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Skull, Play, Compass } from "lucide-react";
import type { Translations } from "@/i18n";

interface CategoriesProps {
  t: Translations;
}

const icons = [BookOpen, Skull, Play, Compass];

export default function Categories({ t }: CategoriesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="categories" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-accent tracking-[0.3em] uppercase">
            {t.categories.title}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 tracking-wide">
            {t.categories.subtitle}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.categories.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl p-6"
                style={{
                  background: "linear-gradient(135deg, rgba(17, 17, 17, 0.9), rgba(26, 26, 26, 0.7))",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="font-display text-foreground text-sm tracking-wider mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
