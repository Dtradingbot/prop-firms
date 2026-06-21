import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const brokersRouter = Router();

brokersRouter.get('/', async (req, res, next) => {
  try {
    const brokers = await prisma.broker.findMany({
      where: { isActive: true },
      orderBy: { rating: 'desc' },
      include: { firms: { select: { name: true, slug: true, logo: true } } },
    });
    res.json({ success: true, data: brokers });
  } catch (e) { next(e); }
});

brokersRouter.get('/:slug', async (req, res, next) => {
  try {
    const broker = await prisma.broker.findUnique({
      where: { slug: req.params.slug },
      include: { firms: { select: { name: true, slug: true, logo: true, rating: true, maxFunding: true } } },
    });
    if (!broker) return res.status(404).json({ success: false, message: 'Broker not found' });
    res.json({ success: true, data: broker });
  } catch (e) { next(e); }
});
