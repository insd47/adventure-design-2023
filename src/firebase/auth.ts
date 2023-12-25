import admin from "./admin";
const auth = admin.auth();
const db = admin.firestore();

export async function checkLogin(token?: string) {
  if (!token) return false;

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const user = await auth.getUser(uid);
    const snapshot = await db.collection("users").doc(user.uid).get();
    const data = snapshot.data();

    if (!data || data.role !== "admin") {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}