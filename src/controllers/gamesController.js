import connection from '../controllers/database.js';

export async function listGames(req, res) {
    const { name } = req.query;
    try {
        if (name) {
            const query = await connection.query(`
            SELECT g.*, j.name as "categoryName" FROM games as g 
            JOIN categories as j on g."categoryId"=j.id
            WHERE LOWER(g.name) LIKE LOWER($1)`, [`${name}%`]);
            return res.status(200).send(query.rows);
        } else {
            const query = await connection.query(`
            SELECT g.*, j.name as "categoryName" FROM games as g 
            JOIN categories as j on g."categoryId"=j.id`);
            return res.status(200).send(query.rows);
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function insertGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    try {
        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ($1, $2, $3, $4, $5)`,
            [name, image, stockTotal, categoryId, pricePerDay]);
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}