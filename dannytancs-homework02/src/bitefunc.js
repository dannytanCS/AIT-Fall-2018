// bitefunc.js

function averageAge(bites) {
    let ages = bites.map(bites => bites.Age);
    //remove NaN ages
    ages = ages.filter(age => !isNaN(age));
    //get rid of all of error ages
    ages = ages.filter(age => age < 100);
    const sum = ages.reduce((age, total) => total + age, 0);
    return (sum/bites.length).toFixed(2);
}


function percentSpayNeuter(bites) {
    let count = 0;
    bites.forEach(function(bite) {
        if (bite.SpayNeuter) {
            count ++;
        }
    });
    return count/bites.length;
}


function topBreed(bites) {
    let result = "";
    const map = new Map();
    bites.forEach(function(bite) {
        const k = bite.Breed;
        if (map.hasOwnProperty(k)) {
            map[k] ++;
        } else {
            map[k] = 1;
        }
    });

    let sorted = [];

    Object.keys(map).forEach( (key) => {
        sorted.push([key, map[key]]);
    });

    sorted.sort(function(a, b) {
        return a[1] < b[1] ? 1 : -1;
    });

    //filter out unknown
    sorted = sorted.filter(bite => bite[0] !== 'UNKNOWN');

    const top10 = sorted.slice(0,10);

    let count = 1;

    top10.forEach(function(biteData) {
        result += count + "." + biteData[0] + " with " + biteData[1] + " reported bites\n";
        count ++;
    });
    return result;
}

function topBorough(bites) {
    let result = "";
    const map = new Map();
    bites.forEach(function(bite) {
        const k = bite.Borough;
        if (map.hasOwnProperty(k)) {
            map[k] ++;
        } else {
            map[k] = 1;
        }
    });

    const sorted = [];

    Object.keys(map).forEach( (key) => {
        sorted.push([key, map[key]]);
    });

    sorted.sort(function(a, b) {
        return a[1] < b[1] ? 1 : -1;
    });

    const top5 = sorted.slice(0,5);

    let count = 1;

    top5.forEach(function(biteData) {
        result += count + "." + biteData[0] + " with " + biteData[1] + " bites\n";
        count ++;
    });
    return result;

}

function topMonths(bites) {
    let result = "";
    const map = new Map();
    bites.forEach(function(bite) {
        let k = bite.DateOfBite;
        if (k!==undefined) {
            k = k.split(" ")[0];
        }
        if (map.hasOwnProperty(k)) {
            map[k] ++;
        } else {
            map[k] = 1;
        }
    });

    const sorted = [];

    Object.keys(map).forEach( (key) => {
        sorted.push([key, map[key]]);
    });

    sorted.sort(function(a, b) {
        return a[1] < b[1] ? 1 : -1;
    });

    const top3 = sorted.slice(0,3);
    result = top3[0][0] + ", " + top3[1][0] + ", and " + top3[2][0] + ".";

    return result;
}

function main(bites) {
    let output = "";
    const average = averageAge(bites);
    output += "Average age of these chompy friends is: " + average + '\n\n';
    const spay = (percentSpayNeuter(bites) * 100).toFixed(2) + "%";
    output += "The percentage of biting dogs that are spayed/neutered: " + spay + '\n\n';
    output += "Top Ten Most Chompy Breeds:\n";
    output += topBreed(bites);
    output += '\n';
    output += 'Dog Bite Leaderboard \n';
    output += topBorough(bites);
    output += '\n';
    output += "The top three months for dog biting are " + topMonths(bites) + "\n";
    return output;
}


module.exports = {
    main: main
};