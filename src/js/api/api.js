import PORT from "./port";
import {} from "../views/chess";
import mainScript from "../index";
import Game from "../models/Game";
const axios = require("axios");

const findTarget = function(ev) {
  if (event.target.className === "button-small") {
    return ev.target;
  } else {
    return ev.target.parentNode;
  }
};

const yesBtnMap = {
  friend_btn: "Accept",
  friends_btn: "Play",
  game_btn: "Accept",
  games_btn: "Play"
};
const noBtnMap = {
  friend_btn: "Refuse",
  friends_btn: "Delete",
  game_btn: "Discard",
  games_btn: "Delete"
};
const titlesMap = {
  friend_btn: "Friend requests",
  friends_btn: "Chose friend to play with",
  game_btn: "Game requests",
  games_btn: "Lasting games"
};
const reqSufixMap = {
  friend_btn: "friend_invs",
  friends_btn: "friends",
  game_btn: "game_invs",
  games_btn: "games"
};

const yesFnMap = {
  friend_btn: async event => {
    const target = findTarget(event).parentNode;
    const nick = target.querySelector("p").innerHTML;
    await axios.patch(PORT + "/api/users/accept_friend/" + nick);
    target.parentNode.removeChild(target);
  },
  friends_btn: async () => {
    const target = findTarget(event).parentNode;
    const nick = target.querySelector("p").innerHTML;
    const response = await axios.patch(PORT + "/api/users/game_inv/" + nick);
    target.parentNode.removeChild(target);
  },
  game_btn: async () => {
    const target = findTarget(event).parentNode;
    const nick = target.querySelector("p").innerHTML;
    const response = await axios({
      method: "post",
      url: "/api/games/new_game",
      data: { nick: nick }
    });
    target.parentNode.removeChild(target);
  },
  games_btn: async () => {
    const target = findTarget(event).parentNode;
    const id = target.getAttribute("gameid");
    const response = await axios.get(PORT + "/api/games/open_game/" + id);
    const game = response.data[0];
    const color =
      response.data[1] === response.data[0].whitePlayerID ? "white" : "black";
    mainScript.gameInit(game, color);
  }
};
const noFnMap = {
  friend_btn: async () => {
    const target = findTarget(event).parentNode;
    const nick = target.querySelector("p").innerHTML;
    await axios.delete(PORT + "/api/users/delete_friend_inv/" + nick);
    target.parentNode.removeChild(target);
  },
  friends_btn: async () => {
    const target = findTarget(event).parentNode;
    const nick = target.querySelector("p").innerHTML;
    await axios.delete(PORT + "/api/users/delete_friend/" + nick);
    target.parentNode.removeChild(target);
  },
  game_btn: async () => {
    const target = findTarget(event).parentNode;
    const nick = target.querySelector("p").innerHTML;
    await axios.delete(PORT + "/api/users/delete_game_inv/" + nick);
    target.parentNode.removeChild(target);
  },
  games_btn: async () => {
    const target = findTarget(event).parentNode;
    const id = target.getAttribute("gameid");
    await axios.delete(PORT + "/api/games/delete_game/" + id);
    target.parentNode.removeChild(target);
  }
};
const variable = document.getElementById("variable-content");

const sendFriendReq = async function() {
  const nickname = document.querySelector(".entry.friends_nickname");
  const response = await axios.patch(
    PORT + "/api/users/add_friend/" + nickname.value
  );
  nickname.placeholder = response.data;
  nickname.value = "";
};

const displayItem = function(item, reqBtn) {
  document.getElementById("req-list").insertAdjacentHTML(
    "beforeend",
    `

  <li class="item" ${item.gameID ? "gameid = " + item.gameID : ""}>
  <div class="name">
    <p>${item.friend ? item.friend : item}</p>
  </div>
  <div class="yes button-small"><p>${yesBtnMap[reqBtn]}</p></div>
  <div class="no button-small"><p>${noBtnMap[reqBtn]}</p></div>
</li>`
  );
};

const setNickname = async function() {
  const input = document.querySelector(".entry.nick");
  const response = document.getElementById("nck");
  const newNick = input.value;
  input.value = "";
  response.innerHTML = "";
  const updatedUser = await axios({
    method: "patch",
    url: PORT + "/api/users/set_nickname",
    data: { nick: newNick }
  });
  if (updatedUser.data === "taken") {
    response.innerHTML = "<p>this nickneme is already taken</p>";
  } else if (updatedUser.data.nick) {
    document.querySelector(".popup").classList.add("invisible");
  } else {
    response.innerHTML = "<p>you cant change the nickname to new_User</p>";
  }
};

const displayCategory = async function(reqBtn, contents) {
  const reqMap = {};
  variable.innerHTML = "";
  if (reqBtn === "friend_btn") {
    variable.insertAdjacentHTML(
      "beforeend",
      `
  <div class="description">
    <h3>Add friend</h3>
  </div>
  <div>
    <input
      class="entry friends_nickname"
      type="text"
      placeholder="type your friends nickname here"
    />
    <div id="add_friend">
      <h3>+</h3>
    </div>
  </div>
  `
    );
    document
      .getElementById("add_friend")
      .addEventListener("click", sendFriendReq);
    document
      .querySelector(".entry.friends_nickname")
      .addEventListener("keypress", event => {
        if (event.keyCode === 13) {
          sendFriendReq();
        }
      });
  }
  variable.insertAdjacentHTML(
    "beforeend",
    `<div class="description"><h4>${titlesMap[reqBtn]}</h3></div>
  <ul id="req-list"></ul>`
  );
  const reqList = document.getElementById("req-list");
  const apiResponse = await axios.get(
    PORT + "/api/users/" + reqSufixMap[reqBtn]
  );
  apiResponse.data.forEach(item => {
    displayItem(item, reqBtn);
  });
  document
    .querySelectorAll(".yes")
    .forEach(el => el.addEventListener("click", yesFnMap[reqBtn]));
  document
    .querySelectorAll(".no")
    .forEach(el => el.addEventListener("click", noFnMap[reqBtn]));
};

const makeMove = async function(id, move) {
  const response = await axios({
    method: "patch",
    url: PORT + "/api/games/make_move",
    data: { gameID: id, move: move }
  });
  return response;
};

export default { setNickname, displayCategory, makeMove };
