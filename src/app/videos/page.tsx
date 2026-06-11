"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, X, Clock, Eye, Loader2, ListVideo } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
}

interface Playlist {
  id: string;
  title: string;
  thumbnail: string;
  videoCount: number;
}

function formatViews(n: string): string {
  const num = parseInt(n, 10);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return n;
}

export default function VideosPage() {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | string>("all");
  const [playlistVideos, setPlaylistVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/videos").then((r) => r.json()),
      fetch("/api/playlists").then((r) => r.json()),
    ]).then(([videosData, playlistsData]) => {
      if (videosData.videos) setAllVideos(videosData.videos);
      else setError(videosData.error || "Failed to load videos");
      if (playlistsData.playlists) setPlaylists(playlistsData.playlists);
      setLoading(false);
    }).catch(() => {
      setError("Network error");
      setLoading(false);
    });
  }, []);

  const loadPlaylist = async (playlistId: string) => {
    setPlaylistLoading(true);
    setActiveTab(playlistId);
    try {
      const res = await fetch(`/api/playlists?playlistId=${playlistId}`);
      const data = await res.json();
      setPlaylistVideos(data.videos || []);
    } catch {
      setPlaylistVideos([]);
    }
    setPlaylistLoading(false);
  };

  const displayVideos = activeTab === "all" ? allVideos : playlistVideos;
  const filteredVideos = searchQuery
    ? displayVideos.filter((v) => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : displayVideos;

  const openVideo = (id: string, title: string) => {
    setSelectedVideo(id);
    setSelectedTitle(title);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-muted-light hover:text-accent transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="font-display text-lg tracking-wider">KLOYN</span>
          </Link>
          <h1 className="font-display text-sm tracking-[0.2em] uppercase text-muted-light hidden sm:block">
            Video Library
          </h1>
        </div>
      </div>

      {/* Search & stats */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl tracking-wider mb-1">
              {loading ? "Loading..." : `${filteredVideos.length} videos`}
            </h2>
            <p className="text-xs text-muted font-mono">
              {activeTab === "all" ? "All videos from KLOYN channel" : playlists.find((p) => p.id === activeTab)?.title}
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/30 font-mono"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            />
          </div>
        </div>

        {/* Playlist tabs */}
        {!loading && playlists.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none -mx-6 px-6">
            <button
              onClick={() => { setActiveTab("all"); setSearchQuery(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-accent text-white"
                  : "glass text-muted-light hover:text-foreground"
              }`}
            >
              <ListVideo size={12} />
              All ({allVideos.length})
            </button>
            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => { loadPlaylist(pl.id); setSearchQuery(""); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === pl.id
                    ? "bg-accent text-white"
                    : "glass text-muted-light hover:text-foreground"
                }`}
              >
                {pl.title} ({pl.videoCount})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16 pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={32} className="text-accent animate-spin" />
            <p className="text-sm text-muted font-mono">Loading videos...</p>
          </div>
        ) : playlistLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={32} className="text-accent animate-spin" />
            <p className="text-sm text-muted font-mono">Loading playlist...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <p className="text-sm text-accent">{error}</p>
            <a href="https://www.youtube.com/@kloyn_gaming/videos" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
              Open on YouTube
            </a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredVideos.map((video, i) => (
              <motion.button
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.5) }}
                onClick={() => openVideo(video.id, video.title)}
                className="group text-left rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(17, 17, 17, 0.9), rgba(26, 26, 26, 0.7))",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="relative aspect-video overflow-hidden bg-[#111]">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center">
                      <Play size={24} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white/80 flex items-center gap-1">
                    <Clock size={10} />
                    {video.duration}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted font-mono">
                    <span className="flex items-center gap-1">
                      <Eye size={10} />
                      {formatViews(video.viewCount)}
                    </span>
                    <span>{video.publishedAt}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* YouTube Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{ background: "rgba(0, 0, 0, 0.92)" }}
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
                <p className="text-sm text-muted-light font-mono line-clamp-2">{selectedTitle}</p>
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
