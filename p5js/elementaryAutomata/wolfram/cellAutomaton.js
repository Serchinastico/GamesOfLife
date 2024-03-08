function calculateNextRow(prevRow, rules) {
  let row = [];

  const newRowLength = prevRow.length + 2;
  for (let i = 0; i < newRowLength; i++) {
    let leftCell = prevRow[i - 2];
    let midCell = prevRow[i - 1];
    let rightCell = prevRow[i];

    if (i === 0) {
      leftCell = 0;
      midCell = 0;
    } else if (i === 1) {
      leftCell = 0;
    } else if (i === newRowLength - 2) {
      rightCell = 0;
    } else if (i === newRowLength - 1) {
      midCell = 0;
      rightCell = 0;
    }

    const ruleIndex = parseInt(`${leftCell}${midCell}${rightCell}`, 2);
    row.push(rules[ruleIndex]);
  }

  return row;
}
