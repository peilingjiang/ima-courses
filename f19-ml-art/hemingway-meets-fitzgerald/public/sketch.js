/*
Based on Ellen Nickles's project.
*/

let charRNN;
let textInput;

let modelIsReady = false
let runningInference = false;
let autoGenerating = false;
let hasGenerated = false;

let hText = '';
let fText = '';
let currentText = '';
let gTextLen = 0;

// function preload() {
//   read_books();
// }

function setup() {
  noCanvas();
  frameRate(30);

  // Create the charRNN generator passing it the model directory
  charRNN = ml5.charRNN('./models/h-m-f/', modelReady);

  // Grab the DOM elements
  textInput = select('#textInput');

  // DOM element events
  select('#reset').mousePressed(onResetButton);
  select('#generate').mousePressed(onGenerateButton);
}

function modelReady() {
  select('#status').html('Loaded ' + new Date().toLocaleString());
  modelIsReady = true;
}

// Read and seed with full text from input box
function generateWithInput() {
  gTextLen = 0;
  currentText = textInput.value();
  generate(currentText, false);
}

function generateWithChar() {
  generate(currentText.slice(-1), true);
}

// Update UI with current text
function updateTextUI() {
  select('#result_hf').html(currentText);
}

// Clear current text, stop auto-generating
function onResetButton() {
  gTextLen = 0;
  currentText = '';
  updateTextUI();
  autoGenerating = false;
  select('#result_h').html();
  select('#result_f').html();
}

// Start auto-generating
function onGenerateButton() {
  currentText = '';
  updateTextUI();
  generateWithInput()
  autoGenerating = true;
}

// Generate new text
function generate(seed, stateful) {
   // prevent starting inference if we've already started another instance
  if(!runningInference) {
    runningInference = true;

    // Update the status log
    select('#status').html('Generating...');

    let data = {
      seed: seed,
      temperature: 0.45,
      length: 1,
      stateful: stateful,
    };

    // Generate text
    charRNN.generate(data, gotData);

    // When it's finished
    function gotData(err, result) {
      if(result) {
        // If the result is not a period, add output sample to current text
        var str = result.sample;
        var check = str.startsWith(".") || str.startsWith("?") || str.startsWith("\"") || str.startsWith("!");

        if (check) {
          // console.log("a period!");
          autoGenerating = false;
        }

        // if (gTextLen >= int(random(300, 500))) {
        //   autoGenerating = false;
        // }

        currentText += str;
        updateTextUI();
        hasGenerated = true;
      }
      runningInference = false;
    }
  }
}

function draw() {
  if (modelIsReady && autoGenerating) {
    generateWithChar();
    gTextLen++;
  } else if (modelReady && hasGenerated && !autoGenerating) {
    // Update the status log
    status = 'Ready! '
    select('#status').html(status);
  }
}
