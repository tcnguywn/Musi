import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
    },
    { timestamps: true }
);

export const Favourite = mongoose.model("Favourite", favouriteSchema);