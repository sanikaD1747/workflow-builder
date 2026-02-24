import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  steps: {
    type: [String],
    required: true,
    validate: {
      validator: function (steps) {
        // Must have 2-4 steps
        if (steps.length < 2 || steps.length > 4) return false;
        // All steps must be unique
        return new Set(steps).size === steps.length;
      },
      message: 'Workflow must have 2-4 unique steps'
    },
    enum: ['clean', 'summarize', 'keypoints', 'tag']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Workflow', workflowSchema);
