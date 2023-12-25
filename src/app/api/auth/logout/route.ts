import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  let response = NextResponse.json(null);
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
