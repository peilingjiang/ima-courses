// import {
//     SSL_OP_NO_QUERY_MTU
// } from "constants";

// import {
//     randomBytes
// } from "crypto";

// things image width and height
const imgW = 64;
const imgH = 64;
// speed(s)
const speed_list = [3.05, 3.4, 3.9];

// the area in the middle of the canvas for things to target and be eatten
let eatingAreaH = 180;

// Use for future random, fully built after buildLists()
let good_list = [];
let bad_list = [];
let bomb_list = [];

let onScreen = []; // array of things on the canvas

let good_food = {
    'egg': -5,
    'orange': -5,
    'bread': -5,
    'mooncake': -10,
    'fish': -10,
    'apple': -15
}

let bad_food = {
    'burger': 5,
    'fries': 5,
    'rice': 5,
    'chicken': 10,
    'potato': 10,
    'hotpot': 15
}

function buildLists() { // Run 1 time
    // build good list with ratio 5:3:1
    for (let i in good_food) {
        if (good_food[i] == -5) {
            for (let j = 0; j < 5; j++) {
                good_list.push(i);
            }
        } else if (good_food[i] == -10) {
            for (j = 0; j < 3; j++) {
                good_list.push(i);
            }
        } else if (good_food[i] == -15) {
            good_list.push(i);
        }
    }

    // build bad list with ratio 5:3:1
    for (i in bad_food) {
        if (bad_food[i] == 5) {
            for (j = 0; j < 5; j++) {
                bad_list.push(i);
            }
        } else if (bad_food[i] == 10) {
            for (j = 0; j < 3; j++) {
                bad_list.push(i);
            }
        } else if (bad_food[i] == 15) {
            bad_list.push(i);
        }
    }

    // buid bomb list with 0.1 possibility of bombing
    for (i = 0; i < 59; i++) {
        bomb_list.push(false);
    }
    bomb_list.push(true);
}

let good_img_list; let good_str_list;
let bad_img_list; let bad_str_list;

function loadimg() {
    // All functions here run 1 time
    const eggImg = loadImage('assets/egg.png');
    const orangeImg = loadImage('assets/orange.png');
    const breadImg = loadImage('assets/bread.png');
    const mooncakeImg = loadImage('assets/mooncake.png');
    const fishImg = loadImage('assets/fish.png');
    const appleImg = loadImage('assets/apple.png');

    const burgerImg = loadImage('assets/burger.png');
    const friesImg = loadImage('assets/fries.png');
    const riceImg = loadImage('assets/rice.png');
    const chickenImg = loadImage('assets/chicken.png');
    const potatoImg = loadImage('assets/potato.png');
    const hotpotImg = loadImage('assets/hotpot.png');

    const bombImg = loadImage('assets/bomb.png');

    console.log('Photos successfully preloaded.');
    buildLists();
    good_img_list = [eggImg, orangeImg, breadImg, mooncakeImg, fishImg, appleImg];
    good_str_list = ['egg', 'orange', 'bread', 'mooncake', 'fish', 'apple']
    bad_img_list = [burgerImg, friesImg, riceImg, chickenImg, potatoImg, hotpotImg];
    bad_str_list = ['burger', 'fries', 'rice', 'chicken', 'potato', 'hotpot']
    console.log('All lists (or array) successfully built.');
}

function startlocX() {
    // randomly set the start **X** point of coming things
    return random([-(imgW / 2), width / 2, width + imgW / 2]);
}

function startlocY() {
    // randomly set the start **Y** point of coming things
    return random([-(imgH / 2), height + imgH / 2]);
}

// How many (of one kind) could be shot at one time
const maxGap = 120;
const minGap = 60;
const maxNum = 1;
let newNum;
let newGap = maxGap;
let bomb_or_not;

function newThing() {
    // TIME GAP - no need to shoot everytime
    if (time % newGap == 0) {
        // Shoot new thing(s)

        // Shoot good food
        newNum = 1;
        for (let f = 0; f < newNum; f++) {
            shoot('good');
        }
        // // Shoot bad food
        // newNum = int(random(maxNum));
        // for (f = 0; f < newNum; f++) {
        //     shoot('bad');
        // }
        // // Shoot bomb
        // bomb_or_not = random(bomb_list);
        // if (bomb_or_not) {
        //     // bomb_or_not == true
        //     shoot('bomb');
        // }
        newGap = int(random(minGap, maxGap));
    }
}

let tempThing;
let tempStr;

function helper_which_to_shoot(k) {
    // randomly pick one kind for shooter function to shoot
    // bomb is not shot here, directly from shoot()
    if (k == 'good') {
        tempStr = random(good_list);
        return good_img_list[good_str_list.indexOf(tempStr)];
    } else if (k == 'bad') {
        tempStr = random(bad_list);
        return bad_img_list[bad_str_list.indexOf(tempStr)];
    }
}

function shoot(kind) {
    if (kind == 'good' || kind == 'bad') {
        tempThing = new Thing(helper_which_to_shoot(kind));
        onScreen.push(tempThing);
    } else if (kind == 'bomb') {

    }
}

// let tempIndex;

class Thing {
    constructor(thingImg, b = false) {
        // thingImg is eggImg, etc.
        this.booster = b;
        // this.t = 0;
        this.start = [startlocX(), startlocY()]; // const for an object
        this.x = this.start[0];
        this.y = this.start[1];
        this.width = imgW; // const at the beginning
        this.height = imgH;
        this.kind = thingImg;
        this.speed = random(speed_list);
        this.target = initTarget(); // array [targetX, targetY]
        console.log(this.target);
        this.sin = (this.target[1] - this.start[1]) / sqrt((this.target[0] - this.start[0])**2 + (this.target[1] - this.start[1])**2);
        this.cos = (this.target[0] - this.start[0]) / sqrt((this.target[0] - this.start[0])**2 + (this.target[1] - this.start[1])**2);
        // console.log(this.sin**2 + this.cos**2);

        if (thingImg in good_img_list == true) {
            // good food
            this.deltaWeight = good_food[good_str_list[good_img_list.indexOf(thingImg)]]; // shall be -5, -10, -15
        } else if (thingImg in bad_img_list == true) {
            // bad food
            this.deltaWeight = bad_food[bad_str_list[bad_img_list.indexOf(thingImg)]]; // shall be 5, 10, 15
        }
    }

    move() {
        this.x += this.speed * this.cos;
        this.y += this.speed * this.sin;

        // rotate
        // ...
    }

    display() {
        // debug with line from start point to target point
        // line(this.start[0], this.start[1], this.target[0], this.target[1]);
        push();
        imageMode(CENTER);
        image(this.kind, this.x, this.y, this.width, this.height);
        pop();
    }

    getArea() {
        // return int: 1 if Left, 2 if Center, 3 if Right
        if (0 <= x && x < width / 3) {
            return 1;
        } else if (width / 3 <= x && x < 2 * (width / 3)) {
            return 2;
        } else if (2 * (width / 3) <= x && x <= width) {
            return 3;
        }
    }
}

class Bomb extends Thing {
    constructor(thingImg, b = false) {
        this.booster = false;

    }
}

function initTarget() {
    return [int(random(width)), int(random(height / 2 - eatingAreaH / 2, height / 2 + eatingAreaH / 2))];
}