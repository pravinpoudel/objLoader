"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var info = gl.getShaderInfoLog(shader);
    throw new Error(String(info));
  }

  return shader;
}

function createProgramFromShaderVariable(gl, vertexShaderSource, fragmentShaderSource) {
  var program = gl.createProgram();
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var errorInfo = gl.getProgramInfoLog(program);
    throw "couldnot compile the program because ".concat(errorInfo);
  }

  return program;
}

function resizeCanvas(canvas) {
  var clientHeight = canvas.clientHeight;
  var clientWidth = canvas.clientWidth;
  var width = canvas.width;
  var height = canvas.height;

  if (clientHeight !== height || clientWidth !== width) {
    canvas.width = clientWidth;
    canvas.height = clientHeight;
  }
}

var webglUtility = {
  createProgramFromShaderVariable: createProgramFromShaderVariable,
  resizeCanvas: resizeCanvas
};
var _default = webglUtility;
exports["default"] = _default;
//# sourceMappingURL=webglutility.dev.js.map
