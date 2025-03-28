import { Button } from "./ui/button";
import { useSignIn } from "@clerk/clerk-react";
const SignInOAuthButtons = () => {
    const { signIn, isLoaded } = useSignIn();

    if (!isLoaded) return null;

    const SignInWithOAuth = () => {     // Using Google to SignIn
        signIn.authenticateWithRedirect ({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/auth-callback",  
        })
    }
    
    return <Button onClick={SignInWithOAuth} variant={"secondary"} className="w-full text-white border-zinc-200 h11">
        Login
    </Button>

}

export default SignInOAuthButtons;