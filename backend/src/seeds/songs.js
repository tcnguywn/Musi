import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
	{
		title: "Stay With Me",
		artist: "Sarah Mitchell",
		imageUrl: "/cover-images/1.jpg",
		audioUrl: "/songs/1.mp3",
		duration: 46,
		genre: "Pop",
	},
	{
		title: "Midnight Drive",
		artist: "The Wanderers",
		imageUrl: "/cover-images/2.jpg",
		audioUrl: "/songs/2.mp3",
		duration: 41,
		genre: "Indie & Alternative",
	},
	{
		title: "Lost in Tokyo",
		artist: "Electric Dreams",
		imageUrl: "/cover-images/3.jpg",
		audioUrl: "/songs/3.mp3",
		duration: 24,
		genre: "Japanese Music",
	},
	{
		title: "Summer Daze",
		artist: "Coastal Kids",
		imageUrl: "/cover-images/4.jpg",
		audioUrl: "/songs/4.mp3",
		duration: 24,
		genre: "Pop",
	},
	{
		title: "Neon Lights",
		artist: "Night Runners",
		imageUrl: "/cover-images/5.jpg",
		audioUrl: "/songs/5.mp3",
		duration: 36,
		genre: "Dance & EDM",
	},
	{
		title: "Mountain High",
		artist: "The Wild Ones",
		imageUrl: "/cover-images/6.jpg",
		audioUrl: "/songs/6.mp3",
		duration: 40,
		genre: "Rock",
	},
	{
		title: "City Rain",
		artist: "Urban Echo",
		imageUrl: "/cover-images/7.jpg",
		audioUrl: "/songs/7.mp3",
		duration: 39,
		genre: "Jazz",
	},
	{
		title: "Desert Wind",
		artist: "Sahara Sons",
		imageUrl: "/cover-images/8.jpg",
		audioUrl: "/songs/8.mp3",
		duration: 28,
		genre: "Indie & Alternative",
	},
	{
		title: "Ocean Waves",
		artist: "Coastal Drift",
		imageUrl: "/cover-images/9.jpg",
		audioUrl: "/songs/9.mp3",
		duration: 28,
		genre: "Jazz",
	},
	{
		title: "Starlight",
		artist: "Luna Bay",
		imageUrl: "/cover-images/10.jpg",
		audioUrl: "/songs/10.mp3",
		duration: 30,
		genre: "Indie & Alternative",
	},
	{
		title: "Winter Dreams",
		artist: "Arctic Pulse",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/11.mp3",
		duration: 29,
		genre: "Indie & Alternative",
	},
	{
		title: "Purple Sunset",
		artist: "Dream Valley",
		imageUrl: "/cover-images/12.jpg",
		audioUrl: "/songs/12.mp3",
		duration: 17,
		genre: "Pop",
	},
	{
		title: "Neon Dreams",
		artist: "Cyber Pulse",
		imageUrl: "/cover-images/13.jpg",
		audioUrl: "/songs/13.mp3",
		duration: 39,
		genre: "Dance & EDM",
	},
	{
		title: "Moonlight Dance",
		artist: "Silver Shadows",
		imageUrl: "/cover-images/14.jpg",
		audioUrl: "/songs/14.mp3",
		duration: 27,
		genre: "Funk",
	},
	{
		title: "Urban Jungle",
		artist: "City Lights",
		imageUrl: "/cover-images/15.jpg",
		audioUrl: "/songs/15.mp3",
		duration: 36,
		genre: "Rap",
	},
	{
		title: "Crystal Rain",
		artist: "Echo Valley",
		imageUrl: "/cover-images/16.jpg",
		audioUrl: "/songs/16.mp3",
		duration: 39,
		genre: "R&B",
	},
	{
		title: "Neon Tokyo",
		artist: "Future Pulse",
		imageUrl: "/cover-images/17.jpg",
		audioUrl: "/songs/17.mp3",
		duration: 39,
		genre: "Japanese Music",
	},
	{
		title: "Midnight Blues",
		artist: "Jazz Cats",
		imageUrl: "/cover-images/18.jpg",
		audioUrl: "/songs/18.mp3",
		duration: 29,
		genre: "Jazz",
	},
];
const seedSongs = async () => {
	console.log("start seeding songs")

	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Clear existing songs
		await Song.deleteMany({});

		// Insert new songs
		await Song.insertMany(songs);

		console.log("Songs seeded successfully!");
	} catch (error) {
		console.error("Error seeding songs:", error);
	} finally {
		mongoose.connection.close();
	}
};

seedSongs();