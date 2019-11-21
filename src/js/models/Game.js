import PORT from "../api/port";
import axios from "axios";
class Game {
  constructor(board, turn, id, color) {
    this.board = board;
    this.turn = turn;
    this.gameID = id;
    this.userColor = color;
    this.switch = "off";
  }
  makeMove = function(piece, x, y) {
    const destinationPiece = this.board.find(
      el => el.position["x"] === parseInt(x) && el.position["y"] === parseInt(y)
    );
    if (destinationPiece) {
      this.board.splice(this.board.indexOf(destinationPiece), 1);
    }
    this.board.find(el => el.id === piece).position["x"] = parseInt(x);
    this.board.find(el => el.id === piece).position["y"] = parseInt(y);
    return destinationPiece;
  };
  choseFn = function(id) {
    const type = this.board.find(el => el.id === id).type;
    switch (type) {
      case "king":
        return this.findKingMoves(id);
      case "queen":
        return [...this.findBishopMoves(id), ...this.findRookMoves(id)];
      case "rook":
        return this.findRookMoves(id);
      case "kinght":
        return this.findKinghtMoves(id);
      case "bishop":
        return this.findBishopMoves(id);
      case "pawn":
        return this.findPawnMoves(id);
    }
  };
  findRookMoves = function(id) {
    const piece = this.board.find(el => el.id === id);
    const moves = [];
    //finding pieces on rooks path
    const piecesVertical = this.board
      .filter(el => el.position["x"] === piece.position["x"])
      .sort((a, b) => a.position["y"] - b.position["y"]);

    const piecesHorizontal = this.board
      .filter(el => el.position["y"] === piece.position["y"])
      .sort((a, b) => a.position["x"] - b.position["x"]);
    //finding movement borders
    const r = piecesHorizontal.find(
      el => el.position["x"] > piece.position["x"]
    );
    const l = piecesHorizontal
      .reverse()
      .find(el => el.position["x"] < piece.position["x"]);
    const u = piecesVertical.find(el => el.position["y"] > piece.position["y"]);
    const d = piecesVertical
      .reverse()
      .find(el => el.position["y"] < piece.position["y"]);
    //
    let left, right, down, up;
    left = !l
      ? 1
      : l.color !== piece.color
      ? l.position["x"]
      : l.position["x"] + 1;
    right = !r
      ? 8
      : r.color !== piece.color
      ? r.position["x"]
      : r.position["x"] - 1;
    down = !d
      ? 1
      : d.color !== piece.color
      ? d.position["y"]
      : d.position["y"] + 1;
    up = !u
      ? 8
      : u.color !== piece.color
      ? u.position["y"]
      : u.position["y"] - 1;
    //defining all possible moves
    //horizontal moves
    for (let i = left; i <= right; i++) {
      if (piece.position["x"] !== i) {
        moves.push([i, piece.position["y"]]);
      }
    }
    //vertical moves
    for (let i = down; i <= up; i++) {
      if (piece.position["y"] !== i) {
        moves.push([piece.position["x"], i]);
      }
    }
    return moves;
  };
  findBishopMoves = function(id) {
    const piece = this.board.find(el => el.id === id);
    const moves = [];
    //finding pieces on bishops path
    const piecesRising = this.board
      .filter(
        el =>
          el.position["x"] - el.position["y"] ===
          piece.position["x"] - piece.position["y"]
      )
      .sort((a, b) => a.position["x"] - b.position["x"]);
    const piecesFalling = this.board
      .filter(
        el =>
          el.position["x"] + el.position["y"] ===
          piece.position["x"] + piece.position["y"]
      )
      .sort((a, b) => a.position["x"] - b.position["x"]);
    //finding movement borders
    const rR = piecesRising.find(el => el.position["x"] > piece.position["x"]);
    const lR = piecesRising
      .reverse()
      .find(el => el.position["x"] < piece.position["x"]);
    const rF = piecesFalling.find(el => el.position["x"] > piece.position["x"]);
    const lF = piecesFalling
      .reverse()
      .find(el => el.position["x"] < piece.position["x"]);
    //
    let lRising, rRising, lFalling, rFalling;
    lRising = !lR
      ? piece.position["x"] - piece.position["y"] <= 0
        ? 1
        : piece.position["x"] - piece.position["y"] + 1
      : lR.color !== piece.color
      ? lR.position["x"]
      : lR.position["x"] + 1;
    //
    rRising = !rR
      ? piece.position["y"] - piece.position["x"] <= 0
        ? 8
        : piece.position["x"] - piece.position["y"] + 8
      : rR.color !== piece.color
      ? rR.position["x"]
      : rR.position["x"] + -1;
    //
    lFalling = !lF
      ? piece.position["x"] + piece.position["y"] <= 9
        ? 1
        : piece.position["x"] + piece.position["y"] - 8
      : lF.color !== piece.color
      ? lF.position["x"]
      : lF.position["x"] + 1;
    rFalling = !rF
      ? piece.position["x"] + piece.position["y"] >= 9
        ? 8
        : piece.position["x"] + piece.position["y"] - 1
      : rF.color !== piece.color
      ? rF.position["x"]
      : rF.position["x"] - 1;
    //defining all possible moves
    for (let i = lRising; i <= rRising; i++) {
      if (piece.position["x"] !== i) {
        moves.push([i, piece.position["y"] - piece.position["x"] + i]);
      }
    }
    for (let i = lFalling; i <= rFalling; i++) {
      if (piece.position["x"] !== i) {
        moves.push([i, piece.position["y"] + piece.position["x"] - i]);
      }
    }
    return moves;
  };
  findPawnMoves = function(id) {
    const piece = this.board.find(el => el.id === id);
    let moves = [];
    const attacks = this.board.filter(el => {
      if (piece.color === "white") {
        return (
          el.position["y"] === piece.position["y"] + 1 &&
          Math.abs(piece.position["x"] - el.position["x"]) === 1 &&
          el.color === "black"
        );
      } else if (piece.color === "black") {
        return (
          el.position["y"] === piece.position["y"] - 1 &&
          Math.abs(piece.position["x"] - el.position["x"]) === 1 &&
          el.color === "white"
        );
      }
    });
    //white case
    if (piece.color === "white") {
      //check if piece is free go to one step forward
      if (
        !this.board.find(
          el =>
            el.position["x"] === piece.position["x"] &&
            el.position["y"] === piece.position["y"] + 1
        )
      ) {
        //add move
        moves.push([piece.position["x"], piece.position["y"] + 1]);
        //check if piece is free and in position go to two steps forward
        if (
          piece.position["y"] === 2 &&
          !this.board.find(
            el =>
              el.position["x"] === piece.position["x"] &&
              el.position["y"] === piece.position["y"] + 2
          )
        ) {
          //add move
          moves.push([piece.position["x"], piece.position["y"] + 2]);
        }
      }
      //adding attack moves
      if (attacks) {
        attacks.forEach(el => {
          moves.push([el.position["x"], el.position["y"]]);
        });
      }
      //black case
    }
    //black case
    else if (piece.color === "black") {
      //check if piece is free go to one step forward
      if (
        !this.board.find(
          el =>
            el.position["x"] === piece.position["x"] &&
            el.position["y"] === piece.position["y"] - 1
        )
      ) {
        //add move
        moves.push([piece.position["x"], piece.position["y"] - 1]);
        //check if piece is free and in position go to two steps forward
        if (
          piece.position["y"] === 7 &&
          !this.board.find(
            el =>
              el.position["x"] === piece.position["x"] &&
              el.position["y"] === piece.position["y"] - 2
          )
        ) {
          //add move
          moves.push([piece.position["x"], piece.position["y"] - 2]);
        }
      }
      //adding attack moves
      if (attacks) {
        attacks.forEach(el => {
          moves.push([el.position["x"], el.position["y"]]);
        });
      }
    }
    return moves;
  };
  findKinghtMoves = function(id) {
    const piece = this.board.find(el => el.id === id);
    let moves = [];
    const kinghtVectors = [
      [-1, 2],
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
      [-2, 1]
    ];
    kinghtVectors.forEach(el => {
      const newPositionX = piece.position["x"] + el[0];
      const newPositionY = piece.position["y"] + el[1];
      if (
        newPositionX > 0 &&
        newPositionX < 9 &&
        newPositionY > 0 &&
        newPositionY < 9
      ) {
        if (
          !this.board.find(
            elem =>
              elem.position["x"] === newPositionX &&
              elem.position["y"] === newPositionY &&
              elem.color === piece.color
          )
        ) {
          moves.push([newPositionX, newPositionY]);
        }
      }
    });
    return moves;
  };
  findKingMoves = function(id) {
    const piece = this.board.find(el => el.id === id);
    let moves = [];
    const kingVectors = [
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0]
    ];
    kingVectors.forEach(el => {
      const newPositionX = piece.position["x"] + el[0];
      const newPositionY = piece.position["y"] + el[1];
      if (
        newPositionX > 0 &&
        newPositionX < 9 &&
        newPositionY > 0 &&
        newPositionY < 9
      ) {
        if (
          !this.board.find(
            elem =>
              elem.position["x"] === newPositionX &&
              elem.position["y"] === newPositionY &&
              elem.color === piece.color
          )
        ) {
          moves.push([newPositionX, newPositionY]);
        }
      }
    });
    return moves;
  };
  //experimental
  on = async function() {
    this.switch = "on";
    while (this.switch === "on") {
      console.log("kaczorek");
      const response = await makePromise(this.gameID);
      if (response.turn === this.userColor) {
        this.switch = "off";
        return response.lastMove;
      }
    }
  };
  off = function() {
    this.switch = "off";
  };
}
const makePromise = function(gameID) {
  return new Promise((resolve, reject) => {
    setTimeout(async function() {
      const response = await axios.get(
        PORT + "/api/games/check_game/" + gameID
      );
      resolve(response.data);
    }, 1000);
  });
};
export default Game;
