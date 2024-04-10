//initial state

const initialState = {
  computer: {
    name: "Computer",
    token: "",
    positions: [],
    active: true,
  },
  player2: {
    name: "Player 2",
    token: "",
    positions: [],
    active: false,
    turn: false,
  },
  player: {
    name: "Player",
    token: "X",
    positions: [],
    turn: true,
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

//Objects
const computer = (function () {
  let { name, token, positions, active } = currentState.computer;
  function randomIndexPos(gameboardLength) {
    return Math.floor(Math.random() * gameboardLength);
  }

  return { name, token, positions, active, randomIndexPos };
})();

const player = (function () {
  let { name, token, positions, turn } = currentState.player;
  return { name, token, positions, turn };
})();
const player2 = (function () {
  let { name, token, positions, active, turn } = currentState.player2;
  return { name, token, positions, active, turn };
})();
/*const difficulty = (function () {
  EASY: 'easy',
  MODERATE: 'moderate',
  HARD: 'hard';
// Function to set AI difficulty
    (difficulty) => {
      switch (difficulty) {
        case difficulty.EASY:
          // Set AI strategy for easy difficulty
          aiStrategy = randomMove;
          break;
        case difficulty.MODERATE:
          // Set AI strategy for moderate difficulty
          aiStrategy = moderateMove;
          break;
        case difficulty.HARD:
          // Set AI strategy for hard difficulty
          aiStrategy = hardMove;
          break;
        default:
          // Default to easy difficulty if invalid difficulty is provided
          aiStrategy = randomMove;
      }
    }
})();
*/
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
      if (computer.active == true) {
        moveArray(chosenArray, player);
        countArray(player);
        checkDraw(emptyPositions);
        randomMove();
        countArray(computer);
      } else if (computer.active == false) {
        player2.token = getAlternateCounter(player.token);
        if (player.turn == true) {
          moveArray(chosenArray, player);
          countArray(player);
          checkDraw(emptyPositions);
          toggleProperty(player, "turn");
          toggleProperty(player2, "turn");
        } else if (player2.turn == true) {
          moveArray(chosenArray, player2);
          countArray(player2);
          checkDraw(emptyPositions);
          toggleProperty(player, "turn");
          toggleProperty(player2, "turn");
        }
      }
      //console.log("player poisitions " + player.positions);
      //console.log("computer poisitions " + computer.positions);
      //console.log("empty positions " + emptyPositions);
    }
  });
  document.addEventListener("DOMContentLoaded", function () {
    symbolSelect.addEventListener("change", function () {
      player.token = symbolSelect.value;
      computer.token = getAlternateCounter(player.token);
      player2.token = computer.token;
      resetGame();
    });
    opponent.addEventListener("change", function () {
      if (opponent.value == "computer") {
        computer.active = true;
        player2.active = false;
      } else if (opponent.value == "player") {
        computer.active = false;
        player2.active = true;
      }
      console.log(computer.active);
      console.log(player2.active);
      resetGame();
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
  //Automatic events
  function toggleProperty(obj, property) {
    obj[property] = !obj[property]; // Invert the boolean value of the property
  }
  function randomMove() {
    if (emptyPositions.length > 0) {
      randomIndex = computer.randomIndexPos(emptyPositions.length);
      if (randomIndex !== -1) {
        const removedPosition = emptyPositions.splice(randomIndex, 1)[0];
        computer.positions.push(removedPosition);

        placeCounter(computer.positions, computer.token);
      }
    }
  }
  //Establish Gameboard Positions
  function strToArr(string) {
    return string.split(",").map(Number);
  }
  function findPosition(position) {
    return JSON.stringify(this) === JSON.stringify(position);
  }
  function moveArray(newPosition, currentPlayer) {
    let currentPosition = emptyPositions.findIndex(findPosition, newPosition);
    if (currentPosition !== -1) {
      const removedPosition = emptyPositions.splice(currentPosition, 1)[0];
      currentPlayer.positions.push(removedPosition);
    }
    placeCounter(currentPlayer.positions, currentPlayer.token);
  }

  function placeCounter(positions, token) {
    positions.forEach((position) => {
      let positionID = position[0] + "," + position[1];
      let gameCounter = document.getElementById(positionID);
      if (gameCounter) {
        gameCounter.textContent = token;
      }
    });
  }
  //Check Results
  function checkDraw(emptyPositions) {
    if (emptyPositions.length == 0) {
      return console.log("draw");
    }
  }
  function countArray(player) {
    const countX = {};
    const countY = {};
    let array = player.positions;
    for (let i = 0; i < array.length; i++) {
      if (countX[array[i][0]]) {
        countX[array[i][0]] += 1;
      } else countX[array[i][0]] = 1;
      // console.log(countX);
    }
    for (let i2 = 0; i2 < array.length; i2++) {
      if (countY[array[i2][1]]) {
        countY[array[i2][1]] += 1;
      } else countY[array[i2][1]] = 1;
      // console.log(countY);
    }
    checkWin(countX, countY, player);
  }
  function findConditionalPositions(positionToFind, player) {
    return (isPositionFound =
      player.positions.find(
        (position) =>
          position[0] === positionToFind[0] && position[1] === positionToFind[1]
      ) !== undefined);
  }
  function checkWin(countX, countY, player) {
    if (Object.values(countX).find((element) => element == 3))
      console.log(player.name + " Horizontal win");
    else if (Object.values(countY).find((element) => element == 3))
      console.log(player.name + " win vertical");
    else if (
      Object.keys(countY).length == 3 &&
      Object.keys(countX).length == 3 &&
      findConditionalPositions([2, 2], player) == true
    )
      console.log(player.name + " win diagonal");
  }

  //Reset Game
  function resetGame() {
    player.positions = [...initialState.player.positions];
    computer.positions = [...initialState.computer.positions];
    player2.positions = [...initialState.player2.positions];
    player.turn = initialState.player.turn;
    player2.turn = initialState.player2.turn;
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
    if (computer.token == "X" && computer.active == true) randomMove();
  }
  return { emptyPositions, symbolSelect, getAlternateCounter };
})();

window.onload = function () {
  player.token = gameboard.symbolSelect.value;
  computer.token = gameboard.getAlternateCounter(player.token);
};
