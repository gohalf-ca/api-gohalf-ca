import { Router } from 'express';
// import config from './config';

const routes = Router();

// routes.route()

routes.get('/health_check', (_, res) => {
    res.status(200).send('OK');
})

export default routes;
