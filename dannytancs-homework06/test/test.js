// require('../src/db.js');
// const auth = require('../src/auth.js');
// auth.register('testtest', 'test@test.test', 'testtest',
//   function(err) {console.log(err);},
//   function(user) {console.log(user);}
// );

require('../src/db.js');
const auth = require('../src/auth.js');
// assuming the user, testtest was already registered previously
auth.login('testtest', 'testtest',
  function(err) {console.log(err);},
  function(user) {console.log(user);}
);