const webSocket = require("ws");
const jwt = require("jsonwebtoken");

module.exports = (server, key) => {
  const wss = new webSocket.Server({ noServer: true });
  const onlineUsers = new Map();

  server.on("upgrade", (request, socket, head) => {
    if (request.url === "/posts") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });
  const broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === webSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  wss.on("connection", (ws, req) => {
    const token = req.headers.cookie
      ?.split(";")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    jwt.verify(token, key, (err, user) => {
      if (err) {
        return ws.close(1008, "Invalid token");
      }

      ws.user = user;
      onlineUsers.set(user.username, ws);
      console.log(`${user.username} connected`);

      broadcast({
        type: "online",
        users: Array.from(onlineUsers.keys()),
      });

      ws.on("message", (message) => {
        const data = JSON.parse(message);
        if (data.type == "chat") {
          console.log(
            `Broadcasting message from ${user.username}: ${data.content}`
          );

          broadcast({
            type: "chat",
            username: user.username,
            message: data.content,
            timestamp: new Date().toISOString(),
          });
        }
      });
      ws.on("close", () => {
        onlineUsers.delete(user.username);
        broadcast({
          type: "online",
          users: Array.from(onlineUsers.keys()),
        });
        console.log(`${user.username} disconnected`);
      });
    });
  });
  return wss;
};
