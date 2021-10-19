"use strict";

var _webglutility = require("../utility/webglutility.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

(function _callee() {
  var canvas, gl, _ref, geometries, materials, minMax, program, positionLocation, vertexColorLocation, normalLocation, texCordinateLocation, tangentLocation, biTangentLocation, modelMatrixLocation, viewProjectionLocation, scaleLocation, normalMatrixLocation, cameraLocation, lightLocation, ambientLocation, diffuseLocation, specularLocation, emmisiveLocation, shininessLocation, opacityLocation, diffuseSamplerLocation, normalSamplerLocation, specularSamplerLocation, hasNormalLocation, ambientlightLocation, minValue, maxValue, range, maxSideLength, offSet, vao, cameraAngle, modelAngle, distanceScale, bufferLists, draw;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          draw = function _ref3() {
            _webglutility.webglUtility.resizeCanvas(gl.canvas);

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST); // gl.enable(gl.CULL_FACE);

            gl.clearColor(0.1, 0.1, 0.1, 0.3);
            modelAngle += 0.008;
            var modelMatrix = m4.yRotation(modelAngle);
            gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
            var normalInverseMatrix = m4.inverse(modelMatrix);
            gl.uniformMatrix4fv(normalMatrixLocation, true, normalInverseMatrix);
            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            var fov = Math.PI / 180 * 60;
            var projectionMatrix = m4.perspective(fov, aspect, 0.1, 1000);
            gl.uniform1f(scaleLocation, 0.5);
            cameraAngle += 0.0;
            var cameraMatrix = m4.yRotation(cameraAngle);
            cameraMatrix = m4.translate(cameraMatrix, 0.0, 0.1, maxSideLength * distanceScale);
            var cameraPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]]; // cameraMatrix = m4.lookAt(cameraPosition, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

            viewMatrix = m4.inverse(cameraMatrix);
            gl.uniform3fv(cameraLocation, cameraPosition);
            var vProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
            gl.uniformMatrix4fv(viewProjectionLocation, false, vProjectionMatrix);
            bufferLists.forEach(function (_ref2, index) {
              var positionBuffer = _ref2.positionBuffer,
                  colorBuffer = _ref2.colorBuffer,
                  normalBuffer = _ref2.normalBuffer,
                  textureBuffer = _ref2.textureBuffer,
                  tangentBuffer = _ref2.tangentBuffer,
                  biTangentBuffer = _ref2.biTangentBuffer,
                  material = _ref2.material,
                  length = _ref2.length;
              var _material$ambient = material.ambient,
                  ambient = _material$ambient === void 0 ? [1.0, 1.0, 1.0] : _material$ambient,
                  _material$diffuse = material.diffuse,
                  diffuse = _material$diffuse === void 0 ? [0.8, 0.87, 0.8] : _material$diffuse,
                  _material$opticalDens = material.opticalDensity,
                  opticalDensity = _material$opticalDens === void 0 ? 1.0 : _material$opticalDens,
                  _material$specular = material.specular,
                  specular = _material$specular === void 0 ? [0.0, 0.0, 0.0] : _material$specular,
                  _material$emmisive = material.emmisive,
                  emmisive = _material$emmisive === void 0 ? [0.0, 0.0, 0.0] : _material$emmisive,
                  _material$shininess = material.shininess,
                  shininess = _material$shininess === void 0 ? 1.0 : _material$shininess,
                  _material$opacity = material.opacity,
                  opacity = _material$opacity === void 0 ? 1.0 : _material$opacity;
              gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
              gl.enableVertexAttribArray(positionLocation);
              gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
              gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
              gl.enableVertexAttribArray(normalLocation);
              gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
              gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
              gl.enableVertexAttribArray(vertexColorLocation);
              gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 0, 0);
              gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
              gl.enableVertexAttribArray(texCordinateLocation);
              gl.vertexAttribPointer(texCordinateLocation, 2, gl.FLOAT, false, 0, 0);
              gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
              gl.enableVertexAttribArray(tangentLocation);
              gl.vertexAttribPointer(tangentLocation, 3, gl.FLOAT, false, 0, 0); // gl.bindBuffer(gl.ARRAY_BUFFER, biTangentBuffer);
              // gl.enableVertexAttribArray(biTangentLocation);
              // gl.vertexAttribPointer(biTangentLocation, 3, gl.FLOAT, false, 0, 0);
              // material value

              gl.uniform3fv(ambientLocation, ambient);
              gl.uniform3fv(diffuseLocation, diffuse); // gl.uniform3fv(ambientLocation, opticalDensity);

              gl.uniform3fv(specularLocation, specular);
              gl.uniform3fv(emmisiveLocation, emmisive);
              gl.uniform1f(opacityLocation, parseFloat(opacity));
              gl.uniform1f(shininessLocation, shininess);
              gl.activeTexture(gl.TEXTURE0);
              gl.bindTexture(gl.TEXTURE_2D, material.normalMap);
              gl.activeTexture(gl.TEXTURE1);
              gl.bindTexture(gl.TEXTURE_2D, material.diffuseMap);
              gl.activeTexture(gl.TEXTURE2);
              gl.bindTexture(gl.TEXTURE_2D, material.specularMap); // texture mapping

              gl.uniform1i(normalSamplerLocation, 0);
              gl.uniform1i(diffuseSamplerLocation, 1);
              gl.uniform1i(specularSamplerLocation, 2);
              gl.drawArrays(gl.TRIANGLES, 0, length / 3);
            });
            window.requestAnimationFrame(draw);
          };

          canvas = document.getElementById("main-canvas");
          gl = canvas.getContext("webgl2");

          if (gl) {
            _context.next = 6;
            break;
          }

          console.log("context couldnot be generated");
          return _context.abrupt("return");

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(objFileLoader(gl));

        case 8:
          _ref = _context.sent;
          geometries = _ref.geometries;
          materials = _ref.materials;
          minMax = _ref.minMax;
          console.log(geometries);
          program = _webglutility.webglUtility.createProgramFromShaderVariable(gl, loader_VS, loader_FS);
          gl.useProgram(program);
          positionLocation = gl.getAttribLocation(program, "a_position");
          vertexColorLocation = gl.getAttribLocation(program, "a_color");
          normalLocation = gl.getAttribLocation(program, "a_normal");
          texCordinateLocation = gl.getAttribLocation(program, "a_texCord");
          tangentLocation = gl.getAttribLocation(program, "a_tangent");
          biTangentLocation = gl.getAttribLocation(program, "a_bitangent");
          modelMatrixLocation = gl.getUniformLocation(program, "u_modelMatrix");
          viewProjectionLocation = gl.getUniformLocation(program, "u_vpMatrix");
          scaleLocation = gl.getUniformLocation(program, "u_scale");
          normalMatrixLocation = gl.getUniformLocation(program, "u_worldNormal");
          cameraLocation = gl.getUniformLocation(program, "u_cameraWorld");
          lightLocation = gl.getUniformLocation(program, "u_lightDirection");
          ambientLocation = gl.getUniformLocation(program, "ambient");
          diffuseLocation = gl.getUniformLocation(program, "diffuse");
          specularLocation = gl.getUniformLocation(program, "specular");
          emmisiveLocation = gl.getUniformLocation(program, "emmisive");
          shininessLocation = gl.getUniformLocation(program, "shininess");
          opacityLocation = gl.getUniformLocation(program, "opacity");
          diffuseSamplerLocation = gl.getUniformLocation(program, "diffuseSampler");
          normalSamplerLocation = gl.getUniformLocation(program, "normalSampler");
          specularSamplerLocation = gl.getUniformLocation(program, "specularSampler");
          hasNormalLocation = gl.getUniformLocation(program, "hasNormal");
          ambientlightLocation = gl.getUniformLocation(program, "u_ambientLight"); // find the range and extend of an object to calculate the offset to properly view the object

          minValue = minMax.min, maxValue = minMax.max;
          range = m4.subtractVectors(maxValue, minValue);
          maxSideLength = m4.length(range);
          offSet = m4.scaleVector(m4.addVectors(minValue, m4.scaleVector(range, 0.5)), -1.0); // -----------------------------------------------

          vao = gl.createVertexArray();
          gl.bindVertexArray(vao);
          cameraAngle = 0.0;
          modelAngle = 0.5;
          distanceScale = 0.6;
          bufferLists = geometries.map(function (geometry, index) {
            var positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            var localPosition = geometry.attributes.position;
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_toConsumableArray(localPosition)), gl.STATIC_DRAW);
            var colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            var vColor = geometry.attributes.colorValue;
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vColor), gl.STATIC_DRAW);
            var normalData = geometry.attributes.normalCord;
            var normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
            var textureCord = geometry.attributes.textCord;
            var textureBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCord), gl.STATIC_DRAW);
            var tangentVector = geometry.tangents;
            var tangentBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangentVector), gl.STATIC_DRAW);
            var biTangent = geometry.biTangent;
            var biTangentBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, biTangentBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(biTangent), gl.STATIC_DRAW);
            var material = geometry.material;
            return {
              positionBuffer: positionBuffer,
              colorBuffer: colorBuffer,
              normalBuffer: normalBuffer,
              textureBuffer: textureBuffer,
              tangentBuffer: tangentBuffer,
              biTangentBuffer: biTangentBuffer,
              length: localPosition.length,
              material: materials[material]
            };
          });
          gl.uniform3fv(lightLocation, [10.0, 10.0, 50.0]);
          gl.uniform3fv(ambientlightLocation, [0.2, 0.2, 0.2]);
          gl.uniform1i(hasNormalLocation, 0);
          window.requestAnimationFrame(draw);

        case 52:
        case "end":
          return _context.stop();
      }
    }
  });
})();
//# sourceMappingURL=index.dev.js.map
