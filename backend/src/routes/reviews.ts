import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { AppError } from '../middleware/errorHandler';

export const reviewsRouter = Router();

reviewsRouter.get('/firm/:firmId', async (req, res, next) => {
  try {
    const { page = '1', limit = '10' } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where: { firmId: req.params.firmId, status: 'APPROVED' } }),
      prisma.review.findMany({
        where: { firmId: req.params.firmId, status: 'APPROVED' },
        skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, avatar: true } } },
      }),
    ]);

    res.json({ success: true, data: reviews, total, page: Number(page) });
  } catch (e) { next(e); }
});

reviewsRouter.post('/',
  authenticate,
  upload.single('proofImage'),
  [
    body('firmId').notEmpty(),
    body('rating').isFloat({ min: 1, max: 5 }),
    body('body').isLength({ min: 10 }),
  ],
  async (req: AuthRequest, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new AppError(errors.array()[0].msg, 400));

    try {
      const { firmId, rating, title, body: reviewBody } = req.body;

      const existing = await prisma.review.findFirst({ where: { firmId, userId: req.user!.id } });
      if (existing) return next(new AppError('You already reviewed this firm', 409));

      const review = await prisma.review.create({
        data: {
          firmId, rating: Number(rating), title, body: reviewBody,
          userId: req.user!.id,
          proofImage: req.file ? `/uploads/${req.file.filename}` : undefined,
        },
      });

      res.status(201).json({ success: true, data: review });
    } catch (e) { next(e); }
  }
);

reviewsRouter.put('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) return next(new AppError('Review not found', 404));
    if (review.userId !== req.user!.id) return next(new AppError('Forbidden', 403));

    const updated = await prisma.review.update({
      where: { id: req.params.id },
      data: { rating: req.body.rating, title: req.body.title, body: req.body.body, status: 'PENDING' },
    });

    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
});

reviewsRouter.patch('/:id/status', authenticate, requireRole('EDITOR', 'SUPER_ADMIN'), async (req: AuthRequest, res, next) => {
  try {
    const { status } = req.body;
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { status },
    });

    if (status === 'APPROVED') {
      const agg = await prisma.review.aggregate({
        where: { firmId: review.firmId, status: 'APPROVED' },
        _avg: { rating: true },
        _count: { id: true },
      });
      await prisma.propFirm.update({
        where: { id: review.firmId },
        data: {
          rating: agg._avg.rating || 0,
          reviewCount: agg._count.id,
        },
      });
    }

    res.json({ success: true, data: review });
  } catch (e) { next(e); }
});
