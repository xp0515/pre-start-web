const http = require("http");
const app = require("./api/app");
const debug = require("debug")("node-angular");

const port = 3000;

app.set("port", port);
const server = http.createServer(app);

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port" + port;
  debug("Listening on " + bind);
};

server.on("listening", onListening);
server.listen(port);
