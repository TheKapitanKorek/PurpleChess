//create game
const clr = "white";
const trn = "white";
import newGame from "./models/newGame";
import Game from "./models/Game";
import UICtrl from "./views/chess";
const color = clr;
let turn = trn;
const game = new Game(newGame);
// function to find desired target of an event
const findTarget = function(ev) {
  if (event.target.className === "figure") {
    return ev.target;
  } else {
    return ev.target.parentNode;
  }
};
const changeTurn = turn => (turn === "black" ? "white" : "black");
//find moves
const findMoves = function() {
  if (turn === color) {
    UICtrl.removeMoves();
    const target = findTarget(event);
    if (target.getAttribute("clr") === color) {
      const moves = game.choseFn(target.id);
      UICtrl.displayMoves(moves, target.id);
    }
  }
};
const checkClick = function() {
  const target = event.target;
  if (target.className === "move") {
    console.log(target);
    const id = target.getAttribute("piece");
    const x = target.getAttribute("x");
    const y = target.getAttribute("y");
    const destinationPc = game.makeMove(id, x, y);
    const piece = game.board.find(el => el.id === id);
    UICtrl.makeMove(destinationPc, piece);
    UICtrl.addEL(findMoves, piece.id);
    UICtrl.removeMoves();
    console.log(turn);
    turn = changeTurn(turn);
    console.log(turn);
    //
  } else if (target.id === "board") {
    UICtrl.removeMoves();
  }
};

//
const setupEventListeners = function() {
  document.getElementById("board").addEventListener("click", checkClick);
  UICtrl.addEventListeners(findMoves);
};
//UICtrl.gameSetup(color);

const init = function() {
  UICtrl.gameSetup(color, game.board);
  setupEventListeners();
};
init();
