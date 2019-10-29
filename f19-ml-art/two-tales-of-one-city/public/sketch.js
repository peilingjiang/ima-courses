let modelCounter = 1; // Count model
let bg;
let runningInference = false;
let generated = false;
let imgArray;

function preload() {
  imgArray = en_images;
}

function setup() {
  noCanvas();
  zh_nameRNN = ml5.charRNN('./models/zh_name/', modelReady);
  zh_contentRNN = ml5.charRNN('./models/zh_description/', modelReady);
  en_nameRNN = ml5.charRNN('./models/en_name/', modelReady);
  en_contentRNN = ml5.charRNN('./models/en_description/', modelReady);
  noLoop();
}

function modelReady() {
  console.log(str(modelCounter) + ' Model Ready');
  modelCounter++;
  if (!generated && modelCounter === 4) {
    generate(zh_nameRNN, ['zh', 'name']);
    generate(en_nameRNN, ['en', 'name']);
    generate(zh_contentRNN, ['zh', 'content']);
    generate(en_contentRNN, ['en', 'content']);
    generated = true;
  }
}

function draw() {

}

function generate(rnn, type) {
  // type will be an array ['zh', 'name']
  // prevent starting inference if we've already started another instance
  let seed = get_seed(type);

  let data = {
    seed: seed,
    temperature: 0.5,
    length: get_len(type)
  };
  // Generate text with the charRNN
  rnn.generate(data, gotData);

  // When it's done
  function gotData(err, result) {
    update_text(type, seed + result.sample);
  }
}

function update_text(t, r) {
  if (t[0] == 'zh') {
    if (t[1] == 'name') {
      $("#zh_title").text(r);
    } else {
      $("#zh_content").text(r + "......");
      $("#zh_content").append("&nbsp;&nbsp;<em>[了解更多]</em>");
    }
  } else {
    let lastSpaceInd = r.lastIndexOf(' ');
    r = r.substring(0, lastSpaceInd);
    if (t[1] == 'name') {
      $("#en_title").text(r);
    } else {
      $("#en_content").text(r + "...");
      $("#en_content").append("&nbsp;&nbsp;<em>[READ MORE]</em>")
    }
  }
}

function get_len(t) {
  if (t[0] == 'zh' && t[1] == 'name') {
    return int(random(12, 20));
  } else if (t[0] == 'zh' && t[1] == 'content') {
    return int(random(150, 250));
  } else if (t[0] == 'en' && t[1] == 'name') {
    return int(random(60, 80));
  } else if (t[0] == 'en' && t[1] == 'content') {
    return int(random(400, 500));
  }
}

function get_seed(t) {
  if (t[0] == 'zh') {
    return random(['中国', '香港', '']);
  } else if (t[0] == 'en') {
    return random(['Hong Kong ', 'China ', '']);
  }
}
