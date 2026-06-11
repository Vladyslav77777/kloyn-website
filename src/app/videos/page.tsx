"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, X, Clock, Eye } from "lucide-react";

interface Video {
  id: string;
  title: string;
  series: string;
  views: string;
  date: string;
}

const videos: Video[] = [
  { id: "jlFe6BMPp3A", title: "Life Is Strange: Double Exposure #1 ДОБРО ПОЖАЛОВАТЬ В КАЛЕДОН!!!", series: "Life Is Strange: Double Exposure", views: "22", date: "2025-10-27" },
  { id: "zYkrrb_FPvM", title: "Life Is Strange: Double Exposure #2 ТОЛЬКО НЕ СНОВА!!!", series: "Life Is Strange: Double Exposure", views: "2", date: "2025-10-30" },
  { id: "aoBt7qgIf7M", title: "Life Is Strange: Double Exposure #3 НАЧИНАЕМ МЕЖМИРОВОЕ РАССЛЕДОВАНИЕ!!", series: "Life Is Strange: Double Exposure", views: "2", date: "2025-11-03" },
  { id: "piL3k_CbW4c", title: "Life Is Strange: Double Exposure #4 СУЕМ СВОЙ НОС В ЧУЖИЕ ДЕЛА!!", series: "Life Is Strange: Double Exposure", views: "0", date: "2025-11-06" },
  { id: "rpL6e0H7KU4", title: "Life Is Strange: Double Exposure #5 УЗНАЕМ СТРАШНУЮ ПРАВДУ!!!", series: "Life Is Strange: Double Exposure", views: "4", date: "2025-11-10" },
  { id: "TSdxHlcLVjI", title: "Life Is Strange: Double Exposure #6 ПРОДОЛЖАЕМ РАССЛЕДОВАНИЕ В КАМПУСЕ!", series: "Life Is Strange: Double Exposure", views: "2", date: "2025-11-13" },
  { id: "Om-CSSu7t-Q", title: "Life Is Strange: Double Exposure #7 СТРОИМ РОМАНТИК С АМАНДОЙ??!!", series: "Life Is Strange: Double Exposure", views: "8", date: "2025-11-17" },
  { id: "vrFwn4Jd3gQ", title: "Life Is Strange: Double Exposure #8 ВСТРЕЧАЕМ ДРУГУЮ СЕБЯ???!!!", series: "Life Is Strange: Double Exposure", views: "2", date: "2025-11-20" },
  { id: "tcwXvoSD7rc", title: "Life Is Strange: Double Exposure #9 ОМУТ ПАМЯТИ И ФЛЕШБЕКИ ИЗ ПРОШЛОГО", series: "Life Is Strange: Double Exposure", views: "7", date: "2025-11-24" },
  { id: "QdePqRLvsbM", title: "Life Is Strange: Double Exposure #10 ФИНАЛ ИСТОРИИ!!!", series: "Life Is Strange: Double Exposure", views: "4", date: "2025-11-27" },
  { id: "c3nD4BhgE1o", title: "Firewatch #1 ПРИКЛЮЧЕНИЯ НАЧИНАЮТСЯ!!!", series: "Firewatch", views: "16", date: "2025-12-01" },
  { id: "zN9c-55Gj6E", title: "Firewatch #2 ФИНАЛ САМОЙ ЧИЛЛОВОЙ ИГРЫ НА КАНАЛЕ!!!!", series: "Firewatch", views: "9", date: "2025-12-04" },
  { id: "wteRipK6EOA", title: "DEAD SPACE 3 #8 СОБИРАЕМ РОЗЕТТУ (х2)!!!", series: "Dead Space 3", views: "9", date: "2025-10-16" },
  { id: "eYYGooXcxig", title: "DEAD SPACE 3 #9 ИССЛЕДУЕМ ГОРОД ДРЕВНИХ И ФИНАЛ ОСНОВНОЙ ИГРЫ!!!", series: "Dead Space 3", views: "16", date: "2025-10-20" },
  { id: "U4OZrsBhtBY", title: "DEAD SPACE 3 #10 DLC ПРОСНУВШИЕСЯ (СНОВА АЙЗЕК И НЕКРОМОРФЫ)!!!", series: "Dead Space 3", views: "5", date: "2025-10-23" },
];

const seriesColors: Record<string, string> = {
  "Life Is Strange: Double Exposure": "#7c3aed",
  "Firewatch": "#f97316",
  "Dead Space 3": "#dc2626",
};

const seriesOrder = ["Life Is Strange: Double Exposure", "Dead Space 3", "Firewatch"];

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeSeries, setActiveSeries] = useState<string | null>(null);

  const filteredVideos = activeSeries
    ? videos.filter((v) => v.series === activeSeries)
    : videos;

  const groupedVideos = seriesOrder
    .map((series) => ({
      series,
      videos: filteredVideos.filter((v) => v.series === series),
    }))
    .filter((g) => g.videos.length > 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-muted-light hover:text-accent transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-display text-lg tracking-wider">KLOYN</span>
          </Link>
          <h1 className="font-display text-sm tracking-[0.2em] uppercase text-muted-light hidden sm:block">
            Video Library
          </h1>
        </div>
      </div>

      {/* Series filter */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveSeries(null)}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
              !activeSeries
                ? "bg-accent text-white"
                : "glass text-muted-light hover:text-foreground"
            }`}
          >
            All ({videos.length})
          </button>
          {seriesOrder.map((series) => {
            const count = videos.filter((v) => v.series === series).length;
            if (count === 0) return null;
            return (
              <button
                key={series}
                onClick={() => setActiveSeries(activeSeries === series ? null : series)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  activeSeries === series
                    ? "text-white"
                    : "glass text-muted-light hover:text-foreground"
                }`}
                style={activeSeries === series ? { backgroundColor: seriesColors[series] } : {}}
              >
                {series} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Video grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {groupedVideos.map((group) => (
          <div key={group.series} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: seriesColors[group.series] }}
              />
              <h2 className="font-display text-xl tracking-wider">{group.series}</h2>
              <span className="text-xs text-muted font-mono">{group.videos.length} videos</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.videos.map((video, i) => (
                <motion.button
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setSelectedVideo(video.id)}
                  className="group text-left rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, rgba(17, 17, 17, 0.9), rgba(26, 26, 26, 0.7))",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: seriesColors[video.series] + "dd" }}
                      >
                        <Play size={24} fill="white" className="text-white ml-1" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white/80">
                      <Clock size={10} className="inline mr-1" />
                      Watch
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors leading-snug">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted font-mono">
                      <span className="flex items-center gap-1">
                        <Eye size={10} />
                        {video.views}
                      </span>
                      <span>{video.date}</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* YouTube Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{ background: "rgba(0, 0, 0, 0.9)" }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X size={28} />
              </button>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-light font-mono">
                  {videos.find((v) => v.id === selectedVideo)?.title}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline mt-2 inline-block"
                >
                  Open on YouTube →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
