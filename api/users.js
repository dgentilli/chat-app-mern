/**
 * Messages API
 * https://expressjs.com/en/guide/routing.html
 */

/**Router for our API routes */

const express = require("express");
const router = express.Router();

/**Passport and bcrypt*/
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport"); //Do I need this?

/**Load Input Validation*/
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

/**  Model */
const User = require("../models/User");

/**pass SocketIO instance so it can be accessed from API endpoints*/
module.exports = users = function(io) {
  /** Test Users API route
   * @route   GET '/api/users/test'
   */
  router.get("/test", (req, res) => res.json({ msg: "Users API test works!" }));

  /**Register user
   * @route   POST '/api/users/register'
   */
  router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (!req.body.email) {
      let errMsg =
        "Please provide user data in the request body {email: email@address.com}";
      return res.status(400).json({ err: errMsg });
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ err: "Email already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(usr => {
                res.json(usr);

                io.emit("chat user", req.body);
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  });

  /**Login user
   * @route   POST '/api/users/login'
   * @ access Public
   */
  router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
      if (!user) {
        return res.status(400).json({
          success: false,
          token: null,
          _id: null,
          email: null,
          msg: "Email not found. Please Sign Up!"
        });
      }

      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            email: user.email
          };

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
  });

  /**  Fetch all users
   *@route   GET '/api/users'
   */
  router.get("/", (req, res) => {
    User.find({})
      .populate("user")
      .exec(function(err, users) {
        res.send(users);
      });
  });

  /**Delete a user by id
   * @route   DELETE '/api/users/:id'
   */
  router.delete("/:id", (req, res) => {
    User.findById(req.params.id)
      .then(user => {
        user.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ usernotfound: "No user found for that ID" })
      );
  });

  return router;
};
