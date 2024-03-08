const WIDTH = 512;
const HEIGHT = WIDTH;
let worlds;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  worlds = {
    red: createWorld(WIDTH, HEIGHT),
    green: createWorld(WIDTH, HEIGHT),
    blue: createWorld(WIDTH, HEIGHT),
  };
}

function draw() {
  background("#000");

  const img = createImage(WIDTH, HEIGHT);
  img.loadPixels();
  worlds = step(worlds, WIDTH, HEIGHT);

  for (let pixelIndex = 0; pixelIndex < WIDTH * HEIGHT; pixelIndex++) {
    const redIndex = pixelIndex * 4;
    const column = pixelIndex % WIDTH;
    const row = floor(pixelIndex / WIDTH);

    const red = worlds.red[row][column] * 256;
    const green = worlds.green[row][column] * 256;
    const blue = worlds.blue[row][column] * 256;

    img.pixels[redIndex] = red;
    img.pixels[redIndex + 1] = green;
    img.pixels[redIndex + 2] = blue;
    img.pixels[redIndex + 3] = 255;
  }

  img.updatePixels();

  image(img, 0, 0);
}

function mouseClicked() {
  worlds = {
    red: createWorld(WIDTH, HEIGHT),
    green: createWorld(WIDTH, HEIGHT),
    blue: createWorld(WIDTH, HEIGHT),
  };
}
