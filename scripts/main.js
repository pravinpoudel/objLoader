`use strict`;

(function () {
  const canvas = document.querySelector("#main-canvas");
  let gl = canvas.getContext("webgl2");
  if (!gl) {
    console.log("webgl2 not found");
    return;
  }
  var ext = gl.getExtension("OES_element_index_uint");

  let program = webglUtils.createProgramFromSources(gl, [vs, fs]);
  let programTriangle = webglUtils.createProgramFromSources(gl, [
    vsTriangle,
    fsTriangle,
  ]);
  let programSkybox = webglUtils.createProgramFromSources(gl, [vsSkybox, fs]);

  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  let positionLocation = gl.getAttribLocation(program, "a_position");
  let sphereTextLocation = gl.getUniformLocation(program, "u_sphereText");
  let modelMatrixLocation = gl.getUniformLocation(program, "u_ModelMatrix");
  let viewProjectionLocation = gl.getUniformLocation(
    program,
    "u_wvProjectionMatrix"
  );

  console.log(gl.getUniformLocation(programTriangle, "u_vpMatrix"));

  let triangleAttributeLocs = {
    position: gl.getAttribLocation(programTriangle, "a_position"),
    modelMatrixLocation: gl.getUniformLocation(programTriangle, "u_vpMatrix"),
  };

  const sphere = sphereVertIndices();

  let positionBufferr = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([...sphere[0]]),
    gl.STATIC_DRAW
  );

  let posTriangleBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, posTriangleBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positionTriangle),
    gl.STATIC_DRAW
  );

  let ballTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, ballTexture);

  const level = 0;
  const internallFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internallFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  let ballImage = new Image();
  ballImage.crossOrigin = "";
  ballImage.src = "http://localhost/game/images/texture/ball.jpg";

  ballImage.onload = function () {
    console.log("i am loaded");
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internallFormat,
      srcFormat,
      srcType,
      ballImage
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  };

  let cameraDegree = 0;

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 1.0, 0.5);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.CULL_FACE);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform1i(sphereTextLocation, 1);

    // cameraDegree += 0.4;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferr);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    let modelRadian = degToRadian(modelDegree);
    let cameraRadian = degToRadian(cameraDegree);

    // -------------------------------------------------------------------
    let modelMatrix = m4.yRotation(0);
    let translationMatrix = m4.translate(modelMatrix, ...modelTranslation);
    console.log(translationMatrix);
    m4.multiply(modelMatrix, translationMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
    // --------------------------------------------------------------------

    let cameraMatrix = m4.yRotation(cameraRadian);

    cameraMatrix = m4.translate(cameraMatrix, 0.0, 0.0, cameraYposition);

    cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];
    cameraPosition = [0.0, 1.0, 0.0];
    cameraMatrix = initialCameraSetup(cameraPosition, up);

    viewMatrix = m4.inverse(cameraMatrix);

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let fieldofView = degToRadian(90);
    let projectionMatrix = m4.perspective(fieldofView, aspect, 0.01, 1000);

    let indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([...sphere[1]]),
      gl.STATIC_DRAW
    );

    let vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);
    gl.drawElements(gl.TRIANGLES, sphere[1].length, gl.UNSIGNED_SHORT, 0);

    // -------------------triangle draw ---------------------

    gl.bindBuffer(gl.ARRAY_BUFFER, posTriangleBuffer);
    gl.enableVertexAttribArray(triangleAttributeLocs.position);

    gl.vertexAttribPointer(
      triangleAttributeLocs.position,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.useProgram(programTriangle);

    gl.uniformMatrix4fv(
      triangleAttributeLocs.modelMatrixLocation,
      false,
      vProjectionMatrix
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    window.requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);
})();
