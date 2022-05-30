import dayjs from 'dayjs';
import connection from '../controllers/database.js';

export async function listCustomers(req, res) {
    const { cpf } = req.query;
    try {
        let obj;
        if (cpf) {
            const query = await connection.query(`
            SELECT * FROM customers
            WHERE LOWER(cpf) LIKE LOWER($1)`, [`${cpf}%`]);
            obj = query.rows.map((item) => {
                return {
                    ...item,
                    birthday: dayjs(item.birthday).format("YYYY-MM-DD"),
                }
            });
        } else {
            const query = await connection.query(`SELECT * FROM customers`);
            obj = query.rows.map((item) => {
                return {
                    ...item,
                    birthday: dayjs(item.birthday).format("YYYY-MM-DD"),
                }
            });
        }
        return res.status(200).send(obj);
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
        const obj = {
            ...query.rows[0],
            birthday: dayjs(query.rows[0].birthday).format("YYYY-MM-DD")
        }
        return res.status(200).send(obj);
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