class Balloon {
  constructor(r) {
    this.x = midWidth;
    this.y = balloonHeight;
    this.r = r;
    // this.friction = friction;
    this.rotation = 0;
    this.balloonImage = loadImage(
      "https://cdn.glitch.com/ce1715c9-8b34-4483-a63a-22cf3c668b47%2Fballoon.png?v=1575943999649"
    );
  }

  display(force) {
    // force > 0, left person blew, rotate towards right
    // force < 0, right person blew, rotate towards left
    // TODO: ROTATE and FLOAT effects
    push();
    fill(5);
    noStroke();
    ellipse(this.x, this.y, 2 * this.r, 2 * this.r);

    this.x = lerp(this.x, this.x + random(-10, 10), 0.025);
    this.y = lerp(this.y, this.y + random(-30, 30), 0.025);
    imageMode(CENTER);
    image(this.balloonImage, this.x, this.y, 2 * this.r, 2 * this.r);

    pop();
  }
}

class Path {
  // The acctual path of the 'path' the balloon is going through
  // Not the 'walls' on the left and right
  constructor(start, end) {
    this.start = start; // List of x and y
    this.end = end;
    this.followers = [];
    this.followerNum = 0;
    this.renderThis = true; // If the path is not in the canvas, don't draw it
    this.nowPath = false;
    this.shifted = false;
  }

  shift() {
    // Move all paths down as balloon flies up
    // upSpeed should > 0
    // Only update rendered ones
    if (this.renderThis && this.shifted == false) {
      // this.start[1] = lerp(this.start[1], this.start[1] + upSpeed, 0.7);
      // this.end[1] = lerp(this.end[1], this.end[1] + upSpeed, 0.7);
      this.start[1] += upSpeed;
      this.end[1] += upSpeed;
      this.shifted = true;
    }
    // Shift following paths recursively
    if (this.followerNum != 0) {
      for (let f in this.followers) {
        this.followers[f].shift();
      }
    }
  }

  resetshifted() {
    // Avoid shift twice in one round
    this.shifted = false;
    if (this.followerNum != 0) {
      for (let f in this.followers) {
        this.followers[f].resetshifted();
      }
    }
  }

  blow(f) {
    // force > 0, left peron blew, path moved to left
    // force < 0, right person blew, path moved to right
    // Only update rendered ones
    if (this.renderThis) {
      // this.start[0] = lerp(this.start[0], this.start[0] - f, 1 - friction);
      // this.end[0] = lerp(this.end[0], this.end[0] - f, 1 - friction);
      this.start[0] -= f;
      this.end[0] -= f;
    }

    if (this.followerNum != 0) {
      for (let fo in this.followers) {
        this.followers[fo].blow(f);
      }
    }
  }

  addFollower(ahead) {
    if (this.followerNum != 0) {
      // Added. pass
      for (let f in this.followers) {
        // Add to all paths
        this.followers[f].addFollower(ahead);
      }
    } else {
      // Add one or two
      let tempToAddNum = random(divideProp); // 1 or 2
      this.followerNum = tempToAddNum;
      for (let i = 0; i < tempToAddNum; i++) {
        let new_path = new Path(this.end, this.getNextEnd());
        this.followers.push(new_path);
      }
      if (ahead > 0) {
        // Add more followers to this new follower
        for (let f = 0; f < this.followerNum; f++) {
          // Add to all paths
          this.followers[f].addFollower(ahead - 1);
        }
      }
    }
  }

  checkLength() {
    // Return how many paths are ahead
    // If not enough, add more to the followers
    if (this.followers.length == 0) {
      return 1;
    } else {
      // No need to check all branches
      // Branches have same length
      return 1 + this.followers[0].checkLength();
    }
  }

  updateNowPath(b) {
    if (
      (this.start[1] + pathR - b.y) * (this.end[1] - pathR - b.y) <= 0 &&
      _helper_distance(this, b) + b.r <= pathR
    ) {
      // path contain balloon
      if (this.nowPath == false) {
        this.nowPath = true;
        now_path.push(this);
      }
    } else {
      if (this.nowPath == true) {
        this.nowPath = false;
        // del this path from now_path
        let new_now_path = [];
        for (let n in now_path) {
          if (now_path[n] != this) {
            new_now_path.push(now_path[n]);
          }
        }
        now_path = new_now_path;
      }
    }

    if (this.followerNum != 0) {
      for (let f in this.followers) {
        this.followers[f].updateNowPath(b);
      }
    }
  }

  display() {
    if (this.renderThis) {
      push();
      noFill();
      if (debug) {
        stroke(255, 255, 255);
      } else {
        stroke(255);
      }
      strokeWeight(2 * pathR);
      line(this.start[0], this.start[1], this.end[0], this.end[1]);
      pop();
      if (debug) {
        // For debug only
        push();
        noFill();
        stroke(255, 0, 0);
        strokeWeight(10);
        line(this.start[0], this.start[1], this.end[0], this.end[1]);
        pop();
      }
    }
    // Recursively render the following
    if (this.followerNum != 0) {
      for (let f in this.followers) {
        this.followers[f].display();
      }
    }
  }

  updaterender() {
    if (this.renderThis) {
      if (this.end[1] > windowHeight + 520) {
        this.renderThis = false;
      }
    }
    if (this.followerNum != 0) {
      for (let f in this.followers) {
        this.followers[f].updaterender();
      }
    }
  }

  // Helper functions
  getNextEnd() {
    if (this.followerNum == 1) {
      return [
        this.end[0] + random(pathNextEndX[0], pathNextEndX[1]),
        this.end[1] + random(pathNextEndY[0], pathNextEndY[1])
      ];
    } else if (this.followerNum == 2) {
      if (this.followers[0].end[0] <= this.end[0]) {
        // First path goes to right
        return [
          this.end[0] + random(200, pathNextEndX[1]),
          this.end[1] + random(pathNextEndY[0], pathNextEndY[1])
        ];
      } else if (this.followers[0].end[0] > this.end[0]) {
        return [
          this.end[0] + random(pathNextEndX[0], -200),
          this.end[1] + random(pathNextEndY[0], pathNextEndY[1])
        ];
      }
    }
  }
}

class Background {
  constructor() {
    this.color = 5;
    this.bg = loadImage(
      "https://cdn.glitch.com/ce1715c9-8b34-4483-a63a-22cf3c668b47%2F2012_08_18b%20(1).png?v=1575941237549"
    );
  }

  shift() {}

  blow(f) {}

  display() {
    push();
    // this.img = loadImage('https://cdn.glitch.com/ce1715c9-8b34-4483-a63a-22cf3c668b47%2Fballoon.png?v=1575943999649');
    image(this.bg, 0, 0, windowWidth, windowHeight);
    // filter(BLUR, 2);
    pop();
  }
}
