import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import authApi from '../../api/authApi';
import type { RegisterRequest } from '../../types/auth';

import RegisterBox from './RegisterBox';
import ErrorBox from '../../components/ErrorBox';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isAnimateOut, setIsAnimateOut] = useState(false);
    const [isAnimateIn, setIsAnimateIn] = useState(false);

    // State to hold the form
    const [formData, setFormData] = useState<RegisterRequest>({
        username: '',
        email: '',
        password: ''
    });

    // Feedback states
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fix: Use requestAnimationFrame to avoid synchronous setState cascading render
        const animationId = requestAnimationFrame(() => {
            setIsAnimateIn(true);
        });
        return () => cancelAnimationFrame(animationId);
    }, []);

    // Handle change in the form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear errors on typing
        if (validationErrors.length > 0 || error) {
            setValidationErrors([]);
            setError('');
        }
    };

    // Google Register API
    const handleGoogleSignup = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        window.location.href = `${baseUrl}/oauth2/authorization/google`;
    };

    // Handle register call api
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);

        // Prioritized Validation Logic
        const errors: string[] = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.username.trim()) {
            errors.push("Username is required.");
        } else if (!formData.email.trim()) {
            errors.push("Email is required.");
        } else if (!emailRegex.test(formData.email)) {
            errors.push("Please enter a valid academic email address.");
        } else if (!formData.password) {
            errors.push("Password is required.");
        } else if (formData.password.length < 8) {
            errors.push("Password is too short (minimum 8 characters).");
        } else if (formData.password.length > 20) {
            errors.push("Password is too long (maximum 20 characters).");
        }

        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        setLoading(true);

        try {
            await authApi.register(formData);
            navigate('/login');
        } catch (err) {
            // Replaced 'any' with typed Axios error
            const axiosError = err as AxiosError<{ message: string }>;
            setError(axiosError.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // UI Transition to Login
    const handleSignInLink = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsAnimateOut(true);
        setTimeout(() => {
            navigate('/login');
        }, 800);
    };

    const clearErrors = () => {
        setError('');
        setValidationErrors([]);
    };

    const combinedErrors = [...(error ? [error] : []), ...validationErrors];

    // Circuit background logic
    const ComplexAnimatedCircuitry = useMemo(() => {
        const strokeColor = "rgba(22, 163, 74, 0.1)";
        const nodeColor = "#16a34a";
        const flowColor = "#22c55e"; // Variable is now used in dots below

        const paths = [
            "M -600 100 H 600", "M -600 250 H 650", "M -600 400 H 550", "M -600 550 H 700",
            "M -600 700 H 500", "M -600 850 H 850", "M 400 100 V 250 L 300 350 V 400",
            "M 100 250 V 400 L 200 500", "M 250 400 V 550 L 50 650", "M -100 550 V 700 L 0 850"
        ];

        const nodes = [
            { cx: 400, cy: 100, r: 8, delay: "0s" }, { cx: 100, cy: 250, r: 10, delay: "1.2s" },
            { cx: 250, cy: 400, r: 7, delay: "2.5s" }, { cx: -100, cy: 550, r: 9, delay: "0.8s" },
            { cx: 0, cy: 850, r: 6, delay: "1.8s" }
        ];

        return (
            <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ease-in-out 
                ${isAnimateOut ? 'translate-x-full opacity-0' : isAnimateIn ? 'translate-x-0 opacity-80' : 'translate-x-full opacity-0'}`}>
                <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    <defs>
                        <filter id="electronGlow">
                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <g transform="rotate(-45 200 400)" stroke={strokeColor} strokeWidth="2" fill="none">
                        {paths.map((d, i) => <path key={`p-${i}`} d={d} />)}

                        {/* Fix: Re-introduced flow dots to utilize flowColor (Now as a heavy swarm!) */}
                        <g filter="url(#electronGlow)">
                            {paths.map((path, i) => (
                                <React.Fragment key={`electrons-${i}`}>
                                    {/* Fast electron */}
                                    <circle r="2" fill={flowColor}>
                                        <animateMotion path={path} dur={`${3 + (i % 3)}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
                                    </circle>
                                    {/* Secondary slower electron */}
                                    <circle r="1.5" fill="#4ade80">
                                        <animateMotion path={path} dur={`${4 + (i % 2)}s`} begin={`${i * 0.2 + 1.5}s`} repeatCount="indefinite" />
                                    </circle>
                                    {/* Third dense electron */}
                                    <circle r="2.5" fill="#86efac">
                                        <animateMotion path={path} dur={`${2.5 + (i % 4)}s`} begin={`${i * 0.7 + 0.5}s`} repeatCount="indefinite" />
                                    </circle>
                                    {/* Fourth tiny trailing electron */}
                                    <circle r="1" fill="#bbf7d0">
                                        <animateMotion path={path} dur={`${3.5 + (i % 2)}s`} begin={`${i * 0.3 + 2.2}s`} repeatCount="indefinite" />
                                    </circle>
                                    {/* Fifth fast burst electron */}
                                    <circle r="1.8" fill="#16a34a">
                                        <animateMotion path={path} dur={`${2 + (i % 3)}s`} begin={`${i * 0.5 + 3.5}s`} repeatCount="indefinite" />
                                    </circle>
                                </React.Fragment>
                            ))}
                        </g>

                        <g>
                            {nodes.map((node, i) => (
                                <circle
                                    key={`n-${i}`}
                                    cx={node.cx}
                                    cy={node.cy}
                                    r={node.r}
                                    fill={nodeColor}
                                    className="animate-power-surge-green"
                                    style={{ animationDelay: node.delay }}
                                />
                            ))}
                        </g>
                    </g>
                </svg>
                <style>{`
                    @keyframes powerSurgeGreen {
                        0%, 100% { opacity: 0.3; transform: scale(1); }
                        20% { opacity: 1; transform: scale(1.15); }
                        40% { opacity: 0.3; transform: scale(1); }
                    }
                    .animate-power-surge-green {
                        animation: powerSurgeGreen 4s infinite linear;
                        transform-origin: center;
                        transform-box: fill-box;
                    }
                `}</style>
            </div>
        );
    }, [isAnimateIn, isAnimateOut]);

    return (
        <div className="min-w-[1024px] min-h-screen flex items-center relative overflow-hidden transition-colors duration-300 bg-[#f8fafc]">
            {ComplexAnimatedCircuitry}

            <div className="w-full max-w-7xl mx-auto flex justify-end px-32 z-10">
                <div className={`transition-all duration-700 ease-in-out w-[448px] shrink-0 ${isAnimateOut ? 'translate-x-full opacity-0' : isAnimateIn ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                    <RegisterBox
                        formData={formData}
                        loading={loading}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        handleGoogleSignup={handleGoogleSignup}
                        handleSignInLink={handleSignInLink}
                    />
                </div>
            </div>

            <ErrorBox
                title="Registration Error"
                errors={combinedErrors}
                onClose={clearErrors}
                position="left"
            />

        </div>
    );
};

export default RegisterPage;