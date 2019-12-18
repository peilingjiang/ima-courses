let debug = false;
let difficulty = 1;

// Numbers
let midWidth;
let midHeight;

let balloonHeight;
// Affected by difficulty
let pathR; // Radius of the path, d = 2r
let balloonR;
let friction; // Bigger, blow slower and shorter distance

let pathStartPoint;
let pathNextEndX = [-520, 520]; // Delta
let pathNextEndY = [-400, -75];

let upSpeed; // The speed flying up, the distance paths moved every frame

let score = 0;

// force is leftForce + rightForce, +!
let force;
let leftForce = 0;
let rightForce = 0; // Updated individually everytime receive 'blow' message

// Objects
let bg; // The background object
let balloon;

let init_path; // First path
let now_path = []; // the current path the balloon is in, a list

// Others
let divideProp; // The probability of dividing into two paths

let game_end = false;
let game_status = "not";

var n_p;
var k;
// var n_start, n_end;
var distance;
