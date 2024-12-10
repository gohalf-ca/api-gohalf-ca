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
            VALUES ($1, $2)
            ON CONFLICT (email) DO UPDATE SET clerk_id = $1
            RETURNING *;
        `;
        const result = await db.query(sql, [clerk_id, email]);
        if (result.rows.length === 0) {
            throw new Error("Failed to create user");
        }
        return result.rows[0];
    } catch (err) {
        console.error(err.message);
    }
}

/** get user id
 * @param {string} clerk_id - The clerk_id of the user.
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
 * */
export const get_user_by_clerk_id = async (clerk_id) => {
    const db = await connect_to_db();
    try {
        const sql = `
            SELECT user_id
            FROM users
            WHERE clerk_id = $1;
        `;
        const result = await db.query(sql, [clerk_id]);
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }
        return result.rows[0];
    } catch (err) {
        console.error(err.message);
    }
}


export const get_user_id = async (req, res) => {
    const db = await connect_to_db();



    try {
        const { clerk_id } = req.params;

        const sql = `
        SELECT user_id 
        FROM users 
        WHERE clerk_id = $1;
        `
        const userID = await db.query(sql, [clerk_id]);

        //filtering to just get id number
        const userIDNum = userID.rows[0].user_id;
        res.status(201).json({ ID: userIDNum });

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Issue occured" })
    }
}
