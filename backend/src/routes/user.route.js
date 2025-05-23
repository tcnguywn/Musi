import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {addToListenHistory, getAllUsers, getMessages, getRecentPlays} from "../controller/user.controller.js";
import {addToFavourites, getFavouriteSongs, removeFromFavourites} from "../controller/favourite.controller.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.get("/histories",protectRoute,getRecentPlays);
router.post("/histories",protectRoute,addToListenHistory);
router.get("/favourites",protectRoute, getFavouriteSongs);
router.post("/favourites/add", protectRoute,addToFavourites);
router.delete("/favourites/:songId",protectRoute, removeFromFavourites);

export default router;