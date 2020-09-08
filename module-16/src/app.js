import 'dotenv/config';

import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import path from 'path';
import express from 'express';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import Youch from 'youch';
import 'express-async-errors';

import './database';
import routes from './routes';
import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    Sentry.init(sentryConfig);
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(helmet());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );

    this.server.use(
      new RateLimit({
        store: new RateLimitRedis({
          client: redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
          }),
        }),
        windowMs: 1000 * 60 * 15,
        max: 10,
      })
    );
  }

  routes() {
    this.server.use(routes);

    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
    // Optional fallthrough error handler
    this.server.use(this.exceptionHandler);
  }

  async exceptionHandler(err, req, res, next) {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      // The error id is attached to `res.sentry` to be returned
      // and optionally displayed to the user for support.
      const errors = await new Youch(err, req).toJSON();
      return res.status(500).json(errors);
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

const app = new App();

export default app.server;
