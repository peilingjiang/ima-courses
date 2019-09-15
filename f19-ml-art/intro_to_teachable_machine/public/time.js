let time = 0;
let haveEaten = false; // No need to update weight if not eat
let haveWon = false;
let toBoostShoot = false;

// bomb countdown
let countdown = 100; // less than 2s

function timestep() {

    time += 1; // ABSOLUTE TIME

    // Update both body position and mouthOpen
    checkPosition();
    drawIdentifier();
    // Update things position
    updateThings();
    // Check bomb
    bomb(); // game might stop here

    if (game) {
        // Shoot new things
        newThing();
        if (toBoostShoot) {
            boostShoot();
        }
        // Check eat
        eat();
        // Calculate weight
        if (haveEaten) {
            updateWeight();
        }
        // Check if have won
        if (weight === 0 && timeLeft >= 0) {
            // WON! aPPle!
            haveWon = true;
            game = false;
        }
        // Update timeLeft
        timeLeft -= 0.1;
        checkOver();
    }

    // DISPLAY ALL
    displayDisappearThings();
    displayThings();
    displayTimeLeft();
    displayWeight();
}

function checkOver() {
    if (timeLeft < 0) {
        timeLeft = 0; // avoid negative number
    }
    if (timeLeft <= 0) {
        haveWon = false;
        game = false;
    }
}

function checkPosition() {
    // Update both body position and mouthOpen
    if (label == '0') {
        position = 0;
        mouthOpen = false; // Escaped
    } else if (label == '1') {
        position = 3;
        mouthOpen = false; // Right and Close
    } else if (label == '2') {
        position = 3;
        mouthOpen = true; // Right and Open
    } else if (label == '3') {
        position = 2;
        mouthOpen = false; // Center and Close
    } else if (label == '4') {
        position = 2;
        mouthOpen = true; // Center and Open
    } else if (label == '5') {
        position = 1;
        mouthOpen = false; // Left and Close
    } else if (label == '6') {
        position = 1;
        mouthOpen = true; // Left and Open
    }
}

function bomb() {
    if (onScreenBomb.length !== 0) {
        for (t = 0; t < onScreenBomb.length; t++) {
            if (onScreenBomb[t].getBombed()) {
                // bombed
                onScreenBomb[t].disappearDisplay();
                if (position !== 0 && onScreenBomb[t].getBombedTime() <= 10) {
                    haveWon = false;
                    game = false;
                }
            }
        }
    }
}

let t;
let haveGone = [];
let haveExplodedorGone = [];

function updateThings() {
    // first move all the things
    // second remove those not collide with the canvas
    if (onScreen.length !== 0) {
        // 1
        for (t = 0; t < onScreen.length; t++) {
            onScreen[t].move();
        }

        // 2-1: Gone with the wind
        haveGone = [];
        for (t = 0; t < onScreen.length; t++) {
            if (helper_thing_not_on(onScreen[t])) {
                haveGone.push(onScreen[t]);
            }
        }
        // 2-2: Gone because of being eaten and alpha down below 16
        for (t = 0; t < onScreen.length; t++) {
            if (onScreen[t].getEaten() && onScreen[t].getAlpha() < 16) {
                haveGone.push(onScreen[t]);
            }
        }

        onScreen = onScreen.diff(haveGone);
    }

    // move all bomb(s) - there shall not be many
    // remove exploded and faded ones, and Gone with the wind ones
    if (onScreenBomb.length !== 0) {
        haveExplodedorGone = [];
        for (t = 0; t < onScreenBomb.length; t++) {
            onScreenBomb[t].move();
            if ((onScreenBomb[t].getBombed() && onScreenBomb[t].getAlpha() < 16) || helper_thing_not_on(onScreenBomb[t])) {
                haveExplodedorGone.push(onScreenBomb[t]);
            }
        }

        onScreenBomb = onScreenBomb.diff(haveExplodedorGone);
    }

}

function helper_thing_not_on(thing) {
    // return true if the thing is not on canvas
    // thing is a Thing object (class)
    if (-(imgW / 2) < thing.getX() && thing.getX() < width + imgW / 2 && -(imgH / 2) < thing.getY() && thing.getY() < height + imgH / 2) {
        return false; // the thing is still on canvas
    } else {
        return true; // the thing has gone
    }
}

function displayDisappearThings() {
    if (onScreen.length !== 0) {
        for (t = 0; t < onScreen.length; t++) {
            if (onScreen[t].getEaten()) {
                onScreen[t].disappearDisplay();
            }
        }
    }

    // exploded bomb(s) displayed in bomb()
}

function displayThings() {
    // console.log(onScreen);

    // display food
    if (onScreen.length !== 0) {
        for (t = 0; t < onScreen.length; t++) {
            if (!onScreen[t].getEaten()) {
                onScreen[t].display();
            }
        }
    }

    // display bomb
    if (onScreenBomb.length !== 0) {
        for (t = 0; t < onScreenBomb.length; t++) {
            if (!onScreenBomb[t].getBombed()) {
                onScreenBomb[t].display();
            }
        }
    }

}

function displayTimeLeft() {
    push();
    fill(0);
    textSize(20);
    text(Math.round(timeLeft * 10) / 10, 20, 20);
    pop();
}

function helper_edible(food) {
    // edible if in eating area
    if ((height - eatingAreaH) / 2 < food.getY() && food.getY() < (height + eatingAreaH) / 2) {
        return true;
    } else {
        return false;
    }
}


let totalDeltaWeight = 0;
let eatGap = 0;

function eat() {
    if (eatGap == 0) {
        totalDeltaWeight = 0;
        if (onScreen.length !== 0) {
            for (t = 0; t < onScreen.length; t++) {
                if (helper_edible(onScreen[t]) && onScreen[t].getArea() === position && mouthOpen && !onScreen[t].getEaten()) {
                    onScreen[t].eatEaten();
                    totalDeltaWeight += onScreen[t].getDeltaWeight();
                    if (onScreen[t].getName() == 'apple') {
                        toBoostShoot = true;
                        bShot -= 10;
                    }
                    break; // eat one thing a time
                }
            }
            if (totalDeltaWeight === 0) {
                haveEaten = false;
            } else {
                haveEaten = true;
            }
        }
        eatGap = 8;
    } else {
        eatGap -= 1;
    }
}

function updateWeight() {
    weight += totalDeltaWeight;
    totalDeltaWeight = 0;
    if (weight <= 0) {
        weight = 0; // avoid negative number
    }
}

function displayWeight() {
    push();
    fill(255);
    textSize(20);
    text("Goal: " + weight, 300, 20);
    pop();
}