// The world pixel by pixel 2020
// Peiling Jiang
// Greedy Pixels

// Based on examples by Daniel Rozin

import processing.video.*;
float dif;

Capture ourVideo;                                 // variable to hold the video object
void setup() {
  size(1280, 720);
  frameRate(120);
  ourVideo = new Capture(this, width, height);    // open the capture in the size of the window
  ourVideo.start();                               // start the video
}

void draw() {
  if (ourVideo.available())  ourVideo.read();
    image(ourVideo, 0, 0);
  ourVideo.loadPixels();
  loadPixels();
  for (int x = 1; x<width-2; x++) {
    for (int y = 1; y<height-2; y++) {
      eat(x, y, -1, 0);
      eat(x, y, 1, 0);
      eat(x, y, 0, -1);
      eat(x, y, 0, 1);
    }
  }
  updatePixels();
}

void eat(int thisX, int thisY, int xStep, int yStep) {
  dif = map(mouseX, 0, 1280, 100, 0);
  
  PxPGetPixel(thisX + xStep, thisY + yStep, ourVideo.pixels, width);
  int nextColor = R + G + B;
  PxPGetPixel(thisX, thisY, ourVideo.pixels, width);
  int thisColor = R + G + B;

  if (abs(thisColor - nextColor) > dif) {
    PxPSetPixel(thisX + xStep, thisY + yStep, 255, R, G, B, pixels, width);

    if (thisX + xStep > 1 && thisX + xStep < width - 1 && thisY + yStep > 1 && thisY + yStep < height - 1) {
      eat(thisX + xStep, thisY + yStep, xStep, yStep);
    }
  }
}

int R, G, B, A;
void PxPGetPixel(int x, int y, int[] pixelArray, int pixelsWidth) {
  int thisPixel=pixelArray[x+y*pixelsWidth];
  A = (thisPixel >> 24) & 0xFF;
  R = (thisPixel >> 16) & 0xFF;
  G = (thisPixel >> 8) & 0xFF;   
  B = thisPixel & 0xFF;
}

void PxPSetPixel(int x, int y, int r, int g, int b, int a, int[] pixelArray, int pixelsWidth) {
  a =(a << 24);                       
  r = r << 16;
  g = g << 8;
  color argb = a | r | g | b;
  pixelArray[x+y*pixelsWidth]= argb;
}
