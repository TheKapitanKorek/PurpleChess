//utility fuctions

const displayCategory = function(reqBtn, contents) {
  const variable = document.getElementById("variable-content");
  const titlesMap = {
    friend_btn: "Friend requests",
    friends_btn: "Chose friend to play with",
    game_btn: "Game requests",
    games_btn: "Lasting games"
  };
  const reqMap = {};
  if ((reqBtn = "freind_btn")) {
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
  }
  variable.insertAdjacentHTML(
    "beforeend",
    `<div class="description"><h4>${titlesMap[reqBtn]}</h3></div>
  <ul id="req-list"></ul>`
  );
  const reqList = document.getElementById("req-list");
};
