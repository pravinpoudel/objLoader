function degToRadian(deg) {
  return (Math.PI / 180) * deg;
}

function radToDegree(rad) {
  return (180 / Math.PI) * rad;
}

function initialCameraSetup(cameraPosition, up) {
  let cameraMatrix = m4.lookAt(cameraPosition, [1, 0, 0], up);
  return cameraMatrix;
}
