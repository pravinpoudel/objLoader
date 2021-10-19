let matLib;
let geometries = [];

async function objFileLoader(gl) {
  async function objLoader() {
    let tempUrl =
      "/game/resources/models/objs/envy-invidia/source/3D_MNK_XII_A_839_Zawisc.obj";
    // tempUrl =
    //   "https://webglfundamentals.org/webgl/resources/models/windmill/windmill.obj";
    const response = await fetch(tempUrl);
    const text = await response.text();
    const lines = text.split("\n");
    const regexKeyword = /(\w*)(?: )*(.*)/;
    let material = "basic";
    let object = "default";
    let group = "";
    let verticesIndices = [];

    let geometry;

    let webglData = [[], [], [], []];

    let positionCordinate = [[0, 0, 0]];
    let textureCordinate = [[0, 0]];
    let normalCordinate = [[0, 0, 0]];
    let vertexColor = [[0, 0, 0]];

    let vertexData = [
      positionCordinate,
      textureCordinate,
      normalCordinate,
      vertexColor,
    ];

    function toNumber(a) {
      return a.map((value) => Number(value));
    }

    function addVertex(data) {
      let indices = data.split("/");
      indices.forEach((index, i) => {
        if (!index) {
          return;
        }
        index = index > 0 ? index : index + vertexData[i].length;
        webglData[i].push(...toNumber(vertexData[i][index]));
        // add color value of that vertex which is i=0 to the webgl data
        if (i === 0) {
          webglData[3].push(...toNumber(vertexColor[index]));
        }
      });
    }

    function resetGeometry() {
      if (geometry) {
        geometry = undefined;
      }
    }

    function setGeometry() {
      if (!geometry) {
        const position = [];
        const texCord = [];
        const normalCord = [];
        const colorValue = [];
        const tangents = [];
        const biTangent = [];
        webglData = [position, texCord, normalCord, colorValue];

        geometry = {
          group,
          material,
          tangents,
          biTangent,
          attributes: {
            position,
            texCord,
            normalCord,
            colorValue,
          },
        };

        geometries.push(geometry);
      }
    }

    let addMethods = {
      v(data) {
        if (data.length > 3) {
          positionCordinate.push(toNumber(data.slice(0, 3)));
          vertexColor.push(toNumber(data.slice(3)));
        } else {
          positionCordinate.push(toNumber(data));
          vertexColor.push([1, 1, 1]);
        }
      },
      vt(data) {
        textureCordinate.push(toNumber(data));
      },
      vn(data) {
        normalCordinate.push(toNumber(data));
      },
      f(data) {
        setGeometry();
        for (
          let i = 0, traingleCount = data.length - 2;
          i < traingleCount;
          i++
        ) {
          addVertex(data[0]);
          addVertex(data[i + 1]);
          addVertex(data[i + 2]);
        }
      },
      mtllib(data) {
        matLib = data;
      },
      usemtl(data) {
        resetGeometry();
        material = data[0];
      },
      o(data) {
        object = data;
      },
    };

    for (let i = 0, length = lines.length; i < length; i++) {
      let line = lines[i].trim();
      if (line === "" || line.startsWith("#")) {
        continue;
      }
      let result = regexKeyword.exec(line);
      if (!result) {
        continue;
      }
      const [, keyword, unparsedArgs] = result;
      let datas = line.split(/\s+/).slice(1);
      const handlerFunction = addMethods[keyword];
      if (!handlerFunction) {
        // console.warn(`${keyword} isnot handled by this program`);
        continue;
      }
      handlerFunction(datas);
    }
  }

  function geometryRange(data) {
    let min = data.slice(0, 3);
    let max = data.slice(0, 3);

    for (let i = 0, length = data.length; i < length; i += 3) {
      for (let j = 0; j < 3; j++) {
        min[j] = Math.min(min[j], data[i + j]);
        max[j] = Math.max(max[j], data[i + j]);
      }
    }
    return { min, max };
  }

  function getRange(geometries) {
    return geometries.reduce(
      ({ min, max }, { attributes }) => {
        const vertexPosition = attributes.position;
        let minMax = geometryRange(vertexPosition);
        return {
          min: min.map((min, index) => Math.min(min, minMax.min[index])),
          max: max.map((max, index) => Math.max(max, minMax.max[index])),
        };
      },
      {
        min: Array(3).fill(Number.POSITIVE_INFINITY),
        max: Array(3).fill(Number.NEGATIVE_INFINITY),
      }
    );
  }

  async function materialLoader() {
    let materials = {};
    let material;
    let keywords = {
      newmtl(data) {
        material = {};
        materials[data[0]] = material;
      },
      Ns(data) {
        material.shininess = Number(...data);
      },
      Ka(data) {
        material.ambient = data.map(Number);
      },
      Kd(data) {
        material.diffuse = data.map(Number);
      },
      Ks(data) {
        material.specular = data.map(Number);
      },
      Ke(data) {
        material.emissive = data.map(Number);
      },
      Ni(data) {
        material.opticalDensity = Number(...data);
      },
      d(data) {
        material.opacity = Number(...data);
      },
      illum(data) {
        material.illum = Number(...data);
      },
      map_Kd(data) {
        material.diffuseMap = data[0];
      },
      map_Bump(data) {
        material.normalMap = data[0];
      },
      map_Normal(data) {
        material.normalMap = data[0];
      },
      map_Ns(data) {
        console.log("specular image");
        material.specularMap = data[0];
      },
    };

    function createDefaultTexture() {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([255, 255, 255, 255])
      );
      return texture;
    }

    function checkPowerOf2(value) {
      if (value == 0) {
        return false;
      }
      let ceil = Math.ceil(Math.log2(value));
      let floor = Math.floor(Math.log2(value));
      return ceil === floor ? true : false;
    }

    function loadImage(url, texture) {
      let image = new Image();
      image.src = url;
      image.crossOrigin = "";
      image.onload = () => {
        // safe side for large texture, otherwise not needed as we have already binded this above
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );

        if (checkPowerOf2(image.width) && checkPowerOf2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      };
      return texture;
    }

    function textureLoader() {
      const textureList = {};
      let texture = createDefaultTexture();
      let materialLists = Object.values(materials);
      materialLists.forEach((material) => {
        Object.entries(material)
          .filter((value) => {
            if (value[0].endsWith("Map")) {
              return true;
            }
          })
          .map(([textureName, textureImage]) => {
            console.log(textureName, textureImage);
            let texturemapped = textureList[textureImage];
            if (!texturemapped) {
              let imageURL = new URL(textureImage, url).href;
              texturemapped = loadImage(imageURL, texture);
              textureList[textureImage] = texturemapped;
            }
            material[textureName] = texturemapped;
          });
        console.log(material);
      });
    }

    let url = new URL(
      "/game/resources/models/objs/envy-invidia/source/3D_MNK_XII_A_839_Zawisc.obj",
      window.location.href
    );
    let materialURL = new URL(matLib, url).href;
    const response = await (await fetch(materialURL)).text();
    const lines = response.split("\n");
    const regexKeyword = /(\w*)(?: )*(.*)/;

    for (let i = 0, length = lines.length; i < length; i++) {
      const data = lines[i].trim();
      if (data == "" || data.startsWith("#")) {
        continue;
      }
      const result = regexKeyword.exec(data);
      if (!result) {
        continue;
      }
      [, keyword, unparsedvalued] = result;
      let datas = data.split(/\s+/).slice(1);
      let handler = keywords[keyword];
      if (!handler) {
        // console.warn(`${keyword} is uncatched keyword`);
        continue;
      }

      handler(datas);
    }
    textureLoader();
    return materials;
  }

  function subArray(a, b) {
    return a.map((value, index) => value - b[index]);
  }

  function mulArray(a, b) {
    return a.map((value, index) => value * b);
  }

  function computeTangent() {
    for (let geometry of geometries) {
      const positions = geometry.attributes.position;
      const texCoordinate = geometry.attributes.texCord;
      const verticesCount = positions / 3;
      for (let i = 0, len = positions.length; i < len; i += 3) {
        let v0 = positions.slice(i, i + 3);
        let v1 = positions.slice(i + 3, i + 6);
        let v2 = positions.slice(i + 6, i + 9);

        let uv0 = texCoordinate.slice(i, i + 2);
        let uv1 = texCoordinate.slice(i + 2, i + 4);
        let uv2 = texCoordinate.slice(i + 4, i + 6);

        let E1 = subArray(v1, v0);
        let E2 = subArray(v2, v0);

        let delUV1 = subArray(uv1, uv0);
        let delUV2 = subArray(uv2, uv0);

        let ifactor = delUV1[0] * delUV2[1] - delUV1[1] * delUV2[0];
        ifactor = 1 / ifactor;

        let tangent = mulArray(
          subArray(mulArray(E1, delUV2[1]), mulArray(E2, delUV1[1])),
          ifactor
        );
        let biTangent = mulArray(
          subArray(mulArray(E1, delUV2[1]), mulArray(E2, delUV1[1])),
          ifactor
        );

        geometry.tangents.push(...tangent);
        geometry.tangents.push(...tangent);
        geometry.tangents.push(...tangent);

        geometry.biTangent.push(...biTangent);
        geometry.biTangent.push(...biTangent);
        geometry.biTangent.push(...biTangent);
      }
    }
  }
  await objLoader();
  materials = await materialLoader();
  computeTangent();
  // await textureLoader();
  let minMax = getRange(geometries);
  console.log(materials);
  return {
    geometries,
    materials,
    minMax,
  };
}
