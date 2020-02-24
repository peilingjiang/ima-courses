/*
  Peiling Jiang
  2020
  Dithering Human
*/

int R, G, B, A;
boolean grey = true;

import processing.video.*;
Capture ourVideo;

void setup() {
  size(1280, 720);
  ourVideo = new Capture(this, width, height);
  ourVideo.start();
  noCursor();
}

int getInd(int x, int y) {
  return x + y * width;
}

void draw() {
  if (ourVideo.available())
    ourVideo.read();
  scale(-1, 1);
  background(0);
  if (grey) {
    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        PxPGetPixel(x, y, ourVideo.pixels, width);
        int ave = (R + G + B) / 3;
        PxPSetPixel(x, y, ave, ave, ave, 255, ourVideo.pixels, width);
      }
    }
  }
  ourVideo.loadPixels();
  for (int y = 0; y < height - 1; y++) {
    for (int x = 1; x < width - 1; x++) {
      // A, R, G, B
      PxPGetPixel(x, y, ourVideo.pixels, width);

      int factor = 1;

      int newR = round(factor * R / 255) * (255 / factor);
      int newG = round(factor * G / 255) * (255 / factor);
      int newB = round(factor * B / 255) * (255 / factor);

      float errR = R - newR;
      float errG = G - newG;
      float errB = B - newB;

      PxPSetPixel(x, y, newR, newG, newB, 255, ourVideo.pixels, width);

      // 1, x + 1, y
      modifyNeighbours(x + 1, y, errR, errG, errB, 7);
      // 2, x - 1, y + 1
      modifyNeighbours(x - 1, y + 1, errR, errG, errB, 3);
      // 3, x, y + 1
      modifyNeighbours(x, y + 1, errR, errG, errB, 5);
      // 4, x + 1, y + 1
      modifyNeighbours(x + 1, y + 1, errR, errG, errB, 1);
    }
  }
  ourVideo.updatePixels();
  image(ourVideo, - width, 0);
}

void modifyNeighbours(int x, int y, float eR, float eG, float eB, int co) {
  PxPGetPixel(x, y, ourVideo.pixels, width);
  float finalR = R + eR * co / 16.0;
  float finalG = G + eG * co / 16.0;
  float finalB = B + eB * co / 16.0;
  ourVideo.pixels[getInd(x, y)] = color(finalR, finalG, finalB);
}

// PxP functions by Daniel Rozin
// Modified by Peiling Jiang

int[] PxPGetPixel(int x, int y, int[] pixelArray, int pixelsWidth) {
  int thisPixel=pixelArray[x+y*pixelsWidth];
  A = (thisPixel >> 24) & 0xFF;
  R = (thisPixel >> 16) & 0xFF;
  G = (thisPixel >> 8) & 0xFF;
  B = thisPixel & 0xFF;
  int[] arr = {A, R, G, B};
  return arr;
}

void PxPSetPixel(int x, int y, int r, int g, int b, int a, int[] pixelArray, int pixelsWidth) {
  a =(a << 24);                       
  r = r << 16;
  g = g << 8;
  color argb = a | r | g | b;
  pixelArray[x+y*pixelsWidth]= argb;
}
