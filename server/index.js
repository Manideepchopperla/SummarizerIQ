import express from 'express';
import cors from 'cors';
import './config/dotenv.js';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    "https://summarizer-iq.vercel.app/"
  ],
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
