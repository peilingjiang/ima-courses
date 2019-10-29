function draw_bg() {
  // TODO: draw background images
}

// Make the DIV element draggable:
dragElement(document.getElementById("zh_window"));
dragElement(document.getElementById("en_window"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
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
    if (e.target.id == 'zh_windowheader') {
      document.getElementById("zh_window").style.zIndex = "3";
      document.getElementById("zh_windowheader").style.zIndex = "4";
      document.getElementById("en_window").style.zIndex = "1";
      document.getElementById("en_windowheader").style.zIndex = "2";
      change_bg();
    } else if (e.target.id == 'en_windowheader') {
      document.getElementById("en_window").style.zIndex = "3";
      document.getElementById("en_windowheader").style.zIndex = "4";
      document.getElementById("zh_window").style.zIndex = "1";
      document.getElementById("zh_windowheader").style.zIndex = "2";
      change_bg();
    }
  }

  function change_bg() {
    console.log("url('" + random(imgArray) + "')");
    $('#background_image').css('background-image', "url('" + random(imgArray) + "')");
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
