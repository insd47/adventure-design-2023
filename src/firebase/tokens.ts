import { randomBytes } from "crypto";
import admin from "./admin";
const db = admin.firestore();

// 토큰 생성
export async function generateToken(id: string) {
  const token = randomBytes(16).toString("hex");

  const docRef = db.collection("tokens").doc(token);
  await docRef.set({ id });

  return token;
}

// 토큰 검증
export async function verifyToken(token: string) {
  const tokenRef = db.collection("tokens").doc(token);
  const tokenSnapshot = await tokenRef.get();
  if (!tokenSnapshot.exists) return false;

  const data = tokenSnapshot.data();
  if (!data) return false;

  const studentRef = db.collection("students").doc(data.id);
  const studentSnapshot = await studentRef.get();
  if (!studentSnapshot.exists) return false;

  return studentSnapshot.data() ?? false;
}

// 토큰 삭제
export async function removeTokens(tokens: string[]) {
  const batch = db.batch();

  tokens.forEach(token => {
    const docRef = db.collection("tokens").doc(token);
    batch.delete(docRef);
  });

  await batch.commit();
}