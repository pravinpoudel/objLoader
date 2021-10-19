"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var matLib;
var geometries = [];

function objFileLoader(gl) {
  var objLoader, geometryRange, getRange, materialLoader, subArray, mulArray, computeTangent, minMax;
  return regeneratorRuntime.async(function objFileLoader$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          computeTangent = function _ref19() {
            for (var _i2 = 0, _geometries = geometries; _i2 < _geometries.length; _i2++) {
              var _geometry = _geometries[_i2];
              var positions = _geometry.attributes.position;
              var texCoordinate = _geometry.attributes.texCord;
              var verticesCount = positions / 3;

              for (var i = 0, len = positions.length; i < len; i += 3) {
                var _geometry$tangents, _geometry$tangents2, _geometry$tangents3, _geometry$biTangent, _geometry$biTangent2, _geometry$biTangent3;

                var v0 = positions.slice(i, i + 3);
                var v1 = positions.slice(i + 3, i + 6);
                var v2 = positions.slice(i + 6, i + 9);
                var uv0 = texCoordinate.slice(i, i + 2);
                var uv1 = texCoordinate.slice(i + 2, i + 4);
                var uv2 = texCoordinate.slice(i + 4, i + 6);
                var E1 = subArray(v1, v0);
                var E2 = subArray(v2, v0);
                var delUV1 = subArray(uv1, uv0);
                var delUV2 = subArray(uv2, uv0);
                var ifactor = delUV1[0] * delUV2[1] - delUV1[1] * delUV2[0];
                ifactor = 1 / ifactor;
                var tangent = mulArray(subArray(mulArray(E1, delUV2[1]), mulArray(E2, delUV1[1])), ifactor);
                var biTangent = mulArray(subArray(mulArray(E1, delUV2[1]), mulArray(E2, delUV1[1])), ifactor);

                (_geometry$tangents = _geometry.tangents).push.apply(_geometry$tangents, _toConsumableArray(tangent));

                (_geometry$tangents2 = _geometry.tangents).push.apply(_geometry$tangents2, _toConsumableArray(tangent));

                (_geometry$tangents3 = _geometry.tangents).push.apply(_geometry$tangents3, _toConsumableArray(tangent));

                (_geometry$biTangent = _geometry.biTangent).push.apply(_geometry$biTangent, _toConsumableArray(biTangent));

                (_geometry$biTangent2 = _geometry.biTangent).push.apply(_geometry$biTangent2, _toConsumableArray(biTangent));

                (_geometry$biTangent3 = _geometry.biTangent).push.apply(_geometry$biTangent3, _toConsumableArray(biTangent));
              }
            }
          };

          mulArray = function _ref18(a, b) {
            return a.map(function (value, index) {
              return value * b;
            });
          };

          subArray = function _ref17(a, b) {
            return a.map(function (value, index) {
              return value - b[index];
            });
          };

          materialLoader = function _ref16() {
            var materials, material, keywords, createDefaultTexture, checkPowerOf2, loadImage, textureLoader, url, materialURL, response, lines, regexKeyword, i, length, data, result, _result2, datas, handler;

            return regeneratorRuntime.async(function materialLoader$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    textureLoader = function _ref12() {
                      var textureList = {};
                      var texture = createDefaultTexture();
                      var materialLists = Object.values(materials);
                      materialLists.forEach(function (material) {
                        Object.entries(material).filter(function (value) {
                          if (value[0].endsWith("Map")) {
                            return true;
                          }
                        }).map(function (_ref7) {
                          var _ref8 = _slicedToArray(_ref7, 2),
                              textureName = _ref8[0],
                              textureImage = _ref8[1];

                          console.log(textureName, textureImage);
                          var texturemapped = textureList[textureImage];

                          if (!texturemapped) {
                            var imageURL = new URL(textureImage, url).href;
                            texturemapped = loadImage(imageURL, texture);
                            textureList[textureImage] = texturemapped;
                          }

                          material[textureName] = texturemapped;
                        });
                        console.log(material);
                      });
                    };

                    loadImage = function _ref11(url, texture) {
                      var image = new Image();
                      image.src = url;
                      image.crossOrigin = "";

                      image.onload = function () {
                        // safe side for large texture, otherwise not needed as we have already binded this above
                        gl.bindTexture(gl.TEXTURE_2D, texture);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                        if (checkPowerOf2(image.width) && checkPowerOf2(image.height)) {
                          gl.generateMipmap(gl.TEXTURE_2D);
                        }

                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                      };

                      return texture;
                    };

                    checkPowerOf2 = function _ref10(value) {
                      if (value == 0) {
                        return false;
                      }

                      var ceil = Math.ceil(Math.log2(value));
                      var floor = Math.floor(Math.log2(value));
                      return ceil === floor ? true : false;
                    };

                    createDefaultTexture = function _ref9() {
                      var texture = gl.createTexture();
                      gl.bindTexture(gl.TEXTURE_2D, texture);
                      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
                      return texture;
                    };

                    materials = {};
                    keywords = {
                      newmtl: function newmtl(data) {
                        material = {};
                        materials[data[0]] = material;
                      },
                      Ns: function Ns(data) {
                        material.shininess = Number.apply(void 0, _toConsumableArray(data));
                      },
                      Ka: function Ka(data) {
                        material.ambient = data.map(Number);
                      },
                      Kd: function Kd(data) {
                        material.diffuse = data.map(Number);
                      },
                      Ks: function Ks(data) {
                        material.specular = data.map(Number);
                      },
                      Ke: function Ke(data) {
                        material.emissive = data.map(Number);
                      },
                      Ni: function Ni(data) {
                        material.opticalDensity = Number.apply(void 0, _toConsumableArray(data));
                      },
                      d: function d(data) {
                        material.opacity = Number.apply(void 0, _toConsumableArray(data));
                      },
                      illum: function illum(data) {
                        material.illum = Number.apply(void 0, _toConsumableArray(data));
                      },
                      map_Kd: function map_Kd(data) {
                        material.diffuseMap = data[0];
                      },
                      map_Bump: function map_Bump(data) {
                        material.normalMap = data[0];
                      },
                      map_Normal: function map_Normal(data) {
                        material.normalMap = data[0];
                      },
                      map_Ns: function map_Ns(data) {
                        console.log("specular image");
                        material.specularMap = data[0];
                      }
                    };
                    url = new URL("/game/resources/models/objs/envy-invidia/source/3D_MNK_XII_A_839_Zawisc.obj", window.location.href);
                    materialURL = new URL(matLib, url).href;
                    _context2.t0 = regeneratorRuntime;
                    _context2.next = 11;
                    return regeneratorRuntime.awrap(fetch(materialURL));

                  case 11:
                    _context2.t1 = _context2.sent.text();
                    _context2.next = 14;
                    return _context2.t0.awrap.call(_context2.t0, _context2.t1);

                  case 14:
                    response = _context2.sent;
                    lines = response.split("\n");
                    regexKeyword = /(\w*)(?: )*(.*)/;
                    i = 0, length = lines.length;

                  case 18:
                    if (!(i < length)) {
                      _context2.next = 36;
                      break;
                    }

                    data = lines[i].trim();

                    if (!(data == "" || data.startsWith("#"))) {
                      _context2.next = 22;
                      break;
                    }

                    return _context2.abrupt("continue", 33);

                  case 22:
                    result = regexKeyword.exec(data);

                    if (result) {
                      _context2.next = 25;
                      break;
                    }

                    return _context2.abrupt("continue", 33);

                  case 25:
                    _result2 = _slicedToArray(result, 3);
                    keyword = _result2[1];
                    unparsedvalued = _result2[2];
                    datas = data.split(/\s+/).slice(1);
                    handler = keywords[keyword];

                    if (handler) {
                      _context2.next = 32;
                      break;
                    }

                    return _context2.abrupt("continue", 33);

                  case 32:
                    handler(datas);

                  case 33:
                    i++;
                    _context2.next = 18;
                    break;

                  case 36:
                    textureLoader();
                    return _context2.abrupt("return", materials);

                  case 38:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          };

          getRange = function _ref15(geometries) {
            return geometries.reduce(function (_ref5, _ref6) {
              var min = _ref5.min,
                  max = _ref5.max;
              var attributes = _ref6.attributes;
              var vertexPosition = attributes.position;
              var minMax = geometryRange(vertexPosition);
              return {
                min: min.map(function (min, index) {
                  return Math.min(min, minMax.min[index]);
                }),
                max: max.map(function (max, index) {
                  return Math.max(max, minMax.max[index]);
                })
              };
            }, {
              min: Array(3).fill(Number.POSITIVE_INFINITY),
              max: Array(3).fill(Number.NEGATIVE_INFINITY)
            });
          };

          geometryRange = function _ref14(data) {
            var min = data.slice(0, 3);
            var max = data.slice(0, 3);

            for (var i = 0, length = data.length; i < length; i += 3) {
              for (var j = 0; j < 3; j++) {
                min[j] = Math.min(min[j], data[i + j]);
                max[j] = Math.max(max[j], data[i + j]);
              }
            }

            return {
              min: min,
              max: max
            };
          };

          objLoader = function _ref13() {
            var tempUrl, response, text, lines, regexKeyword, material, object, group, verticesIndices, geometry, webglData, positionCordinate, textureCordinate, normalCordinate, vertexColor, vertexData, toNumber, addVertex, resetGeometry, setGeometry, addMethods, i, length, line, result, _result, _keyword, unparsedArgs, datas, handlerFunction;

            return regeneratorRuntime.async(function objLoader$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    setGeometry = function _ref4() {
                      if (!geometry) {
                        var position = [];
                        var texCord = [];
                        var normalCord = [];
                        var colorValue = [];
                        var tangents = [];
                        var biTangent = [];
                        webglData = [position, texCord, normalCord, colorValue];
                        geometry = {
                          group: group,
                          material: material,
                          tangents: tangents,
                          biTangent: biTangent,
                          attributes: {
                            position: position,
                            texCord: texCord,
                            normalCord: normalCord,
                            colorValue: colorValue
                          }
                        };
                        geometries.push(geometry);
                      }
                    };

                    resetGeometry = function _ref3() {
                      if (geometry) {
                        geometry = undefined;
                      }
                    };

                    addVertex = function _ref2(data) {
                      var indices = data.split("/");
                      indices.forEach(function (index, i) {
                        var _webglData$i;

                        if (!index) {
                          return;
                        }

                        index = index > 0 ? index : index + vertexData[i].length;

                        (_webglData$i = webglData[i]).push.apply(_webglData$i, _toConsumableArray(toNumber(vertexData[i][index]))); // add color value of that vertex which is i=0 to the webgl data


                        if (i === 0) {
                          var _webglData$;

                          (_webglData$ = webglData[3]).push.apply(_webglData$, _toConsumableArray(toNumber(vertexColor[index])));
                        }
                      });
                    };

                    toNumber = function _ref(a) {
                      return a.map(function (value) {
                        return Number(value);
                      });
                    };

                    tempUrl = "/game/resources/models/objs/envy-invidia/source/3D_MNK_XII_A_839_Zawisc.obj"; // tempUrl =
                    //   "https://webglfundamentals.org/webgl/resources/models/windmill/windmill.obj";

                    _context.next = 7;
                    return regeneratorRuntime.awrap(fetch(tempUrl));

                  case 7:
                    response = _context.sent;
                    _context.next = 10;
                    return regeneratorRuntime.awrap(response.text());

                  case 10:
                    text = _context.sent;
                    lines = text.split("\n");
                    regexKeyword = /(\w*)(?: )*(.*)/;
                    material = "basic";
                    object = "default";
                    group = "";
                    verticesIndices = [];
                    webglData = [[], [], [], []];
                    positionCordinate = [[0, 0, 0]];
                    textureCordinate = [[0, 0]];
                    normalCordinate = [[0, 0, 0]];
                    vertexColor = [[0, 0, 0]];
                    vertexData = [positionCordinate, textureCordinate, normalCordinate, vertexColor];
                    addMethods = {
                      v: function v(data) {
                        if (data.length > 3) {
                          positionCordinate.push(toNumber(data.slice(0, 3)));
                          vertexColor.push(toNumber(data.slice(3)));
                        } else {
                          positionCordinate.push(toNumber(data));
                          vertexColor.push([1, 1, 1]);
                        }
                      },
                      vt: function vt(data) {
                        textureCordinate.push(toNumber(data));
                      },
                      vn: function vn(data) {
                        normalCordinate.push(toNumber(data));
                      },
                      f: function f(data) {
                        setGeometry();

                        for (var i = 0, traingleCount = data.length - 2; i < traingleCount; i++) {
                          addVertex(data[0]);
                          addVertex(data[i + 1]);
                          addVertex(data[i + 2]);
                        }
                      },
                      mtllib: function mtllib(data) {
                        matLib = data;
                      },
                      usemtl: function usemtl(data) {
                        resetGeometry();
                        material = data[0];
                      },
                      o: function o(data) {
                        object = data;
                      }
                    };
                    i = 0, length = lines.length;

                  case 25:
                    if (!(i < length)) {
                      _context.next = 41;
                      break;
                    }

                    line = lines[i].trim();

                    if (!(line === "" || line.startsWith("#"))) {
                      _context.next = 29;
                      break;
                    }

                    return _context.abrupt("continue", 38);

                  case 29:
                    result = regexKeyword.exec(line);

                    if (result) {
                      _context.next = 32;
                      break;
                    }

                    return _context.abrupt("continue", 38);

                  case 32:
                    _result = _slicedToArray(result, 3), _keyword = _result[1], unparsedArgs = _result[2];
                    datas = line.split(/\s+/).slice(1);
                    handlerFunction = addMethods[_keyword];

                    if (handlerFunction) {
                      _context.next = 37;
                      break;
                    }

                    return _context.abrupt("continue", 38);

                  case 37:
                    handlerFunction(datas);

                  case 38:
                    i++;
                    _context.next = 25;
                    break;

                  case 41:
                  case "end":
                    return _context.stop();
                }
              }
            });
          };

          _context3.next = 9;
          return regeneratorRuntime.awrap(objLoader());

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(materialLoader());

        case 11:
          materials = _context3.sent;
          computeTangent(); // await textureLoader();

          minMax = getRange(geometries);
          console.log(materials);
          return _context3.abrupt("return", {
            geometries: geometries,
            materials: materials,
            minMax: minMax
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  });
}
//# sourceMappingURL=objloader.dev.js.map
