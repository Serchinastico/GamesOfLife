function createWorld(width, height) {
  const world = [];

  // Empty world
  for (let y = 0; y < height; y++) {
    world.push([]);
    for (let x = 0; x < width; x++) {
      world[y].push(0);
    }
  }

  // Fill in some random data
  for (let i = 0; i < 100000; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    world[y][x] = 1;
  }

  return world;
}

function step(world, width, height) {
  const newWorld = [];

  for (let y = 0; y < height; y++) {
    newWorld.push([]);

    for (let x = 0; x < width; x++) {
      const cell = world[y][x];
      const neighborsLifeForce = getNeighborsLifeForce(
        world,
        x,
        y,
        width,
        height
      );

      if (cell > 0 && neighborsLifeForce < 2) {
        newWorld[y].push(0);
      } else if (
        cell > 0 &&
        neighborsLifeForce >= 2 &&
        neighborsLifeForce <= 3
      ) {
        newWorld[y].push(1);
      } else if (cell > 0 && neighborsLifeForce >= 4) {
        newWorld[y].push(0);
      } else if (cell === 0 && neighborsLifeForce === 3) {
        newWorld[y].push(1);
      } else {
        newWorld[y].push(0);
      }
    }
  }

  return newWorld;
}

function getNeighborsLifeForce(world, x, y, width, height) {
  let westDx = -1;
  let eastDx = 1;
  let northDy = -1;
  let southDy = 1;

  // Delta corrections for in-the-limits coordinates
  if (x === 0) {
    westDx = width - 1;
  } else if (x === width - 1) {
    eastDx = -(width - 1);
  }

  if (y === 0) {
    northDy = height - 1;
  } else if (y === height - 1) {
    southDy = -(height - 1);
  }

  const swCell = world[y + southDy][x + westDx];
  const wCell = world[y][x + westDx];
  const nwCell = world[y + northDy][x + westDx];
  const nCell = world[y + northDy][x];
  const neCell = world[y + northDy][x + eastDx];
  const eCell = world[y][x + eastDx];
  const seCell = world[y + southDy][x + eastDx];
  const sCell = world[y + southDy][x];

  return swCell + wCell + nwCell + nCell + neCell + eCell + seCell + sCell;
}
