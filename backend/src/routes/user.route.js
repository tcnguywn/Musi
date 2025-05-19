import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {addToListenHistory, getAllUsers, getMessages, getRecentPlays} from "../controller/user.controller.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.get("/histories",protectRoute,getRecentPlays);
router.post("/histories",protectRoute,addToListenHistory);

export default router;