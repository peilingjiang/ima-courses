// Open and connect socket
let socket = io("/host");
// Create user directory
let users = {
  left: null,
  right: null
};
let readyPlayer = {
  left: false,
  right: false
};

let fontRegular, fontBold;

socket.on("connect", function() {
  console.log("Connected");
});

function setup() {
  fontRegular = loadFont(
    "https://cdn.glitch.com/ce1715c9-8b34-4483-a63a-22cf3c668b47%2FAmaticSC-Bold.ttf?v=1575939723505"
  );
  fontBold = loadFont(
    "https://cdn.glitch.com/ce1715c9-8b34-4483-a63a-22cf3c668b47%2FAmaticSC-Bold.ttf?v=1575939723505"
  );

  frameRate(60);
  // scale(0.2);
  createCanvas(windowWidth, windowHeight);

  midWidth = windowWidth / 2;
  midHeight = windowHeight / 2;
  balloonHeight = windowHeight * 0.617;

  pathStartPoint = [midWidth, windowHeight];

  // divideProp = setDivideProp();
  divideProp = [1];
  interpret_difficulty(difficulty);

  bg = new Background();
  balloon = new Balloon(balloonR);
  init_path = new Path([midWidth, windowHeight], [midWidth, 0]);
  init_path.nowPath = true; // Not recommended!
  now_path.push(init_path);

  socket.on("newplayer", function(id) {
    if (users.left == null) {
      users.left = id;
      socket.emit("position", [id, "left"]);
      console.log("LLL JJJ Left player join.");
    } else if (users.right == null) {
      users.right = id;
      socket.emit("position", [id, "right"]);
      console.log("RRR JJJ Right player join.");
    } else {
      console.log("MMM More than 2 players are trying to join. Rejected.");
    }
  });

  socket.on("playerdisconnect", function(id) {
    if (users.left == id) {
      users.left = null;
      readyPlayer.left = false;
      console.log("LLL LLL Left player left.");
    } else if (users.right == id) {
      users.right = null;
      readyPlayer.right = false;
      console.log("RRR LLL Right player left.");
    }

    if (game_status == "in") {
      game_end = true;
    }
  });

  socket.on("force", function(f_d) {
    // console.log("force received", f_d);
    if (f_d.id == users.left) {
      // Left player blew
      leftForce = f_d.force;
    } else if (f_d.id == users.right) {
      // Right player trying to blow the balloon to left
      rightForce = -f_d.force;
    }
  });

  socket.on("playerready", function(id) {
    if (users.left == id) {
      readyPlayer.left = true;
      console.log("LLL RRR Left player ready.");
    } else if (users.right == id) {
      readyPlayer.right = true;
      console.log("LLL RRR Right player ready.");
    }
  });
}

function draw() {
  /*
  Draw three layers:
  1 Background: moving vertically
  2 Path: moving vertically
  3 Balloon: moving horizontally
  */
  // Generate new paths if needed
  if (now_path.length > 0) {
    if (now_path[0].checkLength() < 5) {
      for (let n in now_path) {
        now_path[n].addFollower(5);
      }
    }
  }

  if (debug) {
    if (game_end) {
      game_status = "lost";
    } else {
      game_status = "in";
    }
  } else {
    game_status = check_game();
  }

  if (game_status == "in") {
    score++;
    // shift path, bg
    init_path.shift();
    init_path.resetshifted();
    bg.shift();

    // blow path, bg
    if (debug) {
      rightForce = 0;
      leftForce = 0;
      if (keyIsDown(37)) {
        rightForce = -4;
      }
      if (keyIsDown(39)) {
        leftForce = 4;
      }
    }

    // force = (leftForce + rightForce) * (1 / friction);
    force = leftForce + rightForce;
    init_path.blow(force);
    bg.blow(force);

    // update Now path
    init_path.updateNowPath(balloon);

    // Check if balloon touch path
    check_touch(balloon);
    // Update render
    init_path.updaterender();
  } else if (game_status == "lost") {
    // Allow to reset
    if (keyIsDown(82)) {
      reset();
    }
  } else {
    // Not started or just rest
  }

  // Draw all things
  bg.display();
  init_path.display();
  balloon.display();

  // Draw score
  if (game_status == "in" || game_status == "lost") {
    push();

    fill(255);
    noStroke();
    rect(80, 95, 120, 50);

    textSize(32);

    textFont(fontBold);
    fill(128 + sin(frameCount * 0.1) * 128);
    text("Score: " + floor(score / 60), 100, 100, 200, 200);
    pop();
  }

  // Draw reset reminder
  if (game_status == "lost") {
    push();
    textFont(fontBold);
    fill(225);
    strokeWeight(10);
    stroke(225);
    fill(28);
    rect(350, 250, 750, 250);

    strokeWeight(5);
    textSize(80);
    text("Your Score: " + floor(score / 60), 570, 350);

    textFont(fontRegular);
    fill(225);
    strokeWeight(0);
    textSize(40);
    text("Press R to restart!", 620, 450);

    console.log("press R to restart");
    //alert('Press R to restart!');

    pop();
  }
}

// Helper functions

function is_in_now_path(path_obj) {
  for (let n in now_path) {
    if (now_path[n] === path_obj) {
      return true;
    }
  }
  return false;
}

function check_touch(b) {
  if (now_path.length == 0) {
    game_end = true;
    // throw 'ERROR from developer: OUT OF PATH';
  }
}

function _helper_distance(path, b) {
  // b is balloon object
  if (path.start[0] != path.end[0]) {
    k = (path.start[1] - path.end[1]) / (path.start[0] - path.end[0]);
    return (
      abs(k * b.x - b.y + path.start[1] - k * path.start[0]) / sqrt(sq(k) + 1)
    );
  } else {
    return abs(b.x - path.start[0]);
  }
}

function reset() {
  game_status = "in";
  game_end = false;
  // readyPlayer.left = false;
  // readyPlayer.right = false;
  // socket.emit("unready", socket.id);

  score = 0;
  init_path = null;
  now_path = [];
  init_path = new Path([midWidth, windowHeight], [midWidth, 50]);
  init_path.nowPath = true; // Not recommended!
  now_path.push(init_path);
}

function check_game() {
  // 'in' 'lost' 'not'
  if (game_end) {
    return "lost";
  } else if (if_both_ready()) {
    return "in";
  } else {
    return "not";
  }
}

function if_both_ready() {
  if (readyPlayer.left && readyPlayer.right) {
    return true;
  } else {
    return false;
  }
}

function interpret_difficulty(d) {
  if (d == 1) {
    pathR = 180;
    upSpeed = 1;
    balloonR = pathR * 0.21;
    friction = 0.6; // 0 < friction < 1
  }
}
