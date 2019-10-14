let sth_selected = false;
let trained = false;

function mousePressed() {
    addButton.click();
    trainButton.click();
    saveDataButton.click();
    saveModelButton.click();
    emitClass[0].click();
    for (let i = 0; i < inputClass.length; i++) {
        inputClass[i].click();
    }
}

function mouseReleased() {
    addButton.release();
    trainButton.release();
    emitClass[0].release();
    for (let i = 0; i < inputClass.length; i++) {
        inputClass[i].release();
    }
}

function mouseDragged() {
    return false; // Prevent default
}

function saveData() {
    brain_1.saveData('poses_data_for_color');
    console.log('Brain 1 Data (Color) Saved');
    brain_2.saveData('poses_data_for_emit');
    console.log('Brain 2 Data (Emit) Saved');
}

function saveModel() {
    brain_1.save();
    console.log('Model 1 (Color) Saved');
    brain_2.save();
    console.log('Model 2 (Emit) Saved');
}

class SaveDataButton {
    constructor() {
        this.w = 90;
        this.h = 32;
        this.x = (width + videoWidth) / 2 - 90 - 8 - 2 * this.w - 16;
        this.y = (height - videoHeight) / 2 + 8;
        this.name = 'SaveDataButton';
        // this.clicked = false;
    }

    show() {
        push();
        if (inputClass.length > 0) {
            fill(71, 228, 187, 235);
        } else {
            fill(225);
        }
        rect(this.x, this.y, this.w, this.h);
        fill(255);
        textFont('Inconsolata', 22);
        textStyle(BOLD);
        text('↓data', this.x + 17.5, this.y + 22.5);
        pop();
    }

    click() {
        if (inputClass.length > 0 &&
            this.x <= mouseX && mouseX <= this.x + this.w && this.y <= mouseY && mouseY <= this.y + this.h) {
            // this.clicked = true;
            saveData();
        }
    }
}

class SaveModelButton {
    constructor() {
        this.w = 90;
        this.h = 32;
        this.x = (width + videoWidth) / 2 - 90 - 8 - this.w - 8;
        this.y = (height - videoHeight) / 2 + 8;
        this.name = 'SaveModelButton';
        // this.clicked = false;
    }

    show() {
        push();
        if (trained) {
            fill(71, 228, 187, 235);
        } else {
            fill(225);
        }
        rect(this.x, this.y, this.w, this.h);
        fill(255);
        textFont('Inconsolata', 22);
        textStyle(BOLD);
        text('↓model', this.x + 12.5, this.y + 22.5);
        pop();
    }

    click() {
        if (inputClass.length > 0 && trained &&
            this.x <= mouseX && mouseX <= this.x + this.w && this.y <= mouseY && mouseY <= this.y + this.h) {
            // this.clicked = true;
            saveModel();
        }
    }
}

class TrainButton {
    constructor() {
        this.x = (width + videoWidth) / 2 - 90 - 8;
        this.y = (height - videoHeight) / 2 + 8;
        this.w = 90;
        this.h = 32;
        this.name = 'TrainButton';
        // this.selected = false;
        this.clicked = false; // Once clicked, cannot be clicked again
    }

    show() {
        push();
        if (inputClass.length > 0 && !this.clicked) {
            fill(71, 228, 187, 235);
        } else {
            fill(225);
        }
        rect(this.x, this.y, this.w, this.h);
        fill(255);
        textFont('Inconsolata', 22);
        textStyle(BOLD);
        text('train!', this.x + 14, this.y + 22.5);
        pop();
    }

    click() {
        if (inputClass.length > 0 && !this.clicked &&
            this.x <= mouseX && mouseX <= this.x + this.w && this.y <= mouseY && mouseY <= this.y + this.h) {
            this.clicked = true;
            trained = true;
            // ------------------------------ TRAIN ------------------------------
            trainModel();
            // ------------------------------ TRAIN ------------------------------
        }
    }

    release() {
    }
}

class AddButton {
    constructor() {
        this.x = (width - videoWidth) / 2 + 8;
        this.y = (height - videoHeight) / 2 + 8;
        this.l = 32;
        this.center = [this.x + this.l / 2, this.y + this.l / 2];
        this.addable = true;
        this.clicked = false;
        this.name = 'AddButton';
    }

    show() {
        push();
        if (this.clicked && this.addable) {
            fill(55, 215, 165, 245);
        } else if (this.addable) {
            fill(71, 228, 187, 235);
        } else {
            fill(225);
        }
        rect(this.x, this.y, this.l, this.l);
        fill(255);
        rectMode(CENTER);
        rect(this.center[0], this.center[1], 18, 3.6);
        rect(this.center[0], this.center[1], 3.6, 18);
        pop();
    }

