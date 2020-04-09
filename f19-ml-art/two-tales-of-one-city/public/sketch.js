let bg;
let runningInference = false;
let generated = false;
let imgArray;

function preload() {
  imgArray = en_images;
}

function setup() {
  noCanvas();
  zh_nameRNN = ml5.charRNN('./models/zh_name/', modelReady_zhn);
  zh_contentRNN = ml5.charRNN('./models/zh_description/', modelReady_zhc);
  en_nameRNN = ml5.charRNN('./models/en_name/', modelReady_enn);
  en_contentRNN = ml5.charRNN('./models/en_description/', modelReady_enc);
  noLoop();
}

function modelReady_zhn() {
  console.log('ZH NAME Model Ready');
  generate(zh_nameRNN, ['zh', 'name']);
}

function modelReady_enn() {
  console.log('EN NAME Model Ready');
  generate(en_nameRNN, ['en', 'name']);
}

function modelReady_zhc() {
  console.log('ZH CONTENT Model Ready');
  generate(zh_contentRNN, ['zh', 'content']);
}

function modelReady_enc() {
  console.log('EN CONTENT Model Ready');
  generate(en_contentRNN, ['en', 'content']);
}

function draw() {

}

function generate(rnn, type) {
  // type will be an array ['zh', 'name']
  // prevent starting inference if we've already started another instance
  let seed = get_seed(type);

  let data = {
    seed: seed.slice(-1),
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
      $("#zh_window").css('height', 'auto');
    }
  } else {
    let lastSpaceInd = r.lastIndexOf(' ');
    r = r.substring(0, lastSpaceInd);
    if (t[1] == 'name') {
      $("#en_title").text(r);
    } else {
      $("#en_content").text(r + "...");
      $("#en_content").append("&nbsp;&nbsp;<em>[READ MORE]</em>")
      $("#en_window").css('height', 'auto');
    }
  }
}

function get_len(t) {
  if (t[0] == 'zh' && t[1] == 'name') {
    return int(random(12, 17));
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
    return random(['中国', '香港', '', '暴徒']);
  } else if (t[0] == 'en') {
    return random(['Hong Kong ', 'China ', '', 'Protest ']);
  }
}
