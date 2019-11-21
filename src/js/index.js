//create game
import Game from "./models/Game";
import UICtrl from "./views/chess";
import APIinteraction from "./api/api";
let game;

//let color = clr;
// function to find desired target of an event
const findTarget = function(ev) {
  if (event.target.className === "figure") {
    return ev.target;
  } else {
    return ev.target.parentNode;
  }
};
const changeTurn = turn => (turn === "white" ? "black" : "white");
const findTargetID = function(ev) {
  if (ev.target.className === "button") {
    return ev.target.id;
  } else {
    return ev.target.parentNode.id;
  }
};
//find moves
const findMoves = function(game, color) {
  if (game.turn === color) {
    UICtrl.removeMoves();
    const target = findTarget(event);
    if (target.getAttribute("clr") === color) {
      const moves = game.choseFn(target.id);
      UICtrl.displayMoves(moves, target.id);
    }
  }
};
const checkClick = async function(game) {
  const target = event.target;
  if (target.className === "move") {
    const id = target.getAttribute("piece");
    const x = target.getAttribute("x");
    const y = target.getAttribute("y");
    const destinationPc = game.makeMove(id, x, y);
    const piece = game.board.find(el => el.id === id);
    UICtrl.makeMove(piece, destinationPc);
    UICtrl.addEL(findMoves, piece.id);
    UICtrl.removeMoves();
    game.turn = changeTurn(game.turn);
    const move = {
      id: id,
      dest: [x, y]
    };
    await APIinteraction.makeMove(game.gameID, move);
    waitForMove(game);
  } else if (target.id === "board") {
    UICtrl.removeMoves();
  }
};
const waitForMove = async function(game) {
  try {
    const lastTurn = await game.on();
    const id = lastTurn[0];
    const x = lastTurn[1][0];
    const y = lastTurn[1][1];
    const destinationPc = game.makeMove(id, x, y);
    const piece = game.board.find(el => el.id === id);
    UICtrl.makeMove(piece, destinationPc);
    UICtrl.addEL(findMoves, piece.id);
    game.turn = changeTurn(game.turn);
  } catch {
    console.log("function suspended");
  }
};
//
const setupEventListenersGame = function(game, color) {
  document.getElementById("board").addEventListener("click", function() {
    checkClick(game, color);
  });
  UICtrl.addEventListeners(function() {
    findMoves(game, color);
  });
};
const setupEventListenersProfile = function() {
  document
    .getElementById("set_nick")
    .addEventListener("click", APIinteraction.setNickname);
  ["friend_btn", "friends_btn", "game_btn", "games_btn"].forEach(el => {
    document.getElementById(el).addEventListener("click", event => {
      APIinteraction.displayCategory(findTargetID(event));
    });
  });
};
//UICtrl.gameSetup(color);

const init = function() {
  //UICtrl.gameSetup(color, game.board);
  //setupEventListenersGame();
  setupEventListenersProfile();
  UICtrl.displayProfile();
};
const gameInit = function(requestedGame, color) {
  if (game) {
    game.off();
  }
  game = new Game(
    requestedGame.gameState,
    requestedGame.turn,
    requestedGame._id,
    color
  );
  UICtrl.gameSetup(color, game);
  setupEventListenersGame(game, color);
  if (game.turn !== game.userColor) {
    waitForMove(game);
  }
};
init();
export default { gameInit };
