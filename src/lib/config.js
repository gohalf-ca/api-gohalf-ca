import dotenv from "dotenv";

const { error, parsed } = dotenv.config();

if (error) {
    throw new Error('Failed to load .env file');
}

if (parsed) {
    console.log('Loaded .env file');
}

export default {
    port: process.env.APP_PORT,
    db: {
        url: process.env.DATABASE_URL,
        user: process.env.APP_DATABASE_USERNAME,
        password: process.env.APP_DATABASE_PASSWORD,
        name: process.env.APP_DATABASE_NAME,
        host: process.env.APP_DATABASE_HOST,
        port: process.env.APP_DATABASE_PORT
    }
}
