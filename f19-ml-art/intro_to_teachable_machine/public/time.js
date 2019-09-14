let time = 0;

function timestep() {

    time += 1;

    // Update both body position and mouthOpen
    checkPosition();
    drawIdentifier();
    // Update things position
    updateThings();
    // Check bomb

    checkOver();
    // Shoot new things
    newThing();

    // Check eat

    // Calculate weight

    // Update timeLeft
    timeLeft -= 0.1;
    checkOver();
    // DISPLAY ALL
    displayThings();
    displayTimeLeft();
}

function checkOver() {
    if (timeLeft <= 0 || bomb()) {
        // let over = true;
        // ...
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

}

let t;

function updateThings() {
    // first move all the things
    // second remove those not collide with the canvas

    // 1
    for (t = 0; t < onScreen.length; t++) {
        onScreen[t].move();
    }

    // 2

}

function displayThings() {
    for (t = 0; t < onScreen.length; t++) {
        onScreen[t].display();
    }
}

function displayTimeLeft() {
    push();
    fill(0);
    textSize(20);
    text(Math.round(timeLeft * 10) / 10, 20, 20);
    pop();
}