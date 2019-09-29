/**
 * Messages API
 * https://expressjs.com/en/guide/routing.html
 */

// Router for our API routes
const express = require("express");
const router = express.Router();
//Passport and bcrypt
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport"); //Do I need this?

//Load Input Validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Model
const User = require("../models/User");

// pass SocketIO instance so it can be accessed from API endpoints
module.exports = users = function(io) {
  //Test Users API route
  // @route   GET '/api/users/test'
  router.get("/test", (req, res) => res.json({ msg: "Users API test works!" }));

  // TEST: Create new user (no passport)
  // @route   POST '/api/users'
  router.post("/", function(req, res) {
    // ToDo: server error handling

    // handle empty user
    if (!req.body.email) {
      let errMsg =
        "Please provide user data in the request body {email: email@address.com}";
      res.json({ err: errMsg });

      // create new user
    } else {
      const newUser = new User({
        email: req.body.email
      });

      newUser.save().then(usr => {
        res.json(usr);
      });
    }
  });

  // Register user
  // @route   POST '/api/users/register'
  router.post("/register", (req, res) => {
    // ToDo: Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // handle empty user email
    if (!req.body.email) {
      let errMsg =
        "Please provide user data in the request body {email: email@address.com}";
      return res.status(400).json({ err: errMsg });
    }

    // check for existing user with the email provided
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ err: "Email already exists" });
      } else {
        // create new user
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(usr => {
                res.json(usr);

                // SocketIO -- let clients know that a new chat user was created
                io.emit("chat user", req.body);
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  });

  // Login user
  // @route   POST '/api/users/login'
  // @ access Public
  router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    //Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(400).json({
          success: false,
          token: null,
          _id: null,
          email: null,
          msg: "Email not found. Please Sign Up!"
        });
      }

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create Passport JWT Payload
          const payload = {
            id: user.id,
            email: user.email
          };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                _id: user.id,
                email: user.email
              });
            }
          );
        } else {
          return res.status(400).json({
            success: false,
            token: null,
            _id: null,
            email: null,
            msg: "Password incorrect"
          });
        }
      });
    });
  }); //END LOGIN ROUTE

  // Fetch all users
  // @route   GET '/api/users'
  router.get("/", (req, res) => {
    User.find({})
      // populate user object data, based on user ObjectId
      .populate("user")
      .exec(function(err, users) {
        //if (err) return handleError(err);
        res.send(users);
      });
  });

  // Delete a user by id
  // @route   DELETE '/api/users/:id'
  router.delete("/:id", (req, res) => {
    User.findById(req.params.id)
      .then(user => {
        // Delete
        user.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ usernotfound: "No user found for that ID" })
      );
  });

  //module.exports = router;
  return router;
};
