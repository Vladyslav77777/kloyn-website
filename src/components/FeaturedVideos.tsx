"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Play, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Translations } from "@/i18n";

interface VideosProps {
  t: Translations;
}

const videos = [
  {
    id: "jlFe6BMPp3A",
    title: "Life Is Strange: Double Exposure #1 ДОБРО ПОЖАЛОВАТЬ В КАЛЕДОН!!!",
    views: "22",
    category: "Story",
  },
  {
    id: "eYYGooXcxig",
    title: "DEAD SPACE 3 #9 ИССЛЕДУЕМ ГОРОД ДРЕВНИХ И ФИНАЛ ОСНОВНОЙ ИГРЫ!!!",
    views: "16",
    category: "Horror",
  },
  {
    id: "zN9c-55Gj6E",
    title: "Firewatch #2 ФИНАЛ САМОЙ ЧИЛЛОВОЙ ИГРЫ НА КАНАЛЕ!!!!",
    views: "9",
    category: "Adventure",
  },
  {
    id: "U4OZrsBhtBY",
    title: "DEAD SPACE 3 #10 DLC ПРОСНУВШИЕСЯ (СНОВА АЙЗЕК И НЕКРОМОРФЫ)!!!",
    views: "5",
    category: "Horror",
  },
];

export default function FeaturedVideos({ t }: VideosProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="videos" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-accent tracking-[0.3em] uppercase">
            {t.videos.title}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl mt-4 tracking-wide">
            {t.videos.subtitle}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, i) => (
            <motion.a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-card rounded-xl overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center">
                    <Play size={20} fill="#ffffff" className="text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 text-[10px] font-mono tracking-wider uppercase bg-accent/20 text-accent rounded backdrop-blur-sm border border-accent/20">
                    {video.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted font-mono">
                    {video.views} views
                  </span>
                  <ExternalLink
                    size={12}
                    className="text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/videos"
            className="btn-secondary"
          >
            View All Videos
            <ExternalLink size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
