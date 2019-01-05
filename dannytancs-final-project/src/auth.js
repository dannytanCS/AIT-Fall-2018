const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

function register(aUser, errorCallback, successCallback) {
  if (aUser.username.length < 4 || aUser.password.length < 6) {

    errorCallback({ message: 'PASSWORD NEED TO BE AT LEAST 6 CHARACTERS' }); 
  }
  else {
    User.findOne({ username: aUser.username }, (err, result) => {
      if (err) {
        errorCallback({ message: 'ERROR IN FINDING USER IN DATABASE' });
        console.log(err);
      }
      else if (result) {
        errorCallback({ message: 'USERNAME ALREADY EXISTS' });
      }
      else {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) {
            console.log(err);
          }
          else {
            bcrypt.hash(aUser.password, salt, function (err, hash) {
              if (err) {
                console.log(err);
              }
              else {
                const user = new User({
                  username: aUser.username,
                  name: aUser.name,
                  password: hash
                });
                user.save((err) => {
                  if (err) {
                    errorCallback({ message: 'DOCUMENT SAVE ERROR' });
                  }
                  else {
                    successCallback(user);
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}


function login(aUser, errorCallback, successCallback) {
  User.findOne({ username: aUser.username }, (err, user) => {
    if (!err && user) {
      // compare with form password!
      bcrypt.compare(aUser.password, user.password, (err, passwordMatch) => {
        // regenerate session if passwordMatch is true
        if (passwordMatch) {
          successCallback(user);
        }
        else {
          errorCallback({ message: 'PASSWORDS IS INCORRECT' });
        }
      });
    }
    else if (!user) {
      errorCallback({ message: 'USER NOT FOUND' });
    }
  });

}

function startAuthenticatedSession(req, user, cb) {
  req.session.regenerate((err) => {
    if (!err) {
      req.session.user = user;
      cb(err);
    } else {
      // log out errorcall callback with error
      cb(err);
    }
  });
}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};
