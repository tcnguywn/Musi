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
            // 1. Lấy lịch sử nghe gần đây với trọng số thời gian
            const histories = await ListenHistory.find({ userId })
                .sort({ listenedAt: -1 })
                .limit(200)
                .populate("songId", "genre artist");

            // 2. Tính điểm cho genre với trọng số thời gian
            const genreScores = {};
            const artistScores = {};
            const now = new Date();

            histories.forEach(({ songId, listenedAt }, index) => {
                if (songId && songId.genre) {
                    // Trọng số giảm dần theo thời gian và vị trí
                    const timeWeight = Math.max(0.1, 1 - (now - listenedAt) / (30 * 24 * 60 * 60 * 1000)); // 30 ngày
                    const positionWeight = Math.max(0.1, 1 - index / 100); // Vị trí trong top 100
                    const weight = timeWeight * positionWeight;

                    genreScores[songId.genre] = (genreScores[songId.genre] || 0) + weight;
                    artistScores[songId.artist] = (artistScores[songId.artist] || 0) + weight;
                }
            });

            // 3. Lấy top genres và artists
            const topGenres = Object.entries(genreScores)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([genre]) => genre);

            const topArtists = Object.entries(artistScores)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([artist]) => artist);

            // 4. Lấy danh sách bài hát đã nghe để loại trừ
            const listenedSongIds = histories.map(h => h.songId._id);

            // 5. Gợi ý bài hát thông minh hơn
            if (topGenres.length > 0) {
                const pipeline = [
                    {
                        $match: {
                            _id: { $nin: listenedSongIds }, // Loại trừ bài đã nghe
                            $or: [
                                { genre: { $in: topGenres } },
                                { artist: { $in: topArtists } }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            // Tính điểm ưu tiên
                            score: {
                                $add: [
                                    { $cond: [{ $in: ["$genre", topGenres] }, 2, 0] },
                                    { $cond: [{ $in: ["$artist", topArtists] }, 1, 0] }
                                ]
                            }
                        }
                    },
                    { $sort: { score: -1 } },
                    { $sample: { size: 20 } }, // Lấy 20 bài có điểm cao
                    { $sample: { size: 8 } },  // Random 8 bài để tăng đa dạng
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            artist: 1,
                            imageUrl: 1,
                            audioUrl: 1,
                            genre: 1,
                            score: 1
                        }
                    }
                ];

                songs = await Song.aggregate(pipeline);

                // Nếu không đủ bài, bổ sung thêm
                if (songs.length < 8) {
                    const additionalSongs = await Song.aggregate([
                        { $match: { _id: { $nin: [...listenedSongIds, ...songs.map(s => s._id)] } } },
                        { $sample: { size: 8 - songs.length } },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                artist: 1,
                                imageUrl: 1,
                                audioUrl: 1,
                                genre: 1
                            }
                        }
                    ]);
                    songs = [...songs, ...additionalSongs];
                }
            } else {
                // Fallback cho user mới
                songs = await Song.aggregate([
                    { $sample: { size: 8 } },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            artist: 1,
                            imageUrl: 1,
                            audioUrl: 1,
                            genre: 1
                        }
                    }
                ]);
            }
        } else {
            // User chưa đăng nhập - recommend trending hoặc popular
            songs = await Song.aggregate([
                {
                    $lookup: {
                        from: "listenhistories",
                        localField: "_id",
                        foreignField: "songId",
                        as: "listens"
                    }
                },
                {
                    $addFields: {
                        listenCount: { $size: "$listens" },
                        recentListens: {
                            $size: {
                                $filter: {
                                    input: "$listens",
                                    cond: {
                                        $gte: ["$$this.listenedAt", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)]
                                    }
                                }
                            }
                        }
                    }
                },
                { $sort: { recentListens: -1, listenCount: -1 } },
                { $limit: 20 },
                { $sample: { size: 8 } },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        artist: 1,
                        imageUrl: 1,
                        audioUrl: 1,
                        genre: 1
                    }
                }
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
