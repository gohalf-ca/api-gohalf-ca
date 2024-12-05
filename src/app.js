import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './server/routes.js'
import { clerk_webhook } from './server/handlers/webhook.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();

//  INFO: Clerk middleware
app.use(clerkMiddleware());

//  INFO: cross-origin resource sharing
app.use(cors());

app.post('/webhook', express.raw({ type: 'application/json' }), clerk_webhook)

//  INFO: parse incoming requests with JSON payloads
app.use(express.json());

//  INFO: serve static files
app.use(express.static(path.join(path.dirname(import.meta.url), 'public')));

//  INFO: parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));

//  INFO: use routes
app.use(routes);

export default app;

