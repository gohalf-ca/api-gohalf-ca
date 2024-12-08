import { connect_to_db } from '../../database/database.js';

/** create trip
 * @param {string} owner_id - The owner_id of the user.
 * @param {string} trip_name - The name of the trip.
 * @param {string} trip_desc - The description of the trip.
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
*/
export const create_trip = async (owner_id, trip_name, trip_desc) => {
    const db = await connect_to_db();
    try {
        db.query('BEGIN');

        // generate unique code
        const code = Math.random().toString(36).substring(2, 8);

        // create trip
        const create_trip_sql = `
            INSERT INTO trips (owner_id, name, description, code)
            VALUES ($1, $2, $3, $4)
            RETURNING trip_id;
        `;
        const trip_result = await db.query(create_trip_sql, [owner_id, trip_name, trip_desc, code]);

        // Add owner to user_trips
        const add_owner_sql = `
            INSERT INTO user_trips (trip_id, user_id, is_owner)
            VALUES ($1, $2, TRUE);
        `;
        await db.query(add_owner_sql, [trip_result.rows[0].trip_id, owner_id]);

        await db.query('COMMIT');
        return trip_result.rows[0].trip_id;
    } catch (err) {
        await db.query('ROLLBACK');
        console.error("Failed to create ", err.message);
        return err;
    }
}

/** get trip
 * @param {string} trip_code - The code of the trip.
 * @returns {Promise<import('pg').QueryResult.rows>} - The result of the query.
*/
export const get_trip_by_code = async (trip_code) => {
    try {
        const db = await connect_to_db();
        const sql = `
            SELECT * FROM trips
            WHERE code = $1;
        `;
        const result = await db.query(sql, [trip_code]);
        return result.rows[0];
    } catch (err) {
        console.error("Failed to get trip by code", err.message);
    }
}

/** get trip
 * @param {string} trip_id - The id of the trip.
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
*/
export const get_trip_by_id = async (trip_id) => {
    try {
        const db = await connect_to_db();
        const sql = `
            SELECT * FROM trips
            WHERE trip_id = $1;
        `;
        const result = await db.query(sql, [trip_id]);
        return result.rows[0];
    } catch (err) {
        console.error("Failed to get trip by id", err.message);
        return err;
    }
}

/** update trip
 * @param {string} trip_id - The id of the trip.
 * @param {string} owner_id - The owner_id of the user.
 * @param {string} trip_name - The name of the trip.
 * @param {string} trip_desc - The description of the trip.
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
*/
export const update_trip = async (trip_id, owner_id, trip_name, trip_desc) => {
    try {
        const db = await connect_to_db();
        const sql = `
            UPDATE trips
            SET owner_id = COALESCE($2, owner_id),
                name = COALESCE($3, name),
                description = COALESCE($4, description)
            WHERE trip_id = $1;
        `;
        void db.query(sql, [trip_id, owner_id, trip_name, trip_desc]);
    } catch (err) {
        console.error("Failed to create ", err.message);
        return err;
    }
}

/** delete trip
 * @param {string} trip_id - The id of the trip.
 * @returns {Promise<import('pg').QueryResult>} - The result of the query.
*/
export const delete_trip = async (trip_id) => {
    try {
        const db = await connect_to_db();
        const sql = `
            DELETE FROM trips
            WHERE trip_id = $1;
        `;
        void db.query(sql, [trip_id]);
    } catch (err) {
        console.error("Failed to delete trip", err.message);
        return err;
    }
}

//getting all trips of user
export const get_all_trips = async (clerk_id) => {
    try {
        const db = await connect_to_db();
        // INFO: get all trips of a user, including the trips they own and the trips they are part of
        const sql = `
            SELECT t.* FROM trips t
            JOIN user_trips ut
            ON t.trip_id = ut.trip_id
            JOIN users u
            ON u.user_id = ut.user_id
            WHERE u.clerk_id = $1;
            `;
        const result = await db.query(sql, [clerk_id]);
        return result.rows;

    } catch (err) {
        console.log(err);
        return err;
    }
}

/** join a trip by code
 * @param {string} trip_id - The id of the trip.
 * @param {string} user_id - The id of the user.
 * @returns {Promise<import('pg').QueryResult>.rows} - The result of the query.
*/
export const join_trip = async (trip_id, user_id) => {
    try {
        const db = await connect_to_db();
        const sql = `
            INSERT INTO user_trips (trip_id, user_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await db.query(sql, [trip_id, user_id]);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

