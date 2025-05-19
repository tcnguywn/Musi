import { Song } from '../models/song.model.js';
import { Album } from '../models/album.model.js';

export const searchSongs = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'Missing search query' });

        const regex = new RegExp(q, 'i');
        const matchedSongs = await Song.find({
            $or: [
                { title: { $regex: regex } },
                { artist: { $regex: regex } },
                { genre: { $regex: regex } },
            ],
        })
            .limit(8)
            .select('_id title artist imageUrl audioUrl');

        res.json(matchedSongs);
    } catch (error) {
        next(error);
    }
};

export const searchAlbums = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'Missing search query' });

        const regex = new RegExp(q, 'i');
        const matchedAlbums = await Album.find({
            $or: [{ title: { $regex: regex } }, { artist: { $regex: regex } }],
        })
            .limit(8)
            .select('_id title artist imageUrl releaseYear');

        res.json(matchedAlbums);
    } catch (error) {
        next(error);
    }
};

export const searchAlbumsFromSongs = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'Missing search query' });

        const regex = new RegExp(q, 'i');
        const matchedSongs = await Song.find({
            $or: [
                { title: { $regex: regex } },
                { artist: { $regex: regex } },
                { genre: { $regex: regex } },
            ],
        }).select('_id');

        const songIds = matchedSongs.map((song) => song._id);

        const albums = await Album.find({ songs: { $in: songIds } })
            .limit(8)
            .select('_id title artist imageUrl releaseYear');

        res.json(albums);
    } catch (error) {
        next(error);
    }
};

