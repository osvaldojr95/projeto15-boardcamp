import express from 'express';
import categoriesRoutes from './categoriesRoutes.js';
import gamesRoutes from './gamesRoutes.js';
import customersRoutes from './customersRoutes.js';
import rentalsRoutes from './rentalsRoutes.js';

const router = express.Router();
router.use(categoriesRoutes);
router.use(gamesRoutes);
router.use(customersRoutes);
router.use(rentalsRoutes);
export default router;