import express from 'express';
import Run from '../models/Run.js';
import Workflow from '../models/Workflow.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { executeWorkflowSchema } from '../validators/schemas.js';
import { processWorkflow } from '../services/llmService.js';

const router = express.Router();

// Execute workflow
router.post('/', auth, validate(executeWorkflowSchema), async (req, res) => {
  try {
    const { workflowId, input } = req.body;

    // Fetch workflow and verify ownership
    const workflow = await Workflow.findOne({ _id: workflowId, userId: req.user._id });
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    // Process workflow with LLM
    let outputs;
    let status = 'completed';
    let error = null;

    try {
      outputs = await processWorkflow(workflow.steps, input);
    } catch (err) {
      console.error('Error processing workflow:', err);
      status = 'failed';
      error = err.message;
      outputs = [];
    }

    // Save run to database
    const run = new Run({
      userId: req.user._id,
      workflowId: workflow._id,
      workflowName: workflow.name,
      input,
      steps: workflow.steps,
      outputs,
      status,
      error
    });

    await run.save();

    if (status === 'failed') {
      return res.status(500).json({
        error: 'Workflow execution failed',
        details: error,
        run
      });
    }

    res.status(201).json(run);
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({ error: 'Failed to execute workflow', details: error.message });
  }
});

// Get last 5 runs
router.get('/', auth, async (req, res) => {
  try {
    const runs = await Run.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('workflowId', 'name');
    res.json(runs);
  } catch (error) {
    console.error('Error fetching runs:', error);
    res.status(500).json({ error: 'Failed to fetch runs' });
  }
});

// Get single run
router.get('/:id', auth, async (req, res) => {
  try {
    const run = await Run.findOne({ _id: req.params.id, userId: req.user._id }).populate('workflowId', 'name');
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }
    res.json(run);
  } catch (error) {
    console.error('Error fetching run:', error);
    res.status(500).json({ error: 'Failed to fetch run' });
  }
});

export default router;
