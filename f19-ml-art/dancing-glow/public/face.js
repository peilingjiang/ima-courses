function faceReady() {
    faceStatusLabel = 3;
    console.log("FaceAPI Ready");
    // faceapi.detect(gotFaces);
}

// Got faces
function gotFaces(error, result) {
    if (error) {
        // console.log(error);
        return;
    }
    detections = result;
    // faceapi.detect(gotFaces);
}

function open_or_not() {
    // Return true if the mouth is open,
    // false if not
    // For one face only
    if (detections.length > 0) {
        let points = detections[0].landmarks.positions;
        let mouth_h = dist(points[62]._x, points[62]._y, points[66]._x, points[66]._y);
        let mouth_w = dist(points[60]._x, points[60]._y, points[64]._x, points[64]._y);
        if (mouth_h / mouth_w >= 0.2) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
