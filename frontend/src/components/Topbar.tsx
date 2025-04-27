import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedOut, SignedIn, SignOutButton, UserButton } from "@clerk/clerk-react";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
    const { isAdmin } = useAuthStore();
    console.log({ isAdmin })

    return (
        <div className="flex items-center justify-between p-4 sticky top-0 
        bg-zinc-900/50 dark:bg-zinc-900/75 backdrop-blur-md z-10">
            {/* <div className="flex gap-2 items-center">
                Musi
            </div> */}
            <img className="size-10 text-black" src="/logo.png" />
            <div className="flex items-center gap-4">
                {isAdmin && (
                    <Link to={"/admin"}
                        className= {cn(buttonVariants({variant: "outline"}))}>
                        <LayoutDashboardIcon className="size-4 mr-2" />
                        Admin Dashboard
                    </Link>
                )}
                {/* <SignedIn>
                    <SignOutButton />
                </SignedIn> */}
                <SignedOut>
                    <SignInOAuthButtons />
                </SignedOut>

                <UserButton />
            </div>
        </div>
    )
}

export default Topbar;