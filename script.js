/*
** The Gameboard represents the state of the board
** Each square holds a Cell (defined later)
** and we expose a dropToken method to be able to add Cells to squares
*/

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2d array that will represent the state of the game board
  for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
          board[i].push(Cell());
      }
  }

  // Method to get the entire board
  const getBoard = () => board;

  // drop a token, changing cell's value to the player number
  const dropToken = (row, column, player) => {
      if (row < 0 || row >= rows || column < 0 || column >= columns) {
          console.log("Invalid move: coordinates out of bounds.");
          return false;
      }
      if (board[row][column].getValue() !== 0) {
          console.log("Invalid move: cell already occupied.");
          return false;
      }
      // Valid cell
      board[row][column].addToken(player);
      return true;
  };

  // Method to print the board to the console
  const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      console.log(boardWithCellValues);
  };

  // Interface for interacting with the board
  return { getBoard, dropToken, printBoard };
}

/*
** A Cell represents one "square" on the board and can have one of
** 0: no token is in the square,
** 1: Player One's token,
** 2: Player 2's token
*/

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

/* 
** The GameController will be responsible for controlling the 
** flow and state of the game's turns, as well as whether
** anybody has won the game
*/
function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
  const board = Gameboard();

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
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
      console.log(
          `Dropping ${getActivePlayer().name}'s token into row ${row} & column ${column}...`
      );

      if (!board.dropToken(row, column, getActivePlayer().token)) {
          console.log("Try again.");
          return;
      }

      // Switch player turn
      switchPlayerTurn();
      printNewRound();
  };

  // Initial play game message
  printNewRound();

  // Interface for the UI
  return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard,
      setPlayerName
  };
}

const game = GameController();

// DOM manipulation

function ScreenController(game) {
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');

  const updateScreen = () => {
      // clear the board
      boardDiv.textContent = "";

      // get the newest version of the board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();

      // Display player's turn
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

      // Render board squares
      board.forEach((row, rowIndex) => {
          row.forEach((cell, columnIndex) => {
              // Anything clickable should be a button!!
              const cellButton = document.createElement("button");
              cellButton.classList.add("cell");
              // Create data attributes to identify the row and column
              cellButton.dataset.row = rowIndex;
              cellButton.dataset.column = columnIndex;
              cellButton.textContent = cell.getValue();
              boardDiv.appendChild(cellButton);
          });
      });
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
      const selectedRow = e.target.dataset.row;
      const selectedColumn = e.target.dataset.column;
      // Make sure I've clicked a column and not the gaps in between
      if (selectedRow === undefined || selectedColumn === undefined) return;
      
      game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
      updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();
}

ScreenController(game);

// Attendi che il DOM sia completamente caricato
document.addEventListener('DOMContentLoaded', function() {
  // Recupera gli elementi dal DOM
  const nameInputOne = document.getElementById('playerNameOne');
  const nameInputTwo = document.getElementById('playerNameTwo');
  const savedName = document.getElementById('savedName');

  // Aggiungi event listener agli input
  nameInputOne.addEventListener('input', function() {
      const playerOneName = nameInputOne.value;
      game.setPlayerName(0, playerOneName);
      savedName.innerHTML = `${playerOneName} - your sign will be X<br>${nameInputTwo.value} - your sign will be O`;
  });

  nameInputTwo.addEventListener('input', function() {
      const playerTwoName = nameInputTwo.value;
      game.setPlayerName(1, playerTwoName);
      savedName.innerHTML = `${nameInputOne.value} - your sign will be X<br>${playerTwoName} - your sign will be O`;
  });

});
