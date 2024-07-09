// Utility function to add messages to the messages div
function addMessage(message) {
  const messagesDiv = document.querySelector('.messages');
  const messageParagraph = document.createElement('p');
  messageParagraph.textContent = message;
  messagesDiv.appendChild(messageParagraph);
}

// Clear the messages
function clearMessages() {
  const messagesDiv = document.querySelector('.messages');
  messagesDiv.textContent = "";
}

// Disable the board
function disableBoard() {
  const cellButtons = document.querySelectorAll('.cell');
  cellButtons.forEach(button => button.disabled = true);
}

function Cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // Retrieve the current value of this cell
  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

function Gameboard() {
  const rows = 3;
  const columns = 3;
  let board = [];

  const initializeBoard = () => {
    board = [];
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };

  initializeBoard();

  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
      addMessage("Invalid move: coordinates out of bounds.");
      return false;
    }
    if (board[row][column].getValue() !== 0) {
      addMessage("Invalid move: cell already occupied.");
      return false;
    }
    board[row][column].addToken(player);
    return true;
  };

  const reset = () => {
    initializeBoard();
  };

  return { getBoard, dropToken, reset };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
  let board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1
    },
    {
      name: playerTwoName,
      token: 2
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const setPlayerName = (playerIndex, name) => {
    players[playerIndex].name = name;
  };

  const printNewRound = () => {
    addMessage(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    addMessage(`Dropping ${getActivePlayer().name}'s token into row ${row} & column ${column}...`);

    if (!board.dropToken(row, column, getActivePlayer().token)) {
      addMessage("Try again.");
      return;
    }

    if (checkWin(board.getBoard(), getActivePlayer().token)) {
      addMessage(`${getActivePlayer().name} wins!`);
      disableBoard();
      return;
    }

    if (checkTie(board.getBoard())) {
      addMessage("It's a tie!");
      disableBoard();
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  const resetGame = () => {
    board.reset();
    activePlayer = players[0];
    clearMessages();
    addMessage("Game reset. Starting a new game.");
    printNewRound();
  };

  function checkWin(board, player) {
    const rows = board.length;
    const columns = board[0].length;

    // Check rows
    for (let i = 0; i < rows; i++) {
      if (board[i].every(cell => cell.getValue() === player)) {
        return true;
      }
    }

    // Check columns
    for (let j = 0; j < columns; j++) {
      if (board.every(row => row[j].getValue() === player)) {
        return true;
      }
    }

    // Check diagonal (top-left to bottom-right)
    if (board.every((row, idx) => row[idx].getValue() === player)) {
      return true;
    }

    // Check diagonal (top-right to bottom-left)
    if (board.every((row, idx) => row[columns - 1 - idx].getValue() === player)) {
      return true;
    }

    return false;
  }

  function checkTie(board) {
    return board.every(row => row.every(cell => cell.getValue() !== 0));
  }

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    setPlayerName,
    resetGame
  };
}

function ScreenController(game) {
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue() === 1 ? 'X' : cell.getValue() === 2 ? 'O' : '';
        boardDiv.appendChild(cellButton);
      });
    });

    const messagesDiv = document.querySelector('.messages').textContent;
    if (messagesDiv.includes('wins') || messagesDiv.includes("It's a tie")) {
      disableBoard();
      playerTurnDiv.textContent = messagesDiv;
    } else {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    }
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow || !selectedColumn) return;

    game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();

  return {
    updateScreen  // Return the updateScreen function
  };

}

document.addEventListener('DOMContentLoaded', function() {
  const game = GameController();
  const screen = ScreenController(game);

  const nameInputOne = document.getElementById('playerNameOne');
  const nameInputTwo = document.getElementById('playerNameTwo');
  const resetButton = document.getElementById('resetButton');
  const savedName = document.getElementById('savedName');

  nameInputOne.addEventListener('input', function() {
    const playerOneName = nameInputOne.value;
    game.setPlayerName(0, playerOneName);
    updateSavedNames();
  });

  nameInputTwo.addEventListener('input', function() {
    const playerTwoName = nameInputTwo.value;
    game.setPlayerName(1, playerTwoName);
    updateSavedNames();
  });

  resetButton.addEventListener('click', function() {
    game.resetGame();
    screen.updateScreen();
  });

  function updateSavedNames() {
    savedName.innerHTML = `${nameInputOne.value || 'Player One'} - your sign will be X<br>${nameInputTwo.value || 'Player Two'} - your sign will be O`;
  }

  updateSavedNames();
});
