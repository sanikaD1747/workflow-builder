import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../contexts/AuthContext';
import * as authContext from '../../contexts/AuthContext';
import React from 'react';

// Mock the AuthContext
vi.mock('../../contexts/AuthContext', async () => {
    const actual = await vi.importActual('../../contexts/AuthContext');
    return {
        ...actual,
        useAuth: vi.fn(),
    };
});

test('Login form renders properly', () => {
    authContext.useAuth.mockReturnValue({ login: vi.fn(), loading: false });

    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );

    expect(screen.getByText('Sign in to your account')).toBeDefined();
    expect(screen.getByLabelText(/Email/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
});

test('Displays validation errors', async () => {
    authContext.useAuth.mockReturnValue({
        login: vi.fn().mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } }),
        loading: false
    });

    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeDefined();
    });
});
