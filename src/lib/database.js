import postgres from 'postgres';
import config from './config.js';

if (!config.db.url) {
    throw new Error('Missing DATABASE_URL in .env file');
}

let db = null;

const connectToDb = async () => {
    if (db) {
        return db;
    }

    try {
        db = postgres(config.db.url)

        // Defer (clean up) the connection when the process is terminated.
        process.on('SIGINT', async () => {
            await client.close();
            process.exit(0);
        });

        return db;
    } catch (err) {
        const e = new Error('Failed to connect to the database');
        console.error(e.message, err);
        throw e;
    }
};

export default connectToDb;
