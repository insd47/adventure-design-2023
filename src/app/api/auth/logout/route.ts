import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let response = NextResponse.redirect(new URL('/login', req.nextUrl));
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
