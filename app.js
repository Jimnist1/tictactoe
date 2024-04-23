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
  let { name, token, difficulty, positions, active, board } =
    currentState.computer;
  //AI Minmax Logic
  function fillBoard(turnTaker) {
    let currentPosition = turnTaker.positions;
    if (currentPosition != null) {
      currentPosition.forEach((element) => {
        computer.board[element[0] - 1][element[1] - 1] = turnTaker.token;
      });
    }
    console.log(computer.board);
  }
  function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (computer.board[i][j] == "") {
          computer.board[i][j] = computer.token;
          let score = minimax(computer.board, 0, false);
          computer.board[i][j] = "";
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    console.log(move);
    console.log(move.i + 1 + "," + (move.j + 1));
    return [move.i + 1, move.j + 1];
  }
  let aiScores = {
    X: 1,
    O: -1,
    tie: 0,
  };
  function minimax(board, depth, isMaximizing) {
    let result = aiCheckWinner();
    if (result != null) {
      return aiScores[result];
    }
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "") {
            board[i][j] = computer.token;
            let score = minimax(computer.board, depth + 1, false);
            computer.board[i][j] = "";
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == "") {
            board[i][j] = player.token;
            let score = minimax(computer.board, depth + 1, true);
            board[i][j] = "";
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }
  function equalsThree(a, b, c) {
    return a == b && b == c && a != "";
  }
  function aiCheckWinner() {
    let winner = null;
    for (let i = 0; i < 3; i++) {
      if (
        equalsThree(
          computer.board[i][0],
          computer.board[i][1],
          computer.board[i][2]
        )
      ) {
        winner = computer.board[i][0];
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        equalsThree(
          computer.board[0][i],
          computer.board[1][i],
          computer.board[2][i]
        )
      ) {
        winner = computer.board[0][i];
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        equalsThree(
          computer.board[0][0],
          computer.board[1][1],
          computer.board[2][2]
        )
      ) {
        winner = computer.board[i][0];
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        equalsThree(
          computer.board[2][0],
          computer.board[1][1],
          computer.board[0][2]
        )
      ) {
        winner = computer.board[2][0];
      }
    }
    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (computer.board[i][j] == "") {
          openSpots++;
        }
      }
    }
    if (winner == null && openSpots == 0) {
      return "tie";
    } else return winner;
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
        if (choice == 1) randomMove();
        else if (choice == 2) aiMove();
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
    position = computer.bestMove();
    console.log(position);
    setTimeout(() => {
      moveArray(position, computer);
    }, 400);
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
      adjustWinLinePosition(objectKey, 1, 60, 0);
      disablePointerEvents();
      startWinLineAnimation("horizontal");
      displayOutcome(player, "horizontal");
      gameComplete = true;
    } else if (Object.values(countY).find((element) => element == 3)) {
      const objectKey = Object.keys(countY).find((key) => countY[key] == 3);
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
    computer.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
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
