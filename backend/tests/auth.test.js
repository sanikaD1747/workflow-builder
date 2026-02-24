import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.js';
import { setupTestDB } from './setup.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

setupTestDB();

describe('Auth API', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'password123'
    };

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', testUser.email);
        });

        it('should validate user input', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: 'invalid-email', password: '123' });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Validation failed');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/register').send(testUser);
        });

        it('should login an existing user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send(testUser);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: 'wrongpassword' });

            expect(res.statusCode).toEqual(401);
        });
    });
});
