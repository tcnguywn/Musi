import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:   { type: String, required: true }, //Cherk user ID
        receiverId: { type: String, required: true }, //Cherk user ID
        content:    { type: String, required: true },
    },
    { timestamps: true }  //createdAt, updatedAt
);

export const Message = mongoose.model("Message", messageSchema);