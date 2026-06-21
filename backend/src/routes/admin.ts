import { Router } from 'express';
import slugify from 'slugify';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { AppError } from '../middleware/errorHandler';

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole('EDITOR', 'SUPER_ADMIN'));

// ---- PROP FIRMS ----
adminRouter.get('/firms', async (req, res, next) => {
  try {
    const { page = '1', limit = '20', search } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [total, firms] = await Promise.all([
      prisma.propFirm.count({ where }),
      prisma.propFirm.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' }, include: { broker: { select: { name: true } } } }),
    ]);
    res.json({ success: true, data: firms, total });
  } catch (e) { next(e); }
});

adminRouter.post('/firms', upload.single('logo'), async (req: AuthRequest, res, next) => {
  try {
    const { name, ...rest } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const existing = await prisma.propFirm.findUnique({ where: { slug } });
    if (existing) return next(new AppError('Firm with this name already exists', 409));

    const firm = await prisma.propFirm.create({
      data: {
        name, slug,
        logo: req.file ? `/uploads/${req.file.filename}` : undefined,
        description: rest.description,
        shortDescription: rest.shortDescription,
        websiteUrl: rest.websiteUrl,
        affiliateUrl: rest.affiliateUrl,
        maxFunding: rest.maxFunding ? Number(rest.maxFunding) : undefined,
        minFunding: rest.minFunding ? Number(rest.minFunding) : undefined,
        profitSplit: rest.profitSplit ? Number(rest.profitSplit) : undefined,
        maxProfitSplit: rest.maxProfitSplit ? Number(rest.maxProfitSplit) : undefined,
        maxDrawdown: rest.maxDrawdown ? Number(rest.maxDrawdown) : undefined,
        dailyDrawdown: rest.dailyDrawdown ? Number(rest.dailyDrawdown) : undefined,
        isFeatured: rest.isFeatured === 'true',
        isTrending: rest.isTrending === 'true',
        instantFunding: rest.instantFunding === 'true',
        country: rest.country,
        evaluationType: rest.evaluationType,
        brokerId: rest.brokerId || undefined,
        metaTitle: rest.metaTitle,
        metaDescription: rest.metaDescription,
        payoutFrequency: rest.payoutFrequency,
        founded: rest.founded,
      },
    });
    res.status(201).json({ success: true, data: firm });
  } catch (e) { next(e); }
});

adminRouter.put('/firms/:id', upload.single('logo'), async (req: AuthRequest, res, next) => {
  try {
    const data: any = { ...req.body };
    if (req.file) data.logo = `/uploads/${req.file.filename}`;
    ['maxFunding', 'minFunding', 'profitSplit', 'maxProfitSplit', 'maxDrawdown', 'dailyDrawdown', 'ratingOverride'].forEach(f => {
      if (data[f]) data[f] = Number(data[f]);
    });
    ['isFeatured', 'isTrending', 'instantFunding', 'isActive', 'scalingPlan'].forEach(f => {
      if (data[f] !== undefined) data[f] = data[f] === 'true' || data[f] === true;
    });
    const firm = await prisma.propFirm.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: firm });
  } catch (e) { next(e); }
});

adminRouter.delete('/firms/:id', requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    await prisma.propFirm.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ---- BROKERS ----
adminRouter.get('/brokers', async (req, res, next) => {
  try {
    const brokers = await prisma.broker.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: brokers });
  } catch (e) { next(e); }
});

adminRouter.post('/brokers', upload.single('logo'), async (req, res, next) => {
  try {
    const { name, ...rest } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const broker = await prisma.broker.create({
      data: { name, slug, logo: req.file ? `/uploads/${req.file.filename}` : undefined, ...rest },
    });
    res.status(201).json({ success: true, data: broker });
  } catch (e) { next(e); }
});

adminRouter.put('/brokers/:id', upload.single('logo'), async (req, res, next) => {
  try {
    const data: any = { ...req.body };
    if (req.file) data.logo = `/uploads/${req.file.filename}`;
    const broker = await prisma.broker.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: broker });
  } catch (e) { next(e); }
});

adminRouter.delete('/brokers/:id', requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    await prisma.broker.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ---- OFFERS ----
adminRouter.get('/offers', async (req, res, next) => {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { firm: { select: { name: true, slug: true } } },
    });
    res.json({ success: true, data: offers });
  } catch (e) { next(e); }
});

