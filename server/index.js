import express from 'express';
import cors from 'cors';
import './config/dotenv.js';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins without trailing slash
const allowedOrigins = [
  'http://localhost:5173',
  'https://summarizer-iq.vercel.app'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
}

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/summaries', summaryRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
