import { NextResponse, NextRequest } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const ALLOWED_ORIGINS = [
  "https://kloyn-gaming.vercel.app",
  "https://kloyn-website.vercel.app",
  "http://localhost:3000",
];

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
}

async function getUploadsPlaylistId(): Promise<string | null> {
  if (!API_KEY || !CHANNEL_ID) return null;
  const url = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${CHANNEL_ID}&part=contentDetails`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null;
}

async function fetchAllVideos(): Promise<Video[]> {
  const playlistId = await getUploadsPlaylistId();
  if (!playlistId) return [];

  const videos: Video[] = [];
  let pageToken = "";
  let pages = 0;
  const MAX_PAGES = 15; // 15 * 50 = 750 videos max

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=50&pageToken=${pageToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error || !data.items) break;

    const ids = data.items.map((item: { snippet: { resourceId: { videoId: string } } }) => item.snippet.resourceId.videoId).join(",");

    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${ids}&part=contentDetails,statistics`;
    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();

    const statsMap: Record<string, { duration: string; views: string }> = {};
    for (const item of statsData.items || []) {
      const dur = item.contentDetails.duration;
      const match = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = match?.[1] ? `${match[1]}:` : "";
      const minutes = match?.[2]?.padStart(2, "0") || "00";
      const seconds = match?.[3]?.padStart(2, "0") || "00";
      statsMap[item.id] = {
        duration: `${hours}${minutes}:${seconds}`,
        views: item.statistics?.viewCount || "0",
      };
    }

    for (const item of data.items) {
      const vid = item.snippet.resourceId.videoId;
      const stats = statsMap[vid] || { duration: "--:--", views: "0" };
      videos.push({
        id: vid,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || "",
        publishedAt: item.snippet.publishedAt?.split("T")[0] || "",
        viewCount: stats.views,
        duration: stats.duration,
      });
    }

    pageToken = data.nextPageToken || "";
    pages++;
  } while (pageToken && pages < MAX_PAGES);

  return videos;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Origin check
  const origin = request.headers.get("origin") || request.headers.get("referer") || "";
  const isAllowed = ALLOWED_ORIGINS.some((o) => origin.startsWith(o)) || origin === "";
  if (!isAllowed && origin !== "") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limit
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // API key check
  if (!API_KEY || !CHANNEL_ID) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const videos = await fetchAllVideos();
    const response = NextResponse.json({ videos, total: videos.length });

    // Security headers
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  } catch {
    return NextResponse.json({ error: "Failed", videos: [] }, { status: 200 });
  }
}
