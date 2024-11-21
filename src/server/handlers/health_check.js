import { connect_to_db } from '../../lib/database.js';

/** health_check
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @returns {void} - No return value.
*/
export const health_check = (_, res) => {
    const db = connect_to_db();
    if (!db) {
        res.status(500).json({ server_status: 'ok', database_status: 'not connected' });
    }
    res.status(200).json({ server_status: 'ok', database_status: "connected" });
}
