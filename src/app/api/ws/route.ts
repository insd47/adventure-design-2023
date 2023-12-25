let sensorValues: {
  temperature: number;
  humidity: number;
  gas: number;
}[] = [];

export async function SOCKET(
  client: import('ws').WebSocket,
  request: import('http').IncomingMessage,
  server: import('ws').WebSocketServer,
) {
  console.log("a client connected!");

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

    if (message === "GET_SENSORS") {
      client.send("SENSORS=" + JSON.stringify(sensorValues));
    }
  });

  client.on("close", () => {
    console.log("a client disconnected!");
  });

  client.send("TIME=" + new Date().toISOString());
}