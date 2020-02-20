# Pixels Born Pixels
# Peiling Jiang

# 2020

speeds = [-1, 0, 1]
levelColors = [
               [255, 255, 255],
               [254, 230, 105],
               [253, 163,  50],
               [255, 103, 106],
               [244,  57,  57],
               [161,  51, 221],
               [ 36, 210, 253]
               ]

allPixels = set()
removals = set()
adders = set()

debug = False

disHeight = 5
birthMode = 2 # 1 or 2

def setup():
    frameRate(180)
    size(800, 800 + disHeight)
    colorMode(RGB)
    noStroke()
    noFill()
    background(0)
    global allPixels
    for i in range(500):
        allPixels.add(Pix())
    if debug:
        allPixels.add(Pix(5, 100, 100, 1, 0))
        allPixels.add(Pix(5, 400, 100, -1, 0))
    
def draw():
    global allPixels
    background(0)
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
            if p.level == nowPositions[tempPosition].level:
                # Give birth, remove p
                nowPositions[tempPosition].up(True, adders, nowPositions)
                removals.add(p)
            elif p.level > nowPositions[tempPosition].level:
                # p up, remove original
                p.up(False)
                removals.add(nowPositions[tempPosition])
                nowPositions[tempPosition] = p
            else:
                # original up, remove p
                nowPositions[tempPosition].up(False)
                removals.add(p)
                
    allPixels -= removals
    allPixels = allPixels | adders

    for p in allPixels:
        p.display()
        
    updatePixels()
    
    for c in levelColors:
        fill(c[0], c[1], c[2])
        rect(levelColors.index(c) * 100, height - disHeight, 100, disHeight)
    
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
                        if (ix + iy != 0 or ix * iy != 0) and (self.x + ix, self.y + iy) not in nP:
                            addSet.add(Pix(self.level - 1,
                                           self.x + ix, self.y + iy,
                                           ix, iy))
            elif birthMode == 2:
                for rept in range(3):
                    selectors = speedSelect()
                    addSet.add(Pix(self.level - 1,
                                   self.x + selectors[0], self.y + selectors[1],
                                   selectors[0], selectors[1]))
        return
                    
