import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';

export const analyticsRouter = Router();

analyticsRouter.get('/dashboard', authenticate, requireRole('EDITOR', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const [totalFirms, totalReviews, totalOffers, totalClicks, pendingReviews] = await Promise.all([
      prisma.propFirm.count({ where: { isActive: true } }),
      prisma.review.count(),
      prisma.offer.count({ where: { isActive: true } }),
      prisma.click.count(),
      prisma.review.count({ where: { status: 'PENDING' } }),
    ]);

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentClicks = await prisma.click.count({ where: { createdAt: { gte: last30Days } } });

    const topFirms = await prisma.propFirm.findMany({
      orderBy: { clickCount: 'desc' },
      take: 5,
      select: { name: true, slug: true, clickCount: true, rating: true },
    });

    res.json({
      success: true,
      data: { totalFirms, totalReviews, totalOffers, totalClicks, pendingReviews, recentClicks, topFirms },
    });
  } catch (e) { next(e); }
});
