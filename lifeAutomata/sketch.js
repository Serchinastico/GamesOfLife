const WIDTH = 1024;
const HEIGHT = WIDTH;
let world;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  world = createWorld(WIDTH, HEIGHT);
  stroke("#FFFFFFFF");
  strokeWeight(1.1);
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

    img.pixels[redIndex] = 255;
    img.pixels[redIndex + 1] = 255;
    img.pixels[redIndex + 2] = 255;
    img.pixels[redIndex + 3] = alpha * alpha;
  }

  img.updatePixels();

  image(img, 0, 0);
}

function mouseClicked() {
  world = createWorld(WIDTH, HEIGHT);
}
