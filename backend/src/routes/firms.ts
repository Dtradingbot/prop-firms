import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const firmsRouter = Router();

firmsRouter.get('/', async (req, res, next) => {
  try {
    const {
      page = '1', limit = '20', search, broker, platform,
      minFunding, maxFunding, profitSplit, country,
      instantFunding, evaluationType, sort = 'rating',
      featured, trending,
    } = req.query as Record<string, string>;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (broker) where.broker = { slug: broker };
    if (country) where.country = { equals: country, mode: 'insensitive' };
    if (instantFunding === 'true') where.instantFunding = true;
    if (evaluationType) where.evaluationType = evaluationType;
    if (featured === 'true') where.isFeatured = true;
    if (trending === 'true') where.isTrending = true;
    if (minFunding) where.maxFunding = { gte: Number(minFunding) };
    if (maxFunding) where.maxFunding = { ...where.maxFunding, lte: Number(maxFunding) };
    if (profitSplit) where.profitSplit = { gte: Number(profitSplit) };
    if (platform) where.platforms = { some: { platform: { slug: platform } } };

    const orderBy: any = {
      rating: { rating: 'desc' },
      reviews: { reviewCount: 'desc' },
      newest: { createdAt: 'desc' },
      funding: { maxFunding: 'desc' },
      trending: { clickCount: 'desc' },
    }[sort] || { rating: 'desc' };

    const [total, firms] = await Promise.all([
      prisma.propFirm.count({ where }),
      prisma.propFirm.findMany({
        where, skip, take: Number(limit), orderBy,
        select: {
          id: true, slug: true, name: true, logo: true, shortDescription: true,
          rating: true, trustScore: true, reviewCount: true, maxFunding: true,
          minFunding: true, profitSplit: true, maxProfitSplit: true,
          evaluationType: true, instantFunding: true, isFeatured: true,
          isTrending: true, isVerified: true, country: true, clickCount: true,
          broker: { select: { name: true, slug: true, logo: true } },
          platforms: { select: { platform: { select: { name: true, slug: true, logo: true } } } },
          offers: { where: { isActive: true }, select: { couponCode: true, discount: true, title: true }, take: 1 },
        },
      }),
    ]);

    res.json({ success: true, data: firms, total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    next(e);
  }
});

firmsRouter.get('/featured', async (req, res, next) => {
  try {
    const firms = await prisma.propFirm.findMany({
      where: { isFeatured: true, isActive: true },
      take: 6,
      orderBy: { rating: 'desc' },
      select: {
        id: true, slug: true, name: true, logo: true, rating: true, trustScore: true,
        maxFunding: true, profitSplit: true, evaluationType: true, instantFunding: true,
        broker: { select: { name: true } },
      },
    });
    res.json({ success: true, data: firms });
  } catch (e) { next(e); }
});

firmsRouter.get('/trending', async (req, res, next) => {
  try {
    const firms = await prisma.propFirm.findMany({
      where: { isTrending: true, isActive: true },
      take: 8,
      orderBy: { clickCount: 'desc' },
      select: {
        id: true, slug: true, name: true, logo: true, rating: true,
        maxFunding: true, profitSplit: true, clickCount: true, reviewCount: true,
      },
    });
    res.json({ success: true, data: firms });
  } catch (e) { next(e); }
});

firmsRouter.get('/top-rated', async (req, res, next) => {
  try {
    const firms = await prisma.propFirm.findMany({
      where: { isActive: true, reviewCount: { gte: 1 } },
      take: 10,
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      select: {
        id: true, slug: true, name: true, logo: true, rating: true,
        trustScore: true, reviewCount: true, maxFunding: true, profitSplit: true,
      },
    });
    res.json({ success: true, data: firms });
  } catch (e) { next(e); }
});

firmsRouter.get('/:slug', async (req, res, next) => {
  try {
    const firm = await prisma.propFirm.findUnique({
      where: { slug: req.params.slug },
      include: {
        broker: true,
        platforms: { include: { platform: true } },
        programs: true,
        offers: { where: { isActive: true } },
        faqs: { orderBy: { order: 'asc' } },
        rules: true,
        reviews: {
          where: { status: 'APPROVED' },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, avatar: true } } },
        },
      },
    });

    if (!firm) return next(new AppError('Firm not found', 404));

    await prisma.propFirm.update({
      where: { id: firm.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({ success: true, data: firm });
  } catch (e) { next(e); }
});

firmsRouter.get('/:slug/compare', async (req, res, next) => {
  try {
    const slugs = (req.query.slugs as string)?.split(',') || [req.params.slug];
    const firms = await prisma.propFirm.findMany({
      where: { slug: { in: slugs } },
      include: {
        broker: { select: { name: true } },
        platforms: { include: { platform: { select: { name: true } } } },
        programs: true,
      },
    });
    res.json({ success: true, data: firms });
  } catch (e) { next(e); }
});
