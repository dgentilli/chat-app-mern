/**
 * Messages API
 * https://expressjs.com/en/guide/routing.html
 */

/** Router for our API routes*/
const express = require("express");
const router = express.Router();

/**Model*/
const Message = require("../models/Message");

/**pass SocketIO instance so it can be accessed from API endpoints*/
module.exports = function(io) {
  /**TEST 'messages' API route
   * @route   GET '/api/messages/test'
   */
  router.get("/test", (req, res) =>
    res.json({ msg: "Messages API test works!" })
  );

  /**Create new message
   *@route   POST '/api/messages'
   */
  router.post("/", function(req, res) {
    let msgData = {};

    if (!req.body.message) {
      let errMsg =
        'Please provide message text in the request body {text: "message text"}';
      res.json({ err: errMsg });
    } else {
      msgData["body"] = req.body.message;
      if (req.body.user) msgData["user"] = req.body.user;

      const newMessage = new Message(msgData);

      newMessage.save().then(msg => {
        res.json(msg);

        io.emit("chat message", req.body);
      });
    }
  });

  /**  Fetch filtered messages
   *@route   PUT '/api/messages'
   */
  router.put("/", (req, res) => {
    let filter = {};
    try {
      if (req.body.userId) {
        filter.user = { _id: req.body.userId };
      }
    } catch (error) {
      console.error(error);
    }

    Message.find(filter)
      .populate("user")
      .exec(function(err, messages) {
        messages = messages.filter(function(msg) {
          return msg.user;
        });

        res.send(messages);
      });
  });

  /**Delete a message by id
   * @route   DELETE 'api/messages/:id'
   */
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
