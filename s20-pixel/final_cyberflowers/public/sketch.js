/*
    Peiling Jiang
    Pixel by Pixel 2020 Daniel Rozin
*/

let pageLang = "en";
let tuneMode = false;

// en
let ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

let sketch = (s) => {
    // Parse data from data.json
    let data;
    var getFile = new XMLHttpRequest();
    getFile.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            console.log("========== data ==========");
        }
    };
    getFile.open("GET", "data.json", true);
    getFile.send();

    let c; // Canvas
    let frameRate = 90;
    let scale = 1; // Scale of drawings on canvas
    let bloomMode = 2;

    let flowers = []; // Array of all flowers
    let flowersNum = 0;

    let sliderOffsetX, sliderOffsetY, sliderAngle, sliderHeight;

    s.setup = () => {
        if (tuneMode)
            c = s.createCanvas(
                document.documentElement.scrollWidth,
                500
            );
        else
            c = s.createCanvas(
                document.documentElement.scrollWidth,
                document.documentElement.scrollHeight
            );
        c.position(0, 0);
        s.frameRate(frameRate);
        s.angleMode(s.DEGREES);
        switch (pageLang) {
            case "en":
                s.textFont("Times");
                s.textStyle(s.NORMAL);
                break;
        }

        if (tuneMode) {
            sliderOffsetX = s.createSlider(-4, 4, 0, 0.1);
            sliderOffsetY = s.createSlider(-4, 4, 0, 0.1);
            sliderAngle = s.createSlider(8, 18, 12, 1);
            sliderHeight = s.createSlider(3, 6, 4, 0.5);
            sliderOffsetX.position(10, 600);
            sliderOffsetY.position(160, 600);
            sliderAngle.position(310, 600);
            sliderHeight.position(460, 600);
        }
    }

    s.draw = () => {
        s.clear();
        if (tuneMode) {
            s.push();
            s.textSize(20);
            s.textFont("Helvetica");
            s.text(sliderOffsetX.value(), 10, 30);
            s.text(sliderOffsetY.value(), 50, 30);
            s.text(sliderAngle.value(), 90, 30);
            s.text(sliderHeight.value(), 150, 30);
            s.pop();
        }
        for (let i = 0; i < flowersNum; i++) {
            if (tuneMode) {
                flowers[i].update([sliderOffsetX.value(), sliderOffsetY.value()], sliderAngle.value(), sliderHeight.value());
            }
            flowers[i].bloom();
        }
    };

    s.mouseClicked = () => {
        let tempChar = s.random(ALPHABET);
        if ((pageLang in data) && (tempChar in data[lang])) {
            flowers.push(new Flower(s.mouseX, s.mouseY, pageLang, tempChar, s.random(0, 1)));
            flowersNum++;
        }
    };

    class Flower {
        constructor(x, y, lang, char, sentiment) {
            /*
                lang: language
                char: the root character
                sentiment: [0, 1] sentiment of text around
            */

            this.x = x;
            this.y = y;
            this.lang = lang;
            this.char = char;

            this.t = 0; // For bloom animation
            this.bloomTime = s.int(0.3 * frameRate * s.map(sentiment, 0, 1, 1.2, 0.8) + s.random(-frameRate / 6, frameRate / 6)); // Total bloom time base 1 sec
            this.progress = 0;

            /* [offset, angle (in times), height] */
            this.offset = data[lang][char][0]; // Offset of char in flower
            this.angle = data[lang][char][1]; // How many times rotated!
            this.height = data[lang][char][2]; // Height in standard size
            this.radiusScale = scale * s.map(s.abs(sentiment - 0.5), 0, 0.5, 9, 18); // Size of flower

            this.baseColor = s.random(data.color[s.floor(sentiment * 10)]);
            this.baseColorSet;
            this.buildBaseColorSet();
        }

        buildBaseColorSet() {
            this.baseColorSet = [];
            for (let i = 0; i < this.angle; i++)
                this.baseColorSet.push([
                    s.constrain(this.baseColor[0] + s.random(-17, 17), 0, 255),
                    s.constrain(this.baseColor[1] + s.random(-17, 17), 0, 255),
                    s.constrain(this.baseColor[2] + s.random(-17, 17), 0, 255)
                ]);
        }

        bloom() {
            if (this.progress >= 1) {
                this.display();
                return;
            }
            // Calc progress
            this.progress = this.t / this.bloomTime;
            if (bloomMode == 1) {
                // MODE 1
                s.push();
                s.textSize(this.radiusScale * this.height * s.map(this.progress, 0, 1, 0.8, 1));
                // Move to the root position
                s.translate(this.x, this.y);
                for (let i = 0; i < this.angle; i++) {
                    s.push();
                    s.fill(
                        this.baseColorSet[i][0],
                        this.baseColorSet[i][1],
                        this.baseColorSet[i][2],
                        225 - 7 * i + (100 * this.progress)
                    );
                    s.rotate(i * 360 * this.progress / this.angle);
                    // In pattern offset
                    s.translate(this.radiusScale * this.offset[0], this.radiusScale * this.offset[1]);
                    s.text(this.char, 0, 0);
                    s.pop();
                }
                s.pop();
            } else {
                // MODE 2
                s.push();
                s.textSize(this.radiusScale * this.height * s.map(this.progress, 0, 1, 0.9, 1));
                s.translate(this.x, this.y);
                for (let i = 0; i < s.floor(this.angle * this.progress); i++) {
                    s.push();
                    s.fill(
                        this.baseColorSet[i][0],
                        this.baseColorSet[i][1],
                        this.baseColorSet[i][2],
                        225 - 7 * i
                    );
                    s.rotate(i * 360 / this.angle);
                    s.translate(this.radiusScale * this.offset[0], this.radiusScale * this.offset[1]);
                    s.text(this.char, 0, 0);
                    s.pop();
                }
                s.pop();
            }

            this.t++;
        }

        display() {
            s.push();
            s.textSize(this.radiusScale * this.height);
            s.translate(this.x, this.y);
            for (let i = 0; i < this.angle; i++) {
                s.push();
                s.fill(
                    this.baseColorSet[i][0],
                    this.baseColorSet[i][1],
                    this.baseColorSet[i][2],
                    225 - 7 * i
                );
                s.rotate(i * 360 / this.angle);
                s.translate(this.radiusScale * this.offset[0], this.radiusScale * this.offset[1]);
                s.text(this.char, 0, 0);
                s.pop();
            }
            s.pop();
        }

        update(newOffset, newAngle, newHeight) {
            this.offset = newOffset;
            if (this.angle != newAngle) {
                this.angle = newAngle;
                this.buildBaseColorSet();
            }
            this.height = newHeight;
        }
    }
};

let windowFlowers = new p5(sketch);