//initial state

const initialState = {
  computer: {
    name: "Computer",
    token: "O",
    positions: [],
  },
  player: {
    name: "",
    token: "X",
    positions: [],
  },
  gameboard: {
    emptyPositions: [
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 1],
      [2, 2],
      [2, 3],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
  },
};
let currentState = { ...initialState };

//objects
const computer = (function () {
  let { name, token, positions } = currentState.computer;
  function randomIndexPos(gameboardLength) {
    return Math.floor(Math.random() * gameboardLength);
  }

  return { name, token, positions, randomIndexPos };
})();
const player = (function () {
  let { name, token, positions } = currentState.player;
  return { name, token, positions };
})();
const gameboard = (function () {
  let { emptyPositions } = currentState.gameboard;
  resetGame();
  //cache DOM
  let opponent = document.getElementById("opponentChoice");
  let difficulty = document.getElementById("difficultyChoice");
  const symbolSelect = document.getElementById("counterChoice");

  //Bind Events
  document.addEventListener("click", function (buttonPressed) {
    const target = buttonPressed.target;
    if (target.id == "reset") resetGame();
    else if (target.classList.contains("gameSquare")) {
      let chosenArray = strToArr(target.id);
      moveArray(chosenArray, player);
      checkDraw(emptyPositions);
      countArray(player.positions);
      randomMove();
    }
  });
  document.addEventListener("DOMContentLoaded", function () {
    symbolSelect.addEventListener("change", function () {
      player.token = symbolSelect.value;
      computer.token = getAlternateCounter(player.token);
      resetGame();
      if (computer.token == "X") randomMove();
    });
  });
  function getAlternateCounter(playerChoice) {
    if (playerChoice.toUpperCase() === "X") {
      return "O";
    } else if (playerChoice.toUpperCase() === "O") {
      return "X";
    } else {
      return null;
    }
  }
  function strToArr(string) {
    return string.split(",").map(Number);
  }
  //Computer events
  function randomMove() {
    randomIndex = computer.randomIndexPos(emptyPositions.length);
    computer.positions.push(emptyPositions.splice(randomIndex, 1));
    placeCounter(computer.positions, computer.token);
  }
  //Establish Gameboard Positions
  function findPosition(position) {
    return JSON.stringify(this) === JSON.stringify(position);
  }
  function moveArray(newPosition, currentPlayer) {
    let currentPosition = emptyPositions.findIndex(findPosition, newPosition);
    if (currentPosition !== -1) {
      currentPlayer.positions.push(emptyPositions.splice(currentPosition, 1));
    }
    placeCounter(currentPlayer.positions, currentPlayer.token);
  }
  function placeCounter(positions, token) {
    positions.forEach((positionArray) => {
      positionArray.forEach((position) => {
        let positionID = position.join(",");
        let gameCounter = document.getElementById(positionID);
        if (gameCounter) {
          gameCounter.textContent = token;
        }
      });
    });
  }
  //Check Results
  function checkDraw(emptyPositions) {
    if (emptyPositions.length == 0) {
      return console.log("draw");
    }
  }
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

  //Reset Game
  function resetGame() {
    player.positions = [...initialState.player.positions];
    computer.positions = [...initialState.computer.positions];
    currentState.gameboard.emptyPositions = [
      ...initialState.gameboard.emptyPositions,
    ];
    emptyPositions = [...currentState.gameboard.emptyPositions];
    emptyPositions.forEach((position) => {
      let positionID = position.join(",");
      let gameCounter = document.getElementById(positionID);
      if (gameCounter) {
        gameCounter.textContent = ""; // Set text content to empty
      }
    });
  }
})();
