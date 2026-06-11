import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

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

export const dynamic = "force-dynamic";

export async function GET() {
  if (!API_KEY || !CHANNEL_ID) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const playlists = await fetchPlaylists();
    const response = NextResponse.json({ playlists, total: playlists.length });
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return response;
  } catch {
    return NextResponse.json({ error: "Failed", playlists: [] }, { status: 200 });
  }
}
