import express from 'express';
import { listGames, insertGame } from './../controllers/gamesController.js'
import { validateGame } from './../middlewares/gamesValidations.js'

const router = express.Router();
router.get("/games", listGames);
router.post("/games", validateGame, insertGame);

export default router;