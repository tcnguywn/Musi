import express from "express"
import dotenv from "dotenv"

import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";
import { createServer } from "http";
import { initSocket } from "./lib/socket.js";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import fs from "fs";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import searchRoute from "./routes/search.route.js";

dotenv.config(); 

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
initSocket(httpServer);

const tmpDir = path.join(process.cwd(), "temp");

cron.schedule("0 * * * *", () => {
    if (fs.existsSync(tmpDir)) {
        fs.readdir(tmpDir, (err, files) => {
            if (err) {
                console.log("error",err);
                return;
            }
            for (const file of files) {
                fs.unlink(path.join(tmpDir, file), (err) => {});
            }
        })
    }
});




app.use(express.json());    //parse req.body
app.use(clerkMiddleware()); //add auth to rq object
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits: {
        fileSize: 10 *1024*1024,    //10MB max
    }
}));
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));
app.use("/api/users", userRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/search", searchRoute);
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}
app.use((err, req, res, next) => {  //error handler
    res.status(500).json({ message: process.env.NODE_ENV === "prodution" ? "Internal server erore" : err.message});
});

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
