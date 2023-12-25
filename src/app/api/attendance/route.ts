import admin from "@/firebase/admin";
import { checkLogin } from "@/firebase/auth";
import { Attendance, Student } from "@/firebase/types";
import { NextRequest, NextResponse } from "next/server";
const db = admin.firestore();

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  console.log(id);
  return Response.json({});
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!(await checkLogin(token))) return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const date = new URLSearchParams(req.url.split("?")[1]).get("date");
  const today = new Date().toISOString().split("T")[0];

  const snapshot = await db.collection("students").get();
  const students = snapshot.docs.map(doc => doc.data() as Student);

  const snapshot2 = await db.collection("attendance").doc(date ?? today).collection("students").get();
  const attendances = snapshot2.docs.map(doc => doc.data() as Attendance);

  // 학생 정보와 출석 정보를 합침
  const attendance = students.map(student => {
    const attendance = attendances.find(attendance => attendance.id === student.id);

    return {
      ...student,
      status: attendance?.status ?? "ABSENCE",
    };
  });

  return Response.json(attendance);
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!(await checkLogin(token))) return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  const attendance = await req.json();

  const today = new Date().toISOString().split("T")[0];
  const docRef = db.collection("attendance").doc(attendance.date ?? today).collection("students").doc(attendance.id);

  await docRef.set(attendance);
  return Response.json({});
}