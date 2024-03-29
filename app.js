const computer = (function () {
  let name = "Computer";
  let token = "";
  let positions = [];
  return { name, token, positions };
})();
const player = (function () {
  let name = "";
  let token = "";
  let positions = [];
  return { name, token, positions };
})();
const gameboard = (function () {
  let emptyPositions = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 1],
    [3, 2],
    [3, 3],
  ];

  function checkDraw(emptyPositions) {
    if ((emptyPositions.length = 0)) {
      return console.log("draw");
    }
  }
  checkDraw(emptyPositions);

  function countArray(array) {
    const countX = {};
    const countY = {};
    for (let i = 0; i < array.length; i++) {
      if (countX[array[i][0]]) {
        countX[array[i][0]] += 1;
      } else countX[array[i][0]] = 1;
    }
    for (let i2 = 0; i2 < array.length; i2++) {
      if (countY[array[i2][1]]) {
        countY[array[i2][1]] += 1;
      } else countY[array[i2][1]] = 1;
    }
    checkWin(countX, countY);
  }
  function checkWin(countX, countY) {
    if (Object.values(countX).find((element) => element == 3))
      console.log("win horizontal");
    else if (Object.values(countY).find((element) => element == 3))
      console.log("win vertical");
    else if (Object.keys(countY).length == 3 && Object.keys(countX).length == 3)
      console.log("win diagonal");
  }
  countArray(player.positions);
  countArray(computer.positions);
  return { emptyPositions };
})();
