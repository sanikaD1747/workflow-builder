import mongoose from 'mongoose';

const runSchema = new mongoose.Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true
  },
  workflowName: {
    type: String,
    required: true
  },
  input: {
    type: String,
    required: true
  },
  steps: {
    type: [String],
    required: true
  },
  outputs: {
    type: [{
      step: String,
      output: String,
      timestamp: Date
    }],
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'failed', 'partial'],
    default: 'completed'
  },
  error: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Run', runSchema);
