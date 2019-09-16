// Sound tracks partially from https://github.com/arnofaure/free-sfx.
// Food and Bomb icons from https://emojipedia.org/. Microsoft emoji library.

// things image width and height
const imgW = 67;
const imgH = 67;
// speed(s)
const speed_list = [5.2, 6.17, 6.3];

// the area in the middle of the canvas for things to target and be eatten
let eatingAreaH = 150;

// Use for future random, fully built after buildLists()
let good_list = [];
let bad_list = [];
let bomb_list = [];

let onScreen = []; // array of things on the canvas
let onScreenBomb = []; // array of bombs on the canvas

let good_food = {
    'egg': -5,
    'orange': -5,
    'bread': -5,
    'mooncake': -10,
    'fish': -10,
    'apple': -20
}

let bad_food = {
    'burger': 5,
    'fries': 5,
    'rice': 5,
    'chicken': 10,
    'potato': 10,
    'hotpot': 20
}

let good_dict, bad_dict;

let explosionColor;

// CHANGE POSSIBILITY OF DIFFERENT FOOD AND BOMB HERE
function buildLists() { // Run 1 time
    // build good list with ratio 4:3:1
    for (let i in good_food) {
        if (good_food[i] == -5) {
            for (let j = 0; j < 4; j++) {
                good_list.push(i);
            }
        } else if (good_food[i] == -10) {
            for (j = 0; j < 3; j++) {
                good_list.push(i);
            }
        } else if (good_food[i] == -20) {
            good_list.push(i);
        }
    }

    // build bad list with ratio 4:3:1
    for (i in bad_food) {
        if (bad_food[i] == 5) {
            for (j = 0; j < 4; j++) {
                bad_list.push(i);
            }
        } else if (bad_food[i] == 10) {
            for (j = 0; j < 3; j++) {
                bad_list.push(i);
            }
        } else if (bad_food[i] == 20) {
            bad_list.push(i);
        }
    }

    // buid bomb list with 1/12 possibility of bombing
    for (i = 0; i < 11; i++) {
        bomb_list.push(false);
    }
    bomb_list.push(true);
}

let bomb_warning;
let tIcon, wIcon;
let end_winImg, end_overImg;

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
    bomb_warning = loadImage('assets/bomb_warning.png');

    tIcon = loadImage('assets/t.png');
    wIcon = loadImage('assets/w.png');
    end_winImg = loadImage('assets/end_win.png');
    end_overImg = loadImage('assets/end_over.png');

    console.log('Photos successfully preloaded.');

    buildLists();

    thing_dict = {
        'egg': eggImg,
        'orange': orangeImg,
        'bread': breadImg,
        'mooncake': mooncakeImg,
        'fish': fishImg,
        'apple': appleImg,
        'burger': burgerImg,
        'fries': friesImg,
        'rice': riceImg,
        'chicken': chickenImg,
        'potato': potatoImg,
        'hotpot': hotpotImg,
        'bomb': bombImg
    }

    console.log('Lists (or Array) successfully built.');
}

let introSound, bgSound;
let shootSound, bombShootSound, eatGoodSound, eatBadSound, explosionSound, winSound, overSound;

