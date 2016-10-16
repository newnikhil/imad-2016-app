console.log('Loaded!');

//Change the content of main-text element

var element = document.getElementById("main-text");
element.innerHTML = "New Text Value";

//move the image
var img = document.getElementById("madi");
var marginLeft = 0;

function moveRight() {
  marginLeft += 1;
  img.style.marginLeft = marginLeft + "px";
}

img.onclick = function() {
  var interval = setInterval(moveRight, 50);
};