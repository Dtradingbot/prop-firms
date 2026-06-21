import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

export const blogRouter = Router();

blogRouter.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '12', category, tag } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { isPublished: true };
    if (category) where.categories = { some: { category: { slug: category } } };
    if (tag) where.tags = { some: { tag: { slug: tag } } };

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where, skip, take: Number(limit),
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true, slug: true, title: true, excerpt: true, featuredImage: true,
          publishedAt: true, authorId: true,
          categories: { include: { category: { select: { name: true, slug: true } } } },
          tags: { include: { tag: { select: { name: true, slug: true } } } },
        },
      }),
    ]);

    res.json({ success: true, data: posts, total, page: Number(page) });
  } catch (e) { next(e); }
});

blogRouter.get('/:slug', async (req, res, next) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });
    if (!post || !post.isPublished) return res.status(404).json({ success: false });
    res.json({ success: true, data: post });
  } catch (e) { next(e); }
});
