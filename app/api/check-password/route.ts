import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === process.env.SITE_PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("site-access", "granted", { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
    return res;
  }
  return NextResponse.json({ success: false }, { status: 401 });
}