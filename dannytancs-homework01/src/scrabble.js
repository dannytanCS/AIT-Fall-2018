// scrabble.js

let words;
const readline = require('readline');
const fs = require('fs');
const letterValues = { 
    "E": 1, "A": 1, "I": 1, "O": 1, "N": 1, "R": 1, "T": 1, "L": 1, "S": 1, "U": 1, 
    "D": 2, "G": 2, "B": 3, "C": 3, "M": 3, "P": 3, "F": 4, "H": 4, "V": 4, "W": 4, 
    "Y": 4, "K": 5, "J": 8, "X": 8, "Q": 10, "Z": 10 
};


function getScore(word) {
    let score = 0;
    for (let i = 0; i < word.length; i++) {
        const letter = word.charAt(i).toUpperCase();
        score += letterValues[letter];
    }
    return score;
}

function printOutTop5(validWords) {
    //loop through everything in case less than 5
    console.log("The top scoring words are:");
    for(let i = 0; i < validWords.length; i ++){
        //top 5 
        if (i < 5) {
            console.log(validWords[i].score + ' - ' + validWords[i].word);
        }
	}
}

function main() {

    // set up a readline object that can be used for gathering user input
    const userPrompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    //input file
    fs.readFile('data/enable1.txt', 'utf8', function(err, data) {
        if (err) {
            console.log('File not found', err); 
        } else {
            words = data.split("\n");
        }
    });

     //callback function, check all of the valid words and print top 5
     function handleUserInput(response){
        const validWords = [];
        for (let i = 0; i < words.length; i++) {
            //all of the letters
            const letters = response.split("");
            const validWord = words[i];
            const validLetters = words[i].split("");

            while (validLetters.length > 0) {
                //check the first letter in valid word is in letters given
                const index = letters.indexOf(validLetters[0]);
                if (index !== -1) {
                    //if found remove from given letters and valid word
                    letters.splice(index, 1);
                    //pop the first one
                    validLetters.shift();
                }
                else {
                    //letter from valid word is not in the list of letters, go to the next word in the file list
                    break;
                }
            }
            if (validLetters.length === 0) {
                //end of loop, all letter from valid word are contained in the list of letters
                validWords.push({"word": validWord, "score": getScore(validWord)});
            }
        }
        validWords.sort(function(a, b) {
            // if a is less than b, then a should be after b 
            if(a.score < b.score) {
                return 1;
            //alphabetical if the same
            } else if(a.score >= b.score) {
                return -1;
            }
        });
        printOutTop5(validWords);
        userPrompt.close();
    }

    userPrompt.question("Please enter some letters:", handleUserInput);
   
}

main();