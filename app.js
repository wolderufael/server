const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/song-data");

app.set("port", process.env.PORT || 4000);

const routes = require("./routes/routes");

app.use('/api',routes);

app.listen(app.get("port"), function () {
  console.log("Server started on port " + app.get("port"));
});
