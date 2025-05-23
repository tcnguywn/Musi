import { Button } from "@/components/ui/button.tsx";
import { usePlayerStore } from "@/stores/usePlayerStore.tsx";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";
import {axiosInstance} from "@/lib/axios.ts";
import {useUser} from "@clerk/clerk-react";

const PlayButton = ({ song }: { song: Song }) => {
	const { user } = useUser();
	const { currentSong, isPlaying, changeSong, togglePlay } = usePlayerStore();
	const isCurrentSong = currentSong?._id === song._id;
	const handlePlay = async () => {
		if (isCurrentSong) {
			togglePlay();
		} else {
			changeSong(song);

			try {
				if (user?.id) {
					await axiosInstance.post("/users/histories", {
						songId: song._id,
					});
				}
			} catch (error) {
				console.error("Lỗi khi ghi lịch sử nghe:", error);
			}
		}
	};

	return (
		<Button
			size={"icon"}
			onClick={handlePlay}
			className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
				isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
			}`}
		>
			{isCurrentSong && isPlaying ? (
				<Pause className='size-5 text-black' />
			) : (
				<Play className='size-5 text-black' />
			)}
		</Button>
	);
};

export default PlayButton;