    click() {
        // Called in mousePressed()
        if (this.addable && this.x <= mouseX && mouseX <= this.x + this.l && this.y <= mouseY && mouseY <= this.y + this.l) {
            this.clicked = true;
            inputClass.push(new InputClass(inputClass.length));
        }
        if (inputClass.length >= 8) {
            // -------------------- MAX COLOR CLASS --------------------
            this.addable = false;
        }
    }

    release() {
        this.clicked = false;
    }
}

class InputClass {
    constructor(lastLen) {
        this.x = (width - videoWidth) / 2 + 88 /*AddButton + emitClass*/ + lastLen * 40;
        this.y = (height - videoHeight) / 2 + 8;
        this.l = 32;
        this.center = [this.x + this.l / 2, this.y + this.l / 2];
        this.selected = false;
        this.clicked = false;
        this.color = [200, 200, 200]; // Default color
        this.colorPad = new ColorPad(this.x, this.y, this.l, this.center);
    }

    show() {
        push();
        if (this.selected) {
            fill(71, 228, 187);
        } else {
            // Not selected
            fill(255, 255, 255, 165);
        }
        rect(this.x, this.y, this.l, this.l);
        pop();

        if (this.selected && this.clicked) {
            noCursor();
            let deltaX = mouseX - pmouseX;
            let deltaY = mouseY - pmouseY;
            this.colorPad.update(deltaX, deltaY);
            this.color = this.colorPad.show(deltaX, deltaY);
        }

        push();
        fill(this.color[0], this.color[1], this.color[2]);
        rectMode(CENTER);
        rect(this.center[0], this.center[1], 22, 22);
        pop();
    }

    click() {
        if (this.x <= mouseX && mouseX <= this.x + this.l && this.y <= mouseY && mouseY <= this.y + this.l) {
            this.selected = true; // collecting updated later
            this.clicked = true;
        } else {
            this.selected = false;
        }
    }

    release() {
        if (this.selected) {
            // Only run when this class is selected
            this.clicked = false;
            bodyColor = this.color;
        }
    }
}

class EmitClass {
    constructor() {
        this.x = (width - videoWidth) / 2 + 48;
        this.y = (height - videoHeight) / 2 + 8;
        this.l = 32;
        this.center = [this.x + this.l / 2, this.y + this.l / 2];
        this.selected = false;
    }

    show() {
        push();
        if (this.selected) {
            fill(71, 228, 187);
        } else {
            // Not selected
            fill(255, 255, 255, 165);
        }
        rect(this.x, this.y, this.l, this.l);
        pop();
        push();
        translate((width - videoWidth) / 2 + 48 + 16, (height - videoHeight) / 2 + 8 + 16);
        stroke(color('#333333'));
        strokeWeight(2.2);
        for (let i = 0; i < 8; i++) {
            rotate(PI / 4 * i);
            line(0, -7, 0, -9);
        }
        pop();
    }

    click() {
        if (this.x <= mouseX && mouseX <= this.x + this.l && this.y <= mouseY && mouseY <= this.y + this.l) {
            this.selected = true; // collecting updated later
        } else {
            this.selected = false;
        }
    }

    release() {

    }
}

class ColorPad {
    // Peiling Jiang 2019
    constructor(x, y, l, center) {
        this.class_x = x;
        this.class_y = y;
        this.class_l = l;
        this.class_center = center;
        this.l = 272; // The len of the whole pad
        this.x = this.class_x - (this.l - this.class_l) / 2;
        this.y = this.class_y - (this.l - this.class_l) / 2;
        this.center = this.cal_center();
        this.pixels = [];
        this.picked_color;
        noStroke();
        push();
        for (let i = 1; i <= 4; i++) {
            for (let j = 0; j <= 255; j += 17) {
                this.pixels.push(new Pixel(this.x + j, this.y + (i - 1) * 17, 17.5, [0, j, 85 * (i - 1)]));
            }
            for (let j = 0; j <= 255; j += 17) {
                this.pixels.push(new Pixel(this.x + j, this.y + 68 + (i - 1) * 17, 17.5, [85, j, 85 * (i - 1)]));
            }
            for (let j = 0; j <= 255; j += 17) {
                this.pixels.push(new Pixel(this.x + j, this.y + 136 + (i - 1) * 17, 17.5, [170, j, 85 * (i - 1)]));
            }
            for (let j = 0; j <= 255; j += 17) {
                this.pixels.push(new Pixel(this.x + j, this.y + 204 + (i - 1) * 17, 17.5, [255, j, 85 * (i - 1)]));
            }
        }
        pop();
    }

