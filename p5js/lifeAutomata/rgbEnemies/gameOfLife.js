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
  for (let i = 0; i < 10000; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    world[y][x] = 1;
  }

  return world;
}

function step(worlds, width, height) {
  const newWorlds = {
    red: [],
    green: [],
    blue: [],
  };

  for (let y = 0; y < height; y++) {
    newWorlds.red.push([]);
    newWorlds.green.push([]);
    newWorlds.blue.push([]);

    for (let x = 0; x < width; x++) {
      const cells = {
        red: worlds.red[y][x],
        green: worlds.green[y][x],
        blue: worlds.blue[y][x],
      };

      const neighborsLifeForce = getAllNeighborsLifeForce(
        worlds,
        x,
        y,
        width,
        height
      );

      // Cells die if they don't have enough neighbors around
      for (const color of ["red", "green", "blue"]) {
        const enemyColor = getEnemyColor(color);

        if (neighborsLifeForce[enemyColor] > neighborsLifeForce[color]) {
          newWorlds[color][y].push(cells[color] - 0.05);
        } else if (cells[color] > 0 && neighborsLifeForce[color] < 3) {
          newWorlds[color][y].push(cells[color] - 0.01);
        } else if (
          cells[color] > 0 &&
          neighborsLifeForce[color] >= 3 &&
          neighborsLifeForce[color] <= 5
        ) {
          newWorlds[color][y].push(cells[color] + 0.01);
        } else if (
          cells[color] > 0 &&
          neighborsLifeForce[color] > 5 &&
          neighborsLifeForce[color] < 6
        ) {
          newWorlds[color][y].push(cells[color] - 0.01);
        } else if (cells[color] > 0 && neighborsLifeForce[color] >= 6) {
          newWorlds[color][y].push(1);
        } else if (
          cells[color] === 0 &&
          neighborsLifeForce[color] > 2 &&
          neighborsLifeForce[color] < 3
        ) {
          newWorlds[color][y].push(1);
        } else {
          newWorlds[color][y].push(0);
        }
      }
    }
  }

  return newWorlds;
}

function getEnemyColor(color) {
  switch (color) {
    case "red":
      return "green";
    case "green":
      return "blue";
    case "blue":
      return "red";
  }
}

function getAllNeighborsLifeForce(worlds, x, y, width, height) {
  return {
    red: getNeighborsLifeForce(worlds.red, x, y, width, height),
    green: getNeighborsLifeForce(worlds.green, x, y, width, height),
    blue: getNeighborsLifeForce(worlds.blue, x, y, width, height),
  };
}

function getNeighborsLifeForce(world, x, y, width, height) {
  let westernDx = -2;
  let westDx = -1;
  let eastDx = 1;
  let easternDx = 2;
  let northDy = -1;
  let northernDy = -2;
  let southDy = 1;
  let southernDy = 2;

  // Delta corrections for in-the-limits coordinates
  if (x === 0) {
    westDx = width - 1;
    westernDx = width - 2;
  } else if (x === 1) {
    westernDx = width - 2;
  } else if (x === width - 1) {
    eastDx = -(width - 1);
    easternDx = -(width - 2);
  } else if (x === width - 2) {
    easternDx = -(width - 2);
  }

  if (y === 0) {
    northDy = height - 1;
    northernDy = height - 2;
  } else if (y === 1) {
    northernDy = height - 2;
  } else if (y === height - 1) {
    southDy = -(height - 1);
    southernDy = -(height - 2);
  } else if (y === height - 2) {
    southernDy = -(height - 2);
  }

  const swCell = world[y + southDy][x + westDx];
  const wCell = world[y][x + westDx];
  const nwCell = world[y + northDy][x + westDx];
  const nCell = world[y + northDy][x];
  const neCell = world[y + northDy][x + eastDx];
  const eCell = world[y][x + eastDx];
  const seCell = world[y + southDy][x + eastDx];
  const sCell = world[y + southDy][x];

  const sswwCell = world[y + southernDy][x + westernDx];
  const swwCell = world[y + southDy][x + westernDx];
  const wwCell = world[y][x + westernDx];
  const nwwCell = world[y + northDy][x + westernDx];
  const nnwwCell = world[y + northernDy][x + westernDx];
  const nnwCell = world[y + northernDy][x + westDx];
  const nnCell = world[y + northernDy][x];
  const nneCell = world[y + northernDy][x + eastDx];
  const nneeCell = world[y + northernDy][x + easternDx];
  const neeCell = world[y + northDy][x + easternDx];
  const eeCell = world[y][x + easternDx];
  const seeCell = world[y + southDy][x + easternDx];
  const sseeCell = world[y + southernDy][x + easternDx];
  const sseCell = world[y + southernDy][x + eastDx];
  const ssCell = world[y + southernDy][x];
  const sswCell = world[y + southernDy][x + westDx];

  return (
    0.5 *
      (sswwCell +
        swwCell +
        wwCell +
        nwwCell +
        nnwwCell +
        nnwCell +
        nnCell +
        nneCell +
        nneeCell +
        neeCell +
        eeCell +
        seeCell +
        sseeCell +
        ssCell +
        sswCell) +
    swCell +
    wCell +
    nwCell +
    nCell +
    neCell +
    eCell +
    seCell +
    sCell
  );
}
