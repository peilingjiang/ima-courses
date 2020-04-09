// This practice is based on ml5 Example: PoseNet example using p5.js
// Peiling Jiang

// 0.0.1
// **Only work with one pose per webcam**

let socket = io();

let users = {};

let video;
let poseNet;
let poses = [];

// Set the center point of the user - around the belly, calculated from
// Shoulder and Hip points
let center_point;

// let average_distance;

let total_distance;
let ratio_distance;

let user_position;
let user_color;
// const a list of point indices that would be used to calsulate center point
const center_points = [5, 6, 11, 12];
// const a list of point indices that would be used to calsulate
// total distance to the center point
const edge_points = [0, 7, 8, 9, 10, 13, 14, 15, 16];

const eye_points = [1, 2];

// Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(25); // Save graphic card
  video = createCapture(VIDEO);
  video.size(640, 480);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();

  // Constrain the position of the ball more into center of the canvas with map()
  user_position = [int(map(random(width), 0, width, width * 0.2, width * 0.8)), int(map(random(height), 0, height, height * 0.2, height * 0.8))];
  user_color = [int(random(150, 200)), int(random(150, 200)), int(random(150, 200))];

  // Receive message from server
  socket.on('message', function(message) {
    // Get id and data from message
    let id = message.id;
    let data = message.data;

    // Update user's data
    if (id in users) {
      let user = users[id];
      user.r_d = data.r_d;
      user.position = data.p;
      user.p = data.p;
      user.c = data.c;
    }
    // Or create a new user
    else {
      users[id] = {
        id: message.id,
        r_d: data.r_d,
        p: user_position, // an array with len of 2
        c: user_color
      }
    }
  });

  // Remove disconnected users
  socket.on('disconnected', function(id) {
    if (id in users) {
      delete users[id];
    }
  });
}

function modelReady() {
  console.log('Model Ready');
}

function draw() {
  // image(video, 0, 0, width, height);
  push();
  background(255, 255, 255, 16);
  pop();

  cal_total_d();

  for (u in users) {
    // Get user's data
    let user = users[u];
    // Get this user's data
    let user_r_d = user.r_d;
    let position = user.p;
    let color = user.c;

    let temp_r_d = map(user_r_d, 25, 65, 10, 900);

    noStroke();
    fill(color[0], color[1], color[2]);
    ellipse(position[0], position[1], temp_r_d, temp_r_d);
  }

  // We can call both functions to draw all keypoints and the skeletons
  // drawKeypoints();
  // drawSkeleton();
}

function cal_total_d() {
  // NOW also calculate ratio distance
  if (poses.length >= 1) {
    let pose = poses[0].pose;
    let total_x = 0;
    let total_y = 0;
    let total_d = 0;
    for (let m of center_points) { // array of int/index, len = 4
      let keypoint = pose.keypoints[m];
      total_x += keypoint.position.x;
      total_y += keypoint.position.y;
    }
    center_point = [total_x / 4, total_y / 4];

    let eye_distance = dist(pose.keypoints[eye_points[0]].position.x, pose.keypoints[eye_points[0]].position.y,
      pose.keypoints[eye_points[1]].position.x, pose.keypoints[eye_points[1]].position.y);

    for (let n of edge_points) {
      keypoint = pose.keypoints[n];
      total_d += dist(center_point[0], center_point[1], keypoint.position.x, keypoint.position.y);
    }

    total_distance = total_d;
    ratio_distance = total_distance / eye_distance;
  }

  // emit cannot be put in draw()
  socket.emit('data', {
    r_d: ratio_distance, // ratio_distance calculated above
    p: user_position,
    c: user_color
  });
}

// --------ORIGINAL POSENET() FUNCTIONS--------

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
      // if (j == 1) {
      //   fill(0, 255, 0);
      //   ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      // }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
