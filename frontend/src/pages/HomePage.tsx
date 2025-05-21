import Topbar from "@/components/Topbar.tsx";
import { useMusicStore } from "@/stores/useMusicStore.tsx";
import { useEffect } from "react";
import FeaturedSection from "../components/homePage/FeaturedSection.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { usePlayerStore } from "@/stores/usePlayerStore.tsx";
import SectionGrid from "../components/homePage/SectionGrid.tsx";
import {useUser} from "@clerk/clerk-react";

const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchForYouSongs,
		fetchTrendingSongs,
		fetchRecentPlays,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
		recentPlays,
	} = useMusicStore();

	const { user } = useUser();
	const { initializeQueue } = usePlayerStore();

	// Các API không phụ thuộc user.id
	useEffect(() => {
		fetchFeaturedSongs();
		fetchForYouSongs(user?.id); // truyền undefined nếu chưa có user, xử lý ở trong store
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchForYouSongs, fetchTrendingSongs, user?.id]);

	// Chỉ fetch recent plays nếu có user.id
	useEffect(() => {
		if (user?.id) {
			fetchRecentPlays(user.id);
		}
	}, [user?.id, fetchRecentPlays]);

	// Khởi tạo hàng chờ phát nhạc
	useEffect(() => {
		if (
			madeForYouSongs.length > 0 &&
			featuredSongs.length > 0 &&
			trendingSongs.length > 0
		) {
			const allSongs = [
				...featuredSongs,
				...madeForYouSongs,
				...trendingSongs,
			];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Welcome Back!</h1>

					<FeaturedSection />

					<div className='space-y-8'>
						
						<SectionGrid title='You May Listen' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='On Trending' songs={trendingSongs} isLoading={isLoading} />
						{/* Section hiển thị recentPlays nếu có */}
						{recentPlays.length > 0 && (
							<SectionGrid title='Recently Played' songs={recentPlays} isLoading={isLoading} />
						)}
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};
export default HomePage;
