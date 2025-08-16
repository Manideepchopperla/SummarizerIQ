import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Meeting Summary' },
  transcript: { type: String, required: true },
  prompt: { type: String, required: true },
  content: { type: String, required: true },
  originalSummary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Summary = mongoose.model('Summary', summarySchema);
export default Summary;
