import { Album } from "@/types";
import { Button } from "@/components/ui/button";
import SectionGridSkeleton from "@/components/homePage/SectionGridSkeleton.tsx";

type AlbumSectionProps = {
    title: string;
    albums: Album[];
    isLoading: boolean;
};

const AlbumSection = ({ albums, title, isLoading }: AlbumSectionProps) => {
    if (isLoading) return <SectionGridSkeleton />;

    if (albums.length === 0) return null;

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
                <Button variant="link" className="text-sm text-zinc-400 hover:text-white">
                    Show all
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {albums.map((album) => (
                    <div
                        key={album._id}
                        className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all cursor-pointer"
                    >
                        <div className="aspect-square rounded-md shadow-lg overflow-hidden mb-4">
                            <img
                                src={album.imageUrl}
                                alt={album.title}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                        <h3 className="font-medium mb-2 truncate">{album.title}</h3>
                        <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AlbumSection;
