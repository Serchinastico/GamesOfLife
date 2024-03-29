const WIDTH = 1024;
const HEIGHT = 1600;

let rules = [0, 0, 1, 1, 1, 1, 1, 0].reverse();
let cellRows;
let iteration;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  cellRows = [[1]];
  iteration = 1; // same as cellRows.length
  background("black");
  stroke("white");
  strokeWeight(1.1);
}

function draw() {
  const prevRow = cellRows[iteration - 1];
  const row = calculateNextRow(prevRow, rules);

  cellRows.push(row);
  iteration += 1;

  row.forEach((cell, cellIndex) => {
    const x = WIDTH / 2 - iteration + cellIndex;
    const y = iteration % HEIGHT;
    if (cell === 1) {
      point(x, y);
    }
  });
}
