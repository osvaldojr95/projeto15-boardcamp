import connection from '../controllers/database.js';
import Joi from "joi";

const gameSchema = Joi.object({
    name: Joi.string().alphanum().min(1).required(),
    image: Joi.string().min(1).required(),
    stockTotal: Joi.number().positive().required(),
    categoryId: Joi.number().positive().required(),
    pricePerDay: Joi.number().positive().required(),
})

export async function validateGame(req, res, next) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const validation = gameSchema.validate({ name, image, stockTotal, categoryId, pricePerDay }, { abortEarly: false });
    if (validation.error) {
        return res.sendStatus(400);
    }

    try {
        const categoryExist = await connection.query(`SELECT * FROM categories WHERE id=$1`, [categoryId]);
        if (!categoryExist.rows[0]) {
            return res.sendStatus(400);
        }
        const nameExist = await connection.query(`SELECT * FROM games WHERE LOWER(name) LIKE LOWER($1)`, [name]);
        if (nameExist.rows[0]) {
            return res.sendStatus(409);
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }

    next();
}