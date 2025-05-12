import { useAuthStore } from "@/stores/useAuthStore.tsx";
import Header from "../components/adminPage/Header.tsx";
import DashboardStats from "../components/adminPage/DashboardStats.tsx";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs.tsx";
import { TabsList } from "@radix-ui/react-tabs";
import { Album, Music } from "lucide-react";
import SongsTabContent from "../components/adminPage/SongsTabContent.tsx";
import AlbumsTabContent from "../components/adminPage/AlbumsTabContent.tsx";
import { useMusicStore } from "@/stores/useMusicStore.tsx";
import { useEffect } from "react";

const AdminPage = () => {

    const { isAdmin, isLoading } = useAuthStore();
    const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();
    useEffect(() => {
        fetchAlbums();
        fetchSongs();
        fetchStats();
    }, [ fetchAlbums, fetchSongs, fetchStats ]);

    if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

    
    return <div className="min-h-screen bg-gradient-to-b 
        from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
        {/* AdminPage */}
        <Header />

        <DashboardStats />

        <Tabs defaultValue="songs" className="space-y-6">
            <TabsList className="p-1 bg-zinc-800/50">
                <TabsTrigger value="songs" className="data-[state=active]:bg-zinc-700">
                    <Music className="mr-2 size-4"/>
                    Songs
                </TabsTrigger>

                <TabsTrigger value="albums" className="data-[state=active]:bg-zinc-700">
                    <Album className="mr-2 size-4"/>
                    Albums                        
                </TabsTrigger>
            </TabsList>

            <TabsContent value="songs">
                <SongsTabContent />
            </TabsContent>
            <TabsContent value="albums">
                <AlbumsTabContent />
            </TabsContent>
        </Tabs>
        
    </div>;
};

export default AdminPage;   