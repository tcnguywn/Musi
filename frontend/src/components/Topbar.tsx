import { LayoutDashboardIcon } from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import { SignedOut, UserButton } from "@clerk/clerk-react";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import {useState} from "react";

const Topbar = () => {
    const { isAdmin } = useAuthStore();
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 sticky top-0
			bg-zinc-900/50 dark:bg-zinc-900/75 backdrop-blur-md z-10">
            <div className="flex items-center">
                <img src="/logo.png" className="size-13" alt="Mu6" /> Mu6
            </div>

            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} className="w-full max-w-md mx-4">
                <input
                    type="text"
                    placeholder="Search for songs or albums..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white placeholder-zinc-400
						focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </form>

            <div className="flex items-center gap-4">
                {isAdmin && (
                    <Link
                        to={"/admin"}
                        className={cn(buttonVariants({ variant: "outline" }))}
                    >
                        <LayoutDashboardIcon className="size-4 mr-2" />
                        Admin Dashboard
                    </Link>
                )}
                <SignedOut>
                    <SignInOAuthButtons />
                </SignedOut>

                <UserButton />
            </div>
        </div>
    );
};

export default Topbar;