const express = require("express");
const app = express();
const server = require("http").createServer(app);
const ws = require("ws");

const wss = new ws.Server({ server: server });

const clients = [];

wss.on("connection", (newClient) => {
  clients.push(newClient);
  newClient.on("message", (msg) => {
    msg = JSON.parse(msg);

    switch (msg.event) {
      case "connect":
        sendMessage(msg);
        break;
      case "message":
        sendMessage(msg);
        break;
    }
  });
  newClient.on("close", (code, reason) => {
    // wss.clients.forEach((client) => {
    //   client.send(JSON.stringify(x));
    // });

    const index = clients.findIndex((client) => client === newClient);
    clients.splice(index, 1);
  });
});

const sendMessage = (message) => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
};

app.get("/", (req, res) => res.send("hello world!"));

server.listen(5000, () => {
  console.log("Сервер запустился на порту 5000");
});
