const User = require('../models/User.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({
        message: 'User created!',
        result: result
      });
    })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
}

module.exports.postUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "User not found"
        });
      }
      fetchedUser = user;
      bcrypt.compare(req.body.password, user.password)
        .then(result => {
          if (!result) {
            return res.status(401).json({
              message: "Wrong password"
            });
          }
          const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
            'secret_this_should_be_longer');
          res.status(200).json({
            token: token
          });
        })
    })
    .catch(err => {
      return res.status(401).json({
        message: err
      });
    });
}
