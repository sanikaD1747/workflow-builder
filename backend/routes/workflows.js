import express from 'express';
import Workflow from '../models/Workflow.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createWorkflowSchema } from '../validators/schemas.js';

const router = express.Router();

// Create workflow
router.post('/', auth, validate(createWorkflowSchema), async (req, res) => {
  try {
    const { name, steps } = req.body;

    const workflow = new Workflow({
      name,
      steps,
      userId: req.user._id
    });

    await workflow.save();

    res.status(201).json(workflow);
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow', details: error.message });
  }
});

// Get all workflows
router.get('/', auth, async (req, res) => {
  try {
    const workflows = await Workflow.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// Get single workflow
router.get('/:id', auth, async (req, res) => {
  try {
    const workflow = await Workflow.findOne({ _id: req.params.id, userId: req.user._id });
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    console.error('Error fetching workflow:', error);
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

// Delete workflow
router.delete('/:id', auth, async (req, res) => {
  try {
    const workflow = await Workflow.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
});

export default router;
