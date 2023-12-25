import admin from "@/firebase/admin";
import { checkLogin } from "@/firebase/auth";
import { NextRequest, NextResponse } from "next/server";
const db = admin.firestore();

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!(await checkLogin(token))) return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const student = await req.json();
  const docRef = db.collection("students").doc(student.id);

  if ((await docRef.get()).exists) {
    return Response.json({ message: "student already exists" }, { status: 400 });
  }

  await docRef.set(student);
  return Response.json({});
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!(await checkLogin(token))) return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const students: string[] = await req.json();
  const batch = db.batch();

  students.forEach(student => {
    const docRef = db.collection("students").doc(student);
    batch.delete(docRef);
  });

  await batch.commit();
  return Response.json({});
}