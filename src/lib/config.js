import dotenv from "dotenv";

const { error, parsed } = dotenv.config();

if (error) {
    console.error('Failed to load .env file');
}

if (parsed) {
    console.log('Loaded .env file');
}

export default {
    clerk: {
        signing_secret: process.env.CLERK_SIGNING_SECRET,
        secret_key: process.env.CLERK_SECRET_KEY,
        publishable_key: process.env.CLERK_PUBLISHABLE_KEY,
    },
    port: process.env.APP_PORT,
    client: {
        url: process.env.CLIENT_URL,
    },
    db: {
        url: process.env.DATABASE_URL,
        user: process.env.APP_DATABASE_USERNAME,
        password: process.env.APP_DATABASE_PASSWORD,
        name: process.env.APP_DATABASE_NAME,
        host: process.env.APP_DATABASE_HOST,
        port: process.env.APP_DATABASE_PORT
    }
}
