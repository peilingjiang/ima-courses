PImage pig;

void setup() {
  size(1000, 800);
  pig = loadImage("https://previews.123rf.com/images/tsekhmister/tsekhmister1207/tsekhmister120700590/14452778-small-pig-on-a-grass.jpg");
  pig.resize(width, height);
  imageMode(CENTER);
  frameRate(300);
  
  pig.loadPixels();
  background(0);
}

void draw() {
  
  //for (int i = 0; i < 100; i++) {
  //  int fromX = (int) random(width);
  //  int fromY = (int) random(height);
  //  int toX = fromX + (int) random(-mouseX / 2.0, mouseX / 2.0);
  //  int toY = fromY + (int) random(-mouseY / 2.0, mouseY / 2.0);
  //  copy(pig,   fromX,fromY,200,200,   toX,toY,200,200);
  //}
  
  // push();
  // translate(width / 2, height / 2);
  // rotate(mouseX/100.0);
  // image(pig, 0, 0);
  // pop();
  
  loadPixels();
  for (int x = 0; x < width; x+=2) {
    for (int y = 0; y < height; y+=2) {
      int fX = x;
      int fY = y;
      int tX = x + 2;
      int tY = y + 2;
      
      fX = constrain(fX, 0, width - 1);
      fY = constrain(fY, 0, height - 1);
      tX = constrain(tX, 0, width - 1);
      tY = constrain(tY, 0, height - 1);
      
      PxPGetPixel(fX, fY, pig.pixels, width);
      PxPSetPixel(tX, tY, R, G, B, A, pixels, width);
    }
  }
  updatePixels();
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
