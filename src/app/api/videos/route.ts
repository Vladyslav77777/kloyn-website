import { NextResponse } from "next/server";

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

async function fetchViaAPI(): Promise<Video[]> {
  if (!API_KEY || !CHANNEL_ID) return [];

  const videos: Video[] = [];
  let pageToken = "";

  do {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&type=video&order=date&maxResults=50&pageToken=${pageToken}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.error || !data.items) return [];

    const ids = data.items.map((item: { id: { videoId: string } }) => item.id.videoId).join(",");

    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${ids}&part=contentDetails,statistics`;
    const statsRes = await fetch(statsUrl, { next: { revalidate: 3600 } });
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

async function fetchViaRSS(): Promise<Video[]> {
  if (!CHANNEL_ID) return [];

  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const res = await fetch(rssUrl, { next: { revalidate: 3600 } });
  const text = await res.text();

  const entries = text.split("<entry>").slice(1);
  return entries.map((entry) => {
    const id = entry.match(/yt:videoId>(.*?)<\/yt:videoId/)?.[1] || "";
    const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || "";
    const date = entry.match(/<published>(.*?)<\/published>/)?.[1]?.split("T")[0] || "";
    const views = entry.match(/statistics views="(.*?)"/)?.[1] || "0";
    const thumbMatch = entry.match(/media:thumbnail url="(.*?)"/);
    const thumbnail = thumbMatch?.[1] || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    return {
      id,
      title,
      thumbnail,
      publishedAt: date,
      viewCount: views,
      duration: "--:--",
    };
  });
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let videos = await fetchViaAPI();

    if (videos.length === 0) {
      videos = await fetchViaRSS();
    }

    if (videos.length === 0) {
      return NextResponse.json({ error: "No videos found", videos: [] }, { status: 200 });
    }

    return NextResponse.json({ videos, total: videos.length });
  } catch {
    return NextResponse.json({ error: "Failed to fetch videos", videos: [] }, { status: 200 });
  }
}
