import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import authApi from '../apis/authApi';
import type { LoginRequest } from '../types/auth';

// Import the separated components
import LoginBox from '../components/LoginBox';
import ErrorBox from '../components/ErrorBox';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isExiting, setIsExiting] = useState(false);
    const [isAnimateIn, setIsAnimateIn] = useState(false);

    // State to hold form data (from old version)
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });

    // State for feedback (from old version)
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsAnimateIn(true);
        });
    }, []);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear validation errors when typing
        if (validationErrors.length > 0 || error) {
            setValidationErrors([]);
            setError('');
        }
    };

    // Google Login API
    const handleGoogleLogin = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        window.location.href = `${baseUrl}/oauth2/authorization/google`;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);

        // Validation Logic
        const errors: string[] = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Uses an if/else chain to prioritize errors and prevent accumulation
        if (!formData.email.trim()) {
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
            await authApi.login(formData);
            navigate('/home');
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError(axiosError.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // UI Transition to Register
    const handleJoinNow = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsExiting(true);
        setTimeout(() => {
            navigate('/register');
        }, 800);
    };

    const clearErrors = () => {
        setError('');
        setValidationErrors([]);
    };

    const combinedErrors = [...(error ? [error] : []), ...validationErrors];

    // Logic for the animated circuit background
    const ComplexAnimatedCircuitry = useMemo(() => {
        const strokeColor = "rgba(109, 40, 217, 0.12)";
        const nodeColor = "#7c3aed";

        const paths = [
            "M 400 100 H 1600", "M 350 250 H 1600", "M 450 400 H 1600", "M 300 550 H 1600",
            "M 500 700 H 1600", "M 150 850 H 1600", "M 600 100 V 250 L 700 350 V 400",
            "M 900 250 V 400 L 800 500", "M 750 400 V 550 L 950 650", "M 1100 550 V 700 L 1000 850"
        ];

        const nodes = [
            { cx: 600, cy: 100, r: 8, delay: "0s" }, { cx: 900, cy: 250, r: 10, delay: "1.2s" },
            { cx: 750, cy: 400, r: 7, delay: "2.5s" }, { cx: 1100, cy: 550, r: 9, delay: "0.8s" },
            { cx: 1000, cy: 850, r: 6, delay: "1.8s" }
        ];

        return (
            <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-1000 ease-in-out 
                ${isExiting ? '-translate-x-[15%] opacity-0' : isAnimateIn ? 'translate-x-0 opacity-80' : '-translate-x-[15%] opacity-0'}`}>
                <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    <defs>
                        <filter id="circuitGlow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="electronGlow">
                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <g transform="rotate(-45 800 400)" stroke={strokeColor} strokeWidth="1.5" fill="none">
                        {paths.map((d, i) => <path key={`p-${i}`} d={d} />)}

                        {/* Heavy Electrons Swarm Layer */}
                        <g filter="url(#electronGlow)">
                            {paths.map((path, i) => (
                                <React.Fragment key={`electrons-${i}`}>
                                    {/* Fast electron */}
                                    <circle r="2" fill="#a855f7">
                                        <animateMotion path={path} dur={`${3 + (i % 3)}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
                                    </circle>
                                    {/* Secondary slower electron */}
                                    <circle r="1.5" fill="#38bdf8">
                                        <animateMotion path={path} dur={`${4 + (i % 2)}s`} begin={`${i * 0.2 + 1.5}s`} repeatCount="indefinite" />
                                    </circle>
                                    {/* Third dense electron */}
                                    <circle r="2.5" fill="#c084fc">
                                        <animateMotion path={path} dur={`${2.5 + (i % 4)}s`} begin={`${i * 0.7 + 0.5}s`} repeatCount="indefinite" />
                                    </circle>
                                    {/* Fourth tiny trailing electron */}
                                    <circle r="1" fill="#818cf8">
                                        <animateMotion path={path} dur={`${3.5 + (i % 2)}s`} begin={`${i * 0.3 + 2.2}s`} repeatCount="indefinite" />
                                    </circle>
                                    {/* Fifth fast burst electron */}
                                    <circle r="1.8" fill="#e879f9">
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
                                    className="animate-power-surge"
                                    style={{ animationDelay: node.delay }}
                                />
                            ))}
                        </g>
                    </g>
                </svg>
                <style>{`
                    @keyframes powerSurge {
                        0%, 100% { opacity: 0.3; transform: scale(1); }
                        20% { opacity: 1; transform: scale(1.15); }
                        40% { opacity: 0.3; transform: scale(1); }
                    }
                    .animate-power-surge {
                        animation: powerSurge 4s infinite linear;
                        transform-origin: center;
                        transform-box: fill-box;
                    }
                `}</style>
            </div>
        );
    }, [isExiting, isAnimateIn]);

    return (
        <div className="min-w-[1024px] min-h-screen flex items-center relative overflow-hidden transition-colors duration-300 bg-[#f8fafc]">
            {ComplexAnimatedCircuitry}

            <div className="w-full max-w-7xl mx-auto flex justify-start px-32 z-10">
                <div className={`transition-all duration-1000 ease-in-out w-[448px] shrink-0 ${isExiting ? '-translate-x-full opacity-0' : isAnimateIn ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                    <LoginBox
                        formData={formData}
                        loading={loading}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        handleGoogleLogin={handleGoogleLogin}
                        handleJoinNow={handleJoinNow}
                    />
                </div>
            </div>

            <ErrorBox
                title="Authentication Error"
                errors={combinedErrors}
                onClose={clearErrors}
                position="right"
            />
        </div>
    );
};

export default LoginPage;