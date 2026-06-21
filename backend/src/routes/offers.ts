import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const offersRouter = Router();

offersRouter.get('/', async (req, res, next) => {
  try {
    const offers = await prisma.offer.findMany({
      where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] },
      orderBy: { createdAt: 'desc' },
      include: { firm: { select: { name: true, slug: true, logo: true } } },
    });
    res.json({ success: true, data: offers });
  } catch (e) { next(e); }
});

offersRouter.post('/:id/click', async (req, res, next) => {
  try {
    await prisma.offer.update({ where: { id: req.params.id }, data: { clicks: { increment: 1 } } });
    const offer = await prisma.offer.findUnique({ where: { id: req.params.id }, select: { affiliateUrl: true, firm: { select: { affiliateUrl: true, websiteUrl: true } } } });
    if (!offer) return res.status(404).json({ success: false });
    const url = offer.affiliateUrl || offer.firm.affiliateUrl || offer.firm.websiteUrl;
    res.json({ success: true, url });
  } catch (e) { next(e); }
});
