/*
Based on ml5 Example: Webcam Image Classification using MobileNet and p5.js.

Peiling Jiang 2019

#Peiling's first p5.js project.

Thanks to Daniel Shiffman and Youtube.
*/

/*
Labels:
Escaped          - 0 Label starts from 0!
Left and Close   - 5
Left and Open    - 6
Center and Close - 3
Center and Open  - 4
Right and Close  - 1
Right and Open   - 2 Video flipped with no reason!
*/

/*
How to train a new model:
escape - stay at left side - stay at center - stay at right side;
close - open
*/

let classifier;
let video;
let resultsP;
let label = '';
let imageModel = 'https://storage.googleapis.com/tm-mobilenet/applejpl2/model.json';
// let imageModel = 'model.json';

let weight = 160;
let mouthOpen = false;
let position = 0; // Left - 1, Center - 2, Right - 3, Not in - 0
let timeLeft = 300;

// debug
// position and mouthOpening identifier
let labelIdentifier = true;
// eating area identifier
let eatingAreaIdentifier = true;

let mainColor;
let lightColor;
let c;
let areaColor;

let intro_page;

function preload() {
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  classifier = ml5.imageClassifier(imageModel);
  loadimg(); // load all image and build all lists
  loadsound();

  intro_page = loadImage('assets/intro.png');
}

function setup() {
  mainColor = color('#ff4893');
  lightColor = color('#f8f8f8');

  createCanvas(640, 480);

  background(mainColor);
  image(intro_page, 0, 0, width, height);
  // resultsP = createP('Waiting...');
  classifyVideo();
}

let game = false; // boolean define whether in game or not
let played = false;

function drawVideo() {
  push();
  // Move image by the width of image to the left
  translate(video.width, 0);
  // Then scale it by -1 in the x-axis
  // to flip the image
  scale(-1, 1);
  image(video, 0, 0);
  pop();
}

function draw() {

  if (!game && !played) {

    background(mainColor);
    image(intro_page, 0, 0, width, height);

  } else if (!game && played && !haveWon) {
    // played and failed
    drawVideo();
    timestep();
    image(end_overImg, 0, 0, width, height);

  } else if (!game && played && haveWon) {
    // played and Won
    drawVideo();
    timestep();
    image(end_winImg, 0, 0, width, height);

  } else {
    // game and played(ing)

    // GAME START

    drawVideo();

    // draw helper rect of eating area
    drawEatingArea();

    // Run the game 1 second by 1 second
    timestep();
  }

}

function keyPressed() {
  if (keyCode == 69) { // KeyCode of key E/e is 69
    console.log('Game started.');
    game = true;
    played = true;
    haveWon = false;
    initVs();
    // introSound.stop();
  }
}

function initVs() {
  // initial variables
  time = 0;
  weight = 160;
  mouthOpen = false;
  position = 0;
  timeLeft = 300;
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(video, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // console.log(results[0]);
  // The results are in an array ordered by confidence.
  // resultsP.html(results[0].label);
  label = results[0].label;
  classifyVideo();
}