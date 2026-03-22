import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function GET(req: NextRequest) {
  const query    = req.nextUrl.searchParams.get("query") || "internship";
  const location = req.nextUrl.searchParams.get("location") || "";

  const cacheKey = `${query}__${location}`;

  // Return cached result if still fresh
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  const appId  = process.env.ADZUNA_APP_ID!;
  const appKey = process.env.ADZUNA_APP_KEY!;

  let url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=${encodeURIComponent(query)}&content-type=application/json`;

  if (location) {
    url += `&where=${encodeURIComponent(location)}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }
    const data = await res.json();

    // Store in cache
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}