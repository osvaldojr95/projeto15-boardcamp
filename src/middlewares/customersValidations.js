import connection from '../controllers/database.js';
import Joi from "joi";

const customerSchema = Joi.object({
    name: Joi.string().alphanum().min(1).required(),
    phone: Joi.string().min(10).max(11).required(),
    cpf: Joi.string().min(11).max(11).required(),
    birthday: Joi.date().iso().required(),
})

export async function validateCustomer(req, res, next) {
    const { name, phone, cpf, birthday } = req.body;

    const validation = customerSchema.validate({ name, phone, cpf, birthday }, { abortEarly: false });
    if (validation.error) {
        return res.sendStatus(400);
    }

    next();
}