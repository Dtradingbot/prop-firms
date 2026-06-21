import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const pagesRouter = Router();

pagesRouter.get('/:slug', async (req, res, next) => {
  try {
    const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
    if (!page || !page.isPublished) return res.status(404).json({ success: false });
    res.json({ success: true, data: page });
  } catch (e) { next(e); }
});
