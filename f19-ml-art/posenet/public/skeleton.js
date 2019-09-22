// Set a tolerance value for the unmoved points
let noiseDelta = 8;
let allPoints = {};

class Point {
  constructor(x, y, ind, part) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.index = ind; // keypoint index
    this.part = part; // keypoint part
  }

  update(newX, newY) {
    // Update x
    if (abs(this.x - newX) > noiseDelta) {
      this.px = this.x;
      this.x = newX;
    }
    // Update y
    if (abs(this.y - newY) > noiseDelta) {
      this.py = this.y;
      this.y = newY;
    }
  }

  getX() {
    // return mirrored x
    return (width - this.x);
  }

  getY() {
    return this.y;
  }

  getpX() {
    return (width - this.px);
  }

  getpY() {
    return this.py;
  }
}

function newPoints() {
  // Only work when 1 pose on the screen
  if (poses.length > 0) {
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      if (keypoint.part in allPoints == false) {
        let newPoint = new Point(keypoint.position.x, keypoint.position.y, j, keypoint.part);
        allPoints[keypoint.part] = newPoint;
      }
    }
  }
}

function updateKeypoints() {
  if (poses.length > 0) {
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.part in allPoints) {
        allPoints[keypoint.part].update(keypoint.position.x, keypoint.position.y);
      }
    }
  }
}
