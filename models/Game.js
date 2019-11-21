const newGame = require("../dataProcessing/newGameDafault");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const gameSchema = new Schema({
  blackPlayerID: { type: String, required: true },
  whitePlayerID: { type: String, required: true },
  gameState: { type: Array, required: true, default: newGame },
  turn: { type: String, required: true, default: "white" },
  lastMove: { type: Array, required: true, default: [] }
});
mongoose.model("games", gameSchema);
