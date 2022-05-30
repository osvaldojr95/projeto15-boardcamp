import express from 'express';
import { listCustomers, findCustomer, insertCustomer, updateCustomer } from "./../controllers/customersController.js";
import { validateCustomer } from "./../middlewares/customersValidations.js";

const router = express.Router();
router.get("/customers", listCustomers);
router.get("/customers/:id", findCustomer);
router.post("/customers", validateCustomer, insertCustomer);
router.put("/customers/:id", validateCustomer, updateCustomer);

export default router;