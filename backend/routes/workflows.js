import express from 'express';
import Workflow from '../models/Workflow.js';

const router = express.Router();

// Create workflow
router.post('/', async (req, res) => {
  try {
    const { name, steps } = req.body;
    
    // Validation
    if (!name || !steps || !Array.isArray(steps)) {
      return res.status(400).json({ error: 'Name and steps array are required' });
    }
    
    if (steps.length < 2 || steps.length > 4) {
      return res.status(400).json({ error: 'Workflow must have 2-4 steps' });
    }
    
    // Check for unique steps
    if (new Set(steps).size !== steps.length) {
      return res.status(400).json({ error: 'All steps must be unique' });
    }
    
    const validSteps = ['clean', 'summarize', 'keypoints', 'tag'];
    const invalidSteps = steps.filter(step => !validSteps.includes(step));
    if (invalidSteps.length > 0) {
      return res.status(400).json({ error: `Invalid steps: ${invalidSteps.join(', ')}` });
    }
    
    const workflow = new Workflow({ name, steps });
    await workflow.save();
    
    res.status(201).json(workflow);
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Failed to create workflow', details: error.message });
  }
});

// Get all workflows
router.get('/', async (req, res) => {
  try {
    const workflows = await Workflow.find().sort({ createdAt: -1 }).limit(100);
    res.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// Get single workflow
router.get('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
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
router.delete('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);
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
