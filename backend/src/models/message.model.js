import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        //Clerk UserId
        senderId : {
            type : String,
            required : true
        },
        //Clerk UserId
        receiverId : {
            type : String,
            required : true
        },
        content : {
            type : String,
            required : true
        }
    },
    {timestamps : true}
);


export const Message = mongoose.model("Message", messageSchema);