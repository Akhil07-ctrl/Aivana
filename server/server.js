import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import passport from 'passport';

// Config & Utils
import connectDB from './src/config/db.js';

// Route imports
import authRoutes from './src/modules/auth/auth.routes.js';
import userRoutes from './src/modules/user/user.routes.js';
import productRoutes from './src/modules/product/product.routes.js';
import categoryRoutes from './src/modules/category/category.routes.js';
import orderRoutes from './src/modules/order/order.routes.js';
import cartRoutes from './src/modules/cart/cart.routes.js';
import reviewRoutes from './src/modules/review/review.routes.js';
import deliveryRoutes from './src/modules/delivery/delivery.routes.js';
import aiRoutes from './src/modules/ai/ai.routes.js';

// Middleware
import { errorHandler } from './src/middleware/errorHandler.js';
import { rateLimiter } from './src/middleware/rateLimiter.js';

// Passport config
import './src/modules/auth/passport.js';

// Socket handlers
import { initStockSocket } from './src/sockets/stockSocket.js';

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
  },
});

// Init socket handlers
initStockSocket(io);

// Security & parsing
app.use(helmet());
app.use(compression());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(rateLimiter);

// Passport
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', app: 'Aivana API' }));

// Global error handler
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`🚀 Aivana server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
