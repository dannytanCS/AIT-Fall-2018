// tic-tac-toe.js


function board(rows, columns, initialCellValue = "") {
    return new Array(rows * columns).fill(initialCellValue);
}


function toIndex(board, row, col) {
    if (row >= 0 && col >= 0){
        return Math.sqrt(board.length) * row + col;
    }
    else {
        return undefined;
    }
}

function toRowCol(board, i) {
    const row = Math.floor(i/Math.sqrt(board.length));
    const column = i % Math.sqrt(board.length);
    return {"row": row, "col": column};
}


function setBoardCell(board, letter, row, col) {
    const index = toIndex(board, row, col);
    const copy = board.slice();
    copy[index] = letter;
    return copy;
}

function algebraicToRowCol(algebraicNotation) {
    if (!algebraicNotation || algebraicNotation.length < 2) {return undefined;}

    const letterAscii = algebraicNotation.charCodeAt(0);
    const number = algebraicNotation.substring(1);
 
    if (letterAscii < 65 || letterAscii > 90) {return undefined;}
    if (isNaN(number) || number < 0 || number > 25) {return undefined;}
    //if contain space
    if (number.split(" ").length > 1) {return undefined;}

    const row = letterAscii - 'A'.charCodeAt(0);
    const column = number - 1;

    return {"row": row, "col": column};
    
}

function placeLetters(board, ...args) {
    if (args.length % 2 === 1) {args.pop();} 

    for(let i = 0; i < args.length; i+=2) {
        const letter = args[i];
        const position = algebraicToRowCol(args[i+1]);
        const index = toIndex(board, position.row, position.col);
		if( position && index < board.length && board[index] === ""){
			board = setBoardCell(board, letter, position.row, position.col);
		}
    }
    return board;
}

function boardToString(board) {

    let string = "  ";

    //label all of the numbers
    for (let i = 1; i < Math.sqrt(board.length) + 1; i ++) {
        string += "   " + i;
    }
    string += "  \n";

    for (let row = 0; row < Math.sqrt(board.length); row ++) {
        string += "   ";

        for (let column = 0; column < Math.sqrt(board.length); column ++) {
            string += "+---";
        }
        string += "+\n";
        //letter label
        const letter = String.fromCharCode('A'.charCodeAt(0) + row);

        string += (" " + letter + " ");
        //get the element from row column coordinates
        for (let column2 = 0; column2 < Math.sqrt(board.length); column2 ++) {
            const index = toIndex(board, row, column2);
            string += "| "; 
            if (board[index] === "") {
                string += " ";
            }
            else {
                string += board[index];
            }
            string += " ";
        }
        string += "|\n";
    }
    string += "   ";
    for (let column = 0; column < Math.sqrt(board.length); column ++) {
        string += "+---";
    }

    string += "+\n";

    return string;
}

function getWinnerRows(board) {
    for (let row = 0; row < Math.sqrt(board.length); row ++) {
        //reset for every row
        let count = 0;
        let letter = "";
        for(let column = 0; column < Math.sqrt(board.length); column++) {
            const element = board[toIndex(board, row, column)];
            if (element === letter && element !== "") {
                count++;
            }
            else {
                letter = element;
                count = 1;
            }
            if (count === 3) { return letter;}
        }
    }
    //no winner found
    return undefined;
}


function getWinnerCols(board) {
    for (let column = 0; column < Math.sqrt(board.length); column ++) {
        //reset for every row
        let count = 0;
        let letter = "";
        for(let row = 0; row < Math.sqrt(board.length); row++) {
            const element = board[toIndex(board, row, column)];
            //change element to new letter if it is not equal to the previous adj letter
            if (element === letter && element !== "") {
                count++;
            }
            else {
                letter = element;
                count = 1;
            }
            if (count === 3) { return letter;}
        }
    }
    //no winner found
    return undefined;
}


function getWinnerDiagonals(board) {
    for(let row = 0; row < Math.sqrt(board.length); row ++) {
        for(let column = 0; column < Math.sqrt(board.length); column++) {
            const letter = board[toIndex(board,row, column)];

            const topLeft = toIndex(board,row-1, column-1);
            const topRight = toIndex(board,row+1, column-1);
            const bottomLeft = toIndex(board,row-1, column+1);
            const bottomRight = toIndex(board,row+1, column+1);
        
            //check up diagonal
            if (topRight !== undefined && bottomLeft !== undefined) {
                if (board[topRight] === letter && board[bottomLeft] === letter && letter !== "") {
                    console.log(topRight);
                    console.log(toIndex(board,row, column));
                    console.log(bottomLeft);
                    return letter;
                }
            }
             //check down diagonal
             if (topLeft !== undefined && bottomRight !== undefined) {
                if (board[topLeft] === letter && board[bottomRight] === letter && letter !== "") {
                    return letter;
                }
            }
        }
    }

    //no winner found
    return undefined;
}

function isBoardFull(board) {
    for(let i = 0; i < board.length; i++){
		if(board[i] === '') {return false;}
	}
	return true;
}

function isValidMove(board, row, col) {
    const index = toIndex(board, row, col);
    return index >= 0 && index < board.length && board[index] === '';
}

function isValidMoveAlgebraicNotation(board, algebraicNotation) {
    const position = algebraicToRowCol(algebraicNotation);
	if(position) {return isValidMove(board, position.row, position.col);}
	return false;
}

function getRandomEmptyCellIndex(board) {
    const emptyCells = [];
    for(let i = 0; i < board.length; i++){
		if(board[i] === ''){
            emptyCells.push(i);
		}
    }
    return emptyCells[Math.floor(Math.random()*emptyCells.length)];
}

module.exports = {
	board: board,
	toIndex: toIndex,
	toRowCol: toRowCol,
	setBoardCell: setBoardCell,
	algebraicToRowCol: algebraicToRowCol,
	placeLetters: placeLetters,
	boardToString: boardToString,
	getWinnerRows: getWinnerRows,
	getWinnerCols: getWinnerCols,
	getWinnerDiagonals: getWinnerDiagonals,
	isBoardFull: isBoardFull,
	isValidMove: isValidMove,
	isValidMoveAlgebraicNotation: isValidMoveAlgebraicNotation,
	getRandomEmptyCellIndex: getRandomEmptyCellIndex
};