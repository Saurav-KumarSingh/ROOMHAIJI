require('dotenv').config();
const express = require('express');
const cors = require('cors');

const prisma = require('./src/config/db');
const apiRoutes = require('./src/routes');
const { notFoundHandler, errorHandler } = require('./src/middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middlewares
app.use(cors());
app.use(express.json());

// Incoming Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// Root health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'ROOMHAIJI Backend API',
    version: '1.0.0',
    documentation: '/backend-architecture.md'
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  await prisma.checkDbConnection();
});

module.exports = app;
