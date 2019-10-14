/*
Based on ml5.js examples.
Based on FacaAPI and PoseNet.

Peiling Jiang
2019

NYU ITP IMA
*/

// Video and PoseNet
let video;
let videoWidth = 800;
let videoHeight = 600;
let poseNet;
let poses = [];

// Only need to get face points in this project
let faceapi;
let detections = [];

// Neural Network
let brain_1;
let brain_2; // Two outputs: 'Not Emit' and 'Emit'
let learnedBrain = 0;

let addButton;
let trainButton;
let saveDataButton;
let saveModelButton;

// Display
let bodyColor = [200, 200, 200];
let emitStatus = false;

let inputColor;
let emitClass = [];
let inputClass = [];

// Only detect face when collecting
let collecting = false;
let selectedClassType = 'U';

function setup() {
    const c = createCanvas(windowWidth, windowHeight);
    video = createCapture(VIDEO);
    video.size(videoWidth, videoHeight);

    // Create a new poseNet method with a single detection
    poseStatusLabel = 2;
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on("pose", function (results) {
        poses = results;
    });

    // face-api.js
    // No need to create faceBrain here
    const faceOptions = {
        withLandmarks: true,
        withExpressions: false,
        withDescriptors: false
    };
    faceStatusLabel = 2;
    faceapi = ml5.faceApi(video, faceOptions, faceReady);

    // Hide the video element, and just show the canvas
    video.hide();

    // The interface
    addButton = new AddButton;
    trainButton = new TrainButton;
    emitClass.push(new EmitClass);

    saveDataButton = new SaveDataButton;
    saveModelButton = new SaveModelButton;

    // Create the model
    let options_1 = {
        inputs: 26,
        outputs: 3,
        task: 'regression',
        debug: true
    };

    let options_2 = {
        inputs: 26,
        outputs: 1,
        task: 'classification',
        debug: false
    };
    // The regression model
    brain_1 = ml5.neuralNetwork(options_1);
    // The categorization model
    brain_2 = ml5.neuralNetwork(options_2);

    c.drop(gotFile);
}

function gotFile(file) {
    if (file.subtype === "json") {
        const dataFile = loadJSON(file.data);
        if (file.name == "poses_data_for_color.json") {
            brain_1.loadData(file.data, dataLoaded);
            // Add to interface
            console.log(dataFile);
            console.log(dataFile['data']);
        } else if (file.name == "poses_data_for_emit.json") {
            brain_2.loadData(file.data, dataLoaded);
        } else {
            console.log('File Name Error');
        }
    } else {
        console.log('File Type Error');
    }
}

function dataLoaded() {
    console.log('Data Loaded');
  }

// Train the model
function trainModel() {
    collecting = false;
    brain_1.normalizeData();
    brain_2.normalizeData();
    let options_1 = {
        learningRate: 0.3,
        hiddenUnits: 64,
        modelLoss: "meanSquaredError",
        epochs: 50
    };

    let options_2 = {
        learningRate: 0.25,
        hiddenUnits: 64,
        modelLoss: "categoricalCrossentropy",
        epochs: 50
    };
    trainStatusLabel = 2;
    brain_1.train(options_1, finishedTraining_1);
    brain_2.train(options_2, finishedTraining_2);
}

// Begin prediction
function finishedTraining_1() {
    console.log("Regression Model Done");
    learnedBrain += 1;
    predict_1();
}

function finishedTraining_2() {
    console.log("Categorization Model Done");
    learnedBrain += 1;
    predict_2();
}

// Make a prediction
function predict_1() {
    if (poses.length > 0) {
        let poseInput = get_body_data(poses);
        // Update color
        brain_1.predict(poseInput, gotResults_1);
    }
}

function predict_2() {
    if (poses.length > 0) {
        let poseInput = get_body_data(poses);
        // Emit or not
        brain_2.predict(poseInput, gotResults_2);
    }
}

