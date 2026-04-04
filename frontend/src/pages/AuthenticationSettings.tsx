import { useEffect, useState } from 'react';
import {
    ShieldCheck, Smartphone, Key, History,
    CheckCircle2, AlertCircle, Eye, EyeOff,
    Fingerprint, ShieldAlert, X, Monitor
} from 'lucide-react';
import SettingsSidebar from '../components/SettingsSidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AuthenticationSettings = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');
    const [showPassword, setShowPassword] = useState(false);

    const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
        show: false,
        type: 'success',
        message: ''
    });
    const [progress, setProgress] = useState(100);

    const [authData, setAuthData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactor: true
    });

    useEffect(() => {
        const syncTheme = () => {
            const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
            setTheme(fromStorage);
            if (fromStorage === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        };
        window.addEventListener('themeChange', syncTheme);
        syncTheme();
        return () => window.removeEventListener('themeChange', syncTheme);
    }, []);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setToast({ show: true, type, message });
        setProgress(100);
        const duration = 3000;
        const interval = 10;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    setToast(prev => ({ ...prev, show: false }));
                    return 0;
                }
                return prev - step;
            });
        }, interval);
    };

    const handleUpdatePassword = () => {
        if (!authData.currentPassword || !authData.newPassword) {
            showNotification('error', 'Please fill in all password fields');
            return;
        }
        if (authData.newPassword !== authData.confirmPassword) {
            showNotification('error', 'New passwords do not match');
            return;
        }
        if (authData.newPassword.length < 8) {
            showNotification('error', 'Password must be at least 8 characters');
            return;
        }
        showNotification('success', 'Password updated successfully');
        setAuthData({ ...authData, currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const isDark = theme === 'dark';
    const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';
    const cardBg = isDark ? 'bg-[#000000] border-zinc-800' : 'bg-white border-zinc-200';
    const footerBg = isDark ? 'bg-[#0d0d0d] border-zinc-800' : 'bg-[#fcfcfc] border-zinc-200';
    const inputBg = isDark ? 'bg-black border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black';
    const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
    const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
            <SettingsSidebar />
            <div className="flex-1 flex flex-col min-h-screen text-left">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-[1200px] mx-auto space-y-6">
                        <header className="pb-4 border-b border-zinc-500/10 flex justify-between items-center">
                            <div className="space-y-1">
                                <h1 className={`text-4xl font-bold tracking-tight ${textColor}`}>Authentication</h1>
                                <p className={`text-base ${subTextColor}`}>Manage your security credentials and access control.</p>
                            </div>
                            <div className="p-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-7 space-y-6">
                                <section className={`border rounded-2xl overflow-hidden shadow-sm ${cardBg}`}>
                                    <div className="p-8">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500">
                                                <Key className="w-5 h-5" />
                                            </div>
                                            <h2 className={`text-xl font-bold ${textColor}`}>Update Password</h2>
                                        </div>

                                        <div className="space-y-4 max-w-xl">
                                            <div className="space-y-2">
                                                <label className={`text-sm font-bold ${textColor}`}>Current Password</label>
                                                <input
                                                    type="password"
                                                    value={authData.currentPassword}
                                                    onChange={(e) => setAuthData({...authData, currentPassword: e.target.value})}
                                                    className={`w-full py-3 px-5 rounded-xl border text-base outline-none focus:ring-2 focus:ring-purple-500/20 transition-all ${inputBg}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className={`text-sm font-bold ${textColor}`}>New Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            value={authData.newPassword}
                                                            onChange={(e) => setAuthData({...authData, newPassword: e.target.value})}
                                                            className={`w-full py-3 px-5 rounded-xl border text-base outline-none focus:ring-2 focus:ring-purple-500/20 transition-all ${inputBg}`}
                                                        />
                                                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className={`text-sm font-bold ${textColor}`}>Confirm New</label>
                                                    <input
                                                        type="password"
                                                        value={authData.confirmPassword}
                                                        onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                                                        className={`w-full py-3 px-5 rounded-xl border text-base outline-none focus:ring-2 focus:ring-purple-500/20 transition-all ${inputBg}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-8 py-4 border-t flex justify-between items-center ${footerBg}`}>
                                        <p className={`text-sm font-medium ${subTextColor}`}>Ensure your password is at least 8 characters.</p>
                                        <button onClick={handleUpdatePassword} className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                                            Change Password
                                        </button>
                                    </div>
                                </section>

                                <section className={`border rounded-2xl overflow-hidden shadow-sm ${cardBg}`}>
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                                                    <Smartphone className="w-5 h-5" />
                                                </div>
                                                <h2 className={`text-xl font-bold ${textColor}`}>Two-Factor Authentication</h2>
                                            </div>
                                            <button
                                                onClick={() => setAuthData({...authData, twoFactor: !authData.twoFactor})}
                                                className={`w-12 h-6 rounded-full transition-all relative ${authData.twoFactor ? 'bg-purple-500' : 'bg-zinc-400'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${authData.twoFactor ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                        <p className={`text-sm font-medium leading-relaxed ${subTextColor} mb-6`}>
                                            Add an extra layer of security to your account. To log in, you will need to provide a 6-digit code from your authenticator app.
                                        </p>
                                        <div className="p-4 rounded-xl border-2 border-dashed border-zinc-500/20 flex items-center justify-between bg-zinc-500/5">
                                            <div className="flex items-center gap-4 text-left">
                                                <Fingerprint className="w-8 h-8 text-zinc-400" />
                                                <div>
                                                    <p className={`text-sm font-bold ${textColor}`}>Biometric Verification</p>
                                                    <p className="text-xs text-zinc-500">Not enabled for this device</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-black uppercase text-purple-500 hover:underline">Setup</button>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="lg:col-span-5 space-y-6">
                                <section className={`border rounded-2xl p-6 shadow-sm ${cardBg}`}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <History className="w-5 h-5 text-amber-500" />
                                        <h3 className={`font-bold ${textColor}`}>Active Sessions</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                            <Smartphone className="w-5 h-5 text-purple-500 mt-1" />
                                            <div className="flex-1 text-left">
                                                <p className={`text-sm font-bold ${textColor}`}>iPhone 15 Pro</p>
                                                <p className="text-[10px] text-zinc-500 uppercase font-black">Current Device • Hanoi, VN</p>
                                            </div>
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        </div>
                                        <div className="flex items-start gap-4 p-3 rounded-xl border border-transparent">
                                            <Monitor className="w-5 h-5 text-zinc-400 mt-1" />
                                            <div className="flex-1 text-left">
                                                <p className={`text-sm font-bold ${textColor}`}>Chrome on Windows</p>
                                                <p className="text-[10px] text-zinc-500 uppercase font-black">Last active: 2 hours ago</p>
                                            </div>
                                            <button className="p-1 text-zinc-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20">
                                        Sign out of all devices
                                    </button>
                                </section>

                                <section className={`border rounded-2xl p-6 shadow-sm ${cardBg} bg-gradient-to-br from-amber-500/5 to-transparent`}>
                                    <div className="flex items-center gap-3 mb-4 text-amber-500">
                                        <ShieldAlert className="w-5 h-5" />
                                        <h3 className={`font-bold ${textColor}`}>Security Audit</h3>
                                    </div>
                                    <ul className="space-y-3 text-left">
                                        <li className="flex items-start gap-3 text-xs">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                                            <p className={subTextColor}>Regularly review unrecognized login attempts.</p>
                                        </li>
                                        <li className="flex items-start gap-3 text-xs">
                                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full mt-1.5 shrink-0" />
                                            <p className={subTextColor}>Use email alerts for new sign-ins from new IP addresses.</p>
                                        </li>
                                    </ul>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>

            <div className={`fixed top-8 right-8 z-[300] w-80 overflow-hidden rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'} ${toast.type === 'success' ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-white/10' : 'bg-red-600 text-white border-red-400 shadow-[0_20px_50px_rgba(220,38,38,0.3)]'}`}>
                <div className="flex items-center gap-4 px-6 py-5">
                    <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-white/20'}`}>
                        {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-xs uppercase tracking-widest">{toast.type === 'success' ? 'Security' : 'Error'}</p>
                        <p className="text-[11px] font-medium opacity-90">{toast.message}</p>
                    </div>
                </div>
                <div className={`h-1 w-full ${toast.type === 'success' ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-red-800'}`}>
                    <div className={`h-full transition-all ease-linear ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-white'}`} style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    );
};

export default AuthenticationSettings;