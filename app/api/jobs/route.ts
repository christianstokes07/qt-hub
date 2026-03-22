import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query    = req.nextUrl.searchParams.get("query") || "internship";
  const location = req.nextUrl.searchParams.get("location") || "";

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
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}