function loadsound() {
    // introSound = loadSound('assets/intro.mp3');
    shootSound = loadSound('assets/shoot.mp3');
    eatGoodSound = loadSound('assets/good.mp3');
    eatBadSound = loadSound('assets/bad.mp3');
    bombShootSound = loadSound('assets/bomb_warning.wav');
    explosionSound = loadSound('assets/boom.wav');
    winSound = loadSound('assets/congrats.mp3');
    overSound = loadSound('assets/over.wav');

    console.log('Sounds successfully preloaded.');
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
const maxGap = 100;
const minGap = 70;
const maxNum = 2;
let newNum;
let newGap = maxGap;
let bomb_or_not;

function newThing() {
    // TIME GAP - no need to shoot everytime
    if (time % newGap == 0) {
        // Shoot new thing(s)

        // Shoot good food
        newNum = int(random(maxNum));
        for (let f = 0; f < newNum; f++) {
            shoot('good');
        }
        // Shoot bad food
        newNum = int(random(maxNum));
        for (f = 0; f < newNum; f++) {
            shoot('bad');
        }
        // Shoot bomb
        bomb_or_not = random(bomb_list);
        if (bomb_or_not) {
            // bomb_or_not == true
            shoot('bomb');
        }
        newGap = int(random(minGap, maxGap));
    }
}

let tempThing;
let tempStr;

function helper_which_to_shoot(k) {
    // randomly pick one kind for shooter function to shoot
    // bomb is not shot here, directly from shoot()
    if (k == 'good') {
        return random(good_list);
    } else if (k == 'bad') {
        return random(bad_list);
    }
}

function shoot(kind) {
    if (kind == 'good' || kind == 'bad') {
        tempStr = helper_which_to_shoot(kind);
        tempThing = new Thing(tempStr);
        onScreen.push(tempThing);
    } else if (kind == 'bomb') {
        tempThing = new Bomb();
        onScreenBomb.push(tempThing);
    }
}

let bShot = 0;

function boostShoot() {
    if (time % 10 == 0) { // boostShoot per 10 sec
        tempStr = helper_which_to_shoot('good');
        while (tempStr === 'apple') {
            // avoid repeated boostshoot
            tempStr = helper_which_to_shoot('good');
        }
        tempThing = new Thing(tempStr, true);
        onScreen.push(tempThing);
        bShot += 1;
    }
    if (bShot == 10) {
        toBoostShoot = false;
    }
}

class Thing { // start with a string
    constructor(thingStr, b = false) {
        shootSound.play();
        this.booster = b;
        this.t = 0;
        this.start = [startlocX(), startlocY()]; // const for an object
        this.x = this.start[0];
        this.y = this.start[1];
        this.width = imgW; // const at the beginning
        this.height = imgH;

        this.kind = thing_dict[thingStr]; // food img
        this.str = thingStr; // food name

        this.speed = random(speed_list);

        // boostShoot food always target at the center of canvas
        if (this.booster == true) {
            this.target = [width / 2, height / 2];
        } else {
            this.target = initTarget(); // array [targetX, targetY]
        }
        
        this.sin = (this.target[1] - this.start[1]) / sqrt((this.target[0] - this.start[0]) ** 2 + (this.target[1] - this.start[1]) ** 2);
        this.cos = (this.target[0] - this.start[0]) / sqrt((this.target[0] - this.start[0]) ** 2 + (this.target[1] - this.start[1]) ** 2);
        // console.log(this.sin**2 + this.cos**2);

        // deltaWeight
        // bomb doesn't have
        if (thingStr in good_food) {
            this.deltaWeight = good_food[thingStr];
        } else if (thingStr in bad_food) {
            this.deltaWeight = bad_food[thingStr];
        }

        this.eaten = false;

        this.alpha = 255;
    }

    move() {
        if (!this.eaten) {
            this.x += this.speed * this.cos;
            this.y += this.speed * this.sin;
            this.t += 1;
        }
    }

    display() {
        // debug with line from start point to target point
        // line(this.start[0], this.start[1], this.target[0], this.target[1]);
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.speed * this.t * 0.036); // spinning speed
        image(this.kind, 0, 0, this.width, this.height);
        pop();
    }

    disappearDisplay() {
        this.alpha -= 12; // control the speed of disappearing
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.speed * this.t * 0.036); // final position
        tint(255, this.alpha);
        image(this.kind, 0, 0, this.width, this.height);
        pop();
    }

    getArea() {
        // return int: 1 if Left, 2 if Center, 3 if Right
        if (0 <= this.x && this.x < width / 3) {
            return 1;
        } else if (width / 3 <= this.x && this.x < 2 * (width / 3)) {
            return 2;
        } else if (2 * (width / 3) <= this.x && this.x <= width) {
            return 3;
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getEdible() {
        return this.edible;
    }

    getEaten() {
        // get eaten or not eaten status
        return this.eaten;
    }

    eatEaten() {
        // eat()
        this.eaten = true;
    }

    getDeltaWeight() {
        return this.deltaWeight;
    }

    setDeltaWeight(num) {
        this.deltaWeight = num;
    }

    getAlpha() {
        return this.alpha;
    }

    getName() {
        return this.str;
    }

}

class Bomb {
    constructor() {
        bombShootSound.play();
        this.t = 0;
        this.start = [startlocX(), startlocY()]; // const for an object
        this.x = this.start[0];
        this.y = this.start[1];
        this.width = imgW; // const at the beginning
        this.height = imgH;

        this.kind = thing_dict['bomb']; // 'bomb'

        this.speed = random(speed_list) * 0.8;
        this.target = initTarget(); // array [targetX, targetY]
        this.sin = (this.target[1] - this.start[1]) / sqrt((this.target[0] - this.start[0]) ** 2 + (this.target[1] - this.start[1]) ** 2);
        this.cos = (this.target[0] - this.start[0]) / sqrt((this.target[0] - this.start[0]) ** 2 + (this.target[1] - this.start[1]) ** 2);

        // bomb doesn't have delta

        this.alpha = 255;

        this.bombed = false;
        this.bombedTime = 0;
        this.boomSounded = false; // not played the sound

    }

    move() {
        if (!this.bombed) {
            this.x += this.speed * this.cos;
            this.y += this.speed * this.sin;
            this.t += 1
        }

        if (this.t >= countdown && !haveWon) { // deactive bomb if won
            if (!this.boomSounded) {
                explosionSound.rate(1.25);
                explosionSound.play();
                this.boomSounded = true;
            }
            this.bombed = true;
            this.bombedTime += 1;
        }
    }

    display() {
        // debug with line from start point to target point
        // line(this.start[0], this.start[1], this.target[0], this.target[1]);
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.speed * this.t * 0.02);
        image(this.kind, 0, 0, this.width, this.height);
        pop();

        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.speed * this.t * 0.02);
        tint(255, 128 + 128 * sin(millis() / 100))
        image(bomb_warning, 0, 0, this.width, this.height);
        pop();
    }

    disappearDisplay() {
        // the white explosion
        push();
        noStroke();
        explosionColor = color(255, 255, 255, this.alpha);
        fill(explosionColor);
        rect(-10, -10, width + 20, height + 20);
        pop();
        this.alpha -= 4; // control the speed of disappearing
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.speed * this.t * 0.02); // final position
        tint(255, this.alpha);
        image(this.kind, 0, 0, this.width, this.height);
        pop();
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getAlpha() {
        return this.alpha;
    }

    getBombed() {
        return this.bombed;
    }

    getBombedTime() {
        return this.bombedTime;
    }

}

function initTarget() {
    return [int(random(width)), int(random(height / 2 - eatingAreaH / 2, height / 2 + eatingAreaH / 2))];
}