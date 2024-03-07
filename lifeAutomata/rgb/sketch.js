const WIDTH = 1024;
const HEIGHT = WIDTH;
let redWorld, greenWorld, blueWorld;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  redWorld = createWorld(WIDTH, HEIGHT);
  greenWorld = createWorld(WIDTH, HEIGHT);
  blueWorld = createWorld(WIDTH, HEIGHT);
}

function draw() {
  background("#000");

  const img = createImage(WIDTH, HEIGHT);
  img.loadPixels();
  redWorld = step(redWorld, WIDTH, HEIGHT);
  greenWorld = step(greenWorld, WIDTH, HEIGHT);
  blueWorld = step(blueWorld, WIDTH, HEIGHT);

  for (let pixelIndex = 0; pixelIndex < WIDTH * HEIGHT; pixelIndex++) {
    const redIndex = pixelIndex * 4;
    const column = pixelIndex % WIDTH;
    const row = floor(pixelIndex / WIDTH);

    const red = redWorld[row][column] * 256;
    const green = greenWorld[row][column] * 256;
    const blue = blueWorld[row][column] * 256;

    img.pixels[redIndex] = red;
    img.pixels[redIndex + 1] = green;
    img.pixels[redIndex + 2] = blue;
    img.pixels[redIndex + 3] = 255;
  }

  img.updatePixels();

  image(img, 0, 0);
}

function mouseClicked() {
  redWorld = createWorld(WIDTH, HEIGHT);
  greenWorld = createWorld(WIDTH, HEIGHT);
  blueWorld = createWorld(WIDTH, HEIGHT);
}
