float r, shameThreshold, shameToLimit; // size of the plants
Plant[] plants; // array of Plant objects

int widCount, highCount, count;

void setup() {
  size(840, 840);

  r = 24.0;
  shameThreshold = 45.0;
  shameToLimit = 70.0; // fully recover only after mouse is _ away

  widCount = int((width + 2 * r) / r);
  highCount = int((height + 2 * r) / r); // bleed one on each side
  count = widCount * highCount;
  plants = new Plant[count]; // array of Plant objects
  int i, j;
  int index = 0;
  for (i = 0; i < widCount; i++) {
    for (j = 0; j < highCount; j++) {
      plants[index++] = new Plant(i * r - r/2, j * r - r/2);
    }
  }
}

float moX, moY;
void draw() {
  background(0);
  noStroke(); // <<<
  // update
  for (Plant p : plants) {
    if (mouseX == 0) {
      moX = -200;
      moY = -200;
    } else {
      moX = mouseX;
      moY = mouseY;
    }
    p.update(moX, moY);
    p.display();
  }  
}

class Plant {
    float x, y;
    float len; // length of leaf, 0 < len < r
    float lenLimit, selfThreshold;
    int direction;
    boolean toShame, toRecover;
    // float h; // z axis
    int re, gr, bl, co;
    // contructor
    Plant (float xInt, float yInt) {
      x = xInt;
      y = yInt;
      len = r / 2;
      lenLimit = r / 2;
      selfThreshold = random(shameThreshold - 10, shameThreshold + 10);
      direction = floor(random(2)); // get direction, 1 or 2

      toShame = false;
      toRecover = false;
      
      // re = int( random(200, 255) );
      // gr = int( random(200, 255) );
      // bl = int( random(200, 255) );
      co = int( random(238, 252) );
    }

    void update (float mX, float mY) {
      /*
        Update plant width based on mouse position
      */
      float md = dist(x, y, mX, mY); // mouse distance
      // update lenLimit
      lenLimit = ( constrain(md, 0, shameToLimit) / shameToLimit ) * r / 2;
      // SHAME
      if (md < selfThreshold) {
        toShame = true; // decrease
        toRecover = false;
      } else if (md > selfThreshold) {
        // Recover
        toRecover = true; // increase
      }

      // update len
      if (toShame && len > r * 0.05) {
        len *= 0.8;
        if (len <= r * 0.06) {
          toShame = false;
        }
      } else if ( toRecover && (len < r / 2) ) {
        float rSpeed = random(-0.14, 0.36);
        len = constrain(len + rSpeed, 0, r / 2);
        if (len >= r / 2) {
          toRecover = false;
        }
      }

      // update co
      co = constrain(co + int(random(-3, 3)), 200, 255);
    }

    void display () {
      push();
      fill(co);
      if (direction == 0) {
        beginShape();
        vertex(x - r/2, y - r/2);
        vertex(x - len, y + len);
        vertex(x + r/2, y + r/2);
        vertex(x + len, y - len);
        endShape(CLOSE);
      } else {
        // direction == 1
        beginShape();
        vertex(x + r/2, y - r/2);
        vertex(x - len, y - len);
        vertex(x - r/2, y + r/2);
        vertex(x + len, y + len);
        endShape(CLOSE);
      }
      pop();
    }
}
