const mongoose = require("mongoose");
const { Schema } = mongoose;
const messageSchema = new Schema({
  recipientID: { type: String, required: true },
  senderID: { type: String, required: true },
  subject: { type: String, required: true }
});
mongoose.model("messages", messageSchema);
