const express = require("express");
const router = express.Router();
const Song = require("../models/song");

router.get("/statistics", async (req, res, next) => {
  try {
    const stats = await Song.aggregate([
      {
        $facet: {
          songCount: [
            {
              $group: {
                _id: {
                  title: "$title",
                  artist: "$artist",
                  album: "$album",
                  genre: "$genre",
                },
              },
            },
            { $count: "totalSongs" },
          ],
          artistCount: [
            { $group: { _id: "$artist" } },
            { $count: "totalArtists" },
          ],
          albumCount: [
            { $group: { _id: "$album" } },
            { $count: "totalAlbums" },
          ],
          genreCount: [
            { $group: { _id: "$genre" } },
            { $count: "totalGenres" },
          ],
          songsPerArtist: [{ $group: { _id: "$artist", count: { $sum: 1 } } }],
          songsPerAlbum: [{ $group: { _id: "$album", count: { $sum: 1 } } }],
          songsPerGenre: [{ $group: { _id: "$genre", count: { $sum: 1 } } }],
        },
      },
    ]);



    res.status(200).json({
      songCount: stats[0].songCount[0]?.totalSongs || 0,
      artistCount: stats[0].artistCount[0]?.totalArtists || 0,
      genreCount: stats[0].genreCount[0]?.totalGenres || 0,
      albumCount: stats[0].albumCount[0]?.totalAlbums || 0,
      songsPerArtist: stats[0].songsPerArtist,
      songsPerAlbum:stats[0].songsPerAlbum,
      songsPerGenre:stats[0].songsPerGenre
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;