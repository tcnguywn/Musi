import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from '@clerk/express';

import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import albumRoutes from "./routes/album.route.js";
import songRoutes from "./routes/song.route.js";
import statRoutes from "./routes/stat.route.js";
import fileUpload from "express-fileupload";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve;

app.use(express.json()) //to parse req.body

app.use(clerkMiddleware()); //add auth to req obj => user.auth

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,"tmp"),
    createParentPath : true,
    limits : {
        fileSize : 10 * 1024 * 1024 , //10MB file size
    }
}))

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/stats", statRoutes);


app.listen(PORT, () => {
    console.log("Server is running in port " + PORT);
    connectDB();
})