adminRouter.post('/offers', async (req, res, next) => {
  try {
    const data = { ...req.body, discount: req.body.discount ? Number(req.body.discount) : undefined, expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined };
    const offer = await prisma.offer.create({ data });
    res.status(201).json({ success: true, data: offer });
  } catch (e) { next(e); }
});

adminRouter.put('/offers/:id', async (req, res, next) => {
  try {
    const data = { ...req.body, discount: req.body.discount ? Number(req.body.discount) : undefined, expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined };
    const offer = await prisma.offer.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: offer });
  } catch (e) { next(e); }
});

adminRouter.delete('/offers/:id', async (req, res, next) => {
  try {
    await prisma.offer.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ---- REVIEWS ----
adminRouter.get('/reviews', async (req, res, next) => {
  try {
    const { status } = req.query as { status?: string };
    const reviews = await prisma.review.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        firm: { select: { name: true, slug: true } },
      },
    });
    res.json({ success: true, data: reviews });
  } catch (e) { next(e); }
});

// ---- BLOG ----
adminRouter.get('/blog', async (req, res, next) => {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: posts });
  } catch (e) { next(e); }
});

adminRouter.post('/blog', upload.single('featuredImage'), async (req: AuthRequest, res, next) => {
  try {
    const { title, ...rest } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const post = await prisma.blogPost.create({
      data: {
        title, slug,
        content: rest.content,
        excerpt: rest.excerpt,
        featuredImage: req.file ? `/uploads/${req.file.filename}` : undefined,
        authorId: req.user!.id,
        isPublished: rest.isPublished === 'true',
        publishedAt: rest.isPublished === 'true' ? new Date() : undefined,
        metaTitle: rest.metaTitle,
        metaDescription: rest.metaDescription,
      },
    });
    res.status(201).json({ success: true, data: post });
  } catch (e) { next(e); }
});

adminRouter.put('/blog/:id', upload.single('featuredImage'), async (req: AuthRequest, res, next) => {
  try {
    const data: any = { ...req.body };
    if (req.file) data.featuredImage = `/uploads/${req.file.filename}`;
    if (data.isPublished === 'true' && !data.publishedAt) data.publishedAt = new Date();
    const post = await prisma.blogPost.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: post });
  } catch (e) { next(e); }
});

adminRouter.delete('/blog/:id', requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ---- PAGES (CMS) ----
adminRouter.get('/pages', async (req, res, next) => {
  try {
    const pages = await prisma.page.findMany({ orderBy: { slug: 'asc' } });
    res.json({ success: true, data: pages });
  } catch (e) { next(e); }
});

adminRouter.put('/pages/:id', async (req, res, next) => {
  try {
    const page = await prisma.page.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: page });
  } catch (e) { next(e); }
});

// ---- MENUS ----
adminRouter.get('/menus', async (req, res, next) => {
  try {
    const menus = await prisma.menu.findMany();
    res.json({ success: true, data: menus });
  } catch (e) { next(e); }
});

adminRouter.put('/menus/:location', async (req, res, next) => {
  try {
    const menu = await prisma.menu.upsert({
      where: { location: req.params.location },
      update: { items: req.body.items },
      create: { location: req.params.location, items: req.body.items },
    });
    res.json({ success: true, data: menu });
  } catch (e) { next(e); }
});

// ---- SETTINGS ----
adminRouter.get('/settings', requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const settings = await prisma.setting.findMany();
    res.json({ success: true, data: settings });
  } catch (e) { next(e); }
});

adminRouter.put('/settings/:key', requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const setting = await prisma.setting.upsert({
      where: { key: req.params.key },
      update: { value: req.body.value },
      create: { key: req.params.key, value: req.body.value },
    });
    res.json({ success: true, data: setting });
  } catch (e) { next(e); }
});

// ---- USERS ----
adminRouter.get('/users', requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
    res.json({ success: true, data: users });
  } catch (e) { next(e); }
});

adminRouter.put('/users/:id/role', requireRole('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { role: req.body.role } });
    res.json({ success: true, data: { id: user.id, role: user.role } });
  } catch (e) { next(e); }
});
