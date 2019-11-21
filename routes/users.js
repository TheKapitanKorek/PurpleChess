const mongoose = require("mongoose");
const User = mongoose.model("users");
const Game = mongoose.model("games");
module.exports = (rootRoute, app) => {
  app.patch(rootRoute + "/set_nickname", async (req, res) => {
    const user = req.user;
    const nickname = req.body.nick;
    if (!user) {
      return res.send("you must be loged in");
    }
    if (user.nick !== "new_User") {
      return res.send("you cant change your nickname");
    }
    if (nickname === "new_User") {
      return res.send("you cant change nickname to new_User");
    }
    const nicknameTaken = await User.findOne({ nick: nickname });
    if (nicknameTaken) {
      return res.send("taken");
    }
    user.nick = nickname;
    const updatedUser = await user.save();
    res.send(updatedUser);
  });
  app.get(rootRoute + "/friend_invs", (req, res) => {
    return res.send(req.user.friendInvs);
  });
  app.get(rootRoute + "/friends", (req, res) => {
    return res.send(req.user.friends);
  });
  app.get(rootRoute + "/game_invs", (req, res) => {
    return res.send(req.user.gameInvs);
  });
  app.get(rootRoute + "/games", async (req, res) => {
    const gameIDs = req.user.games;
    res.send(gameIDs);
  });
  //sending friend requests
  app.patch(rootRoute + "/add_friend/:nick", async (req, res) => {
    destinationUser = await User.findOne({ nick: req.params.nick });
    if (
      req.params.nick === "newUser" ||
      req.params.nick === "" ||
      !destinationUser
    ) {
      return res.send("such user does not exist");
    } else if (destinationUser.friends.indexOf(req.user.nick) !== -1) {
      return res.send("already a friends of yours");
    } else if (req.user.friendInvs.indexOf(destinationUser.nick) !== -1) {
      return res.send("this user has alread invited you");
    }
    destinationUser.friendInvs.push(req.user.nick);
    await destinationUser.save();
    res.send("request successfully sent");
  });
  //sending game requests
  app.patch(rootRoute + "/game_inv/:nick", async (req, res) => {
    if (req.user.friends.indexOf(req.params.nick) === -1) {
      return res.status(400).send("not your homie dont act like you know me");
    }
    const friend = await User.findOne({ nick: req.params.nick });
    friend.gameInvs.push(req.user.nick);
    await friend.save();
    res.send("done");
  });
  //deleting game requsets
  app.delete(rootRoute + "/delete_game_inv/:nick", async (req, res) => {
    if (req.user.gameInvs.indexOf(req.params.nick) < 0) {
      return res.send("no object that can be deleted");
    }
    req.user.gameInvs.splice(req.user.gameInvs.indexOf(req.params.nick), 1);
    await req.user.save();

    res.send("done");
  });
  //deleting friend requests
  app.delete(rootRoute + "/delete_friend_inv/:nick", async (req, res) => {
    if (req.user.friendInvs.indexOf(req.params.nick) < 0) {
      return res.send("no object that can be deleted");
    }
    req.user.friendInvs.splice(req.user.friendInvs.indexOf(req.params.nick), 1);
    await req.user.save();
    res.send("done");
  });
  //accepting friends
  app.patch(rootRoute + "/accept_friend/:nick", async (req, res) => {
    if (req.user.friendInvs.indexOf(req.params.nick) < 0) {
      return res.send("no invitation");
    }
    const friend = await User.findOne({ nick: req.params.nick });
    if (!friend) {
      res.send("no such friend sorry");
    }
    friend.friends.push(req.user.nick);
    req.user.friends.push(req.params.nick);
    req.user.friendInvs.splice(req.user.friendInvs.indexOf(req.params.nick), 1);
    await req.user.save();
    await friend.save();
    res.send("done");
  });
  //deleting friends
  app.delete(rootRoute + "/delete_friend/:nick", async (req, res) => {
    if (req.user.friends.indexOf(req.params.nick) < 0) {
      return res.send("no such friend");
    }
    const friend = await User.findOne({ nick: req.params.nick });
    req.user.friends.splice(req.user.friends.indexOf(req.params.nick), 1);
    friend.friends.splice(friend.friends.indexOf(req.user.nick), 1);
    await req.user.save();
    await friend.save();
    res.send("done");
  });
};
