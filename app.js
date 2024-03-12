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
    [1, 1][1, 2][1, 3][(2, 1)][(2, 2)][(2, 3)][(3, 1)][(3, 2)][(3, 3)],
  ];
  function checkDraw(emptyPositions) {
    if ((emptyPositions.length = 0)) {
      return "draw";
    }
  }
  function checkWin(array) {
    const counter = {};
    array.forEach(element => {if (element[0])
        
    });
  }
})();

//3 positions in a line = win
//cannot place a tile on existing tile

//reset with each match (overall score maybe)
