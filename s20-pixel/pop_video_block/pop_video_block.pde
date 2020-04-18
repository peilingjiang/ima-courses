/*
  P0P Video Block
  Peiling Jiang
  
  Based on code by Daniel Rozin
  Pixel by Pixel 2020
*/

int interactive = 2; // Mouse interactivity
/*
  0 - None
  1 - Peak
  2 - Adjust height for all
*/

import processing.video.*;

int cell = 20;
float scale = 0.5;

Capture video;

void setup() {
  size(1600, 900, P3D);
  frameRate(90);
  video = new Capture(this, 1280, 720);
  video.start();
  noStroke();
}

void draw() {
  
  background(0);
  lights();

  if (video.available()) video.read();
  video.loadPixels();

  translate(video.width / 2, video.height / 2, 0);
  scale(scale);
  rotateX(PI * 0.25);
  translate(- scale * video.width / 2, - scale * video.height / 2 + 100, 0);

  for (int x = 0; x < video.width; x += cell) {
    for (int y = 0; y < video.height; y += cell) {
      PxPGetPixel(x, y, video.pixels, video.width);
      float z = (R + G + B) / 3;
      if (interactive == 1)
        // Mouse interactivity
        z += constrain(map(dist(x, y, map(mouseX, 0, width, 0, video.width), map(mouseY, 0, height, 0, video.height)),
                                0, 150, 120, 0),
                                0, 120);
      else if (interactive == 2)
        z *= map(mouseY, 0, height, 4, 0);
      fill(R, G, B);
      pushMatrix();
      translate(x, y, z / 2.0);
      // POP Repeat
      for (int m = -3; m < 4; m += 1) { // x axis
        for (int n = -5; n < 2; n += 1) { // y axis
          push();
          translate((1.0 / scale) * m * scale * video.width, (1.0 / scale) * n * scale * video.height, 0);
          box(cell, cell, z);
          pop();
        }
      }
      popMatrix();
    }
  }
  
}

int R, G, B, A;

void PxPGetPixel(int x, int y, int[] pixelArray, int pixelsWidth) {
  int thisPixel = pixelArray[x + y * pixelsWidth];
  A = (thisPixel >> 24) & 0xFF;
  R = (thisPixel >> 16) & 0xFF;
  G = (thisPixel >> 8) & 0xFF;
  B = thisPixel & 0xFF;
}
