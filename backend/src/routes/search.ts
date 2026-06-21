import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const searchRouter = Router();

searchRouter.get('/', async (req, res, next) => {
  try {
    const { q } = req.query as { q: string };
    if (!q || q.length < 2) return res.json({ success: true, data: { firms: [], brokers: [], offers: [] } });

    const [firms, brokers, offers] = await Promise.all([
      prisma.propFirm.findMany({
        where: { isActive: true, OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] },
        take: 5,
        select: { slug: true, name: true, logo: true, rating: true, maxFunding: true },
      }),
      prisma.broker.findMany({
        where: { isActive: true, name: { contains: q, mode: 'insensitive' } },
        take: 3,
        select: { slug: true, name: true, logo: true, rating: true },
      }),
      prisma.offer.findMany({
        where: { isActive: true, title: { contains: q, mode: 'insensitive' } },
        take: 3,
        select: { id: true, title: true, discount: true, couponCode: true, firm: { select: { name: true, slug: true } } },
      }),
    ]);

    res.json({ success: true, data: { firms, brokers, offers } });
  } catch (e) { next(e); }
});
