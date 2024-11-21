import { connect_to_db } from '../../lib/database.js';
import { hash } from 'bcrypt'

/** register
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
*/
export const register = async (req, res) => {
    const db = await connect_to_db();

    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Missing username or password' });
    }
    const name = req.body.name || email.split('@')[0];
    const hashed_password = hash(password, 10);
    try {
        const sql = `
            INSERT INTO users (name, email, username, password)
            VALUES ($1, $2, $3, $4);
        `;
        const row = await db.query(sql, [name, email, username, hashed_password]);

        console.log("User created", row);
        res.json({ row });

    } catch (err) {
        return res.status(500).json({ error: 'Failed to create user', message: err.message });
    }
}
