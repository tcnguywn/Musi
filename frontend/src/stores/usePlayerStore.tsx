import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore.js";

const updateActivity = (activity: string) => {
	const socket = useChatStore.getState().socket;
	if (socket?.auth?.userId) {
		socket.emit("update_activity", {
			userId: socket.auth.userId,
			activity,
		});
	}
};

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	isShuffling: boolean;
	repeatMode: 'off' | 'one' | 'all';

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	changeSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	toggleShuffle: () => void;
	cycleRepeatMode: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	isShuffling: false,
	repeatMode: 'off',

	initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;
		const song = songs[startIndex];
		updateActivity(`Playing ${song.title} by ${song.artist}`);
		set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
		});
	},

	changeSong: (song: Song | null) => {
		if (!song) return;
		updateActivity(`Playing ${song.title} by ${song.artist}`);
		const songIndex = get().queue.findIndex((s) => s._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});
	},

	togglePlay: () => {
		const willStartPlaying = !get().isPlaying;
		const currentSong = get().currentSong;
		const activity = willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle";
		updateActivity(activity);
		set({ isPlaying: willStartPlaying });
	},

	toggleShuffle: () => {
		set((state) => ({ isShuffling: !state.isShuffling }));
	},

	cycleRepeatMode: () => {
		set((state) => {
			const nextMode = state.repeatMode === 'off' ? 'one' : state.repeatMode === 'one' ? 'all' : 'off';
			return { repeatMode: nextMode };
		});
	},

	playNext: () => {
		const { currentIndex, queue, isShuffling, repeatMode, currentSong } = get();
		if (repeatMode === "one" && currentSong) {
			updateActivity(`Playing ${currentSong.title} by ${currentSong.artist}`);
			set({ currentSong, isPlaying: true });
			return;
		}

		if (isShuffling) {
			const remaining = queue.filter((_, i) => i !== currentIndex);
			if (remaining.length === 0) return;
			const randomSong = remaining[Math.floor(Math.random() * remaining.length)];
			const randomIndex = queue.findIndex((s) => s._id === randomSong._id);
			updateActivity(`Playing ${randomSong.title} by ${randomSong.artist}`);
			set({ currentSong: randomSong, currentIndex: randomIndex, isPlaying: true });
			return;
		}

		const nextIndex = currentIndex + 1;
		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];
			updateActivity(`Playing ${nextSong.title} by ${nextSong.artist}`);
			set({ currentSong: nextSong, currentIndex: nextIndex, isPlaying: true });
		} else if (repeatMode === "all") {
			const firstSong = queue[0];
			updateActivity(`Playing ${firstSong.title} by ${firstSong.artist}`);
			set({ currentSong: firstSong, currentIndex: 0, isPlaying: true });
		} else {
			updateActivity("Idle");
			set({ isPlaying: false });
		}
	},

	playPrevious: () => {
		const { currentIndex, queue } = get();
		const prevIndex = currentIndex - 1;
		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];
			updateActivity(`Playing ${prevSong.title} by ${prevSong.artist}`);
			set({ currentSong: prevSong, currentIndex: prevIndex, isPlaying: true });
		} else {
			updateActivity("Idle");
			set({ isPlaying: false });
		}
	},
}));