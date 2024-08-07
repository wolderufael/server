const mongoose = require("mongoose");
const User= require("./user")
const Schema = mongoose.Schema;

const songsSchema = new mongoose.Schema(
  {
    title: { type: String },
    artist: { type: String },
    album: { type: String },
    genre: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Song= mongoose.model("Song",songsSchema);

module.exports=Song;
