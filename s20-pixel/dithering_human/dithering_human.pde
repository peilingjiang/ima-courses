/*
  Peiling Jiang
  2020
  Dithering Human
*/

boolean grey = true;

import processing.video.*;
Capture ourVideo;

void setup() {
  size(1280, 720);
  ourVideo = new Capture(this, width, height);
  ourVideo.start();
  if (grey) ourVideo.filter(GRAY);
  noCursor();
  
}

int getInd(int x, int y) {
  return x + y * width;
}

void draw() {
  if (ourVideo.available())
    ourVideo.read();
  background (0);
  ourVideo.loadPixels();
  loadPixels();
  for (int y = 0; y < width; y++) {
    for (int x = 0; x < width; x++) {
      // A, R, G, B
      int[] oldColorArr = PxPGetPixel(x, y, ourVideo.pixels, width);
      
      int newR = round(5 * oldColorArr[1] / 255) * 51;
      int newG = round(5 * oldColorArr[2] / 255) * 51;
      int newB = round(5 * oldColorArr[3] / 255) * 51;
      
      float errR = newR - oldColorArr[1];
      float errG = newG - oldColorArr[2];
      float errB = newB - oldColorArr[3];
      
      PxPSetPixel(x, y, newR, newG, newB, 255, pixels, width);
      
      // 1
      int[] nowColorArr = PxPGetPixel(x + 1, y, ourVideo.pixels, width);
      nowColorArr[1] = nowColorArr[1] * 7 / 16;
      nowColorArr[2] = nowColorArr[2] * 7 / 16;
      nowColorArr[3] = nowColorArr[3] * 7 / 16;
      PxPSetPixel(x + 1, y, nowColorArr[1], nowColorArr[2], nowColorArr[3], 255, pixels, width);
      
      // 2, x - 1, y + 1
      nowColorArr = PxPGetPixel(x - 1, y + 1, ourVideo.pixels, width);
      nowColorArr[1] = nowColorArr[1] * 3 / 16;
      nowColorArr[2] = nowColorArr[2] * 3 / 16;
      nowColorArr[3] = nowColorArr[3] * 3 / 16;
      PxPSetPixel(x - 1, y + 1, nowColorArr[1], nowColorArr[2], nowColorArr[3], 255, pixels, width);
      
      // 3, x, y + 1
      nowColorArr = PxPGetPixel(x, y + 1, ourVideo.pixels, width);
      nowColorArr[1] = nowColorArr[1] * 5 / 16;
      nowColorArr[2] = nowColorArr[2] * 5 / 16;
      nowColorArr[3] = nowColorArr[3] * 5 / 16;
      PxPSetPixel(x, y + 1, nowColorArr[1], nowColorArr[2], nowColorArr[3], 255, pixels, width);
      
      // 4, x + 1, y + 1
      nowColorArr = PxPGetPixel(x + 1, y + 1, ourVideo.pixels, width);
      nowColorArr[1] = nowColorArr[1] * 1 / 16;
      nowColorArr[2] = nowColorArr[2] * 1 / 16;
      nowColorArr[3] = nowColorArr[3] * 1 / 16;
      PxPSetPixel(x + 1, y + 1, nowColorArr[1], nowColorArr[2], nowColorArr[3], 255, pixels, width);
      
    }
  }
  updatePixels();
  
}
      
// PxP functions by Daniel Rozin
// Modified by Peiling Jiang

int[] PxPGetPixel(int x, int y, int[] pixelArray, int pixelsWidth) {
  int thisPixel=pixelArray[x+y*pixelsWidth];
  int R, G, B, A;
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
