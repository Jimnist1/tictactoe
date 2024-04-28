//initial state

const initialState = {
  computer: {
    name: "Computer",
    token: "",
    difficulty: "easy",
    positions: [],
    active: true,
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
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
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    gameComplete: false,
  },
};

//Objects
const computer = (function () {
  let { name, token, difficulty, positions, active, board } =
    initialState.computer;
  //AI Minmax Logic
  function fillBoard(turnTaker) {
    let currentPosition = turnTaker.positions;
    if (currentPosition != null) {
      currentPosition.forEach((element) => {
        computer.board[element[0]][element[1]] = turnTaker.token;
      });
    }
  }
  function bestMove(board, computerToken) {
    let bestScore = -Infinity;
    let move;

    // Check all empty spots on the board
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // If spot is empty
        if (board[i][j] === "") {
          // Try placing the player's symbol in the empty spot
          board[i][j] = computerToken;
          // Calculate the score for this move
          let score = minimax(board, 0, false, computerToken);
          // Undo the move
          board[i][j] = "";
          // If this move is better than the current best move, update bestScore and move
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    // Return the best move
    return move;
  }

  function minimax(board, depth, isMaximizing, computerToken) {
    const playerToken = computerToken === "X" ? "O" : "X";
    // Base case: check if the game is over
    let result = checkWinner(board);
    if (result !== null) {
      return result === computerToken
        ? 10 - depth
        : result === playerToken
        ? depth - 10
        : 0;
    }

    // Maximizing player's turn (computer)
    if (isMaximizing) {
      let bestScore = -Infinity;
      // Check all empty spots on the board
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // If spot is empty
          if (board[i][j] === "") {
            // Try placing the computer's symbol in the empty spot
            board[i][j] = computerToken;
            // Recursively call minimax function with the new board state
            let score = minimax(board, depth + 1, false);
            // Undo the move
            board[i][j] = "";
            // Update bestScore
            bestScore = Math.max(bestScore, score);
          }
        }
      }
      return bestScore;
    }
    // Minimizing player's turn (human)
    else {
      let bestScore = Infinity;
      // Check all empty spots on the board
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // If spot is empty
          if (board[i][j] === "") {
            // Try placing the human's symbol in the empty spot
            board[i][j] = playerToken;
            // Recursively call minimax function with the new board state
            let score = minimax(board, depth + 1, true);
            // Undo the move
            board[i][j] = "";
            // Update bestScore
            bestScore = Math.min(bestScore, score);
          }
        }
      }
      return bestScore;
    }
  }

  function checkWinner(board) {
    const winPatterns = [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        board[(a / 3) | 0][a % 3] &&
        board[(a / 3) | 0][a % 3] === board[(b / 3) | 0][b % 3] &&
        board[(a / 3) | 0][a % 3] === board[(c / 3) | 0][c % 3]
      ) {
        return board[(a / 3) | 0][a % 3];
      }
    }

    // Check for a draw
    let draw = true;
    for (let row of board) {
      for (let cell of row) {
        if (cell === "") {
          draw = false;
          break;
        }
      }
    }
    if (draw) {
      return "draw";
    }

    return null;
  }

  function randomIndexPos(gameboardLength) {
    return Math.floor(Math.random() * gameboardLength);
  }
  return {
    name,
    token,
    difficulty,
    positions,
    active,
    board,
    randomIndexPos,
    fillBoard,
    bestMove,
  };
})();

