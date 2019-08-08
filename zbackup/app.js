"use strict";
const clr = "white";
const newGame = [
  { color: "black", position: [1, 7], type: "pawn", id: "B-P-1" },
  { color: "black", position: [2, 7], type: "pawn", id: "B-P-2" },
  { color: "black", position: [3, 7], type: "pawn", id: "B-P-3" },
  { color: "black", position: [4, 7], type: "pawn", id: "B-P-4" },
  { color: "black", position: [5, 7], type: "pawn", id: "B-P-5" },
  { color: "black", position: [6, 7], type: "pawn", id: "B-P-6" },
  { color: "black", position: [7, 7], type: "pawn", id: "B-P-7" },
  { color: "black", position: [8, 7], type: "pawn", id: "B-P-8" },
  { color: "black", position: [1, 8], type: "rook", id: "B-R-1" },
  { color: "black", position: [8, 8], type: "rook", id: "B-R-2" },
  { color: "black", position: [2, 8], type: "kinght", id: "B-K-1" },
  { color: "black", position: [7, 8], type: "kinght", id: "B-K-2" },
  { color: "black", position: [3, 8], type: "bishop", id: "B-B-1" },
  { color: "black", position: [6, 8], type: "bishop", id: "B-B-2" },
  { color: "black", position: [4, 8], type: "queen", id: "B-Q" },
  { color: "white", position: [5, 8], type: "king", id: "B-K" },
  { color: "white", position: [1, 2], type: "pawn", id: "W-P-1" },
  { color: "white", position: [2, 2], type: "pawn", id: "W-P-2" },
  { color: "white", position: [3, 2], type: "pawn", id: "W-P-3" },
  { color: "white", position: [4, 2], type: "pawn", id: "W-P-4" },
  { color: "white", position: [5, 2], type: "pawn", id: "W-P-5" },
  { color: "white", position: [6, 2], type: "pawn", id: "W-P-6" },
  { color: "white", position: [7, 2], type: "pawn", id: "W-P-7" },
  { color: "white", position: [8, 2], type: "pawn", id: "W-P-8" },
  { color: "white", position: [1, 1], type: "rook", id: "W-R-1" },
  { color: "white", position: [8, 1], type: "rook", id: "W-R-2" },
  { color: "white", position: [2, 1], type: "kinght", id: "W-K-1" },
  { color: "white", position: [7, 1], type: "kinght", id: "W-K-2" },
  { color: "white", position: [3, 1], type: "bishop", id: "W-B-1" },
  { color: "white", position: [6, 1], type: "bishop", id: "W-B-2" },
  { color: "white", position: [4, 1], type: "queen", id: "W-Q" },
  { color: "white", position: [5, 1], type: "king", id: "W-K" }
];
//UI Controller
const UIController = (function() {
  const DOMstrings = {
    verticalCord: document.getElementById("vertical-coordinate"),
    horizontalCord: document.getElementById("horizontal-coordinate"),
    board: document.getElementById("board")
  };
  //function to convert number into letter
  const toLetter = function(numb) {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return letters[numb - 1];
  };

  // change coordinates depending on the player;
  const blackOrWhite = function(color) {
    DOMstrings.board.className = color;
    if (color === "white") {
      DOMstrings.verticalCord.style.flexDirection = "column-reverse";
      DOMstrings.horizontalCord.style.flexDirection = "row";
    } else if (color === "black") {
      DOMstrings.verticalCord.style.flexDirection = "column";
      DOMstrings.horizontalCord.style.flexDirection = "row-reverse";
    }
  };
  //function for displaying pieces
  const displayPiece = function(piece) {
    const html = `<div class="figure" id=${
      piece.id
    } style="grid-area:${toLetter(piece.position["x"])}_${toLetter(
      piece.position["y"]
    )}" clr:${piece.color}>
    <img src="./svgs/${piece.color}-${piece.type}.svg" alt="chess figure" />
  </div>`;
    DOMstrings.board.insertAdjacentHTML("beforeend", html);
  };
  const displayPieces = function(board) {
    board.forEach(el => displayPiece(el));
  };
  //display moves functions

  const displayMove = function(x, y, id) {
    const html = `<div class="move" style="grid-area:${toLetter(x)}_${toLetter(
      y
    )}" x=${x} y=${y} piece="${id}"></div>`;
    DOMstrings.board.insertAdjacentHTML("afterbegin", html);
  };

  //public components
  return {
    gameSetup: function(color, board) {
      DOMstrings.board.innerHTML = "";
      blackOrWhite(color);
      displayPieces(board);
    },
    addEventListeners: function(fn) {
      const figures = DOMstrings.board.querySelectorAll(".figure");
      figures.forEach(el => {
        el.addEventListener("click", fn);
      });
    },
    addEL: function(fn, id) {
      document.getElementById(id).addEventListener("click", fn);
    },
    //display moves
    displayMoves: function(arr, id) {
      arr.forEach(el => {
        displayMove(el[0], el[1], id);
      });
    },
    //remove moves
    removeMoves: function() {
      board.querySelectorAll(".move").forEach(el => {
        el.parentNode.removeChild(el);
      });
    },
    makeMove: function(destinationPiece, piece) {
      if (destinationPiece) {
        const desPiece = document.getElementById(destinationPiece.id);
        desPiece.parentNode.removeChild(desPiece);
      }
      document
        .getElementById(piece.id)
        .parentNode.removeChild(document.getElementById(piece.id));
      displayPiece(piece);
    }
  };
})();
//Backend controller
const AppController = (function() {
  class Game {
    constructor(board) {
      this.board = board.map(
        el => new Figure(el.color, el.position, el.type, el.id)
      );
    }
    makeMove = function(piece, x, y) {
      const destinationPiece = this.board.find(
        el =>
          el.position["x"] === parseInt(x) && el.position["y"] === parseInt(y)
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
      const u = piecesVertical.find(
        el => el.position["y"] > piece.position["y"]
      );
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
      const lR = piecesRising
        .reverse()
        .find(el => el.position["x"] < piece.position["x"]);
      const rR = piecesRising.find(
        el => el.position["x"] > piece.position["x"]
      );
      const lF = piecesFalling
        .reverse()
        .find(el => el.position["x"] < piece.position["x"]);
      const rF = piecesFalling.find(
        el => el.position["x"] > piece.position["x"]
      );
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
  }
  class Figure {
    constructor(color, position, type, id) {
      this.color = color;
      this.position = { x: position[0], y: position[1] };
      this.type = type;
      this.id = id;
    }
  }
  const color = clr;
  return {
    createGame: function(arr) {
      return new Game(arr);
    }
  };
})();
//Global App controller
const Controller = (function(UICtrl, AppCtrl) {
  //create game
  const game = AppCtrl.createGame(newGame);
  // function to find desired target of an event
  const findTarget = function(ev) {
    if (event.target.className === "figure") {
      return ev.target;
    } else {
      return ev.target.parentNode;
    }
  };
  //find moves
  const findMoves = function() {
    const target = findTarget(event);
    const moves = game.choseFn(target.id);
    UICtrl.displayMoves(moves, target.id);
  };
  const checkClick = function() {
    const target = event.target;
    if (target.className === "move") {
      const id = target.getAttribute("piece");
      const x = target.getAttribute("x");
      const y = target.getAttribute("y");
      const destinationPc = game.makeMove(id, x, y);
      const piece = game.board.find(el => el.id === id);
      UICtrl.makeMove(destinationPc, piece);
      UICtrl.addEL(findMoves, piece.id);
      UICtrl.removeMoves();
      //
    } else if (target.id === "board") {
      UICtrl.removeMoves();
    }
  };
  const color = clr;
  //
  const setupEventListeners = function() {
    document.getElementById("board").addEventListener("click", checkClick);
    UICtrl.addEventListeners(findMoves);
  };
  //UICtrl.gameSetup(color);
  return {
    init: function() {
      UICtrl.gameSetup(color, game.board);
      setupEventListeners();
    }
  };
})(UIController, AppController);

Controller.init();

/*
//UI controller
const UIController = (function() {
  return {};
})();
//State Controller
const stateController = (function() {
  return {};
})();
//Global App Controller
const controller = (function(UICtrl, stateCtrl) {})(
  UIController,
  stateController
);
//figures objects
class Figure {
  constructor(color, position) {
    this.color = color;
    this.position = { x: position[0], y: position[1] };
  }
  move() {
    console.log("move");
  }
}

class Rook extends Figure {
  constructor(color, position) {
    super(color, position);
  }
  findMoves() {}
}
// ojshdifbi
let king = new Figure("black", [1, 1]);
let rook1 = new Rook("white", [8, 8]);
console.log(king);
console.log(rook1);

let game = {
  state: [
    new Rook("white", [2, 2]),
    new Rook("white", [6, 2]),
    new Rook("black", [3, 2]),
    new Rook("black", [4, 4])
  ]
};

console.log(game);
let moveType = function(move, activeFig) {
  game1.forEach(figure => {
    if (figure.position[0] === move[0] && figure.position[1] === move[1]) {
      if (figure.color !== activeFig.color) {
      }
    }
  });
  return true;
};
//ROOK MOVES
let addRookMove = (i, x, y, rook) => {
  if (
    game.state.find(
      el =>
        el.position[x] === i &&
        el.position[y] === rook.position[y] &&
        el.color === rook.color
    )
  ) {
    //no more possible moves, break the loop
    return;
  } else if (
    game.state.find(
      el =>
        el.position[x] === i &&
        el.position[y] === rook.position[y] &&
        el.color !== rook.color
    )
  ) {
    //no more possible moves, break the loop and add move to avalivable attacks
    return { type: "attack", position: [i, rook.position[y]] };
  } else {
    //add move to avalivable moves for this figure
    return { type: "move", position: [i, rook.position[y]] };
  }
};

let rookMove = function(rook) {
  let avalivableMoves = [];
  let avalivableAtacks = [];
  //Function finding moves and attacks

  //Horizontal
  for (let i = rook.position["x"] + 1; i++; i <= 8 && i >= 1) {
    const move = addRookMove(i, "x", "y", rook);
    if (move.type === "move") {
      avalivableMoves.push(move.position);
    } else if (move.type === "attack") {
      avalivableAtacks.push(move.position);
    } else {
      break;
    }
  }
  for (let i = rook.position["x"] - 1; i--; i >= 1 && i <= 8) {
    const move = addRookMove(i, "x", "y", rook);
    if (move.type === "move") {
      avalivableMoves.push(move.position);
    } else if (move.type === "attack") {
      avalivableAtacks.push(move.position);
    } else {
      break;
    }
  }
  //Vertical
  for (let i = rook.position["y"] + 1; i++; i <= 8 && i >= 1) {
    const move = addRookMove(i, "x", "y", rook);
    if (move.type === "move") {
      avalivableMoves.push(move.position);
    } else if (move.type === "attack") {
      avalivableAtacks.push(move.position);
    } else {
      break;
    }
  }
  for (let i = rook.position["y"] - 1; i--; i >= 1 && i <= 8) {
    const move = addRookMove(i, "x", "y", rook);
    if (move.type === "move") {
      avalivableMoves.push(move.position);
    } else if (move.type === "attack") {
      avalivableAtacks.push(move.position);
    } else {
      break;
    }
  }

  return [avalivableMoves, avalivableAtacks];
};
console.log(rookMove(game.state[0]));
*/
