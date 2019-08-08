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
  const html = `<div class="figure" id=${piece.id} style="grid-area:${toLetter(
    piece.position["x"]
  )}_${toLetter(piece.position["y"])}" clr="${piece.color}">
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
export default {
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
