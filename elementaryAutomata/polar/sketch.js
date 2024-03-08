const WIDTH = 1024;
const HEIGHT = 1024;
const RULE = 73;

let rule = numberToRule(RULE);
let cellRows;
let iteration;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellRows = [[1]];
  iteration = 1; // same as cellRows.length

  noFill();
  background("#240A34");
  stroke("#EABE6C");
  strokeWeight(1);
}

function draw() {
  const prevRow = cellRows[iteration - 1];
  const row = calculateNextRow(prevRow, rule);

  cellRows.push(row);
  iteration += 1;

  const numberOfCells = row.length;
  row.forEach((cell, cellIndex) => {
    const rotation = iteration * 0.001;
    const start = rotation + cellIndex / numberOfCells;
    const end = rotation + (cellIndex + 1) / numberOfCells;

    if (cellIndex < numberOfCells / 4.5 || cellIndex > numberOfCells * 0.785) {
      stroke("#891652");
    } else {
      stroke("#EABE6C");
    }

    if (cell === 1) {
      arc(
        windowWidth / 2,
        windowHeight / 2,
        iteration,
        iteration,
        start * TWO_PI,
        end * TWO_PI
      );
    }
  });
}

function numberToRule(number) {
  return number
    .toString(2)
    .padStart(8, 0)
    .split("")
    .map((i) => parseInt(i))
    .reverse();
}

function addListeners() {
  document.getElementById("update-simulation").onclick = () => {
    rule = numberToRule(parseInt(document.getElementById("rule").value));
    cellRows = [[1]];
    iteration = 1;
    background("#240A34");
  };
}
document.addEventListener("DOMContentLoaded", addListeners);
