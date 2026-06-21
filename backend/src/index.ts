import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import { authRouter } from './routes/auth';
import { firmsRouter } from './routes/firms';
import { brokersRouter } from './routes/brokers';
import { offersRouter } from './routes/offers';
import { reviewsRouter } from './routes/reviews';
import { blogRouter } from './routes/blog';
import { pagesRouter } from './routes/pages';
import { analyticsRouter } from './routes/analytics';
import { adminRouter } from './routes/admin';
import { redirectRouter } from './routes/redirect';
import { searchRouter } from './routes/search';
import { newsletterRouter } from './routes/newsletter';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

app.use('/api/auth', authRouter);
app.use('/api/firms', firmsRouter);
app.use('/api/brokers', brokersRouter);
app.use('/api/offers', offersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/blog', blogRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/search', searchRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/go', redirectRouter);

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`PropFirmHub API running on port ${PORT}`);
});

export default app;
