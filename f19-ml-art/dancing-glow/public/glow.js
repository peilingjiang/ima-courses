let frac = 30;

// Noise
let xOff = 0;
let yOff = 1000;
let offSpeed = 0.2;
let amp = 20;

function draw_glow(p) {
    // Draw emit
    if (emitStatus == 'Emit') {
        push();
        let emitC = color(bodyColor[0], bodyColor[1], bodyColor[2]);
        emitC.setAlpha(128 + 128 * sin(millis() / 100));
        fill(emitC);
        rect(0, 0, width, height);
        pop();
    }

    push();
    translate(video.width, (height - videoHeight) / 2);
    scale(-1, 1);
    noFill();
    stroke(bodyColor);
    // p is poses[0].pose
    // This function will be called only when poses.length > 0

    // [0] are lefts, [1] are rights
    let shoulders = [p.leftShoulder, p.rightShoulder];
    let elbows = [p.leftElbow, p.rightElbow];
    let wrists = [p.leftWrist, p.rightWrist];
    let hips = [p.leftHip, p.rightHip];
    let knees = [p.leftKnee, p.rightKnee];
    let ankles = [p.leftAnkle, p.rightAnkle];

    let lines = [
        [wrists[0].x, wrists[0].y, elbows[0].x, elbows[0].y],
        [wrists[1].x, wrists[1].y, elbows[1].x, elbows[1].y],
        [elbows[0].x, elbows[0].y, shoulders[0].x, shoulders[0].y],
        [elbows[1].x, elbows[1].y, shoulders[1].x, shoulders[1].y],
        [ankles[0].x, ankles[0].y, knees[0].x, knees[0].y],
        [ankles[1].x, ankles[1].y, knees[1].x, knees[1].y],
        [knees[0].x, knees[0].y, hips[0].x, hips[0].y],
        [knees[1].x, knees[1].y, hips[1].x, hips[1].y],
        
        [shoulders[0].x, shoulders[0].y, shoulders[1].x, shoulders[1].y],
        [hips[0].x, hips[0].y, hips[1].x, hips[1].y]
    ]

    // console.log('DRAW');

    for (let i = 0; i < lines.length; i++) {
        let l = lines[i];
        let fracNum = round(dist(l[0], l[1], l[2], l[3]) / frac);
        let dX = (l[2] - l[0]) / fracNum;
        let dY = (l[3] - l[1]) / fracNum;
        let start = [l[0], l[1]];
        let end = [l[2], l[3]];
        let next = [l[0] + dX, l[1] + dY];
        // Draw first line
        draw_line(start, next);
        // Draw middle ones
        for (let j = 2; j < fracNum; j++) {
            start = next;
            next = [l[0] + dX * j + map(noise(xOff), 0, 1, -amp, amp), l[1] + dY * j + map(noise(yOff), 0, 1, -amp, amp)];
            draw_line(start, next);
            xOff += offSpeed;
            yOff += offSpeed;
        }
        // Draw last line
        draw_line(next, end);
    }
    
    pop();
}

function draw_line(start, end) {
    // Draw blur
    push();
    strokeWeight(9);
    line(start[0], start[1], end[0], end[1]);
    // filter(BLUR, 5);
    pop();
    // Draw glow
    push();
    strokeWeight(3);
    stroke(bodyColor[0] + 30, bodyColor[1] + 30, bodyColor[2] + 30); // Make it glow
    line(start[0], start[1], end[0], end[1]);
    // filter(BLUR, 1);
    pop();
}