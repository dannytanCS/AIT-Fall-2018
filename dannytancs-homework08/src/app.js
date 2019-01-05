const express = require("express");
const path = require("path");
const app = express();
require("./db");
const mongoose = require("mongoose");
const Smashing = mongoose.model("Smashing");
const publicPath = path.resolve(__dirname, "public");

app.use(express.static(publicPath));
// use this if you're expecting the body to be json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// helper function to get today's date
function nowAsString() {
  return new Date().toISOString().substring(0, 10);
}

// helper functions to count the letters in a string
function countLetters(smashingText) {
  const counts = smashingText.split("").reduce(
    (counts, letter) => ({
      ...counts,
      [letter]: letter in counts ? counts[letter] + 1 : 1
    }),
    {}
  );
  return Object.entries(counts).map(([letter, count]) => ({ letter, count }));
}

// GET /api/smashings
// returns a JSON list of keyboard smashings objects with each object
// containing the following fields:
// * smashingText
// * length
// * sentiment
// * date
//
// if there is a query string, filter the results using that query string
//
// example: 
// GET /api/smashings?lengthGt=2&lengthLt=55555 
//
// (note that smashings is plural, not singular!)
//
// results in the following json response:
// [
//   {smashingText: 'aaa', length: 3, etc.}, 
//   {smashingText: 'asdf', length: 4, etc.}
// ]
app.get("/api/smashings", (req, res) => {
  // parse the incoming query parameters to make the filtering form
  // on the frontend part functional

  // set up mapping of req.query keys and their associated mongoose/mongodb
  // query objects
  const filterFields = {
    lengthGt: target => ({ length: { $gt: target } }),
    lengthLt: target => ({ length: { $lt: target } }),
    sentimentGt: target => ({ sentiment: { $gt: target } }),
    sentimentLt: target => ({ sentiment: { $lt: target } }),
    dateGt: target => ({ date: { $gt: target } }),
    dateLt: target => ({ date: { $lt: target } })
  };

  // build a single query object, called q, using mappings above
  // for example, q may be: {$and: [length: {$gt: 10}, sentiment {$gt: 0.23}]}
  // ...and it can be used in a mongoose "query" to search for documents
  const q = Object.keys(req.query).length > 0 ? {
    $and: Object.entries(req.query)
      .map(([field, val]) => filterFields[field](val))
  } : {};

  // TODO: 
  // find documents and send back a response
  //
  // * use the query object, q, above to search for matching documents in the
  //   smashings collection
  // * give back the result as json... it should be an Array of smashing
  //   objects: [{smashingText: 'aaa', length: 3, etc.}, etc.] (which is 
  //   essentially what the result set will be when the query finishes)
  Smashing.find(q, function (err, smashings) {
    if (!err) {
      res.json(smashings); //found and sending back smashing //use of mapping is to eliminate some fields since it is not displayed
    }
  })
});

// POST /api/smashings
//
// (note, singular, not plural!)
//
// creates a new keyboard smashing document in the database by using
// the post body (whose content type is the same as if it were 
// submitted through a form: application/x-www-form-urlencoded)
//
// * this only expects a single value, the string entered in the form's
// textarea
// * all of the other fields will be calculated based on that single
//   value
// * it should return a response in json , with {_code: 'OK'} if document
//   is successfully saved
//
// example: 
// POST /api/smashing  with body smashingText='asdf'
//
// results in the following json response:
// {"_code": "OK"} or {"_code": "ERROR"} depending on if document was
// successfully saved
app.post("/api/smashing", (req, res) => {
  // TODO: 
  // use the parses incoming POST request body (this should be done by
  // the middleware) to create a new document and save it to the database:
  //
  // * see db.js for the properties required for a Smashing document
  // * make sure to include the original keyboard smashing text, called
  //   smashingText
  // * use the nowAsString function defined at the beginning of this file
  //   to set the date of the submission in YYYY-MM-DD format
  // * use the countLetters function defined at the beginning of this file
  //   to set the letterCounts property, which should be an array of 
  //   objects that look similar to this:{letter: "h", count: 8}
  //   (simply use the return result from the function as is)
  // * generate a random floating point number between 0 and 1 to
  //   assign to the sentiment property 
  // * make sure you send a response as soon as the data is saved
  //   ... the response should be {_code: "OK"} if the document is saved
  //   ... or {_code: "ERROR"} if an error occurred while saving
  const s = new Smashing({
    smashingText: req.body.smashingText,
    length: req.body.smashingText.length,
    letterCounts: countLetters(req.body.smashingText),
    sentiment: Math.random(),
    date: nowAsString(),
  });
  s.save(function (err, savedObj) {
    if (err) {
      res.json({ "_code": 'ERROR' })
    } else {
      res.json({ "_code": 'OK' })
    }
  });
});

app.listen(3000);
