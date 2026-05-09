import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import authApi from '../../api/authApi';
import type { LoginRequest } from '../../types/auth';
import { useDarkMode } from '../../hooks/useDarkMode';

import LoginBox from './LoginBox';
import ErrorBox from '../../components/ErrorBox';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isExiting, setIsExiting] = useState(false);
    const [isAnimateIn, setIsAnimateIn] = useState(false);

    // Call hook here ONLY, and pass down to Box
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsAnimateIn(true);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (validationErrors.length > 0 || error) {
            setValidationErrors([]);
            setError('');
        }
    };

    const handleGoogleLogin = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        window.location.href = `${baseUrl}/oauth2/authorization/google`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors([]);

        const errors: string[] = [];
        if (!formData.email.trim()) errors.push("Email is required.");
        if (!formData.password) errors.push("Password is required.");

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

    const ComplexAnimatedCircuitry = useMemo(() => {
        const strokeColor = isDarkMode ? "rgba(167, 139, 250, 0.15)" : "rgba(109, 40, 217, 0.12)";
        const nodeColor = isDarkMode ? "#a855f7" : "#7c3aed";

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
                        <filter id="electronGlow">
                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <g transform="rotate(-45 800 400)" stroke={strokeColor} strokeWidth="1.5" fill="none">
                        {paths.map((d, i) => <path key={`p-${i}`} d={d} />)}

                        <g filter="url(#electronGlow)">
                            {paths.map((path, i) => (
                                <React.Fragment key={`electrons-${i}`}>
                                    <circle r="2" fill={isDarkMode ? "#d8b4fe" : "#a855f7"}>
                                        <animateMotion path={path} dur={`${3 + (i % 3)}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" />
                                    </circle>
                                    <circle r="1.5" fill={isDarkMode ? "#7dd3fc" : "#38bdf8"}>
                                        <animateMotion path={path} dur={`${4 + (i % 2)}s`} begin={`${i * 0.2 + 1.5}s`} repeatCount="indefinite" />
                                    </circle>
                                    <circle r="2.5" fill={isDarkMode ? "#c084fc" : "#c084fc"}>
                                        <animateMotion path={path} dur={`${2.5 + (i % 4)}s`} begin={`${i * 0.7 + 0.5}s`} repeatCount="indefinite" />
                                    </circle>
                                </React.Fragment>
                            ))}
                        </g>

                        <g>
                            {nodes.map((node, i) => (
                                <circle key={`n-${i}`} cx={node.cx} cy={node.cy} r={node.r} fill={nodeColor} className="animate-power-surge" style={{ animationDelay: node.delay }} />
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
    }, [isExiting, isAnimateIn, isDarkMode]);

    return (
        <div className={`min-w-[1024px] min-h-screen flex items-center relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-slate-50'}`}>
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
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                    />
                </div>
            </div>
            <ErrorBox title="Authentication Error" errors={combinedErrors} onClose={clearErrors} position="right" />
        </div>
    );
};

export default LoginPage;