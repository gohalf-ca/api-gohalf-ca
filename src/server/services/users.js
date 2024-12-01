import { connect_to_db } from '../../database/database.js';

/** create user
 * @param {string} clerk_id - The clerk_id of the user.
 * @param {string} email - The email of the user.
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
*/
export const create_user = async (clerk_id, email) => {
    const db = await connect_to_db();
    try {
        const sql = `
            INSERT INTO users (clerk_id, email)
            VALUES ($1, $2);
        `;
        void db.query(sql, [clerk_id, email]);
    } catch (err) {
        console.error("Failed to create user", err.message);
        return null;
    }
}
