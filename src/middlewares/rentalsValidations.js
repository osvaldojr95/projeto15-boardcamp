import connection from '../controllers/database.js';
import Joi from "joi";

const rentalSchema = Joi.object({
    customerId: Joi.number().positive().required(),
    gameId: Joi.number().positive().required(),
    daysRented: Joi.number().positive().required(),
})

export async function validateRental(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    const validation = rentalSchema.validate({ customerId, gameId, daysRented }, { abortEarly: false });
    if (validation.error) {
        return res.sendStatus(400);
    }

    try {
        const customerExist = await connection.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
        if (!customerExist.rows[0]) {
            return res.sendStatus(400);
        }
        const gameExist = await connection.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
        if (!gameExist.rows[0]) {
            return res.sendStatus(400);
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }

    next();
}