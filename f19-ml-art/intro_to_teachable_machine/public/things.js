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
    const eggImg = loadImage('assets/egg.png');
    const orangeImg = loadImage('assets/orange.png');
    const breadImg = loadImage('assets/bread.png');
    const tomatoImg = loadImage('assets/tomato.png');
    const fishImg = loadImage('assets/fish.png');
    const appleImg = loadImage('assets/apple.png');

    const burgerImg = loadImage('assets/burger.png');
    const friesImg = loadImage('assets/fries.png');
    const riceImg = loadImage('assets/rice.png');
    const chickenImg = loadImage('assets/chicken.png');
    const potatoImg = loadImage('assets/potato.png');
    const hotpotImg = loadImage('assets/hotpot.png');

    const bombImg = loadImage('assets/bomb.png');

    console.log('Photos successfully preloaded.')
}

