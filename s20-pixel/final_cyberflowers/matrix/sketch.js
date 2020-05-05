/*
    Peiling Jiang
    Pixel by Pixel 2020 Daniel Rozin
*/

let pageLang = "en";

// en
let ALPHABET = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789.,!?@#%^&*".split("");

let sketch = (s) => {
    // Parse data from data.json
    let data;

    let c; // Canvas
    let frameRate = 60;
    let scale = 0.43; // Scale of drawings on canvas

    let flowers = []; // Array of all flowers
    let flowersNum = 0;

    let margin = 45;
    let rowNum = 9;
    let colNum = 8;
    let gap;
    let sowable = false;

    var getFile = new XMLHttpRequest();
    getFile.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            console.log("========== data ==========");
            sowable = true;
        }
    };
    getFile.open("GET", "data.json", true);
    getFile.send();

    s.setup = () => {
        c = s.createCanvas(720, 810);
        s.frameRate(frameRate);
        s.angleMode(s.DEGREES);
        switch (pageLang) {
            case "en":
                s.textFont("Times");
                s.textStyle(s.NORMAL);
                break;
        }

        gap = s.int((s.width - 2 * margin) / (colNum - 1));
    }

    s.draw = () => {
        if (sowable) {
            for (let row = 0; row < rowNum; row++) {
                for (let col = 0; col < colNum; col++) {
                    flowers.push(new Flower(margin + gap * col, margin + gap * row, pageLang, ALPHABET[col + row * colNum], 0.89));
                    flowersNum++;
                }
            }
            sowable = !sowable;
        }
        s.background(245);
        if (flowersNum) {
            for (let i = 0; i < flowersNum; i++)
                flowers[i].bloom();
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
            this.bloomTime = s.int(0.3 * frameRate * s.map(sentiment, 0, 1, 1.2, 0.8)); // Total bloom time base 1 sec
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
            for (let i = 0; i < this.angle; i++) {
                let colorOffset = s.random(-15, 15);
                this.baseColorSet.push([
                    s.constrain(this.baseColor[0] + colorOffset + s.random(-3, 3), 0, 255),
                    s.constrain(this.baseColor[1] + colorOffset + s.random(-3, 3), 0, 255),
                    s.constrain(this.baseColor[2] + colorOffset + s.random(-3, 3), 0, 255)
                ]);
            }
        }

        bloom() {
            if (this.progress >= 1) {
                this.display();
                return;
            }
            // Calc progress
            this.progress = this.t / this.bloomTime;
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
    }

    let saved = false;
    let saveCount = 0;

    s.keyTyped = () => {
        if (s.key === 's') {
            saved = !saved;
            s.saveCanvas(c, "canvas" + saveCount, "png");
            saveCount++;
        }
    };
};

let windowFlowers = new p5(sketch);