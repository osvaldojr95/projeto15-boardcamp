import express from 'express';
import categoriesRoutes from './categoriesRoutes.js';

const router = express.Router();
router.use(categoriesRoutes);
export default router;