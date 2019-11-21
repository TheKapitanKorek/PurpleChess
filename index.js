const path = require("path");
const keys = require("./config/keys");
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
require("./models/User");
require("./models/Game");
require("./services/passport");
//middlewares
const except = require("./middlewares/except");
const checkLogged = require("./middlewares/checkLogged");
const cors = require("cors");

//mongoose.connect(keys.mongoURI);
mongoose
  .connect("mongodb://localhost/playground")
  .then(() => {
    console.log("conected to mongoDB");
  })
  .catch(err => {
    console.error("couldnt connect to mongoDB exiting with message: " + err);
  });
const app = express();
app.use(cors());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use("/api", except(["/current_user", "/users/set_nickname"], checkLogged));
//adding routes from external files
require("./routes/authRoutes")(app);
require("./routes/users")("/api/users", app);
require("./routes/games")("/api/games", app);

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("listening on port " + PORT));
