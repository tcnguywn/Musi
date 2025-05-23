import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton.tsx";
import { buttonVariants } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utils.ts";
import { useMusicStore } from "@/stores/useMusicStore.tsx";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { Heart, HomeIcon, Library, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "@/lib/axios.ts";
import { Song } from "@/types";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const { user, isSignedIn } = useUser();
	const [likedSongs, setLikedSongs] = useState<Song[]>([]);
	const [isLoadingLikedSongs, setIsLoadingLikedSongs] = useState(false);

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	// Fetch liked songs for authenticated users
	useEffect(() => {
		const fetchLikedSongs = async () => {
			if (!isSignedIn || !user?.id) return;

			setIsLoadingLikedSongs(true);
			try {
				const response = await axiosInstance.get("/users/favourites");
				setLikedSongs(response.data);
			} catch (error) {
				console.error("Error fetching liked songs:", error);
			} finally {
				setIsLoadingLikedSongs(false);
			}
		};

		fetchLikedSongs();
	}, [isSignedIn, user?.id]);

	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Navigation menu */}
			<div className='rounded-lg bg-zinc-900 p-4'>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Home</span>
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								})
							)}
						>
							<MessageCircle className='mr-2 size-5' />
							<span className='hidden md:inline'>Messages</span>
						</Link>
					</SignedIn>
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span className='hidden md:inline'>Playlists</span>
					</div>
				</div>

				<ScrollArea className='h-[calc(100vh-300px)]'>
					<div className='space-y-2'>
						{/* Liked Songs Playlist - Only visible when signed in */}
						<SignedIn>
							{isLoadingLikedSongs ? (
								<div className="p-2 flex items-center gap-3">
									<div className="size-12 rounded-md bg-gradient-to-br from-purple-700 to-blue-400 flex items-center justify-center flex-shrink-0">
										<Heart className="size-6 text-white animate-pulse" />
									</div>
									<div className='flex-1 min-w-0 hidden md:block'>
										<div className="h-5 w-24 bg-zinc-800 rounded animate-pulse mb-1"></div>
										<div className="h-4 w-16 bg-zinc-800 rounded animate-pulse"></div>
									</div>
								</div>
							) : (
								<Link
									to={`/liked-songs`}
									className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
								>
									<div className="size-12 rounded-md bg-gradient-to-br from-purple-700 to-blue-400 flex items-center justify-center flex-shrink-0">
										<Heart className="size-6 text-white" />
									</div>
									<div className='flex-1 min-w-0 hidden md:block'>
										<p className='font-medium truncate'>Liked Songs</p>
										<p className='text-sm text-zinc-400 truncate'>
											Playlist • {likedSongs.length} songs
										</p>
									</div>
								</Link>
							)}
						</SignedIn>

						{/* Albums list */}
						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							albums.map((album) => (
								<Link
									to={`/albums/${album._id}`}
									key={album._id}
									className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
								>
									<img
										src={album.imageUrl}
										alt='Playlist img'
										className='size-12 rounded-md flex-shrink-0 object-cover'
									/>

									<div className='flex-1 min-w-0 hidden md:block'>
										<p className='font-medium truncate'>{album.title}</p>
										<p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
									</div>
								</Link>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default LeftSidebar;