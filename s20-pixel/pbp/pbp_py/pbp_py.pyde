# Pixels Born Pixels
# Peiling Jiang

# 2020

"""
Pixels born pixels.
Pixels eat pixels.
Pixels upgrade.
"""

speeds = [-1, 0, 1]
levelColors = [
    [255, 255, 255],
    [254, 230, 105],
    [253, 163, 50],
    [255, 103, 106],
    [244, 57, 57],
    [161, 51, 221],
    [36, 210, 253]
]

allPixels = set()
removals = set()
adders = set()

debug = False

disHeight = 32
birthMode = 2  # 1 or 2

def setup():
    frameRate(90)
    size(770, 770 + disHeight)
    colorMode(RGB)
    noStroke()
    noFill()
    background(0)
    
    global allPixels
    
    if debug:
        allPixels.add(Pix(5, 100, 100, 1, 0))
        allPixels.add(Pix(5, 400, 100, -1, 0))
    else:
        for i in range(600):
            allPixels.add(Pix())

def draw():
    background(0)

    global allPixels
    nowPositions = {}
    # To remove this round, give birth or eaten
    removals = set()
    # To add this round, emitted
    adders = set()

    loadPixels()

    for p in allPixels:
        tempPosition = p.move()
        if tempPosition not in nowPositions:
            nowPositions[tempPosition] = p
        else:
            tempPix = nowPositions[tempPosition]
            if p.level == tempPix.level:
                # Give birth, remove p
                nowPositions[tempPosition].up(True, adders, nowPositions)
                removals.add(p)
            elif p.level > tempPix.level:
                # p up, remove original
                p.up(False)
                removals.add(tempPix)
                nowPositions[tempPosition] = p
            else:
                # original up, remove p
                nowPositions[tempPosition].up(False)
                removals.add(p)

    allPixels -= removals
    allPixels = allPixels | adders

    cNum = [0, 0, 0, 0, 0, 0, 0] # Counting
    for p in allPixels:
        p.display()
        cNum[p.level] += 1

    updatePixels()

    # Draw level hint
    cnTotal = 0
    cumuLen = 0
    cnTotal = sum(cNum)
    # End part
    fill(levelColors[len(levelColors) - 1][0],
         levelColors[len(levelColors) - 1][1], levelColors[len(levelColors) - 1][2])
    rect((len(levelColors) - 1) * width / len(levelColors),
         height - disHeight / 2, width / len(levelColors), disHeight / 2)
    rect(cumuLen, height - disHeight, width, disHeight / 2)

    for c in range(len(levelColors) - 1):
        fill(levelColors[c][0], levelColors[c][1], levelColors[c][2])
        rect(c * width / len(levelColors), height - disHeight / 2,
             width / len(levelColors), disHeight / 2)
        # Draw by cumulative length
        cumuLenDelta = width * cNum[c] / cnTotal
        # Floating numbers *shake*
        if cNum[c + 1] == 0:
            rect(cumuLen, height - disHeight, width, disHeight / 2)
        else:
            rect(cumuLen, height - disHeight, cumuLenDelta, disHeight / 2)
        cumuLen += cumuLenDelta

def speedSelect():
    tempSelectorX = int(random(3))
    tempSelectorY = int(random(3))
    while tempSelectorX * tempSelectorY == 1:
        tempSelectorX = int(random(3))
        tempSelectorY = int(random(3))
    return tempSelectorX, tempSelectorY

class Pix:

    def __init__(self, sL=None, eX=None, eY=None, sX=None, sY=None):
        if not sL:
            self.x = int(random(0, width - 1))
            self.y = int(random(0, height - 1 - disHeight))
            self.level = 0
            # SPEED avoid 0, 0
            selectors = speedSelect()
            self.speedX = speeds[selectors[0]]
            self.speedY = speeds[selectors[1]]
        else:
            self.x = eX
            self.y = eY
            self.speedX = sX
            self.speedY = sY
            self.level = sL

    def move(self):
        self.x = constrain(self.x + self.speedX, 0, width - 1)
        self.y = constrain(self.y + self.speedY, 0, height - 1 - disHeight)
        if self.x in (0, width - 1):
            self.speedX = - self.speedX
        if self.y in (0, height - 1 - disHeight):
            self.speedY = - self.speedY
        return self.x, self.y

    def display(self):
        pixels[self.x + self.y * width] = color(levelColors[self.level][0],
                                                levelColors[self.level][1],
                                                levelColors[self.level][2])

    def up(self, emit, addSet=None, nP=None):
        self.level += 1
        if self.level == 7:
            self.level = 0
            return

        if emit:
            if self.level == 0:
                return
            if birthMode == 1:
                for ix in range(-1, 2):
                    for iy in range(-1, 2):
                        if (ix != 0 or iy != 0) and (self.x + ix, self.y + iy) not in nP:
                            addSet.add(Pix(self.level - 1,
                                           self.x + ix, self.y + iy,
                                           ix, iy))
            elif birthMode == 2:
                rate = floor(random(3, 5))
                for rept in range(rate):
                    selectors = speedSelect()
                    addSet.add(Pix(self.level - 1,
                                   self.x +
                                   selectors[0], self.y + selectors[1],
                                   speeds[selectors[0]], speeds[selectors[1]]))
        return
