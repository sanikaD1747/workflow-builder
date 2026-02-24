import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '24h'
    });
};

router.post('/register', validate(registerSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({ email, password });
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
});

router.post('/login', validate(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in', details: error.message });
    }
});

export default router;
