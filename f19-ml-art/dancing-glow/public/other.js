let poseStatusLabel = 1;
let faceStatusLabel = 1;
let trainStatusLabel = 1;

function draw_hint() {
    noStroke();
    draw_pn();
    draw_fa();
    draw_train();
}

function draw_pn() {
    // Draw poseNet Not Ready
    push();
    if (poseStatusLabel === 1) {
        fill(235);
    } else if (poseStatusLabel === 2) {
        fill(251, 229, 85);
    } else if (poseStatusLabel === 3) {
        fill(71, 228, 187);
    }
    rect((width - videoWidth) / 2, (height + videoHeight) / 2 + 6, 110, 26);
    fill(255);
    textFont('Inconsolata', 14);
    text('PoseNet Ready', (width - videoWidth) / 2 + 10, (height + videoHeight) / 2 + 23);
    pop();
}

function draw_fa() {
    push();
    if (faceStatusLabel === 1) {
        fill(235);
    } else if (faceStatusLabel === 2) {
        fill(251, 229, 85);
    } else if (faceStatusLabel === 3) {
        fill(71, 228, 187);
    }
    rect((width - videoWidth) / 2 + 116, (height + videoHeight) / 2 + 6, 110, 26);
    fill(255);
    textFont('Inconsolata', 14);
    text('FaceAPI Ready', (width - videoWidth) / 2 + 126, (height + videoHeight) / 2 + 23);
    pop();
}

function draw_train() {
    push();
    if (true) {
        if (trainStatusLabel === 1) {
            fill(235);
        } else if (trainStatusLabel === 2) {
            fill(251, 229, 85);
        } else if (trainStatusLabel === 3) {
            fill(71, 228, 187);
        }
    }
    rect((width - videoWidth) / 2 + 232, (height + videoHeight) / 2 + 6, 117, 26);
    fill(255);
    textFont('Inconsolata', 14);
    text('Train Finished', (width - videoWidth) / 2 + 242, (height + videoHeight) / 2 + 23);
    pop();
}