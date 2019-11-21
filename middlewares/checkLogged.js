const mongoose = require("mongoose");
const User = mongoose.model("users");
module.exports = async function(req, res, next) {
  if (req.user) {
    if (req.user.nick !== "new_User") {
      next();
    } else {
      return res.status(400).send("change your nickname you little hacker :>");
    }
  } else {
    return res.status(400).send("access denied");
  }
};
