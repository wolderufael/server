const mongoose= require("mongoose");

const songsSchema=new mongoose.Schema({
    title: {type:String},
    artist:{type:String},
    album:{type:String},
    genre:{type:String}
}, { timestamps: true });

const Song= mongoose.model("Song",songsSchema);

module.exports=Song;
