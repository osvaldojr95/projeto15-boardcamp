import connection from '../controllers/database.js';
import Joi from "joi";

const categorySchema = Joi.string().alphanum().min(1).required();

export async function validateCategoy(req, res, next) {
    const { name } = req.body;

    if (!name) {
        return res.sendStatus(400);
    }

    const validation = categorySchema.validate(name, { abortEarly: false });
    if (validation.error) {
        return res.sendStatus(400);
    }

    try {
        const exist = await connection.query(`SELECT * FROM categories WHERE name=$1`, [name]);
        if (exist.rows[0]) {
            return res.sendStatus(409);
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }

    next();
}