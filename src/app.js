import express from 'express';
import routes from './server/routes.js'
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes)

export default app;

