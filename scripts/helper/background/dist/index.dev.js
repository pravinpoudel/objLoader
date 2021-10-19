"use strict";

(function () {
  var background = document.getElementById("background-canvas");
  console.log(background);
  var gl_back = background.getContext("2d");
  var cwidth = background.width;
  var cheight = background.height; // gradient = gl_back.createRadialGradient(0, 0, cwidth, cheight);
  // gradient.addColorStop(0, "rgb(0, 0, 0)");
  // gradient.addColorStop(0.5, "rgb(128, 128, 128)");
  // gradient.addColorStop(1, "rgb(0, 0, 0)");

  var grd = gl_back.createRadialGradient(75, 50, 5, 200, 60, 200);
  grd.addColorStop(0, "#ffc0cb");
  grd.addColorStop(1, "#333333");
  background.style.backgroundColor = "black";
  gl_back.beginPath();
  gl_back.rect(0, 0, cwidth, cheight);
  gl_back.fillStyle = grd;
  gl_back.fill();
})();
//# sourceMappingURL=index.dev.js.map
