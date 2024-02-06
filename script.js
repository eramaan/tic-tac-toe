console.log("go bananas");

//player 
//name, token, active

let players = {
    PlayerOne: {
        name:"One",
        token:1,
        active:1
    },
    PlayerTwo: {
        name:"Two",
        token:2,
        active:0
    }
};

let setActivePlayer = () => {
    let activePlayer = players.PlayerOne.active === 1 ? players.PlayerOne : players.PlayerTwo;
    console.log(activePlayer);
    return activePlayer;
};
setActivePlayer();

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

    // use this to update cell value: board[1][2].addToken(players.PlayerOne);

    const dropToken = (row, column, activePlayer) => {
    
    board[row][column].addToken(activePlayer);
    }

    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;

    return { getBoard, dropToken, printBoard };
};

// define cell
function Cell() {
    let value = 0;
  
    const addToken = (player) => {
      value = player.token;
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

const checkCell = (row, column, activePlayer) => {
    if (board[row][column].getValue != 0) { //usa le coordinate della cella
        return;
    } else {
        dropToken(row, column, activePlayer);
    }
};


const switchPlayerTurn = () => {
    if (players.PlayerOne.active === 1) {
        players.PlayerOne.active = 0;
        players.PlayerTwo.active = 1;
    } else {
        players.PlayerOne.active = 1;
        players.PlayerTwo.active = 0;
    }
    setActivePlayer();
  };


//reset game
//refresh cells to empty state
//refresh players