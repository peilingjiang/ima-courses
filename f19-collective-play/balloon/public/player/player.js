let mic;

let selfPosition = null;
let ready = false;

// Open and connect socket
let socket = io("/player");

socket.on("connect", function() {
  console.log("Connected");
});

let fontRegular, fontBold;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  // By default, it does not .connect() (to the computer speakers)
  mic.start();

  socket.on("playerposition", function(player_data) {
    // player_data is a list [0]id [1]'left'/'right'
    if (player_data[0] == socket.id) {
      selfPosition = player_data[1];
    }
  });

  socket.on("playerunready", function() {
    ready = false;
  });

  fontRegular = loadFont(
    "https://cdn.glitch.com/ce1715c9-8b34-4483-a63a-22cf3c668b47%2FAmaticSC-Bold.ttf?v=1575939723505"
  );
  fontBold = loadFont(
    "https://cdn.glitch.com/ce1715c9-8b34-4483-a63a-22cf3c668b47%2FAmaticSC-Bold.ttf?v=1575939723505"
  );
}

function draw() {
  background(225);

  // Get the overall volume (between 0 and 1.0)
  let vol = mic.getLevel();
  // console.log(vol);

  if (selfPosition == "left") {
    textFont(fontRegular);
    textSize(20);
    text("POSITION: LEFT", 650, 150);
  } else if (selfPosition == "right") {
    textFont(fontRegular);
    textSize(20);
    text("POSITION: RIGHT", 650, 150);
  }

  if (!ready) {
    textFont(fontRegular);
    textSize(30);
    text("Blow into the microphone to get ready!", 550, 100);
    if (vol > 0.25) {
      emit_ready();
      ready = true;
    }
  } else {
    // Ready
    ellipse(windowWidth / 2, windowHeight / 2, map(vol, 0, 1, 0, 500));
    emit_vol(vol);
  }
}

function emit_ready() {
  socket.emit("ready", socket.id);
}

function emit_vol(v) {
  v = map(v, 0, 1, 0, 20);
  socket.emit("blow", v);
}
