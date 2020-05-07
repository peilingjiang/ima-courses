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
    let scale = 1.25; // Scale of drawings on canvas

    let flowers = []; // Array of all flowers
    let flowersNum = 0;

    let currentInd = 0;

    var getFile = new XMLHttpRequest();

    s.setup = () => {
        c = s.createCanvas(720, 720);
        getFile.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                console.log("========== data ==========");
                currentInd = 24;
                flowers.push(new Flower(s.width / 2, s.height / 2, pageLang, ALPHABET[24], 0.89));
                flowers.push(new Flower(80, s.height - 80, pageLang, ALPHABET[24], 0.50));
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
            s.text(ALPHABET[currentInd], s.width - 30, 30);
            s.pop();

            if (s.mouseX > 0 && s.mouseX < s.width && s.mouseY > 0 && s.mouseY < s.height)
                flowers[0].update(
                    s.map(s.mouseX, 200, s.width - 200, -4, 4, true),
                    s.map(s.mouseY, 200, s.height - 200, -4, 4, true)
                );
            flowers[0].bloom(true);
            flowers[1].bloom(false);
        }
    };

    s.mouseClicked = () => {
        if (s.mouseX > 0 && s.mouseX < s.width && s.mouseY > 0 && s.mouseY < s.height) {
            currentInd += 1;
            if (currentInd >= ALPHABET.length - 1)
                currentInd = 0;
            flowers[0].reset(s.width / 2, s.height / 2, pageLang, ALPHABET[currentInd], 0.89);
            flowers[1].reset(80, s.height - 80, pageLang, ALPHABET[currentInd], 0.5);
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
            this.bloomTime = s.int(0.3 * frameRate * s.map(sentiment, 0, 1, 1.2, 0.8)); // Total bloom time 1 sec
            this.progress = 0.5;

            /* [offset, angle (in times), height] */
            this.offsetX = data[lang][char][0][0]; // Offset of char in flower
            this.offsetY = data[lang][char][0][1]
            this.angle = data[lang][char][1]; // How many times rotated!
            this.height = data[lang][char][2]; // Height in standard size
            this.radiusScale = scale * s.map(s.abs(sentiment - 0.5), 0, 0.5, 9, 18); // Size of flower

            this.baseColor = s.random(data.color[s.floor(sentiment * 10)]);
            this.startColor = s.random(data.color[9]);
            this.baseColorSet;
            this.buildBaseColorSet();
        }

        buildBaseColorSet() {
            this.baseColorSet = [];
            for (let i = 0; i < this.angle; i++) {
                let colorOffset = s.random(-12, 12);
                this.baseColorSet.push([
                    s.constrain(this.baseColor[0] + colorOffset + s.random(-2, 2), 0, 255),
                    s.constrain(this.baseColor[1] + colorOffset + s.random(-2, 2), 0, 255),
                    s.constrain(this.baseColor[2] + colorOffset + s.random(-2, 2), 0, 255)
                ]);
            }
        }

        bloom(mainFlower) {
            if (this.progress < 1) {
                this.t++;
            }
            // Calc progress
            this.progress = this.t / this.bloomTime;
            // MODE 2
            s.push();
            s.textSize(this.radiusScale * this.height * s.map(this.progress, 0, 1, 0.9, 1));
            s.translate(this.x, this.y);
            for (let i = s.floor(this.angle * this.progress) - 1; i >= 0; i--) {
                s.push();
                s.fill(
                    this.baseColorSet[i][0],
                    this.baseColorSet[i][1],
                    this.baseColorSet[i][2],
                    225 - 7 * i
                );
                if (i == 0 && mainFlower)
                    s.fill(this.startColor[0], this.startColor[1], this.startColor[2], 225);
                s.rotate(i * 360 / this.angle);
                s.translate(this.radiusScale * this.offsetX, this.radiusScale * this.offsetY);
                s.text(this.char, 0, 0);
                s.pop();
            }
            s.pop();
        }

        update(newOffsetX, newOffsetY) {
            this.offsetX = s.lerp(this.offsetX, newOffsetX, 0.4);
            this.offsetY = s.lerp(this.offsetY, newOffsetY, 0.4);
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
            this.offsetX = data[newLang][newChar][0][0];
            this.offsetY = data[newLang][newChar][0][1];
            this.angle = data[newLang][newChar][1];
            this.height = data[newLang][newChar][2];
            this.radiusScale = scale * s.map(s.abs(newSentiment - 0.5), 0, 0.5, 9, 18); // Size of flower

            this.baseColor = s.random(data.color[s.floor(newSentiment * 10)]);
            this.baseColorSet;
            this.buildBaseColorSet();
        }
    }
};

let windowFlowers = new p5(sketch);