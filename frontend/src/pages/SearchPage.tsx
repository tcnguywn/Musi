import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchStore } from "@/stores/useSearchStore";
import Topbar from "@/components/Topbar.tsx";
import SectionGrid from "@/components/homePage/SectionGrid.tsx";
import AlbumSection from "@/components/searchPage/AlbumSections.tsx";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("q")?.trim() || "";

    const {
        searchSongs,
        searchAlbums,
        searchAlbumsFromSongs,
        resultSongs,
        resultAlbums,
        resultAlbumsFromSongs,
        isLoading,
    } = useSearchStore();

    useEffect(() => {
        if (keyword.trim()) {
            searchSongs(keyword);
            searchAlbums(keyword);
            searchAlbumsFromSongs(keyword);
        }
    }, [keyword]);


    return (
        <main className="h-full bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-md overflow-hidden">
            <Topbar />
            <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-6">
                        Search results for:{" "}
                        <span className="italic text-white">"{keyword}"</span>
                    </h1>

                    <div className="space-y-10">
                        {resultSongs.length > 0 && (
                            <SectionGrid
                                title="Songs"
                                songs={resultSongs}
                                isLoading={isLoading}
                            />
                        )}

                        {resultAlbums.length > 0 && (
                            <AlbumSection
                                title="Albums"
                                albums={resultAlbums}
                                isLoading={isLoading}
                            />
                        )}

                        {resultAlbumsFromSongs.length > 0 && (
                            <AlbumSection
                                title="Albums from Songs"
                                albums={resultAlbumsFromSongs}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                </div>
            </ScrollArea>
        </main>
    );
};

export default SearchPage;
