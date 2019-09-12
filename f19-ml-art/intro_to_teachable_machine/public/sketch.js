/*
Based on ml5 Example: Webcam Image Classification using MobileNet and p5.js.

Peiling Jiang 2019

Thanks to Daniel Shiffman.
*/

let classifier;
let video;
let resultsP;
let label = '';
let imageModel = 'https://storage.googleapis.com/tm-mobilenet/aPPlejpl1/model.json';
// let imageModel = 'model.json';

let egg; let orange; let bread; let tomato; let fish; let apple;
let burger; let fries; let rice; let chicken; let potato; let hotpot;
let bomb;

function preload() {
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  classifier = ml5.imageClassifier(imageModel); 
  loadimg();
}

function setup() {
  createCanvas(320, 240);
  resultsP = createP('Waiting...');
  classifyVideo();
}

function draw() {
  image(video, 0, 0);
  
  if (label == '0') {
    fill(255, 0, 0);
    ellipse(100, 100, 50);
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(video, gotResult);
}

// When we get a result
function gotResult(error, results) {
  console.log(results[0]);
  // The results are in an array ordered by confidence.
  resultsP.html(results[0].label);
  label = results[0].label;
  classifyVideo();
}
