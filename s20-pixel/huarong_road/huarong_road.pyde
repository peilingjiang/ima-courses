"""
Huarong Road

Peiling Jiang
Pixel By Pixel Daniel Rozin 2020
"""

import random

add_library('video')
ourVideo = Capture(this, 1280, 720)

r = 80
step = 5
xNum = 1280 / r
yNum = 720 / r

blocks = set()
blockNum = [] # Store random init numbers
removed = 0

def setup():
    global removed
    frameRate(60)
    size(1280, 720)
    # ourVideo = Capture(this, width, height) | ourVideo
    ourVideo.start()
    
    # Build random number list
    for i in range(int(width * height // pow(r, 2))):
        blockNum.append(i)
    removed = random.choice(blockNum)
    print(removed)
    blockNum.remove(removed)
    
    # Build blocks list
    for i in range(int(width * height // pow(r, 2) - 1)):
        tempNum = random.choice(blockNum)
        blocks.add(Block((i % xNum - 1) * r, (i // xNum) * r, r, tempNum,
                            (tempNum % xNum - 1) * r, (tempNum // xNum) * r))
        blockNum.remove(tempNum)
    ourVideo.loadPixels()
    
def draw():
    global removed
    background("#00d1ff")
    ourVideo.read()
    
    loadPixels()
    for b in blocks:
        b.move()
        b.display()
    
    updatePixels()
        
class Block:
    def __init__(self, x, y, l, randomNum, randomX, randomY):
        self.x = x
        self.y = y
        self.l = l
        self.num = randomNum
        self.currentX = randomX
        self.currentY = randomY
        self.moving = 0 # 0 False 8 True
        self.direction = []
    
    def display(self):
        for x in range(self.l):
            for y in range(self.l):
                pixels[(self.currentY + y) * width + self.currentX + x] = ourVideo.pixels[(y + self.y) * width + x + self.x]
        return
                
    def move(self):
        if self.moving > 0:
            self.moving -= 1
            self.currentX += self.direction[0]
            self.currentY += self.direction[1]
        return
                
def mousePressed():
    global removed
    for b in blocks:
        if (b.currentX < mouseX < b.currentX + b.l and b.currentY < mouseY < b.currentY + b.l):
            print(b.num, removed)
            b.direction = helper_getDirection(b)
            if b.direction != []:
                b.moving = step
                b.move()
            break
        
def helper_getDirection(b):
    global removed
    if (removed + xNum == b.num):
        # re at top
        removed, b.num = b.num, removed
        return [0, -r / step]
    elif (removed - xNum == b.num):
        # re at bottom
        removed, b.num = b.num, removed
        return [0, r / step]
    elif (removed + 1 == b.num):
        # re at left
        removed, b.num = b.num, removed
        return [-r / step, 0]
    elif (removed - 1 == b.num):
        # re at right
        removed, b.num = b.num, removed
        return [r / step, 0]
    return []

# R, G, B, A = 0, 0, 0, 0
# def PxPGetPixel(x, y, pixelList, pixelWidth):
#     thisPixel = pixelList[x + y * pixelWidth]
#     A = (thisPixel >> 24) & 0xFF
#     R = (thisPixel >> 16) & 0xFF
#     G = (thisPixel >> 8) & 0xFF   
#     B = thisPixel & 0xFF
