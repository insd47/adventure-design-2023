import { checkLogin } from "@/firebase/auth";

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

  console.log(deviceId, "connecs to:", process.env.DEVICE_ID);

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
    });

    client.on("close", () => {
      console.log("a client disconnected!");
    });
  }

  const token = request.headers.cookie?.split("token=")[1]?.split(";")[0];

  if (await checkLogin(token)) {
    console.log("admin connected!");
    client.on("message", (data) => {
      const message = data.toString();

      if (message === "GET_SENSORS") {
        client.send(JSON.stringify(sensorValues));
      }

      if (message.startsWith("SET_DEVICE_") && arduinoClient) {
        console.log("FORWARDING TO ARDUINO: " + message);
        arduinoClient.send(message);
      }
    });
  }
}
