// Create server
let port = process.env.PORT || 8000;
let express = require("express");
let app = express();
let server = require("http")
  .createServer(app)
  .listen(port, function() {
    console.log("Server listening at port: ", port);
  });

// Tell server where to look for files
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/host", function(req, res) {
  res.sendFile(__dirname + "/public/host/index.html");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/player/index.html");
});

// Create socket connection
let io = require("socket.io").listen(server);

let players = io.of("/player");

// console.log(players);

players.on("connection", function(socket) {
  console.log("A player client connected: " + socket.id);
  hosts.emit("newplayer", socket.id);
  console.log("newplayer sent");
  socket.on("ready", function() {
    console.log("A player is ready.");
    hosts.emit("playerready", socket.id);
  });

  socket.on("blow", function(force) {
    let force_data = {
      id: socket.id,
      force: force
    };
    hosts.emit("force", force_data);
  });

  socket.on("disconnect", function() {
    console.log("A player client has disconnected " + socket.id);
    hosts.emit("playerdisconnect", socket.id);
  });
});

let hosts = io.of("/host");

hosts.on("connection", function(socket) {
  console.log("A host client connected: " + socket.id);

  // Tell player which position it is
  // after receiving the info from host
  socket.on("position", function(position_data) {
    // position_data is a list, [0] = id, [1] = 'left' / 'right'
    players.emit("playerposition", position_data);
  });

  socket.on("unready", function() {
    players.emit("playerunready");
  });

  socket.on("disconnect", function() {
    console.log("A host client has disconnected " + socket.id);
    players.emit("playerunready");
  });
});
