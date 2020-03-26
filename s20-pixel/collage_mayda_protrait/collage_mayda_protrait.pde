/*
Peiling Jiang
 
Protrait for Mayda Pena
 
Pixel by Pixel Midterm Project
2020
Daniel Rozin
*/

// -----------------------
// -----------------------
// ----- Pixel Cloud -----
// -----------------------
// -----------------------

int photoNum = 8;
int pixelNum;
int buffer = 12;

PShader cloud;
PImage[] images = new PImage[photoNum];
int[] layers; // Storing the layers of each pixel

void setup() {
  size(800, 800, P2D);
  pixelNum = (width + buffer) * (height + buffer);
  background(0);
  frameRate(80);
  // Load images
  for (int i = 0; i < photoNum; i++) {
    images[i] = loadImage(str(i + 1) + ".jpg");
    images[i].resize(width + buffer, height + buffer);
    images[i].loadPixels();
  }
  // Init layers
  layers = new int[pixelNum];
  //int tempL = floor(random(0, photoNum));
  for (int i = 0; i < pixelNum; i++) {
    layers[i] = floor(random(0, photoNum));
  }
  cloud = loadShader("cloud.glsl");
}

void draw() {
  loadPixels();

  for (int i = 0; i < width; i++) {
    for (int j = 0; j < height; j++) {
      // Transfer pixel from pixel[i] to a new one
      int positionInImage = constrain((j + int(map(mouseY - height / 2, -height / 2, height / 2, buffer / 2, -buffer / 2))) * (width + buffer) +
        i + int(map(mouseX - width / 2, -width / 2, width / 2, buffer / 2, -buffer / 2)), 
        0, pixelNum - 1);
      transferPixel(pixels, j * width + i, images[layers[positionInImage]].pixels[positionInImage]);
    }
  }

  updatePixels();

  filter(cloud);
  updateLayers(layers);
}

void transferPixel(int[] pixelArray, int i, int targetColor) {
  pixelArray[i] = (255 << 24) |
    ((( 94 * ((pixelArray[i] >> 16) & 0xFF) + 6 * ((targetColor >> 16) & 0xFF)) / 100) << 16) |
    ((( 94 * ((pixelArray[i] >> 8) & 0xFF)  + 6 * ((targetColor >> 8) & 0xFF)) / 100) << 8) |
    ((  95 * (pixelArray[i] & 0xFF)         + 5 * (targetColor & 0xFF)) / 100);
}

void updateLayers(int[] l) {
  int[] steps = {0, 0, 0, 0, 0, -1, 1};
  int tempStep = 0;
  for (int i = 0; i < pixelNum; i++) {
    if (!mousePressed) {
      tempStep = steps[int(random(steps.length))];

      if ((l[i] == photoNum - 1) && (tempStep == 1))
        l[i] = 0;
      else if ((l[i] == 0) && (tempStep == -1))
        l[i] = photoNum - 1;
      else
        l[i] += tempStep;
    } else if ((mouseY * width + mouseX) != i) {
      // Mouse clicked on one pixel
      l[i] = constrain(l[mouseY * width + mouseX] + steps[int(random(steps.length))], 0, photoNum - 1);
    }
  }
}
