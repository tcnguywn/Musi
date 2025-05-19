import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import {ListenHistory} from "../models/history.model.js";

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const addToListenHistory = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const { songId } = req.body;

		// Optional: Xoá bản cũ nếu tồn tại để tránh trùng (giữ lại bản mới nhất)
		await ListenHistory.deleteOne({ userId, songId });

		const newHistory = await ListenHistory.create({
			userId,
			songId,
			listenedAt: new Date(), // explicit nếu bạn có timestamp tùy chỉnh
		});

		res.status(201).json(newHistory);
	} catch (error) {
		next(error);
	}
};


export const getRecentPlays = async (req, res, next) => {
	try {
		const userId = req.auth.userId;

		const histories = await ListenHistory.find({ userId })
			.sort({ listenedAt: -1 })
			.limit(8)
			.populate({
				path: "songId",
				select: "_id title artist imageUrl audioUrl genre duration",
			});

		// Trích ra chỉ phần bài hát đã populate
		const songs = histories
			.map(item => item.songId)
			.filter(song => song); // tránh null nếu bị xoá

		res.status(200).json(songs);
	} catch (error) {
		next(error);
	}
};