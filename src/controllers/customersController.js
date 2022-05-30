import connection from '../controllers/database.js';

export async function listCustomers(req, res) {
    const { cpf } = req.query;
    try {
        if (cpf) {
            const query = await connection.query(`
            SELECT * FROM customers
            WHERE LOWER(cpf) LIKE LOWER($1)`, [`${cpf}%`]);
            return res.status(200).send(query.rows);
        } else {
            const query = await connection.query(`SELECT * FROM customers`);
            return res.status(200).send(query.rows);
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function findCustomer(req, res) {
    const { id } = req.params;
    try {
        const query = await connection.query(`
            SELECT * FROM customers WHERE id=$1`, [id]);
        if (!query.rows[0]) {
            res.sendStatus(404);
        }
        return res.status(200).send(query.rows[0]);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function insertCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        const exist = await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if (exist.rows[0]) {
            return res.sendStatus(409);
        }

        await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
    try {
        const exist = await connection.query(`SELECT * FROM customers WHERE id=$1`, [id]);
        if (!exist.rows[0]) {
            return res.sendStatus(404);
        }

        const exist2 = await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if (exist2.rows[0] && exist2.rows[0].id !== Number(id)) {
            return res.sendStatus(409);
        }

        await connection.query(`
            UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5`, [name, phone, cpf, birthday, id]);
        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}