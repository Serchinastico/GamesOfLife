const WIDTH = 1024;
const HEIGHT = WIDTH;
let world;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  world = createWorld(WIDTH, HEIGHT);
}

function draw() {
  background("#000");

  const img = createImage(WIDTH, HEIGHT);
  img.loadPixels();
  world = step(world, WIDTH, HEIGHT);

  for (let pixelIndex = 0; pixelIndex < WIDTH * HEIGHT; pixelIndex++) {
    const redIndex = pixelIndex * 4;
    const column = pixelIndex % WIDTH;
    const row = floor(pixelIndex / WIDTH);

    const alpha = world[row][column] * 256;

    img.pixels[redIndex] = alpha;
    img.pixels[redIndex + 1] = alpha;
    img.pixels[redIndex + 2] = alpha;
    img.pixels[redIndex + 3] = 255;
  }

  img.updatePixels();

  image(img, 0, 0);
}

function mouseClicked() {
  world = createWorld(WIDTH, HEIGHT);
}
