import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res , next) => {
    if(!req.auth.userId) {
        return res.status(401).json({message : 'Unauthorized - You must be login'});
    }

    next();
}

export const requireAdmin =  async(req,res,next) => {
    try {
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

        if(!isAdmin) {
            return res.status(403).json({message : "Unauthorized - You must be admin"});
        }

        next();
    } catch (error) {
        console.log("Error in auth callback", error);
        res.status(500).json({message : "Internal server error", error});
    }
}