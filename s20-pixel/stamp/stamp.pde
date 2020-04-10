/*
  STAMP
  Peiling Jiang 2020
 
  Pixel by Pixel Daniel Rozin
  NYU IMA
*/

/*
  Inspired by Photoshop Stamp Tool
  How to use: Click souce - Click destination, Scroll to change area size
  Multiple stamps supported!
  You may try: swap the faces of two people
*/

boolean replaceSource = true; // True if to swap, False if to have classic stamp tool

import processing.video.*;
Capture ourVideo;
sourceColor[] sources = new sourceColor[0];
boolean clickSource = true;
int areaR = 50;
int minR = 20, maxR = 150;
int viewTime = 0;

void setup() {
  size(1280, 720);
  frameRate(120);
  String videoList[] = Capture.list();
  ourVideo = new Capture(this, width, height, videoList[0]); // Get the first camera
  ourVideo.start();
  noStroke();
}

void draw() {
  // scale(-1, 1);
  image(ourVideo, 0, 0);
  if (ourVideo.available())
    ourVideo.read();
  
  ourVideo.loadPixels();
  loadPixels();

  for (int i = 0; i < sources.length; i++) {
    sources[i].sourceRecord= 1000.0;
    // Update source location
    for (int x = constrain(sources[i].sourceX - 80, 0, width); x < constrain(sources[i].sourceX + 80, 0, width); x++) {
      for (int y = constrain(sources[i].sourceY - 80, 0, height); y < constrain(sources[i].sourceY + 80, 0, height); y++) {
        PxPGetPixel(x, y, ourVideo.pixels, width);
        // TODO: Algorithm to find the pixel with the most similar color while also nearest can be optimized
        sources[i].updateLocation('S', R, G, B, x, y);
      }
    }
    if (sources[i].hasDest) {
      // Update dest location
      for (int x = constrain(sources[i].destX - 80, 0, width); x < constrain(sources[i].destX + 80, 0, width); x++) {
        for (int y = constrain(sources[i].destY - 80, 0, height); y < constrain(sources[i].destY + 80, 0, height); y++) {
          PxPGetPixel(x, y, ourVideo.pixels, width);
          sources[i].updateLocation('D', R, G, B, x, y);
        }
      }
    }
    sources[i].display();
  }
  updatePixels();
  if (viewTime > 0) {
    viewTime -= 1;
    fill(0, 209, 255, 240);
    ellipse(maxR, height - maxR, areaR * 2, areaR * 2);
  }
}

void mousePressed() {
  PxPGetPixel(mouseX, mouseY, ourVideo.pixels, width);
  if (clickSource) {
    // Add source
    sources = (sourceColor[]) append(sources, new sourceColor(R, G, B, mouseX, mouseY, areaR));
    clickSource = false;
  } else {
    // Add dest
    for (int i = 0; i < sources.length; i++) {
      if (!sources[i].hasDest) {
        sources[i].setDest(R, G, B, mouseX, mouseY);
        break;
      }
    }
    clickSource = true;
  }
}

void mouseWheel(MouseEvent event) {
  float e = event.getCount();
  areaR -= e;
  viewTime = 120;
  areaR = constrain(areaR, minR, maxR);
}

class sourceColor {
  int sourceRed, sourceGreen, sourceBlue;
  float sourceRecord = 1000.0;
  int sourceX = 0; // For tracking where to stamp (replace)
  int sourceY = 0;
  
  boolean hasDest = false;
  int destRed, destGreen, destBlue;
  float destRecord = 1000.0;
  int destX = 0;
  int destY = 0;
  
  int thisAreaR;

  sourceColor(int r, int g, int b, int x, int y, int arear) {
    sourceRed = r;
    sourceGreen = g;
    sourceBlue = b;
    sourceX = x;
    sourceY = y;
    thisAreaR = arear;
  }

  void updateLocation(char type, int r, int g, int b, int x, int y) {
    // For updating the location of both source and dest (if any)
    float thisPixelSimilarity = 0.0;
    if (type == 'S')
      thisPixelSimilarity = dist(sourceRed, sourceGreen, sourceBlue, r, g, b);
    else 
      thisPixelSimilarity = dist(destRed, destGreen, destBlue, r, g, b);
    if (thisPixelSimilarity < sourceRecord) {
      sourceRecord = thisPixelSimilarity;
      if (type == 'S') {
        sourceX = x;
        sourceY = y;
      } else {
        destX = x;
        destY = y;
      }
    }
  }
  
  void setDest(int r, int g, int b, int x, int y) {
    hasDest = true;
    destRed = r;
    destGreen = g;
    destBlue = b;
    destX = x;
    destY = y;
  }
  
  void display() {
    // Swap the pixels in source and dest
    if (hasDest) {
      for (int x = constrain(destX - thisAreaR, 0, width); x < constrain(destX + thisAreaR, 0, width); x++) {
        if (sourceX + x - destX > 0 && sourceX + x - destX < width) {
          for (int y = constrain(destY - thisAreaR, 0, height); y < constrain(destY + thisAreaR, 0, height); y++) {
            float tempDist = int(dist(x, y, destX, destY));
            if (tempDist <= thisAreaR && sourceY + y - destY > 0 && sourceY + y - destY < height) {
              PxPGetPixel(sourceX + x - destX, sourceY + y - destY, ourVideo.pixels, width);
              // TODO: Circle edge alpha not fade (too sharp).
              PxPSetPixel(x, y, R, G, B, int(map(tempDist, 0, thisAreaR, 255, 0)), pixels, width);
            }
          }
        }
      }
    }
  }
}

int R, G, B, A;
void PxPGetPixel(int x, int y, int[] pixelArray, int pixelsWidth) {
  int thisPixel = pixelArray[x+y*pixelsWidth];
  A = (thisPixel >> 24) & 0xFF;
  R = (thisPixel >> 16) & 0xFF;
  G = (thisPixel >> 8) & 0xFF;
  B = thisPixel & 0xFF;
}

void PxPSetPixel(int x, int y, int r, int g, int b, int a, int[] pixelArray, int pixelsWidth) {
  a = (a << 24);
  r = r << 16;
  g = g << 8;
  color argb = a | r | g | b;
  pixelArray[x+y*pixelsWidth] = argb;
}
