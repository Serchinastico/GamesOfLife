const WIDTH = 1024;
const HEIGHT = 1024;
const RULE = 73;
const rules = RULE.toString(2)
  .padStart(8, 0)
  .split("")
  .map((i) => parseInt(i))
  .reverse();
let cellRows;
let iteration;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  cellRows = [[1]];
  iteration = 1; // same as cellRows.length

  noFill();
  background("black");
  stroke("white");
  strokeWeight(1.1);
}

function draw() {
  const prevRow = cellRows[iteration - 1];
  const row = calculateNextRow(prevRow, rules);

  cellRows.push(row);
  iteration += 1;

  const numberOfCells = row.length;
  row.forEach((cell, cellIndex) => {
    const rotation = iteration * -0.001;
    const start = rotation + cellIndex / numberOfCells;
    const end = rotation + (cellIndex + 1) / numberOfCells;

    if (cell === 1) {
      arc(
        WIDTH / 2,
        HEIGHT / 2,
        iteration,
        iteration,
        start * TWO_PI,
        end * TWO_PI
      );
    }
  });
}
