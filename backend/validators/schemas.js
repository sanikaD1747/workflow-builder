import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters')
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required')
    })
});

export const createWorkflowSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
        steps: z.array(z.enum(['clean', 'summarize', 'extract', 'tag']))
            .min(2, 'Workflow must have at least 2 steps')
            .max(4, 'Workflow can have at most 4 steps')
            .refine(
                (steps) => new Set(steps).size === steps.length,
                'Steps must be unique'
            )
    })
});

export const executeWorkflowSchema = z.object({
    body: z.object({
        workflowId: z.string().min(1, 'Workflow ID is required'),
        initialInput: z.string().min(1, 'Initial input is required').max(5000, 'Input is too long')
    })
});
