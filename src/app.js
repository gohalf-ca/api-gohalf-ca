import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './server/routes.js'

const app = express();

//  INFO: cross-origin resource sharing
app.use(cors());

//  INFO: parse incoming requests with JSON payloads
app.use(express.json());

//  INFO: serve static files
app.use(express.static(path.join(path.dirname(import.meta.url), 'public')));

//  INFO: parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));

//  INFO: use routes
app.use(routes);

export default app;

