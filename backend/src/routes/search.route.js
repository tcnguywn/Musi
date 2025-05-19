import {Router} from "express";
import {searchAlbums, searchAlbumsFromSongs, searchSongs} from "../controller/search.controller.js";

const router = Router();

router.get('/songs', searchSongs);
router.get('/albums', searchAlbums);
router.get('/albums-from-songs', searchAlbumsFromSongs);

export default router;
