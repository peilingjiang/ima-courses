// Based on ml5 example of PoseNet example using p5.js by ml5js.org
// Based on ml5 example with p5.serialport using Binary Serial Data by Ellen Nickles
//
// Heather Kim and Peiling Jiang
//
// 2019

let serial;

let video;
let poseNet;
let poses = [];

let img;
let fr;

let playPose; // having correct pose or not
let playing; // is playing or not
let vel; // the velocity of playing

let keyParts = {
  'nose': 0,
  'leftShoulder': 5,
  'rightShoulder': 6,
  'leftElbow': 7,
  'rightElbow': 8,
  'leftWrist': 9,
  'rightWrist': 10,
  'leftHip': 11,
  'rightHip': 12
};

let playPosePoints = {
  'nose': [348, 155],
  'leftShoulder': [250, 270],
  'rightShoulder': [435, 275],
  'leftElbow': [125, 360],
  'rightElbow': [542, 370],
  'leftWrist': [95, 240],
  'rightWrist': [410, 360]
}

let displaySafeR = 25;
let safeR = 50;

function setup() {
  createCanvas(640, 480);

  // Instantiate our SerialPort object
  serial = new p5.SerialPort();
  // List the ports available
  serial.list();
  // Fill in your serial port name here
  serial.open("/dev/tty.usbmodem14301"); // <-- double-check this!

  // Serial port callbacks
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);

  fr = 60;
  frameRate(fr);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log('model ready');
  // Only initial points when model is ready
  newPoints();
}

function draw() {

  // VIDEO
  push();
  // Move image by the width of image to the left
  translate(video.width, 0);
  // Then scale it by -1 in the x-axis
  // to flip the image
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  newPoints();
  updateKeypoints();

  if (is_playPose()) { // Start playing
    drawText();
    drawStandard(16);
    playViolin();
  } else { // Not playing
    drawStandard(72);
    serial.write(0);
  }

  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  push();
  noStroke();
  fill(color('#ed5107'));
  for (let i in allPoints) {
    if (i in keyParts) {
      // textSize(18);
      // text(int(allPoints[i].getX()) + '  ' + int(allPoints[i].getY()), allPoints[i].getX() + 5, allPoints[i].getY() - 8);
      ellipse(allPoints[i].getX(), allPoints[i].getY(), 16, 16);
    }
  }
  pop();
}

function drawStandard(fillAlpha) {
  push();
  noStroke();
  fill(255, 255, 255, fillAlpha);
  for (let i in playPosePoints) {
    ellipse(playPosePoints[i][0], playPosePoints[i][1], 2 * displaySafeR, 2 * displaySafeR);
  }
  pop();
}

function drawText() {
  push();
  fill(255);
  noStroke();
  textStyle(BOLD);
  textFont('Avenir', 32);
  textFont('Inconsolata', 32);
  text('The violinist is prepared.', 32, 42); // text
  pop();
}

let offTime = 101; // Won't change playing status if pose only off for less than ~1 sec

function is_playPose() {
  let off;

  if ('nose' in allPoints &&
    'leftShoulder' in allPoints &&
    'rightShoulder' in allPoints &&
    'leftElbow' in allPoints &&
    'leftWrist' in allPoints &&
    'rightElbow' in allPoints) {
      // LOOP
    for (let i in allPoints) {
      if (i in playPosePoints && dist(allPoints[i].getX(), allPoints[i].getY(), playPosePoints[i][0], playPosePoints[i][1]) > safeR) {
        off = true;
        break;
      } else {
        off = false;
      }
    }
    // LOOP END
    if (!off) {
      offTime = 0;
      return true;
    } else if (off) {
      if (offTime > 100) {
        return false;
      } else {
        // Not off long enough
        offTime += 1;
        return true;
      }
    }
  } else {
    // Not all points detected
    return false;
  }
}

///////////  Serial port functions ///////////

function serverConnected() {
  print("Connected to Server");
}

function gotList(thelist) {
  print("List of Serial Ports:");
  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}

function gotOpen() {
  print("Serial Port is Open");
}

function gotClose() {
  print("Serial Port is Closed");
}

function gotError(theerror) {
  print(theerror);
}
