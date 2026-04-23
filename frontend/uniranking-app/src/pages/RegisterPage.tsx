/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../apis/authApi';
import type { RegisterRequest } from '../types/auth';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterRequest>({
        username: '',
        email: '',
        password: ''
    });

    const [, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authApi.register(formData);
            alert('Registration successful! Please login.');
            navigate('/home'); // Send them to login page after success
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input name="username" placeholder="Username" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Register'}</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

const styles = {
    container: { maxWidth: '300px', margin: '50px auto', textAlign: 'center' as const },
    form: { display: 'flex', flexDirection: 'column' as const, gap: '10px' }
};

export default RegisterPage;