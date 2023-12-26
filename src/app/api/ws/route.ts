import { checkLogin } from "@/firebase/auth";
import admin from "@/firebase/admin";
import { AttendanceStatus } from "@/firebase/types";
const db = admin.firestore();

let sensorValues: {
  temperature: number;
  humidity: number;
  gas: number;
}[] = [];

let arduinoClient: import("ws").WebSocket | null = null;

export async function SOCKET(
  client: import("ws").WebSocket,
  request: import("http").IncomingMessage,
  server: import("ws").WebSocketServer
) {
  const url = request.url?.split("device_id=");
  const deviceId = url && url.length > 1 ? url[1].split("&")[0] : null;

  if (deviceId === process.env.DEVICE_ID) {
    arduinoClient = client;
    console.log("arduino connected!");
    client.send("TIME=" + new Date().toISOString());

    client.on("message", (data) => {
      const message = data.toString();

      if (message.startsWith("SENSORS=")) {
        const sensors = message.split("SENSORS=")[1].split(",").map(Number);

        if (sensorValues.length >= 10) {
          sensorValues.shift();
        }

        sensorValues.push({
          temperature: sensors[0],
          humidity: sensors[1],
          gas: sensors[2],
        });
      }

      else if (message.startsWith("AUTH=")) {
        const studentId = message.split("AUTH=")[1].trim();

        const today = new Date().toISOString().split("T")[0];
        const docRef = db.collection("attendance").doc(today).collection("students").doc(studentId);

        docRef.set({
          id: studentId,
          status: AttendanceStatus.ATTENDANCE,
        });
      }
    });
  }

  const token = request.headers.cookie?.split("token=")[1]?.split(";")[0];

  if (await checkLogin(token)) {
    console.log("admin connected!");
    client.on("message", (data) => {
      const message = data.toString();

      if (message === "GET_SENSORS") {
        client.send("SENSORS=" + JSON.stringify(sensorValues));
      }

      else if (message.startsWith("SET_DEVICE_") && arduinoClient) {
        arduinoClient.send(message);
      }
    });
  }

  client.on("close", () => {
    console.log("a client disconnected!");
  });
}
