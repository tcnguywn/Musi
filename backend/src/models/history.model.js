import mongoose from "mongoose";

const listenHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: String, // hoặc mongoose.Schema.Types.ObjectId nếu bạn liên kết tới User collection
            required: true,
        },
        songId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",
            required: true,
        },
        listenedAt: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
);

export const ListenHistory = mongoose.model("ListenHistory", listenHistorySchema);
