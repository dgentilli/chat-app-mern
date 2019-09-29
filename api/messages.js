/**
 * Messages API
 * https://expressjs.com/en/guide/routing.html
 */

// Router for our API routes
const express = require("express");
const router = express.Router();

// Model
const Message = require("../models/Message");

// pass SocketIO instance so it can be accessed from API endpoints
module.exports = function(io) {
  // TEST 'messages' API route
  // @route   GET '/api/messages/test'
  router.get("/test", (req, res) =>
    res.json({ msg: "Messages API test works!" })
  );

  // Create new message
  // @route   POST '/api/messages'
  router.post("/", function(req, res) {
    // message data
    let msgData = {};

    // handle empty message
    if (!req.body.message) {
      let errMsg =
        'Please provide message text in the request body {text: "message text"}';
      res.json({ err: errMsg });

      // create new message
    } else {
      //populating fields in message schema
      msgData["body"] = req.body.message;
      if (req.body.user) msgData["user"] = req.body.user;

      //New Message instance (populating Mongoose model to save to database)
      const newMessage = new Message(msgData);

      //Mongoose: saving to database, returning saved document
      newMessage.save().then(msg => {
        res.json(msg);

        // SocketIO -- let clients know that a new chat message was created
        io.emit("chat message", req.body);
      });
    }
  });

  // Fetch filtered messages
  // @route   PUT '/api/messages'
  router.put("/", (req, res) => {
    // Filtering
    let filter = {};

    // if request includes "user" filter, filter messages by user id (using try...catch so app doesn't crash when there's no req.body)
    try {
      if (req.body.userId) {
        filter.user = { _id: req.body.userId };
      }
    } catch (error) {
      console.error(error);
    }

    // Find & return messages that satisfy filter criteria
    Message.find(filter)
      // populate user object data, based on user ObjectId
      .populate("user")
      .exec(function(err, messages) {
        // if (err) return handleError(err);

        // filter out user 'null' messages (fallback when userId filter is null)
        messages = messages.filter(function(msg) {
          return msg.user;
        });

        res.send(messages);
      });
  });

  // Delete a message by id
  // @route   DELETE 'api/messages/:id'
  router.delete("/:id", (req, res) => {
    Message.findById(req.params.id)
      .then(msg => {
        // Delete
        msg.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ msgnotfound: "No message found for that ID" })
      );
  });

  return router;
};
