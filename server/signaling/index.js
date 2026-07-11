const { PeerServer } = require("peer");

const port = process.env.PORT || 9000;

const server = PeerServer({
  port,
  path: "/aris",
  allow_discovery: true,
});

server.on("connection", (client) => {
  console.log("device joined:", client.getId());
});

server.on("disconnect", (client) => {
  console.log("device left:", client.getId());
});

console.log(`aris relay listening on ${port}`);