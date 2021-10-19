(function () {
  let canvas = document.getElementById("main-canvas");
  let toggleButton = document.getElementById("toggle-button");
  const rotateHandler = (e) => {
    let keyPressed = e.keyCode;
    console.log(keyPressed);
    switch (Number(keyPressed)) {
      case 68:
        modelTranslation[0] += 0.2;
        break;
      case 65:
        modelTranslation[0] -= 0.2;
        break;
      case 87:
        modelTranslation[2] -= 0.2;
        break;
      case 88:
        modelTranslation[2] += 0.2;
        break;
      case 39:
        modelDegree -= 0.01;
        break;
      case 37:
        modelDegree += 0.01;
        break;
      default:
        console.log(`${keyPressed} clicked`);
    }
  };

  const viewToggle = (e) => {
    if (cameraYposition == 0.0) {
      cameraYposition = 2.5;
      return;
    }
    cameraYposition = 0.0;
  };

  window.addEventListener("keydown", rotateHandler);
  toggleButton.addEventListener("click", viewToggle);
})();
