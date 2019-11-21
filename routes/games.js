const mongoose = require("mongoose");
const GameCheck = require("../dataProcessing/game");
const User = mongoose.model("users");
const Game = mongoose.model("games");

module.exports = (rootRoute, app) => {
  app.get(rootRoute + "/open_game/:id", async (req, res) => {
    const game = await Game.findById(req.params.id);
    res.send([game, req.user.id]);
  });

  app.get(rootRoute + "/check_game/:id", async (req, res) => {
    try {
      const info = await Game.findById(req.params.id).select({
        turn: 1,
        lastMove: 1
      });
      res.send(info);
    } catch {
      res.status(400).send("invalid request");
    }
  });

  app.patch(rootRoute + "/make_move", async (req, res) => {
    if (!req.body.move || !req.body.gameID) {
      return res.status(400).send("invalid request");
    }
    if (!req.body.move.dest) {
      return res.status(400).send("invalid request");
    }
    if (
      req.user.games.findIndex(game => game.gameID === req.body.gameID) === -1
    ) {
      return res.status(400).send("no you are not in this game");
    }
    const gameDoc = await Game.findById(req.body.gameID);
    if (
      (gameDoc.turn === "white" && gameDoc.whitePlayerID !== req.user.id) ||
      (gameDoc.turn === "black" && gameDoc.blackPlayerID !== req.user.id)
    ) {
      return res.send("other players move");
    }
    const game = new GameCheck(gameDoc.gameState);
    const pieceID = req.body.move.id;
    const piece = game.board.find(el => el.id === pieceID);
    const destination = [
      parseInt(req.body.move.dest[0]),
      parseInt(req.body.move.dest[1])
    ];

    const possibleMoves = game.choseFn(pieceID);
    if (
      possibleMoves.findIndex(
        move => move[0] === destination[0] && move[1] === destination[1]
      ) === -1
    ) {
      return res.send("invalid move");
    }
    if (piece.color !== gameDoc.turn) {
      return res.send("invalid move");
    }
    const destPiece = game.makeMove(pieceID, destination[0], destination[1]);
    if (destPiece) {
      gameDoc.gameState.splice(
        gameDoc.gameState.findIndex(el => el.id === destPiece.id),
        1
      );
    }
    gameDoc.gameState.splice(
      gameDoc.gameState.findIndex(el => el.id === piece.id),
      1,
      {
        color: piece.color,
        type: piece.type,
        id: piece.id,
        position: { x: destination[0], y: destination[1] }
      }
    );
    gameDoc.turn = gameDoc.turn === "black" ? "white" : "black";
    gameDoc.lastMove = [pieceID, destination];
    const savedGame = await gameDoc.save();
    res.send(savedGame.gameState);
  });
  app.post(rootRoute + "/new_game", async (req, res) => {
    if (req.user.gameInvs.indexOf(req.body.nick) < 0) {
      return res.send("you do not have a game request from tahat person");
    }
    req.user.gameInvs.splice(req.user.gameInvs.indexOf(req.params.name), 1);
    const friend = await User.findOne({ nick: req.body.nick });
    const rand0 = Math.floor(Math.random() * 2) === 0 ? friend.id : req.user.id;
    const rand1 = Math.floor(Math.random() * 2) === 1 ? friend.id : req.user.id;
    const newGame = await new Game({
      blackPlayerID: rand0,
      whitePlayerID: rand1
    }).save();
    req.user.games.push({ gameID: newGame.id, friend: friend.nick });
    friend.games.push({ gameID: newGame.id, friend: req.user.nick });
    await req.user.save();
    await friend.save();
    res.send({ newGame });
  });
  app.delete(rootRoute + "/delete_game/:id", async (req, res) => {
    const game = await Game.findById(req.params.id);
    if (
      game.blackPlayerID === req.user.id ||
      game.whitePlayerID === req.user.id
    ) {
      const black = await User.findById(game.blackPlayerID);
      const white = await User.findById(game.whitePlayerID);
      black.games.splice(black.games.findIndex(el => el.gameID === game.id), 1);
      white.games.splice(white.games.findIndex(el => el.gameID === game.id), 1);
      await black.save();
      await white.save();
      await game.delete();
      res.send("done");
    }
  });
};
