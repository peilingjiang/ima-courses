// 重写 / Refake
$('button').click(function (event) {
  event.preventDefault();
  if (event.target.id == 'zh_windowheaderbutton') {
    $("#zh_title").text('重新杜撰中');
    $("#zh_content").text("重新杜撰中");
    $("#zh_window").css('height', '80vh');
    generate(zh_nameRNN, ['zh', 'name']);
    generate(zh_contentRNN, ['zh', 'content']);
  } else if (event.target.id == 'en_windowheaderbutton') {
    $("#en_title").text('ReFAKING');
    $("#en_content").text("ReFAKING");
    $("#en_window").css('height', '80vh');
    generate(en_nameRNN, ['en', 'name']);
    generate(en_contentRNN, ['en', 'content']);
  }
})

// Make the DIV element draggable:
dragElement(document.getElementById("zh_window"));
dragElement(document.getElementById("en_window"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    // document.getElementById(elmnt.id + "header").onmouseup = dragMouseUp;
    document.getElementById(elmnt.id + "headertext").onmouseup = dragMouseDown;
    // document.getElementById(elmnt.id + "headertext").onmouseup = dragMouseUp;
    document.getElementById(elmnt.id + "headerbutton").onmouseup = dragMouseDown;
    // document.getElementById(elmnt.id + "headerbutton").onmouseup = dragMouseUp;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
    // elmnt.onmouseup = dragMouseUp;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    if (e.target.id == 'zh_windowheader' || e.target.id == 'zh_windowheadertext' || e.target.id == 'zh_windowheaderbutton') {
      document.getElementById("zh_window").style.zIndex = "3";
      document.getElementById("zh_windowheader").style.zIndex = "4";
      document.getElementById("en_window").style.zIndex = "1";
      document.getElementById("en_windowheader").style.zIndex = "2";
      if (e.target.id != 'zh_windowheaderbutton') {
        change_bg();
      }
      // load_bg();
    } else if (e.target.id == 'en_windowheader' || e.target.id == 'en_windowheadertext' || e.target.id == 'en_windowheaderbutton') {
      document.getElementById("en_window").style.zIndex = "3";
      document.getElementById("en_windowheader").style.zIndex = "4";
      document.getElementById("zh_window").style.zIndex = "1";
      document.getElementById("zh_windowheader").style.zIndex = "2";
      if (e.target.id != 'en_windowheaderbutton') {
        change_bg();
      }
      // load_bg();
    }
  }

  function dragMouseUp(e) {
    // Do nothing here
  }

  function change_bg() {
    let lastImgUrl = '';
    let imgUrl;
    imgUrl = random(imgArray);
    if (lastImgUrl == '') {
      // Init
      lastImgUrl = imgUrl;
    } else {
      // Avoid same image twice
      while (imgUrl == lastImgUrl) {
        imgUrl = random(imgArray);
      }
      lastImgUrl = imgUrl;
    }
    let bgImg = new Image();
    bgImg.src = imgUrl;
    $(bgImg).on('load', function () {
      $('#background_image').css('background-image', "url('" + $(this).attr("src") + "')");
    });
  }

  function load_bg() {
    // Do nothing here
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
