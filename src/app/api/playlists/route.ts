import { NextResponse, NextRequest } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

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

async function fetchPlaylists(): Promise<Playlist[]> {
  if (!API_KEY || !CHANNEL_ID) return [];

  const playlists: Playlist[] = [];
  let pageToken = "";

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlists?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,contentDetails&maxResults=50&pageToken=${pageToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error || !data.items) break;

    for (const item of data.items) {
      playlists.push({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || "",
        videoCount: item.contentDetails.itemCount,
      });
    }

    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return playlists;
}

async function fetchPlaylistVideos(playlistId: string): Promise<Video[]> {
  if (!API_KEY) return [];

  const videos: Video[] = [];
  let pageToken = "";
  let pages = 0;

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
  } while (pageToken && pages < 15);

  return videos;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!API_KEY || !CHANNEL_ID) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const playlistId = request.nextUrl.searchParams.get("playlistId");

  try {
    if (playlistId) {
      const videos = await fetchPlaylistVideos(playlistId);
      const response = NextResponse.json({ videos, total: videos.length });
      response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
      return response;
    }

    const playlists = await fetchPlaylists();
    const response = NextResponse.json({ playlists, total: playlists.length });
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return response;
  } catch {
    return NextResponse.json({ error: "Failed", videos: [], playlists: [] }, { status: 200 });
  }
}
