import express from 'express';
import categoriesRoutes from './categoriesRoutes.js';
import gamesRoutes from './gamesRoutes.js';

const router = express.Router();
router.use(categoriesRoutes);
router.use(gamesRoutes);
export default router;