const player = (function () {
  let { name, token, positions, turn } = initialState.player;
  return { name, token, positions, turn };
})();
const player2 = (function () {
  let { name, token, positions, active, turn } = initialState.player2;
  return { name, token, positions, active, turn };
})();
const gameboard = (function () {
  let { emptyPositions, gameComplete } = initialState.gameboard;
  //cache DOM
  let opponent = document.getElementById("opponentChoice");
  const symbolSelect = document.getElementById("counterChoice");
  const dialog = document.getElementById("dialog");
  const outcome = document.getElementById("endGameWinner");
  const outcomeMessage = document.getElementById("endGameMessage");
  const winLine = document.querySelector(".winLine");
  const gameboardContainer = document.querySelector(".gameboardContainer");
  const difficultyStatus = document.getElementById("difficultyChoice");

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
    difficultyStatus.addEventListener("change", function () {
      if (difficultyStatus.value) {
        computer.difficulty = difficultyStatus.value;
        resetGame();
      }
    });
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
        difficultyStatus.disabled = false;
      } else if (opponent.value == "player") {
        computer.active = false;
        player2.active = true;
        difficultyStatus.disabled = true;
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
  function compMove() {
    if (emptyPositions.length > 0) {
      aiDescision();
    }
  }
  function aiDescision() {
    let currentStrategy = computer.difficulty;
    switch (currentStrategy) {
      case "easy":
        randomMove();
        break;
      case "moderate":
        let choice = computer.randomIndexPos(2);
        console.log(choice);
        if (choice == 0) randomMove();
        else if (choice == 1) aiMove();

        break;
      case "hard":
        aiMove();
        break;
    }
  }
  function randomMove() {
    randomIndex = computer.randomIndexPos(emptyPositions.length);
    if (randomIndex !== -1) {
      const removedPosition = emptyPositions.splice(randomIndex, 1)[0];
      computer.positions.push(removedPosition);
      setTimeout(() => {
        gameboard.placeCounter(computer.positions, computer.token);
      }, 400);
    }
  }
  function aiMove() {
    position = computer.bestMove(computer.board, computer.token);
    moveArray([position.i, position.j], computer);
    console.log(position, computer.board);
  }
  function playerVsComputerEvent(position) {
    if (checkForCounter(position) == false) {
      moveArray(position, player);
      countArray(player);
      computer.fillBoard(player);
      if (gameComplete == false) {
        checkDraw(emptyPositions);
        compMove();
        countArray(computer);
        checkDraw(emptyPositions);
        computer.fillBoard(computer);
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
          position[0] == positionToFind[0] && position[1] == positionToFind[1]
      ) !== undefined);
  }
  function checkWin(countX, countY, player) {
    if (Object.values(countX).find((element) => element == 3)) {
      const objectKey = Object.keys(countX).find((key) => countX[key] == 3);
      adjustWinLinePosition(objectKey, 0, 60, 0);
      disablePointerEvents();
      startWinLineAnimation("horizontal");
      displayOutcome(player, "horizontal");
      gameComplete = true;
    } else if (Object.values(countY).find((element) => element == 3)) {
      const objectKey = Object.keys(countY).find((key) => countY[key] == 3);
      adjustWinLinePosition(0, objectKey, -100, 150);
      disablePointerEvents();
      startWinLineAnimation("vertical");
      displayOutcome(player, "vertical");
      gameComplete = true;
    } else if (
      findConditionalPositions([0, 0], player) == true &&
      findConditionalPositions([1, 1], player) == true &&
      findConditionalPositions([2, 2], player) == true
    ) {
      disablePointerEvents();
      adjustWinLinePosition(1, 0, 60, 0);
      startWinLineAnimation("diagonal");
      displayOutcome(player, "diagonal");
      gameComplete = true;
    } else if (
      findConditionalPositions([0, 2], player) == true &&
      findConditionalPositions([1, 1], player) == true &&
      findConditionalPositions([2, 0], player) == true
    ) {
      disablePointerEvents();
      adjustWinLinePosition(1, 0, 60, 0);
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
    computer.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    stopWinLineAnimation();
    enablePointerEvents();
    emptyPositions = [...initialState.gameboard.emptyPositions];
    emptyPositions.forEach((position) => {
      let positionID = position.join(",");
      let gameCounter = document.getElementById(positionID);
      if (gameCounter) {
        gameCounter.textContent = ""; // Set text content to empty
      }
    });
    if (computer.token == "X" && computer.active == true) compMove();
  }
  return {
    emptyPositions,
    symbolSelect,
    getAlternateCounter,
    placeCounter,
  };
})();

window.onload = function () {
  player.token = gameboard.symbolSelect.value;
  computer.token = gameboard.getAlternateCounter(player.token);
};
