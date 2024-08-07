const express = require("express");
const statisticsRouter = require("./statistics");
const Song = require("../models/song");
const User = require("../models/user");

const router = express.Router();

router.use(function (req, res, next) {
  res.locals.currentSong = req.song;
  next();
});
router.get("/login", async (rq, res, next) => {
  try {
    const { username, password } = req.body
    const existingUser = await Song.findOne({
      username: username
    });
    if (existingUser) {
      return res.status(200).json({ message: "User Exists" });
    }

    const newUser = new User({
      username: username
    })

     await newUser.save();
     res.status(201).json({ message: "User Added", song: newSong });
  } catch (error) {
    next(err);
  }
})
router.get("/", async (rq, res, next) => {
  try {

    const songs = await Song.find().sort({ createdAt: -1 }).exec();

    res.json({songs});
  } catch (err) {
    next(err);
  }
});

router.post("/addsong", async (req, res, next) => {
  try {
    const { title, artist, album, genre } = req.body;

    const existingSong = await Song.findOne({ title: title, artist:artist, album:album, genre:genre });
    if (existingSong) {
      return res.status(200).json({ message: "Song Exists" });
    }

    const newSong = new Song({
      title: title,
      artist: artist,
      album: album,
      genre: genre,
    });

    await newSong.save();
    res.status(201).json({ message: "Song Added", song: newSong });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const songId = req.params.id;
    const { title, artist, album, genre } = req.body;
   

    if (!title && !artist && !album && !genre) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }
    const updatedSong = await Song.findByIdAndUpdate(
      songId,
      { $set: { title, artist, album, genre } },
      { new: true, runValidators: true }
    );

    if (!updatedSong) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json({ message: "Song edited successfully", song: updatedSong });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const songId = req.params.id;

    // Validate that the song ID is provided
    if (!songId) {
      return res.status(400).json({ error: "Song ID is required" });
    }

    // Find and delete the song by ID
    const deletedSong = await Song.findByIdAndDelete(songId);

    // If no song is found, return a 404 error
    if (!deletedSong) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Song deleted successfully", song: deletedSong });
  } catch (err) {
    next(err);
  }
});

router.use(statisticsRouter);

module.exports = router;
