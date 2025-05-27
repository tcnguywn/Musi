import { Song } from "../models/song.model.js";
import { ListenHistory } from "../models/history.model.js";
export const getAllSongs = async(req, res, next) => {
    try {
        // -1: Desc; 1: Asc
        const songs = await Song.find().sort({createdAt: -1});
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getFeaturedSongs = async (req, res, next) => {
    try {
        // random songs using MongoDB aggregate pipelined
        const songs = await Song.aggregate([
            {
                $sample: {size: 6},
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);
        res.json(songs);
    } catch (error) {
        next(error);
    }
};


export const getForYouSongs = async (req, res, next) => {
    try {
        const userId = req.query.userId;

        let songs;

        if (userId) {
            // 1. Lấy lịch sử nghe và populate thông tin bài hát
            const histories = await ListenHistory.find({ userId })
                .sort({ listenedAt: -1 })
                .limit(100)
                .populate("songId", "genre");

            // 2. Đếm tần suất genre
            const genreCount = {};
            histories.forEach(({ songId }) => {
                if (songId && songId.genre) {
                    genreCount[songId.genre] = (genreCount[songId.genre] || 0) + 1;
                }
            });

            // 3. Lấy top genre
            const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
            const topGenre = sortedGenres[0]?.[0];

            // 4. Gợi ý bài hát theo genre hoặc random fallback
            if (topGenre) {
                songs = await Song.aggregate([
                    { $match: { genre: topGenre } },
                    { $sample: { size: 4 } },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            artist: 1,
                            imageUrl: 1,
                            audioUrl: 1,
                        },
                    },
                ]);
            } else {
                // fallback
                songs = await Song.aggregate([
                    { $sample: { size: 4 } },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            artist: 1,
                            imageUrl: 1,
                            audioUrl: 1,
                        },
                    },
                ]);
            }
        } else {
            // người dùng chưa đăng nhập -> random
            songs = await Song.aggregate([
                { $sample: { size: 4 } },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        artist: 1,
                        imageUrl: 1,
                        audioUrl: 1,
                    },
                },
            ]);
        }

        res.json(songs);
    } catch (error) {
        next(error);
    }
};


export const getTrendingSongs = async (req, res, next) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const songs = await ListenHistory.aggregate([
            {
                $match: {
                    listenedAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: '$songId',
                    playCount: { $sum: 1 },
                },
            },
            {
                $sort: { playCount: -1 },
            },
            {
                $limit: 8,
            },
            {
                $lookup: {
                    from: 'songs',               // tên collection (viết thường, số nhiều)
                    localField: '_id',
                    foreignField: '_id',
                    as: 'song',
                },
            },
            { $unwind: '$song' },
            {
                $project: {
                    _id: '$song._id',
                    title: '$song.title',
                    artist: '$song.artist',
                    imageUrl: '$song.imageUrl',
                    audioUrl: '$song.audioUrl',
                    playCount: 1,
                },
            },
        ]);

        res.json(songs);
    } catch (error) {
        next(error);
    }
};
