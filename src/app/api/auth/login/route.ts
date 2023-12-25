import admin from "@/firebase/admin";
import { NextRequest, NextResponse } from "next/server";
const auth = admin.auth();
const db = admin.firestore();

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ message: "Permission Denied" }, { status: 403 });

  const decodedToken = await auth.verifyIdToken(token);
  const uid = decodedToken.uid;

  const user = await auth.getUser(uid);
  const snapshot = await db.collection("users").doc(user.uid).get();
  const data = snapshot.data();

  if (!data || data.role !== "admin") {
    return NextResponse.json({ message: "Permission Denied" }, { status: 403 });
  }

  let response = NextResponse.json(null);
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  return response;
}
