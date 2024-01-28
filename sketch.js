const cvWidth = 1366;
const cvHeight = 768;

const predefinedColorSchemes = {
  aw1: {
    circleColor: [236, 232, 19],
    rectColor: [214, 39, 132],
  },
  aw2: {
    circleColor: [228, 42, 140],
    rectColor: [51, 180, 177],
  },
  aw3: {
    circleColor: [82, 185, 79],
    rectColor: [246, 140, 72],
  },
  aw4: {
    circleColor: [207, 34, 40],
    rectColor: [237, 235, 78],
  },
};

let img;
let params = {};
let ps;
let circleColor;
let rectColor;
let colorScheme;
let isImgLoaded;

function style() {
  const lh = 25,
    eps = 20,
    center = `
    display: flex;
    justify-content: center;
    align-items: center;`;

  let sketch = select("#sketch");
  sketch.style(`${center} flex-direction: column;`);

  let circleColorLabel = select("#circleColor-label");
  circleColorLabel.style(`height: ${lh}px;`);

  let rectColorLabel = select("#rectColor-label");
  rectColorLabel.style(`height: ${lh}px;`);
}

function preload() {
  // img = loadImage('selfie.jpeg')
  // Image upload input.
  input = createFileInput(handleImage);
  input.parent("imgUploader");
}

function setup() {
  canvas = createCanvas(cvWidth, cvHeight);
  canvas.parent("sketch-canvas");
  canvas.style(`display: block;`);

  saveBtn = createButton("⬇️ Save artwork");
  saveBtn.parent("saveBtn");
  saveBtn.mousePressed(() => {
    if (img) {
      saveCanvas("makeArt.png");
    }
  });

  // Parameters.
  params.circleColor = createColorPicker(color(0, 0, 255));
  params.circleColor.parent("circleColor");

  params.rectColor = createColorPicker(color(255, 255, 255));
  params.rectColor.parent("rectColor");

  params.resolution = createSlider(1, 5, 2, 0.2);
  params.resolution.parent("resolution");

  params.colorScheme = createSelect();
  const colorSchemes = [
    "Your choice",
    "Andy Warhol 1",
    "Andy Warhol 2",
    "Andy Warhol 3",
    "Andy Warhol 4",
  ];
  const colorSchemeKeys = ["custom", "aw1", "aw2", "aw3", "aw4"];

  for (let i = 0; i < colorSchemes.length; i += 1) {
    params.colorScheme.option(colorSchemes[i], colorSchemeKeys[i]);
  }
  params.colorScheme.parent("colorScheme");

  style();
  noStroke();

  buffer = createGraphics(cvWidth, cvHeight);
}

function draw() {
  clear();
  if (isImgLoaded) {
    image(img, 0, 0);
  }

  ps = params.resolution.value() / 100;
  select("#resolution-label").html(`Resolution: ${ps.toFixed(3)}`);

  colorScheme = params.colorScheme.selected();
  if (colorScheme == "custom") {
    circleColor = params.circleColor.color();
    rectColor = params.rectColor.color();
  } else {
    circleColor = color(...predefinedColorSchemes[colorScheme].circleColor);
    rectColor = color(...predefinedColorSchemes[colorScheme].rectColor);
  }

  if (img) {
    loadPixels();
    const ix = parseInt(img.width * ps);
    const yx = parseInt(img.height * ps);

    for (let i = 0; i < img.width; i += ix) {
      for (let j = 0; j < img.height; j += yx) {
        let c = img.get(i, j);
        let b = brightness(c);
        let bMap = map(b, 0, 100, 0, 1);

        push();
        translate(i, j);

        // Create the rect.
        fill(circleColor);
        rect(0, 0, ix, yx);

        // Create the circle.
        fill(rectColor);
        circle(0, 0, ix * bMap);

        // Reverse the translation.
        pop();
      }
    }
  }
  // saveCanvas('result.png');
}

function handleImage(file) {
  clear();
  isImgLoaded = false;

  if (file.type === "image") {
    img = createImg(file.data, "Alt text", "Anonymous", imgCreated);
    img.hide();
    // image(img, 0, 0);
    // img.loadPixels();
  } else {
    img = null;
  }
}

function imgCreated() {
  img.hide();
  // Create a temporary p5.Graphics object to draw the image.
  let g = createGraphics(img.elt.width, img.elt.height);
  g.image(img, 0, 0);
  // Remove the original element from the DOM.
  img.remove();
  // g.get will return image data as a p5.Image object
  img = g.get(0, 0, g.width, g.height);

  // Because we've converted it into a p5.Image object, we can
  // use functions such as 'resize', and 'filter',
  // which aren't available on the HTML img element.
  // Uncomment the following lines for an example...
  img.resize(768, 0);
  resizeCanvas(img.width, img.height);

  // Record that we have finished creating the image object.
  isImgLoaded = true;
}
