import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
}

async function fetchAllVideos(): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = [];
  let pageToken = "";

  do {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&type=video&order=date&maxResults=50&pageToken=${pageToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) break;

    const ids = data.items.map((item: { id: { videoId: string } }) => item.id.videoId).join(",");

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
      const vid = item.id.videoId;
      const stats = statsMap[vid] || { duration: "00:00", views: "0" };
      videos.push({
        id: vid,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || "",
        publishedAt: item.snippet.publishedAt.split("T")[0],
        viewCount: stats.views,
        duration: stats.duration,
      });
    }

    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return videos;
}

export async function GET() {
  if (!API_KEY || !CHANNEL_ID) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const videos = await fetchAllVideos();
    return NextResponse.json({ videos, total: videos.length });
  } catch {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
