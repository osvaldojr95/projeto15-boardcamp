import dayjs from 'dayjs';
import connection from '../controllers/database.js';

export async function listRentals(req, res) {
    const { customerId, gameId } = req.query;

    let whereCustomer = '';
    let whereGame = '';

    if (customerId) {
        whereCustomer = `WHERE r."customerId"=${customerId}`;
    }
    if (gameId) {
        whereGame = (whereCustomer ? `and r."gameId"=${gameId}` : `WHERE r."gameId"=${gameId}`);
    }

    const sql = `
        SELECT r.*,c.name,g.name as game,g."categoryId",ca.name as "categoryName" FROM rentals as r
        JOIN customers as c on r."customerId"=c.id
        JOIN games as g on r."gameId"=g.id
        JOIN categories as ca on g."categoryId"=ca.id
        ${whereCustomer}
        ${whereGame}
    `;

    try {
        const query = await connection.query(sql);
        const obj = query.rows.map((item) => {
            return {
                id: item.id,
                customerId: item.customerId,
                gameId: item.gameId,
                rentDate: dayjs(item.rentDate).format("YYYY-MM-DD"),
                daysRented: item.daysRented,
                returnDate: dayjs(item.returnDate).format("YYYY-MM-DD"),
                originalPrice: item.originalPrice,
                delayFee: item.delayFee,
                customer: {
                    id: item.customerId,
                    name: item.name
                },
                game: {
                    id: item.gameId,
                    name: item.game,
                    categoryId: item.categoryId,
                    categoryName: item.categoryName
                }
            }
        })
        return res.status(200).send(obj);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    try {
        const available = await connection.query(`SELECT * FROM rentals WHERE "gameId"=$1`, [gameId]);
        const gameInfo = await connection.query(`SELECT * FROM games WHERE id=$1`, [gameId]);

        if (available.rowCount < gameInfo.rows[0].stockTotal) {
            const rentDate = dayjs(Date.now()).format("YYYY-MM-DD");
            const originalPrice = gameInfo.rows[0].pricePerDay * daysRented;
            await connection.query(`
                INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") 
                VALUES ($1, $2, $3, $4, $5)`,
                [customerId, gameId, rentDate, daysRented, originalPrice]);
            return res.sendStatus(201);
        }
        return res.sendStatus(400);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function endRental(req, res) {
    const { id } = req.params;
    try {
        if (!id) {
            return res.sendStatus(404);
        }
        const query = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if (!query.rows[0]) {
            return res.sendStatus(404);
        }
        if (query.rows[0].returnDate !== null) {
            return res.sendStatus(400);
        }
        const returnDate = dayjs(Date.now()).format("YYYY-MM-DD");
        const gameInfo = await connection.query(`SELECT * FROM games WHERE id=$1`, [query.rows[0].gameId]);

        let hours = dayjs(returnDate).diff(query.rows[0].rentDate, 'hours');
        let days = Math.max(0, Math.floor(hours / 24) - query.rows[0].daysRented);
        const delayFee = days * gameInfo.rows[0].pricePerDay;

        await connection.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`, [returnDate, delayFee, id]);
        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function removeRental(req, res) {
    const { id } = req.params;
    try {
        if (!id) {
            return res.sendStatus(404);
        }
        const query = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if (!query.rows[0]) {
            return res.sendStatus(404);
        }
        if (query.rows[0].returnDate === null) {
            return res.sendStatus(400);
        }
        await connection.query(`DELETE FROM rentals WHERE id=$1`, [id]);
        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}