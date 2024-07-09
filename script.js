/*
** The Gameboard represents the state of the board
** Each equare holds a Cell (defined later)
** and we expose a dropToken method to be able to add Cells to squares
*/

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    // Create a 2d array that will represent the state of the game board
    // For this 2d array, row 0 will represent the top row and
    // column 0 will represent the left-most column.
    // This nested-loop technique is a simple and common way to create a 2d array.
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  
    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;
  

    // drop a token, changing cell's value to the player number
    const dropToken = (row, column, player) => {

      let validMove = true; 

      if (row < 0 || row >= rows || column < 0 || column >= columns) {
        console.log("Invalid move: coordinates out of bounds.");
        return false; // Coordinate non valide
    }
    if (board[row][column].getValue() !== 0) {
        console.log("Invalid move: cell already occupied.");
        return false; // Cella già occupata
    }
          
        // Otherwise, I have a valid cell
        board[row][column].addToken(player);
        return true;
      };
  
    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      console.log(boardWithCellValues);
    };
  
    // Here, we provide an interface for the rest of our
    // application to interact with the board
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
  
    // How we will retrieve the current value of this cell through closure
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
  function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
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
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
  
    const playRound = (row,column) => {
      // Drop a token for the current player
      console.log(
        `Dropping ${getActivePlayer().name}'s token into row ${row} & column ${column}...`
      );

      // board.dropToken(row, column, getActivePlayer().token);

      if (!board.dropToken(row, column, getActivePlayer().token)) {
        console.log("Try again.");
        return;
    }

      /*  This is where we would check for a winner and handle that logic,
          such as a win message. */
  
      // Switch player turn
      switchPlayerTurn();
      printNewRound();
    };
  
    // Initial play game message
    printNewRound();
  
    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version, so I'm revealing it now
    return {
      playRound,
      getActivePlayer
    };
  }
  
  const game = GameController();



  //
  // DOM manipulation
  // let's go
  //



  // Attendi che il DOM sia completamente caricato
document.addEventListener('DOMContentLoaded', function() {
  // Recupera gli elementi dal DOM
  const nameInputOne = document.getElementById('playerNameOne');
  const nameInputTwo = document.getElementById('playerNameTwo');
  const saveNameButton = document.getElementById('saveNameButton');
  const savedName = document.getElementById('savedName');


  // Aggiungi un event listener al bottone
  saveNameButton.addEventListener('click', function() {
      // Recupera il valore dell'input
      const playerOneName = nameInputOne.value;
      const playerTwoName = nameInputTwo.value;

      
      // Salva il valore nel paragrafo
      savedName.innerHTML = `Player 1: ${playerOneName} - your sign will be X<br>Player 2: ${playerTwoName} - your sign will be O`;
  });
});
