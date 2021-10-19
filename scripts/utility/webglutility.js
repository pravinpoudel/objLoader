function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let info = gl.getShaderInfoLog(shader);
    throw new Error(String(info));
  }
  return shader;
}

function createProgramFromShaderVariable(
  gl,
  vertexShaderSource,
  fragmentShaderSource
) {
  const program = gl.createProgram();
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    let errorInfo = gl.getProgramInfoLog(program);
    throw `couldnot compile the program because ${errorInfo}`;
  }
  return program;
}

function resizeCanvas(canvas) {
  let clientHeight = canvas.clientHeight;
  let clientWidth = canvas.clientWidth;

  let width = canvas.width;
  let height = canvas.height;

  if (clientHeight !== height || clientWidth !== width) {
    canvas.width = clientWidth;
    canvas.height = clientHeight;
  }
}

const webglUtility = {
  createProgramFromShaderVariable,
  resizeCanvas,
};

export default webglUtility;
