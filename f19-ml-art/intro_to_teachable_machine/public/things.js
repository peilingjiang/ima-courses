let good_food = {
    5: ['egg', 'orange', 'bread'],
    10: ['tomato', 'fish'],
    15: ['apple']
}

let bad_food = {
    5: ['burger', 'fries', 'rice'],
    10: ['chicken', 'potato'],
    15: ['hotpot']
}

function loadimg() {
    egg = loadImage('assets/egg.png');
    orange = loadImage('assets/orange.png');
    bread = loadImage('assets/bread.png');
    tomato = loadImage('assets/tomato.png');
    fish = loadImage('assets/fish.png');
    apple = loadImage('assets/apple.png');

    burger = loadImage('assets/burger.png');
    fries = loadImage('assets/fries.png');
    rice = loadImage('assets/rice.png');
    chicken = loadImage('assets/chicken.png');
    potato = loadImage('assets/potato.png');
    hotpot = loadImage('assets/hotpot.png');

    bomb = loadImage('assets/bomb.png');

    console.log('Photos successfully preloaded.')
}