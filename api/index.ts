
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { connectDB } from '../server/config/db.js';
import { getJwtSecret } from '../server/middleware/auth.js';

import authRoutes from '../server/routes/authRoutes.js';
import studentRoutes from '../server/routes/studentRoutes.js';
import roomRoutes, { allocationRouter } from '../server/routes/roomRoutes.js';
import complaintRoutes from '../server/routes/complaintRoutes.js';
import leaveRoutes from '../server/routes/leaveRoutes.js';
import feeRoutes from '../server/routes/feeRoutes.js';
import noticeRoutes from '../server/routes/noticeRoutes.js';
import dashboardRoutes from '../server/routes/dashboardRoutes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Atlas before handling API requests.
// Reuse an existing connection when possible.
app.use(async (_req: Request, res: Response, next: NextFunction) => {
  try {
    getJwtSecret();
    await connectDB();
    next();
  } catch (error) {
    console.error('[Vercel API] Initialization failed:', error);
    res.status(503).json({
      success: false,
      message: 'API initialization failed. Check server configuration.',
    });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    status: mongoose.connection.readyState === 1 ? 'healthy' : 'database_unavailable',
    app: 'Smart Hostel Management System',
    database: mongoose.connection.name || 'unavailable',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/allocations', allocationRouter);
app.use('/api/complaints', complaintRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Intentionally do not expose /api/seed/reset in production.

app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

export default app;
