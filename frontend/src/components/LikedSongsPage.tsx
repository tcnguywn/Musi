import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { usePlayerStore } from "@/stores/usePlayerStore.tsx";
import { Song } from "@/types";
import { useUser } from "@clerk/clerk-react";
import { Heart, Pause, Play, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios.ts";
import { formatDuration } from "@/pages/AlbumPage.tsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LikedSongsPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [likedSongs, setLikedSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [unlikingInProgress, setUnlikingInProgress] = useState<string | null>(null);
    const { currentSong, isPlaying, changeSong, togglePlay } = usePlayerStore();

    const fetchLikedSongs = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get("/users/favourites");
            setLikedSongs(response.data);
        } catch (error) {
            console.error("Error fetching liked songs:", error);
            toast.error("Could not fetch your liked songs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Redirect if not logged in
        if (!user) {
            toast.error("Please login to view your liked songs");
            navigate("/");
            return;
        }

        fetchLikedSongs();
    }, [user, navigate]);

    const handlePlayLikedSongs = () => {
        if (likedSongs.length === 0) return;

        const isCurrentSongInLiked = likedSongs.some(song => song._id === currentSong?._id);

        if (isCurrentSongInLiked && isPlaying) {
            togglePlay();
        } else if (isCurrentSongInLiked && !isPlaying) {
            togglePlay();
        } else {
            // Start playing from the first liked song
            changeSong(likedSongs[0]);
        }
    };

    const handlePlaySong = (song: Song) => {
        if (currentSong?._id === song._id) {
            togglePlay();
        } else {
            changeSong(song);
        }
    };

    const handleUnlikeSong = async (e: React.MouseEvent, songId: string) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền đến hàng (để không phát bài hát)

        if (unlikingInProgress === songId) return; // Ngăn chặn nhiều lần click

        setUnlikingInProgress(songId);

        try {
            await axiosInstance.delete(`/users/favourites/${songId}`);

            // Cập nhật UI bằng cách loại bỏ bài hát đã unlike
            setLikedSongs(prev => prev.filter(song => song._id !== songId));

            toast.success("Removed from your Liked Songs");

            // Nếu đang phát bài hát này, chuyển sang bài hát tiếp theo trong danh sách đã thích
            if (currentSong?._id === songId && isPlaying) {
                const currentIndex = likedSongs.findIndex(song => song._id === songId);
                if (currentIndex !== -1 && likedSongs.length > 1) {
                    const nextIndex = (currentIndex + 1) % likedSongs.length;
                    changeSong(likedSongs[nextIndex]);
                }
            }
        } catch (error) {
            console.error("Error unliking song:", error);
            toast.error("Could not remove song from your liked songs");
        } finally {
            setUnlikingInProgress(null);
        }
    };

    if (isLoading) return <div className="p-6">Loading your liked songs...</div>;

    return (
        <div className='h-full'>
            <ScrollArea className='h-full rounded-md'>
                {/* Main Content */}
                <div className='relative min-h-full'>
                    {/* Background gradient */}
                    <div
                        className='absolute inset-0 bg-gradient-to-b from-purple-700/80 via-zinc-900/80
                         to-zinc-900 pointer-events-none'
                        aria-hidden='true'
                    />

                    {/* Content */}
                    <div className='relative z-10'>
                        <div className='flex p-6 gap-6 pb-8'>
                            <div className="w-[240px] h-[240px] shadow-xl rounded bg-gradient-to-br from-purple-700 to-blue-400 flex items-center justify-center">
                                <Heart className="size-32 text-white" />
                            </div>
                            <div className='flex flex-col justify-end'>
                                <p className='text-sm font-medium'>Playlist</p>
                                <h1 className='text-7xl font-bold my-4'>Liked Songs</h1>
                                <div className='flex items-center gap-2 text-sm text-zinc-100'>
                                    <span className='font-medium text-white'>{user?.fullName || "Your Collection"}</span>
                                    <span>• {likedSongs.length} songs</span>
                                </div>
                            </div>
                        </div>

                        {/* Play button */}
                        <div className='px-6 pb-4 flex items-center gap-6'>
                            <Button
                                onClick={handlePlayLikedSongs}
                                size='icon'
                                disabled={likedSongs.length === 0}
                                className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400
                                hover:scale-105 transition-all'
                            >
                                {isPlaying && likedSongs.some(song => song._id === currentSong?._id) ? (
                                    <Pause className='h-7 w-7 text-black' />
                                ) : (
                                    <Play className='h-7 w-7 text-black' />
                                )}
                            </Button>
                        </div>

                        {/* Table Section */}
                        {likedSongs.length > 0 ? (
                            <div className='bg-black/20 backdrop-blur-sm'>
                                {/* Table header */}
                                <div
                                    className='grid grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-10 py-2 text-sm
                                    text-zinc-400 border-b border-white/5'
                                >
                                    <div>#</div>
                                    <div>Title</div>
                                    <div>Artist</div>
                                    <div>
                                        <Clock className='h-4 w-4' />
                                    </div>
                                    <div></div> {/* Cột cho nút unlike */}
                                </div>

                                {/* Songs list */}
                                <div className='px-6'>
                                    <div className='space-y-2 py-4'>
                                        {likedSongs.map((song, index) => {
                                            const isCurrentSong = currentSong?._id === song._id;
                                            return (
                                                <div
                                                    key={song._id}
                                                    onClick={() => handlePlaySong(song)}
                                                    className={`grid grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-4 py-2 text-sm 
                                                    ${isCurrentSong ? 'text-green-500' : 'text-zinc-400'} 
                                                    hover:bg-white/5 rounded-md group cursor-pointer`}
                                                >
                                                    <div className='flex items-center justify-center'>
                                                        {isCurrentSong && isPlaying ? (
                                                            <div className="h-4 w-4 relative">
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="h-1 w-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                                    <div className="h-1 w-1 bg-green-500 rounded-full animate-bounce mx-0.5" style={{ animationDelay: '250ms' }} />
                                                                    <div className="h-1 w-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '500ms' }} />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span>{index + 1}</span>
                                                        )}
                                                    </div>
                                                    <div className='flex items-center gap-3'>
                                                        <img
                                                            src={song.imageUrl}
                                                            alt={song.title}
                                                            className='h-10 w-10 rounded object-cover'
                                                        />
                                                        <span className='font-medium'>{song.title}</span>
                                                    </div>
                                                    <div className='flex items-center'>{song.artist}</div>
                                                    <div className='flex items-center'>
                                                        {formatDuration(song.duration)}
                                                    </div>
                                                    <div className='flex items-center justify-center'>
                                                        <button
                                                            onClick={(e) => handleUnlikeSong(e, song._id)}
                                                            className="opacity-70 hover:opacity-100 focus:outline-none"
                                                            disabled={unlikingInProgress === song._id}
                                                            title="Remove from Liked Songs"
                                                        >
                                                            {unlikingInProgress === song._id ? (
                                                                <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <Heart className="h-5 w-5 fill-red-500 text-green-500" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-black/20 backdrop-blur-sm p-10 text-center">
                                <p className="text-zinc-400">You haven't liked any songs yet</p>
                                <p className="text-zinc-500 text-sm mt-2">Like songs by clicking the heart icon on your favorite tracks</p>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default LikedSongsPage;