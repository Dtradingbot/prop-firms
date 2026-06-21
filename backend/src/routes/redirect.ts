import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const redirectRouter = Router();

redirectRouter.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  const firm = await prisma.propFirm.findUnique({
    where: { slug },
    select: { id: true, affiliateUrl: true, websiteUrl: true },
  });

  if (!firm) return res.redirect('/');

  const target = firm.affiliateUrl || firm.websiteUrl;

  await prisma.click.create({
    data: {
      firmId: firm.id,
      source: req.query.source as string || 'direct',
      referrer: req.headers.referer || null,
      device: req.headers['user-agent'] || null,
      ip: (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').split(',')[0].trim(),
    },
  }).catch(() => {});

  await prisma.propFirm.update({
    where: { id: firm.id },
    data: { clickCount: { increment: 1 } },
  }).catch(() => {});

  res.redirect(302, target);
});
