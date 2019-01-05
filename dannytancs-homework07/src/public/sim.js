function randomGenerator(size) {
    return Math.floor(Math.random() * size);
}

function randomElementInArray(array) {
    return array[randomGenerator(array.length)];
}

function emojiStringToArray(str) {
    const split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
    const arr = [];
    split.forEach(function (emoji) {
        if (emoji !== "") {
            arr.push(emoji);
        }
    });
    return arr;
}

function generateForest(stringOfEmojis) {

    if (stringOfEmojis === "") {
        stringOfEmojis = "🌵🎄🌲🌳🌴🌱🌿☘️🍀🎍🎋🍃🍂🍁🌾🥀🌺🌻🌹🌷🌼🌸💐🐶🐱🐭🐹🐰🐻🐼🐨🐯🦁🐘🐐🐏🐑";
    }
    const listOfEmojis = emojiStringToArray(stringOfEmojis);

    //empty tree
    listOfEmojis.push(" ");

    const forest = [];
    for (let i = 0; i < 64; i++) {
        forest.push(randomElementInArray(listOfEmojis));
    }
    return forest;
}

function simpsonIndexElement(forest) {
            
    const index = 1 - Object.entries(
        [...forest.join("")].reduce(
            (counts, emoji) => ({ ...counts, [emoji]: (counts[emoji] || 0) + 1 }),
            {}
        )
    ).reduce(([top, bottom], [species, count]) => [top + (count * (count - 1)), bottom + count], [0, 0])
        .reduce((sumLilN, bigN) => sumLilN / (bigN * (bigN - 1)));
        

    const string = "the current Simpson's Index is: " + index;


    const div = document.createElement('div');
    const text = document.createTextNode(string);
    div.appendChild(text);

    if (index <= 0.7) {
        const pushTray = document.getElementById('pushtray');
        pushTray.style.display = "block";
        pushTray.innerHTML = "WARNING: Simpson's index dropped to " + index;        
    }

    return div;
}

function pin() {
    if (this.style.backgroundColor === "white") {
        this.style.backgroundColor = "lightgray";
    }
    else {
        this.style.backgroundColor = "white";
    }
}

// function replaceRow(forestArray) {
//     const rows = document.querySelectorAll("#sim>div>div");
//     let index = 0;
//     rows.forEach((row) => {
//         if (row.style.backgroundColor === "white") {
//             string = "";
//             for (let i = 0; i < 8; i++) {
//                 string += forestArray[index];
//                 index ++;
//             }
//             row.innerHTML = string;
//         }
//     });
// }

function replaceIndividual(forestArray) {
    const elements = document.querySelectorAll("#sim>div>div>span");
    let index = 0;
    elements.forEach((element) => {
        if (element.style.backgroundColor === "white") {
            element.innerHTML = forestArray[index];
            index ++;
        }
    });
}


// for rows
// function into8by8(forestArray) {
//     const forest = document.createElement('div');
//     for(let i = 0; i < Math.sqrt(forestArray.length); i++) {
//         const div = document.createElement('div');
//         div.addEventListener('click', pin)
//         div.style.backgroundColor = "white";
//         let row = "";
//         for (let j = 0; j < Math.sqrt(forestArray.length); j++) {
//             row += forestArray[i*8 +j];
//         }
//         const text = document.createTextNode(row);
//         div.appendChild(text);
//         forest.appendChild(div);
//     }
//     return forest;
// }


// for individual
function into8by8(forestArray) {
    const forest = document.createElement('div');
    for(let i = 0; i < Math.sqrt(forestArray.length); i++) {
        const div = document.createElement('div');
        for (let j = 0; j < Math.sqrt(forestArray.length); j++) {
            const span = document.createElement('span');
            span.innerHTML = forestArray[i*8 +j];
            span.style.width = "21px";
            span.style.height = "26px";
            span.style.verticalAlign = "top";
            span.style.display = "inline-block";
            span.addEventListener('click', pin);
            span.style.backgroundColor = "white";
            div.appendChild(span);
        }
        forest.appendChild(div);
    }
    return forest;
}


function addForestElement(forestArray) {
    const div = into8by8(forestArray);
    const sim = document.getElementById('sim');
    sim.appendChild(div);
}

function addButton() {
    const button = document.createElement('button');
    const text = document.createTextNode('generate');
    button.appendChild(text);
    const sim = document.getElementById('sim');
    sim.appendChild(button);
}


function addSimponElement(forestArray) {
    const sim = document.getElementById('sim');
    const div = simpsonIndexElement(forestArray);
    sim.appendChild(div);
}


function restartButton() {
    const button = document.createElement('button');
    const text = document.createTextNode('restart');
    button.appendChild(text);
    const sim = document.getElementById('sim');
    sim.appendChild(button);
}

function generate() {
    const inputValue = document.getElementById('inputForest').value;
    const forestArray = generateForest(inputValue);
    const simpson = document.querySelectorAll("#sim>div")[0];
    const newSimpson = simpsonIndexElement(forestArray);
    simpson.parentNode.replaceChild(newSimpson, simpson);
    replaceIndividual(forestArray);
}

function restart() {
    const sim = document.getElementById('sim');
    sim.style.display = "none";
    sim.innerHTML = "";
    const pushTray = document.getElementById('pushtray');
    pushTray.style.display = "none";
    pushTray.innerHTML = "";
    const forest = document.getElementById('inputForest');
    forest.value = "";
    const intro = document.getElementById('intro');
    intro.style.display = "block";

}

function start() {
    document.getElementById('intro').style.display = "none";
    document.getElementById('sim').style.display = "block";
    const inputValue = document.getElementById('inputForest').value;
    const forest = generateForest(inputValue);
    addSimponElement(forest);
    addForestElement(forest);
    addButton();
    restartButton();
    document.querySelectorAll('#sim>button')[0].addEventListener('click', generate);
    document.querySelectorAll('#sim>button')[1].addEventListener('click', restart);
}

function main() {
    document.querySelector('#intro>button').addEventListener('click', start);
}

document.addEventListener('DOMContentLoaded', main);





