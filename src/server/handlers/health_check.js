import { connect_to_db } from '../../database/database.js';

/** health_check
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
*/
export const health_check = async (_, res) => {
    const db = await connect_to_db();
    console.log("db", db);
    if (!db) {
        res.status(500).json({ server_status: 'ok', database_status: 'not connected' });
    }
    res.status(200).json({ server_status: 'ok', database_status: "connected" });
}
