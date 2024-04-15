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
    name: "Player 1",
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
    gameComplete: false,
  },
};
let currentState = { ...initialState };

//Objects
const computer = (function () {
  let { name, token, positions, active } = currentState.computer;
  let difficulty = document.getElementById("difficultyChoice");
  //AI Minmax Logic
  function minimax(board, depth, maximizingPlayer) {
    let result = evaluate(board);
    if (result !== null) {
      return result;
    }

    if (maximizingPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === "") {
            board[i][j] = "X";
            let score = minimax(board, depth + 1, false);
            board[i][j] = "";
            bestScore = Math.max(bestScore, score);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === "") {
            board[i][j] = "O";
            let score = minimax(board, depth + 1, true);
            board[i][j] = "";
            bestScore = Math.min(bestScore, score);
          }
        }
      }
      return bestScore;
    }
  }
  function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = [row, column];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          board[i][j] = "X";
          const score = minimax(board, 0, false);
          board[i][j] = "";
          if (score > bestScore) {
            bestScore = score;
            row = i;
            column = j;
          }
        }
      }
    }
    return bestMove;
  }
  function evaluate(board) {
    const winningCombinations = [
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    for (const combination of winningCombinations) {
      if (combination.every((cell) => cell === "X")) {
        return 10;
      } else if (combination.every((cell) => cell === "O")) {
        return -10;
      }
    }
    if (board.every((row) => row.every((cell) => cell !== ""))) {
      return 0;
    }
    return 5;
  }
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const bestScore = minimax(board, 0, true);
  console.log("Best score:", bestScore);
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
const gameboard = (function () {
  let { emptyPositions, gameComplete } = currentState.gameboard;
  //cache DOM
  let opponent = document.getElementById("opponentChoice");
  const symbolSelect = document.getElementById("counterChoice");
  const dialog = document.getElementById("dialog");
  const outcome = document.getElementById("endGameWinner");
  const outcomeMessage = document.getElementById("endGameMessage");
  const winLine = document.querySelector(".winLine");
  const gameboardContainer = document.querySelector(".gameboardContainer");

  //Bind Events
  document.addEventListener("click", function (buttonPressed) {
    const target = buttonPressed.target;
    if (target.id == "reset") resetGame();
    else if (target.id == "closeReset") {
      dialog.close();
      resetGame();
    } else if (target.classList.contains("gameSquare")) {
      let chosenArray = strToArr(target.id);
      if (computer.active == true) {
        playerVsComputerEvent(chosenArray);
      } else if (computer.active == false) {
        player2.token = getAlternateCounter(player.token);
        if (player.turn == true) {
          playerVsPlayerEvent(chosenArray, player);
        } else if (player2.turn == true) {
          playerVsPlayerEvent(chosenArray, player2);
        }
      }
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
      resetGame();
    });
  });
  //Automatic events
  function getAlternateCounter(playerChoice) {
    if (playerChoice.toUpperCase() === "X") {
      return "O";
    } else if (playerChoice.toUpperCase() === "O") {
      return "X";
    } else {
      return null;
    }
  }
  function toggleProperty(obj, property) {
    obj[property] = !obj[property]; // Invert the boolean value of the property
  }
  function randomMove() {
    if (emptyPositions.length > 0) {
      randomIndex = computer.randomIndexPos(emptyPositions.length);
      if (randomIndex !== -1) {
        const removedPosition = emptyPositions.splice(randomIndex, 1)[0];
        computer.positions.push(removedPosition);
        setTimeout(() => {
          placeCounter(computer.positions, computer.token);
        }, 400);
      }
    }
  }
  function playerVsComputerEvent(position) {
    if (checkForCounter(position) == false) {
      moveArray(position, player);
      countArray(player);
      if (gameComplete == false) {
        checkDraw(emptyPositions);
        randomMove();
        countArray(computer);
        checkDraw(emptyPositions);
      }
    }
  }
  function playerVsPlayerEvent(position, activePlayer) {
    if (checkForCounter(position) == false) {
      moveArray(position, activePlayer);
      countArray(activePlayer);
      if (gameComplete == false) {
        checkDraw(emptyPositions);
        toggleProperty(player, "turn");
        toggleProperty(player2, "turn");
      }
    }
  }
  function disablePointerEvents() {
    const elementsToDisable = document.querySelectorAll(".gameSquare");
    elementsToDisable.forEach((element) => {
      element.classList.add("disabled");
    });
    const containerToDisable = document.querySelectorAll(".containerLeft");
    containerToDisable.forEach((element) => {
      element.classList.add("disabled");
    });
  }
  function enablePointerEvents() {
    const elementsToEnable = document.querySelectorAll(".gameSquare");
    elementsToEnable.forEach((element) => {
      element.classList.remove("disabled");
    });
    const containerToDisable = document.querySelectorAll(".containerLeft");
    containerToDisable.forEach((element) => {
      element.classList.remove("disabled");
    });
  }
  //Establish/Check Gameboard Positions
  function checkForCounter(position) {
    let positionID = position[0] + "," + position[1];
    let gameCounter = document.getElementById(positionID);
    if (gameCounter.textContent !== "") return true;
    else return false;
  }
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
    setTimeout(() => {
      placeCounter(currentPlayer.positions, currentPlayer.token);
    }, 200);
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
  const adjustWinLinePosition = function (
    winSquareRow,
    winSquareCol,
    leftAdjust,
    topAdjust
  ) {
    const gameboardContainerRect = gameboardContainer.getBoundingClientRect();
    const gameSquare = document.getElementById(
      `${winSquareRow},${winSquareCol}`
    );
    const gameSquareRect = gameSquare.getBoundingClientRect();
    const relativeLeft = gameSquareRect.left - gameboardContainerRect.left;
    winLine.style.left = relativeLeft + leftAdjust + "px";
    const squareHeight = gameSquare.offsetHeight;
    const winLineHeight = winLine.offsetHeight;
    const relativeTop =
      gameSquareRect.top -
      gameboardContainerRect.top +
      (squareHeight - winLineHeight) / 2;
    winLine.style.top = relativeTop + topAdjust + "px";
  };
  // Animation Display
  const startWinLineAnimation = function (direction) {
    if (direction == "horizontal") {
      winLine.classList.add("animate");
    } else if (direction == "vertical") {
      winLine.style.transform = "rotate(90deg)";
      winLine.classList.add("animate");
    } else if (direction == "diagonal") {
      winLine.style.transform = "rotate(45deg)";
      winLine.classList.add("animate");
    } else if (direction == "reverseDiagonal") {
      winLine.style.transform = "rotate(135deg)";
      winLine.classList.add("animate");
    }
  };
  const stopWinLineAnimation = function () {
    winLine.classList.remove("animate");
    winLine.style.transform = "";
  };
  //Check Results
  function checkDraw(emptyPositions) {
    if (emptyPositions.length == 0) {
      outcome.textContent = "You Draw.....";
      outcomeMessage.textContent = "I guess no-one gets to smile here";
      dialog.showModal();
      gameComplete = true;
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
    if (Object.values(countX).find((element) => element == 3)) {
      const objectKey = Object.keys(countX).find((key) => countX[key] === 3);
      adjustWinLinePosition(objectKey, 1, 60, 0);
      disablePointerEvents();
      startWinLineAnimation("horizontal");
      displayOutcome(player, "horizontal");
      gameComplete = true;
    } else if (Object.values(countY).find((element) => element == 3)) {
      const objectKey = Object.keys(countY).find((key) => countY[key] === 3);
      adjustWinLinePosition(1, objectKey, -100, 150);
      disablePointerEvents();
      startWinLineAnimation("vertical");
      displayOutcome(player, "vertical");
      gameComplete = true;
    } else if (
      findConditionalPositions([1, 1], player) == true &&
      findConditionalPositions([2, 2], player) == true &&
      findConditionalPositions([3, 3], player) == true
    ) {
      disablePointerEvents();
      adjustWinLinePosition(2, 1, 60, 0);
      startWinLineAnimation("diagonal");
      displayOutcome(player, "diagonal");
      gameComplete = true;
    } else if (
      findConditionalPositions([1, 3], player) == true &&
      findConditionalPositions([2, 2], player) == true &&
      findConditionalPositions([3, 1], player) == true
    ) {
      disablePointerEvents();
      adjustWinLinePosition(2, 1, 60, 0);
      startWinLineAnimation("reverseDiagonal");
      displayOutcome(player, "diagonal");
    }
  }
  function displayOutcome(object, direction) {
    setTimeout(() => {
      if (computer.active == true) {
        switch (object) {
          case player:
            outcome.textContent = "You Win!!!";
            outcomeMessage.textContent =
              "You have beaten the machine! With a " + direction + " line";
            dialog.showModal();
            break;
          case computer:
            outcome.textContent = "You Lose!!";
            outcomeMessage.textContent =
              "You lost to the Computer by " +
              direction +
              " line, and frankly it has the logic of a toaster O.o";
            dialog.showModal();
            break;
        }
      } else if (player2.active == true) {
        switch (object) {
          case player:
            outcome.textContent = "You Win!!! " + player.name;
            outcomeMessage.textContent =
              "You have beaten " +
              player2.name +
              " with a " +
              direction +
              " line";
            dialog.showModal();
            break;
          case player2:
            outcome.textContent = "You Win!!! " + player2.name;
            outcomeMessage.textContent =
              "You have beaten " +
              player.name +
              " with a " +
              direction +
              " line";
            dialog.showModal();
            break;
        }
      }
    }, 3000);
  }
  //Clear game to initial spec
  resetGame();

  //Reset Game
  function resetGame() {
    player.positions = [...initialState.player.positions];
    computer.positions = [...initialState.computer.positions];
    player2.positions = [...initialState.player2.positions];
    player.turn = initialState.player.turn;
    player2.turn = initialState.player2.turn;
    gameComplete = false;
    stopWinLineAnimation();
    enablePointerEvents();
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
  return {
    emptyPositions,
    symbolSelect,
    getAlternateCounter,
  };
})();

window.onload = function () {
  player.token = gameboard.symbolSelect.value;
  computer.token = gameboard.getAlternateCounter(player.token);
};
