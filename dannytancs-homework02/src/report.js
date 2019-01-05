// report.js


class Bite {
    constructor(UniqueID, DateOfBite, Species, Breed, Age, Gender, SpayNeuter, Borough, ZipCode) {
        this.UniqueID = UniqueID;
        this.DateOfBite = DateOfBite;
        this.Species = Species;
        this.Breed = Breed;
        this.Age = Age;
        this.Gender = Gender;
        this.SpayNeuter = SpayNeuter;
        this.Borough = Borough;
        this.ZipCode = ZipCode;
    }
}


//local file

// function processFile(processData) {
//     const fs = require('fs');
//     fs.readFile('../DOHMH_Dog_Bite_Data.csv', 'utf8', function(err, data) {
//         if (err) {
//             console.log('File not found', err); 
//         } else {
//             processData(data);
//         }
//     });
// }

const request = require('request');
const biteData = [];

function getData(string) {
    const link = 'http://jvers.com/csci-ua.0480-fall2018-001-003/homework/02/dogbite/' + string + '.json';
    request(link, function (error,response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        }
        //get data
        const data = JSON.parse(body)["data"];
        data.forEach(function(bite) {
            const aBite = new Bite(parseInt(bite["UniqueID"]), bite["DateOfBite"], bite["Species"], bite["Breed"], parseInt(bite["Age"]), bite["Gender"], (bite["SpayNeuter"] === "true"), bite["Borough"], parseInt(bite["ZipCode"]));
            biteData.push(aBite);
        });

        if (JSON.parse(body)["next"]) {
            getData(JSON.parse(body)["next"]);
        }
        else {
            const biteFunc = require('./bitefunc');
            console.log(biteFunc.main(biteData));
        }
    });
}

function data() {
    
    
    //local file

    // processFile( content => {
    //     let bites = content.split("\n");
    //     //remove first index of headings
    //     bites = bites.slice(1,bites.length);
    //     const listOfBites = [];
    //     bites.forEach(function(bite) {
    //         const biteData = bite.split(",");
    //         const moreBreed = biteData.length - 9;

    //         const breedArray = biteData.slice(3, 4+moreBreed);
    //         let breeds = "";
    //         if (breedArray.length === 1) {
    //             breeds = breedArray[0];
    //         }
    //         else {
    //             breedArray.forEach(function (breed) {
    //                 breeds += breed + ', ';
    //             });
    //             breeds.slice(0, breeds.length - 2);
    //         }

    //         const aBite = new Bite(parseInt(biteData[0]), biteData[1], biteData[2], breeds, parseInt(biteData[4+moreBreed]), biteData[5+moreBreed], (biteData[6+moreBreed] === 'true'), biteData[7+moreBreed], parseInt(biteData[8+moreBreed]));
    //         listOfBites.push(aBite);
    //     });
    //     const biteFunc = require('./bitefunc');
    //     console.log(biteFunc.main(listOfBites));
    // });


    getData('c86d267e9c6c89416bf9e96ba7fa62a4ba1ec93f');
}

data();
