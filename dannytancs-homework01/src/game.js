// game.js

const tic = require('./tic-tac-toe.js');
const readlineSync = require('readline-sync');
const arr = process.argv[2] ? JSON.parse(process.argv[2]) : undefined;
let playerMoves;
let computerMoves;


function checkWin(board) {
    if (tic.getWinnerRows(board) !== undefined) {
        return tic.getWinnerRows(board);
    }

    if (tic.getWinnerCols(board) !== undefined) {
        return tic.getWinnerCols(board);
    }

    if (tic.getWinnerDiagonals(board) !== undefined) {
        return tic.getWinnerDiagonals(board);
    }

    return false;
}

function playerTurn(board, letter){
    let move = readlineSync.question("What's your move?\n");
    while(!tic.isValidMoveAlgebraicNotation(board, move)) {
        console.log("Your move must be in the correct format, and it must specify an existing empty cell!\n");
        move = readlineSync.question("What's your move?\n");
    }
    board = tic.placeLetters(board, letter, move);
    console.log(tic.boardToString(board));
    return board;
}

function computerTurn(board, letter){
    readlineSync.question("Press <ENTER> to show computer's move...\n");
    const index = tic.getRandomEmptyCellIndex(board);
    board[index] = letter;
    console.log(tic.boardToString(board));
    return board;
}

//win or draw
function checkForStop(board, playerLetter) {
    //check for draw and no win
    if (tic.isBoardFull(board) && !checkWin(board)) {
        console.log("It's a draw!\n");
    }
    //check for win
    if (checkWin(board)) {
        if (checkWin(board) === playerLetter) {
            console.log("Player won!\n");
        }
        else {
            console.log("Computer won!\n");
        }
    }
    //check for win or draw
    return checkWin(board) || tic.isBoardFull(board);
}


//computer moves
function computerMove(board, computerLetter) {
    if (computerMoves && computerMoves.length > 0) {
        console.log("Computer will make the following moves: ", computerMoves);
        readlineSync.question('Press <ENTER> to confirm computer\'s scripted move\n');
        // pop the first element
        const move = computerMoves.shift();
        // valid move
        if(tic.isValidMove(board, move[0], move[1])){
            const index = tic.toIndex(board, move[0], move[1]);
            board[index] = computerLetter;
            console.log(tic.boardToString(board));
        }
        else {
            console.log("Invalid move. Computer will move randomly \n");
            board = computerTurn(board, computerLetter);
        }
    }
    else {
        board = computerTurn(board, computerLetter);   
    }
    return board;
}


//player moves
function playerMove(board, playerLetter) {
    if (playerMoves && playerMoves.length > 0) {
        console.log("Player will make the following moves: ", playerMoves);
        readlineSync.question('Press <ENTER> to confirm player\'s scripted move\n');
        // pop the first element
        const move = playerMoves.shift();
        // valid move
        if(tic.isValidMove(board, move[0], move[1])){
            const index = tic.toIndex(board, move[0], move[1]);
            board[index] = playerLetter;
            console.log(tic.boardToString(board));
        }
        else {
            console.log("Invalid move \n");
            board = playerTurn(board, playerLetter);
        }
    }
    else {
        board = playerTurn(board, playerLetter);
    }
    return board;
}

function main() {
    console.log("Shall we play a game? TIC-TAC-TOE!\n");

    //input moves or not
    if(arr !== undefined){
        playerMoves = arr[1];
        computerMoves = arr[0];
    }



    let width = readlineSync.question("How wide should the board be? (1 - 26)\n");
    while(width < 1 || width > 26){
        width = readlineSync.question("How wide should the board be? (1 - 26)\n");
    }

    let playerLetter = readlineSync.question("Pick your letter: X or O\n");
    while(playerLetter !== "X" && playerLetter !== "O") {
        playerLetter = readlineSync.question("Pick your letter: X or O\n");
    }


    let board = tic.board(width, width, '');
    console.log('Player is ', playerLetter);
    console.log(tic.boardToString(board));

    while (!tic.isBoardFull(board) && !checkWin(board)) {
        //goes first
        if (playerLetter === "X") {

            board = playerMove(board, playerLetter);
            if (!checkForStop(board, playerLetter)) {
                board = computerMove(board, "O");
                checkForStop(board, playerLetter);
            }        
        }
        //goes second 
        else {
            board = computerMove(board, "X");  
            if (!checkForStop(board, playerLetter)) {
                board = playerMove(board, playerLetter);
                checkForStop(board, playerLetter);
            }              
        }
    }
}

main();