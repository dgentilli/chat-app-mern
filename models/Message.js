/**
 * Message Model
 * https://mongoosejs.com/docs/guide.html#models
 * https://mongoosejs.com/docs/populate.html
 * https://mongoosejs.com/docs/schematypes.html#objectids
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const User = require("./User");

var messageSchema = new Schema({
  body: String,
  created: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = Message = mongoose.model("Message", messageSchema);