    cal_center() {
        return [this.x + this.l / 2, this.y + this.l / 2];
    }

    show() {
        // console.log(this.pixels);
        push();
        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i].show();
        }
        fill(255, 255, 255, 64);
        rect(this.x, this.y, 272.5, 272.5);
        pop();

        // Return the selected color
        let minDist = this.l;
        let color_to_return = [0, 0, 0];
        for (let i = 0; i < this.pixels.length; i++) {
            let nowPixel = this.pixels[i];
            if (dist(nowPixel.center[0], nowPixel.center[1], this.class_center[0], this.class_center[1]) <= minDist) {
                minDist = dist(nowPixel.center[0], nowPixel.center[1], this.class_center[0], this.class_center[1]);
                color_to_return = nowPixel.c;
            }
        }
        return color_to_return;
    }

    update(dX, dY) {
        // Update default pad x and y by the selected pixel
        this.x -= dX;
        this.y -= dY;
        this.center = this.cal_center();
        // Update all pixels
        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i].update(dX, dY);
        }
    }
}

class Pixel {
    constructor(x, y, l, colorArray) {
        this.x = x;
        this.y = y;
        this.l = l;
        this.c = colorArray;
        this.center = this.cal_center();
    }

    cal_center() {
        return [this.x + this.l / 2, this.y + this.l / 2];
    }

    update(dX, dY) {
        this.x -= dX;
        this.y -= dY;
        this.center = this.cal_center();
    }

    show() {
        // is_in is a boolean value telling if
        // the pixel is in color window area
        // let temp_alpha;
        // if (is_in) {
        //     temp_alpha = 255;
        // } else {
        //     temp_alpha = 170;
        // }
        push();
        fill(this.c[0], this.c[1], this.c[2]);
        rect(this.x, this.y, this.l, this.l);
        pop();
    }
}

function draw_selection_area() {
    // Draw the basic color selection area
    push();
    noStroke();
    fill(255, 255, 255, 96);
    rect((width - videoWidth) / 2, (height - videoHeight) / 2, video.width, 48);
    pop();
    // Update cursor style
    update_cursor();
    // Draw train button
    trainButton.show();
    // Draw add button
    addButton.show();
    // Draw emit classes
    emitClass[0].show();
    // Draw downloads
    saveDataButton.show();
    saveModelButton.show();
    // Draw input classes
    for (let i = 0; i < inputClass.length; i++) {
        if (!inputClass[i].selected) {
            inputClass[i].show();
        }
    }
    for (let i = 0; i < inputClass.length; i++) {
        if (inputClass[i].selected) {
            inputClass[i].show();
        }
    }

    // Update collecting
    update_collecting();
}

function update_cursor() {
    let pointer = false;
    if (cursor_over(addButton) || cursor_over_wh(trainButton) || cursor_over_wh(saveDataButton) || cursor_over_wh(saveModelButton)) {
        pointer = true;
    }
    for (let i = 0; i < emitClass.length; i++) {
        if (cursor_over(emitClass[i])) {
            pointer = true;
        }
    }
    for (let i = 0; i < inputClass.length; i++) {
        if (cursor_over(inputClass[i])) {
            pointer = true;
        }
    }
    if (pointer) {
        cursor('pointer');
    } else {
        cursor('default');
    }
}

function cursor_over(obj) {
    if (obj.x <= mouseX && mouseX <= obj.x + obj.l && obj.y <= mouseY && mouseY <= obj.y + obj.l) {
        return true;
    } else {
        return false;
    }
}

function cursor_over_wh(obj) {
    if (obj.x <= mouseX && mouseX <= obj.x + obj.w && obj.y <= mouseY && mouseY <= obj.y + obj.h) {
        return true;
    } else {
        return false;
    }
}

function update_collecting() {
    let s = false;
    // Emit
    for (let i = 0; i < emitClass.length; i++) {
        if (emitClass[i].selected) {
            selectedClassType = 'E';
            s = true;
            break;
        }
    }
    // Color
    for (let i = 0; i < inputClass.length; i++) {
        if (inputClass[i].selected && !inputClass[i].clicked) {
            selectedClassType = 'C';
            s = true;
            break;
        }
    }
    if (s && !trained) {
        collecting = true;
    } else {
        collecting = false;
    }
}