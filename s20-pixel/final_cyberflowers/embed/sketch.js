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
    let frameRate = 90;
    let scale = 1.6; // Scale of drawings on canvas

    let flowers = []; // Array of all flowers
    let flowersNum = 0;

    let xOffset = 210;
    let currentInd = 0;

    var getFile = new XMLHttpRequest();

    s.setup = () => {
        c = s.createCanvas(720, 320);
        getFile.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                console.log("========== data ==========");
                flowers.push(new Flower(xOffset, 320 / 2, pageLang, ALPHABET[0], 0.89));
                flowers.push(new Flower(720 - xOffset, 320 / 2, pageLang, ALPHABET[1], 0.89));
                flowersNum += 2;
            }
        };
        getFile.open("GET", "data.json", true);
        getFile.send();
        s.frameRate(frameRate);
        s.angleMode(s.DEGREES);
        switch (pageLang) {
            case "en":
                s.textFont("Times");
                s.textStyle(s.NORMAL);
                break;
        }
    }

    s.draw = () => {
        s.background(245);
        if (flowers.length) {
            s.push();
            s.textStyle(s.NORMAL);
            s.textSize(17);
            s.fill(200);
            s.text(ALPHABET[currentInd], s.width - 50, 30);
            s.text(ALPHABET[currentInd + 1], s.width - 30, 30);
            s.pop();
            for (let i = 0; i < flowersNum; i++)
                flowers[i].bloom();
        }
    };

    s.mouseClicked = () => {
        if (s.mouseX > 0 && s.mouseX < s.width && s.mouseY > 0 && s.mouseY < s.height) {
            currentInd += 2;
            if (currentInd >= ALPHABET.length - 1)
                currentInd = 0;
            flowers[0].reset(xOffset, s.height / 2, pageLang, ALPHABET[currentInd], 0.89);
            flowers[1].reset(s.width - xOffset, s.height / 2, pageLang, ALPHABET[currentInd + 1], 0.89);
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

        update(newOffset, newAngle, newHeight) {
            this.offset = newOffset;
            if (this.angle != newAngle) {
                this.angle = newAngle;
                this.buildBaseColorSet();
            }
            this.height = newHeight;
        }

        reset(newX, newY, newLang, newChar, newSentiment) {
            this.x = newX;
            this.y = newY;
            this.lang = newLang;
            this.char = newChar;

            this.t = 0;
            this.bloomTime = s.int(0.3 * frameRate * s.map(newSentiment, 0, 1, 1.2, 0.8) + s.random(-frameRate / 6, frameRate / 6));
            this.progress = 0;

            /* [offset, angle (in times), height] */
            this.offset = data[newLang][newChar][0];
            this.angle = data[newLang][newChar][1];
            this.height = data[newLang][newChar][2];
            this.radiusScale = scale * s.map(s.abs(newSentiment - 0.5), 0, 0.5, 9, 18); // Size of flower

            this.baseColor = s.random(data.color[s.floor(newSentiment * 10)]);
            this.baseColorSet;
            this.buildBaseColorSet();
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

    let validateData = (lang) => {
        try {
            if (!(lang in data))
                throw "Language not in data.";
            for (let i in data[lang]) {
                if (data[lang][i].length != 3 || data[lang][i][0].length != 2)
                    throw i;
            }
        } catch (error) {
            console.error(error);
            return;
        }
        console.log("Check finished.");
    };
};

let windowFlowers = new p5(sketch);