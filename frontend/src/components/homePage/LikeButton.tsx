import { Button } from "@/components/ui/button.tsx";
import { Song } from "@/types";
import { Heart } from "lucide-react";
import { axiosInstance } from "@/lib/axios.ts";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const LikeButton = ({ song }: { song: Song }) => {
    const { user } = useUser();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Tạo hàm riêng để kiểm tra trạng thái yêu thích
    const checkFavoriteStatus = useCallback(async () => {
        if (!user?.id) return;

        try {
            setIsLoading(true);
            const response = await axiosInstance.get("/users/favourites");
            const favorites = response.data;

            // Chuyển sang chuỗi để so sánh chính xác
            const isSongFavorite = favorites.some(
                (favSong: Song) => favSong._id.toString() === song._id.toString()
            );
            setIsFavorite(isSongFavorite);
        } catch (error) {
            console.error("Error checking favorite status:", error);
        } finally {
            setIsLoading(false);
        }
    }, [song._id, user?.id]);

    // Kiểm tra trạng thái yêu thích khi component mount hoặc song/user thay đổi
    useEffect(() => {
        checkFavoriteStatus();
    }, [checkFavoriteStatus]);

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        // Ngăn sự kiện click lan ra các phần tử cha
        e.stopPropagation();

        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
            return;
        }

        setIsLoading(true);
        try {
            if (isFavorite) {
                // Xóa khỏi danh sách yêu thích
                await axiosInstance.delete(`/users/favourites/${song._id}`);
                toast.success("Đã xóa khỏi danh sách yêu thích");
            } else {
                // Thêm vào danh sách yêu thích
                await axiosInstance.post("/users/favourites/add", {
                    songId: song._id
                });
                toast.success("Đã thêm vào danh sách yêu thích");
            }

            // Cập nhật trạng thái
            setIsFavorite(!isFavorite);
        } catch (error: any) {
            console.error("Lỗi khi thao tác với danh sách yêu thích:", error);
            // Hiển thị thông báo lỗi chi tiết nếu có
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
            toast.error(errorMessage);

            // Cập nhật lại trạng thái nếu có lỗi
            checkFavoriteStatus();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            size={"icon"}
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`absolute bottom-3 left-2 
                ${isFavorite ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-700 hover:bg-gray-600'} 
                hover:scale-105 transition-all 
                opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0`}
        >
            <Heart
                className={`size-5 ${isFavorite ? 'fill-white text-white' : 'text-white'}`}
            />
        </Button>
    );
};

export default LikeButton;