import express from 'express';
import { listCategories, insertCategory } from './../controllers/categoriesController.js';
import { validateCategoy } from './../middlewares/categoriesValidations.js';

const router = express.Router();
router.get("/categories", listCategories);
router.post("/categories", validateCategoy, insertCategory);

export default router;