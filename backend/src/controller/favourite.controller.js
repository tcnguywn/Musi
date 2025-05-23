import { Favourite } from "../models/favourite.model.js";
import { Song } from "../models/song.model.js";

export const getFavouriteSongs = async (req, res, next) => {
    try {
        const userId = req.auth.userId;

        // Tìm document yêu thích hoặc trả về mảng rỗng nếu không có
        const favourite = await Favourite.findOne({ userId }).populate({
            path: "songs",
            select: "_id title artist imageUrl audioUrl genre duration",
        });

        // Trả về mảng rỗng nếu không tìm thấy document hoặc không có bài hát yêu thích
        const songs = favourite ? favourite.songs || [] : [];

        res.status(200).json(songs);
    } catch (error) {
        next(error);
    }
};

// Thêm bài hát vào danh sách yêu thích
export const addToFavourites = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const { songId } = req.body;

        if (!songId) {
            return res.status(400).json({ message: "Song ID is required" });
        }

        // Kiểm tra bài hát có tồn tại không
        const songExists = await Song.exists({ _id: songId });
        if (!songExists) {
            return res.status(404).json({ message: "Song not found" });
        }

        // Tìm hoặc tạo mới document yêu thích
        let favourite = await Favourite.findOne({ userId });

        if (!favourite) {
            favourite = await Favourite.create({
                userId,
                songs: [songId]
            });
            return res.status(201).json({
                message: "Created new favourites list with song",
                favourite
            });
        }

        // Kiểm tra xem bài hát đã có trong danh sách chưa
        if (favourite.songs.includes(songId)) {
            return res.status(200).json({
                message: "Song already in favourites",
                favourite
            });
        }

        // Thêm bài hát vào danh sách
        favourite.songs.push(songId);
        await favourite.save();

        res.status(200).json({
            message: "Added to favourites",
            favourite
        });
    } catch (error) {
        console.error("Error adding to favourites:", error);
        next(error);
    }
};

// Xóa bài hát khỏi danh sách yêu thích
export const removeFromFavourites = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const { songId } = req.params;

        if (!songId) {
            return res.status(400).json({ message: "Song ID is required" });
        }

        const favourite = await Favourite.findOne({ userId });

        // Nếu không tìm thấy danh sách yêu thích
        if (!favourite) {
            return res.status(404).json({ message: "Favourites list not found" });
        }

        // Kiểm tra xem bài hát có trong danh sách không
        if (!favourite.songs.includes(songId)) {
            return res.status(200).json({
                message: "Song not in favourites",
                favourite
            });
        }

        // Xóa bài hát khỏi danh sách
        favourite.songs = favourite.songs.filter(
            id => id.toString() !== songId.toString()
        );

        await favourite.save();

        res.status(200).json({
            message: "Removed from favourites",
            favourite
        });
    } catch (error) {
        console.error("Error removing from favourites:", error);
        next(error);
    }
};
