import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const newsletterRouter = Router();

newsletterRouter.post('/subscribe',
  [body('email').isEmail()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new AppError('Valid email required', 400));

    try {
      await prisma.newsletter.upsert({
        where: { email: req.body.email },
        update: { isActive: true },
        create: { email: req.body.email },
      });
      res.json({ success: true, message: 'Subscribed successfully' });
    } catch (e) { next(e); }
  }
);
