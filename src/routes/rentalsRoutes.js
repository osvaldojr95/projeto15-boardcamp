import express from 'express';
import { listRentals, insertRental, endRental, removeRental } from './../controllers/rentalsController.js'
import { validateRental } from './../middlewares/rentalsValidations.js'

const router = express.Router();
router.get("/rentals", listRentals);
router.post("/rentals", validateRental, insertRental);
router.post("/rentals/:id/return", endRental);
router.delete("/rentals/:id", removeRental);

export default router;