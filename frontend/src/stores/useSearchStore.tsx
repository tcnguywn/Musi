import { create } from "zustand";
import { Song, Album } from "@/types";
import { axiosInstance } from "@/lib/axios";

interface SearchState {
    resultSongs: Song[];
    resultAlbums: Album[];
    resultAlbumsFromSongs: Album[];
    isLoading: boolean;

    searchSongs: (q: string) => Promise<void>;
    searchAlbums: (q: string) => Promise<void>;
    searchAlbumsFromSongs: (q: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
    resultSongs: [],
    resultAlbums: [],
    resultAlbumsFromSongs: [],
    isLoading: false,

    searchSongs: async (q: string) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/search/songs", { params: { q } });
            set({ resultSongs: res.data });
        } catch (err) {
            console.error("Error searching songs", err);
        } finally {
            set({ isLoading: false });
        }
    },

    searchAlbums: async (q: string) => {
        try {
            const res = await axiosInstance.get("/search/albums", { params: { q } });
            set({ resultAlbums: res.data });
        } catch (err) {
            console.error("Error searching albums", err);
        }
    },

    searchAlbumsFromSongs: async (q: string) => {
        try {
            const res = await axiosInstance.get("/search/albums-from-songs", { params: { q } });
            set({ resultAlbumsFromSongs: res.data });
        } catch (err) {
            console.error("Error searching albums from songs", err);
        }
    },
}));

