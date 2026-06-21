import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const authRouter = Router();

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });

const signRefreshToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });

authRouter.post('/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('name').notEmpty(),
  ],
  async (req: AuthRequest, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new AppError(errors.array()[0].msg, 400));

    try {
      const { email, password, name } = req.body;
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) return next(new AppError('Email already in use', 409));

      const hashed = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { email, password: hashed, name },
        select: { id: true, email: true, name: true, role: true },
      });

      const token = signToken(user.id);
      const refreshToken = signRefreshToken(user.id);

      res.status(201).json({ success: true, token, refreshToken, user });
    } catch (e) {
      next(e);
    }
  }
);

authRouter.post('/login',
  [body('email').isEmail(), body('password').notEmpty()],
  async (req: AuthRequest, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Invalid credentials', 401));
      }

      const token = signToken(user.id);
      const refreshToken = signRefreshToken(user.id);

      res.json({
        success: true, token, refreshToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
      });
    } catch (e) {
      next(e);
    }
  }
);

authRouter.post('/refresh', async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new AppError('Refresh token required', 401));
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
    const token = signToken(payload.id);
    res.json({ success: true, token });
  } catch {
    next(new AppError('Invalid refresh token', 401));
  }
});

authRouter.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true },
    });
    res.json({ success: true, user });
  } catch (e) {
    next(e);
  }
});
