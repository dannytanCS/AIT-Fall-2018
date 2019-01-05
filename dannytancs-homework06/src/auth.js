const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

function register(username, email, password, errorCallback, successCallback) {
  if (username.length < 8 || password.length < 8) {
    errorCallback({ message: 'USERNAME OR PASSWORD TOO SHORT' }); 
  }
  else {
    User.findOne({ username: username }, (err, result) => {
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
            bcrypt.hash(password, salt, function (err, hash) {
              if (err) {
                console.log(err);
              }
              else {
                const user = new User({
                  username: username,
                  email: email,
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


function login(username, password, errorCallback, successCallback) {
  User.findOne({ username: username }, (err, user) => {
    if (!err && user) {
      // compare with form password!
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        // regenerate session if passwordMatch is true
        if (passwordMatch) {
          successCallback(user);
        }
        else {
          errorCallback({ message: 'PASSWORDS DO NOT MATCH' });
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
