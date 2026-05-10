import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import authApi from '../../api/authApi';
import type { RegisterRequest } from '../../types/auth';
import { useDarkMode } from '../../hooks/useDarkMode';

import RegisterBox from './RegisterBox';
import ErrorBox from '../../components/ErrorBox';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isAnimateOut, setIsAnimateOut] = useState(false);
    const [isAnimateIn, setIsAnimateIn] = useState(false);

    // Call hook here ONLY, and pass down to Box
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const [formData, setFormData] = useState<RegisterRequest & { confirmPassword?: string }>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const animationId = requestAnimationFrame(() => {
            setIsAnimateIn(true);
        });
        return () => cancelAnimationFrame(animationId);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (validationErrors.length > 0 || error) {
            setValidationErrors([]);
            setError('');
        }
    };

    const handleGoogleSignup = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        window.location.href = `${baseUrl}/oauth2/authorization/google`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);

        const errors: string[] = [];
        if (!formData.username.trim()) errors.push("Username is required.");
        if (!formData.email.trim()) errors.push("Email is required.");
        if (!formData.password) errors.push("Password is required.");
        if (formData.password !== formData.confirmPassword) errors.push("Passwords do not match.");

        if (errors.length > 0) {
            setValidationErrors(errors);
            return;
        }

        setLoading(true);
        try {
            await authApi.register(formData);
            navigate('/login');
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError(axiosError.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

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

    const ComplexAnimatedCircuitry = useMemo(() => {
        const strokeColor = isDarkMode ? "rgba(34, 197, 94, 0.15)" : "rgba(22, 163, 74, 0.1)";
        const nodeColor = isDarkMode ? "#22c55e" : "#16a34a";
        const flowColor = isDarkMode ? "#4ade80" : "#22c55e";

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
                        <filter id="electronGlowGreen">
                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <g transform="rotate(-45 200 400)" stroke={strokeColor} strokeWidth="2" fill="none">
                        {paths.map((d, i) => <path key={`p-${i}`} d={d} />)}

                        <g filter="url(#electronGlowGreen)">
                            {paths.map((path, i) => (
                                <React.Fragment key={`electrons-${i}`}>
                                    <circle r="2.5" fill={flowColor}>
                                        <animateMotion path={path} dur={`${3 + (i % 3)}s`} begin={`${i * 0.2}s`} repeatCount="indefinite" />
                                    </circle>
                                    <circle r="2" fill={isDarkMode ? "#86efac" : "#4ade80"}>
                                        <animateMotion path={path} dur={`${4 + (i % 2)}s`} begin={`${i * 0.2 + 1.5}s`} repeatCount="indefinite" />
                                    </circle>
                                </React.Fragment>
                            ))}
                        </g>

                        <g>
                            {nodes.map((node, i) => (
                                <circle key={`n-${i}`} cx={node.cx} cy={node.cy} r={node.r} fill={nodeColor} className="animate-power-surge-green" style={{ animationDelay: node.delay }} />
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
    }, [isAnimateIn, isAnimateOut, isDarkMode]);

    return (
        <div className={`min-w-[1024px] min-h-screen flex items-center relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-slate-50'}`}>
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
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                    />
                </div>
            </div>
            <ErrorBox title="Registration Error" errors={combinedErrors} onClose={clearErrors} position="left" />
        </div>
    );
};

export default RegisterPage;