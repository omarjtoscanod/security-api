const http = require("http");

const app = require("./server");
const config = require("./server/config");
const database = require("./server/database");

// Connect to databse
database.connect(config.database);

// create Web Server
const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server running at ${config.port}`);
});
