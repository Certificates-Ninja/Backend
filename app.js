const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const routes = require("./routes/router");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(routes);

//Sample test endpoint
app.get("/", (req, res) => res.send("Working"));

// starting server
app.listen(3001, function () {
  console.log("server listening");
});
