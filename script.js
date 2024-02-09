console.log("go bananas");

//player 
//name, token, active

let players = {
    playerOne: {
        name:"One",
        token:1,
        active:1
    },
    playerTwo: {
        name:"Two",
        token:2,
        active:0
    }
};

let setActivePlayer = () => {
    let activePlayer = players.playerOne.active === 1 ? players.playerOne : players.playerTwo;
    return activePlayer;
};

let currentPlayer = setActivePlayer();

function Gameboard() {

//board 
//3x3 grid of cells 

    const rows = 3; 
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    // use this to update cell value: board[1][2].addToken(players.playerOne);
    // Gameboard().dropToken(1,1,currentPlayer)

    const dropToken = (row, column, currentPlayer) => {
    
    // board[row][column].addToken(currentPlayer);
    board[row][column].addToken(currentPlayer);
    console.log("done");
    }

    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;

    return { getBoard, dropToken, printBoard };
};

// define cell
function Cell() {
    let value = 0;
  

    // per lanciarlo Cell().addToken(currentPlayer)
    const addToken = (player) => {
      value = player.token;
      console.log(value)
    };
  
    const getValue = () => value;
    return {
      addToken,
      getValue
    };
};


// per stampare la board, usa board.printBoard()
board = Gameboard()



//round
//check cell with the token of the active player if empty - otherwise escape
//check win/tie
//change active player

const checkCell = (row, column, currentPlayer) => {
    if (Gameboard().getBoard()[row][column].getValue() != 0) { //usa le coordinate della cella
        return;
    } else {
        Gameboard().dropToken(row, column, currentPlayer);
    }
};


const switchPlayerTurn = () => {
    if (players.playerOne.active === 1) {
        players.playerOne.active = 0;
        players.playerTwo.active = 1;
    } else {
        players.playerOne.active = 1;
        players.playerTwo.active = 0;
    }
    currentPlayer = setActivePlayer();
    console.log(currentPlayer);
  };


//reset game
//refresh cells to empty state
//refresh players