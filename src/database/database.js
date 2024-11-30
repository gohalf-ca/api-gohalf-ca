import pg from 'pg';
import config from '../lib/config.js'

if (!config.db.url) {
    throw new Error('Missing DATABASE_URL in .env file');
}

/**
 * @type {import('pg').Pool | null}
 */
let db = null;

/**
 * Connect to the database.
 * @returns {Promise<import('pg').Pool>}
 */
export const connect_to_db = async () => {
    if (db) {
        return db;
    }

    try {
        db = new pg.Pool({
            user: config.db.user,
            host: config.db.host,
            database: config.db.name,
            password: config.db.password,
            port: config.db.port,
            max: 1,
            idleTimeoutMillis: 30000,
        });

        // Defer (clean up) the connection when the process is terminated.
        process.on('SIGINT', async () => {
            db.end();
            process.exit(0);
        });

        return db;
    } catch (err) {
        const e = new Error('Failed to connect to the database');
        console.error(e.message, err);
        throw e;
    }
};

