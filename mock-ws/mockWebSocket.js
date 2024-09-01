const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  const interval = setInterval(() => {
    const newDetection = {
      id: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      cameraId: `CAM00${Math.floor(Math.random() * 5) + 1}`,
      objectType: ["person", "vehicle", "animal"][
        Math.floor(Math.random() * 3)
      ],
      confidenceScore: Math.random().toFixed(2),
    };

    ws.send(JSON.stringify(newDetection));
  }, 5000); // Send a new detection every 5 seconds

  ws.on("close", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:8080");