function gotResults_1(error, outputs) {
    // Update color
    if (error) {
        console.error(error);
        return;
    }

    // Update bodyColor
    bodyColor = [round(outputs[0].value), round(outputs[1].value), round(outputs[2].value)];
    predict_1();
}

function gotResults_2(error, results) {
    // Emit if needed
    if (error) {
        console.error(error);
        return;
    }

    // Emit
    if (results[0].label === 'Emit') {
        emitStatus = true;
    } else if (results[0].label === 'Not Emit') {
        emitStatus = false;
    }
    // console.log(results);
    predict_2();
}

//  Add a training example
function addExample_1() {
    // Add to brain_1 as color input
    // Add to brain_2 as Not Emit category
    if (poses.length > 0) {
        let poseInput = get_body_data(poses);
        let target = bodyColor;
        // Add data for regression training
        // Input 26, Output 3
        brain_1.addData(poseInput, [target[0], target[1], target[2]]);
        // Add data for categorization training
        // Input 26, Output 1
        brain_2.addData(poseInput, ["Not Emit"]);
    }
}

function addExample_2() {
    // Add to brain_2 as Emit category
    if (poses.length > 0) {
        let poseInput = get_body_data(poses);

        brain_2.addData(poseInput, ["Emit"]);
    }
}

// PoseNet ready
function modelReady() {
    poseStatusLabel = 3;
    console.log("PoseNet Ready");
}

// ---------------------------------------- DRAW ----------------------------------------
function draw() {
    background(255);
    // Draw model status
    draw_hint();

    // Draw video
    push();
    // Move image by the width of image to the left
    translate(width, 0);
    // Then scale it by -1 in the x-axis
    // to flip the image
    scale(-1, 1);
    image(video, (width - videoWidth) / 2, (height - videoHeight) / 2, videoWidth, videoHeight);
    pop();

    // Detect or Not
    if (collecting) {
        faceapi.detect(gotFaces);
    } else {
        detections = [];
    }

    // For one face only
    let mouthStatus = open_or_not(); // true if open

    // Draw collecting hint (tint on video)
    if (collecting && mouthStatus) {
        push();
        fill(71, 228, 187, 32);
        rect((width - videoWidth) / 2, (height - videoHeight) / 2, videoWidth, videoHeight);
        pop();
    }

    // Draw selections
    draw_selection_area();

    // For one pose only
    if (poses.length > 0) {
        let pose = poses[0].pose;

        if (collecting && mouthStatus && !trained) {
            // A color or emit class selected, and mouth is open for collecting data
            if (selectedClassType === 'C') {
                draw_glow(pose);
                addExample_1();
            } else if (selectedClassType === 'E') {
                addExample_2();
            }
        }

        if (trained && learnedBrain === 2) {
            draw_glow(pose);
            trainStatusLabel = 3;
        }
    }
}
// ---------------------------------------- DRAW ----------------------------------------

function get_body_data(p) {
    // This function will be called only when poses.length > 0
    let theP = p[0].pose;
    let nose = theP.nose;
    let shoulders = [theP.leftShoulder, theP.rightShoulder];
    let elbows = [theP.leftElbow, theP.rightElbow];
    let wrists = [theP.leftWrist, theP.rightWrist];
    let hips = [theP.leftHip, theP.rightHip];
    let knees = [theP.leftKnee, theP.rightKnee];
    let ankles = [theP.leftAnkle, theP.rightAnkle];

    let input = [
        nose.x,
        nose.y,
        shoulders[0].x,
        shoulders[0].y,
        shoulders[1].x,
        shoulders[1].y,
        elbows[0].x,
        elbows[0].y,
        elbows[1].x,
        elbows[1].y,
        wrists[0].x,
        wrists[0].y,
        wrists[1].x,
        wrists[1].y,
        hips[0].x,
        hips[0].y,
        hips[1].x,
        hips[1].y,
        knees[0].x,
        knees[0].y,
        knees[1].x,
        knees[1].y,
        ankles[0].x,
        ankles[0].y,
        ankles[1].x,
        ankles[1].y
    ];
    return input;
}
