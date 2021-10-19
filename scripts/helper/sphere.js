const numbLatitude = 100;
const numbLongitude = 100;
const radius = 1.0;
const vertices = [];
const indices = [];

function sphereVertIndices() {
  let index = 0;
  let u, v;
  let maxX = 0.0;
  for (let i = 0; i <= numbLatitude; i++) {
    theta = (i * Math.PI) / numbLatitude;
    let sintheta = Math.sin(theta);
    let costheta = Math.cos(theta);

    for (let j = 0; j <= numbLongitude; j++) {
      let phi = (j * (2.0 * Math.PI)) / numbLongitude;
      let sinphi = Math.sin(phi);
      let cosinephi = Math.cos(phi);

      let x = radius * sintheta * cosinephi;
      let y = radius * costheta;
      let z = radius * sintheta * sinphi;
      vertices[index++] = x;
      vertices[index++] = y;
      vertices[index++] = z;
      if (x < maxX) {
        maxX = x;
      }
    }
  }
  console.log(maxX);

  console.log(`index count1 is ${index}`);

  index = 0;
  let p0, p1, i, j;
  for (i = 0; i <= numbLatitude - 2; i++) {
    for (j = 0; j <= numbLongitude; j++) {
      p0 = i * (numbLongitude + 1) + j; //remember not j+1;
      p1 = p0 + numbLongitude + 1; //dont forget to add 1;
      indices[index++] = p0;

      indices[index++] = p1;
      indices[index++] = p0 + 1;

      indices[index++] = p1;
      indices[index++] = p1 + 1;
      indices[index++] = p0 + 1;
    }
  }

  for (j = 0; j < numbLongitude; j++) {
    p0 = i * (numbLongitude + 1) + j;
    p1 = p0 + numbLongitude + 1;
    indices[index++] = p0;

    indices[index++] = p1;
    indices[index++] = p0 + 1;
  }

  console.log(p0, p1);

  console.log(`index count2 is ${index}`);
  return [vertices, indices];
}
