import { z } from 'zod';

export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.issues.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        return next(error);
    }
};
