const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  googleID: String,
  nick: {
    type: String,
    required: true,
    default: "new_User",
    minlength: 3,
    maxlength: 20
  },
  games: { type: Array, required: true, default: [] },
  gameInvs: { type: Array, required: true, default: [] },
  friends: { type: Array, required: true, default: [] },
  friendInvs: { type: Array, required: true, default: [] }
});
mongoose.model("users", userSchema);
