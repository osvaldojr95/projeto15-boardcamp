import connection from '../controllers/database.js';

export async function listCategories(req, res) {
    try {
        const query = await connection.query(`SELECT * FROM categories`);
        return res.status(200).send(query.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function insertCategory(req, res) {
    try {
        await connection.query(`INSERT INTO categories (name) VALUES ($1)`, ['TESTE']);
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}