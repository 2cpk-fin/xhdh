import { useEffect, useState } from 'react';
import { User, Mail, Phone, Fingerprint, Trash2, Camera, Plus, CheckCircle2, Globe, ShieldAlert, BadgeCheck, X, Link as LinkIcon, ShieldCheck, AlertCircle } from 'lucide-react';
import SettingsSidebar from '../components/SettingsSidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const GeneralSettings = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

    const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
        show: false,
        type: 'success',
        message: ''
    });
    const [progress, setProgress] = useState(100);

    const [emails, setEmails] = useState(['testing@gmail.com']);
    const [profile, setProfile] = useState({
        displayName: 'Tester',
        username: 'testing1909',
        phone: '0912345678',
        userId: 'U822b3j2h482374'
    });

    useEffect(() => {
        const syncTheme = () => {
            const fromStorage = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
            setTheme(fromStorage);
            if (fromStorage === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
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

    const handleSave = () => {
        if (!profile.displayName.trim() || !profile.username.trim()) {
            showNotification('error', 'Name and Username cannot be empty!');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const allEmailsValid = emails.every(email => emailRegex.test(email));
        if (!allEmailsValid) {
            showNotification('error', 'One or more email addresses are invalid!');
            return;
        }

        if (emails.length > 1 && emails[0].toLowerCase() === emails[1].toLowerCase()) {
            showNotification('error', 'Secondary email cannot be the same as primary!');
            return;
        }

        const vnPhoneRegex = /^(0|84)([35789])([0-9]{8})$/;
        if (!vnPhoneRegex.test(profile.phone.replace(/\s/g, ""))) {
            showNotification('error', 'Invalid Vietnamese phone number!');
            return;
        }

        showNotification('success', 'Preferences updated successfully');
    };

    const addEmail = () => {
        if (emails.length < 2) {
            setEmails([...emails, ""]);
        }
    };

    const removeEmail = (index: number) => {
        setEmails(emails.filter((_, i) => i !== index));
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
            <div className="flex-1 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-[1200px] mx-auto space-y-6 text-left">
                        <header className="pb-4 border-b border-zinc-500/10">
                            <h1 className={`text-4xl font-bold tracking-tight ${textColor}`}>General Settings</h1>
                            <p className={`text-base ${subTextColor} mt-1`}>Manage your account details and public appearance.</p>
                        </header>

                        <section className={`border rounded-2xl overflow-hidden shadow-sm ${cardBg}`}>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2.5 bg-purple-500/10 rounded-xl">
                                        <Camera className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <h2 className={`text-xl font-bold ${textColor}`}>Profile Identity</h2>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                    <div className="space-y-6 flex-1 w-full">
                                        <div className="space-y-3 text-left">
                                            <label className={`text-sm font-bold tracking-tight ${textColor} flex items-center gap-2`}>
                                                <User className="w-4 h-4 text-purple-500" /> Display Name
                                            </label>
                                            <div className="relative max-w-2xl">
                                                <input
                                                    type="text"
                                                    value={profile.displayName}
                                                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                                    className={`w-full py-3 px-5 rounded-xl border text-base font-medium outline-none focus:ring-2 focus:ring-purple-500/20 transition-all ${inputBg}`}
                                                />
                                                <BadgeCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-zinc-500/20 group-hover:border-purple-500 transition-all shadow-xl bg-zinc-100 dark:bg-zinc-900">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${profile.displayName}&background=6366f1&color=fff&size=128`}
                                                className="w-full h-full object-cover"
                                                alt="Avatar"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="text-white w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`px-8 py-4 border-t flex justify-between items-center ${footerBg}`}>
                                <p className={`text-sm font-medium ${subTextColor} flex items-center gap-2`}>
                                    <Globe className="w-4 h-4" /> Global visibility is active.
                                </p>
                                <button onClick={handleSave} className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                                    Update Profile
                                </button>
                            </div>
                        </section>

                        <section className={`border rounded-2xl overflow-hidden shadow-sm ${cardBg}`}>
                            <div className="p-8 text-left">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                                            <Mail className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <h2 className={`text-xl font-bold ${textColor}`}>Email Addresses</h2>
                                    </div>
                                    {emails.length < 2 && (
                                        <button onClick={addEmail} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs font-bold uppercase transition-all">
                                            <Plus className="w-4 h-4" /> Add
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-4 max-w-2xl">
                                    {emails.map((email, index) => (
                                        <div key={index} className="flex gap-3">
                                            <div className="relative flex-1 text-left">
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => {
                                                        const newEmails = [...emails];
                                                        newEmails[index] = e.target.value;
                                                        setEmails(newEmails);
                                                    }}
                                                    className={`w-full py-3 px-5 rounded-xl border text-base font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${inputBg}`}
                                                    placeholder="Enter email address"
                                                />
                                                {index === 0 && <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />}
                                            </div>
                                            {emails.length > 1 && (
                                                <button onClick={() => removeEmail(index)} className="p-3 text-zinc-400 hover:text-red-500 transition-colors">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`px-8 py-4 border-t flex justify-between items-center ${footerBg}`}>
                                <p className={`text-sm font-medium ${subTextColor}`}>Primary email is used for all security notifications.</p>
                                <button onClick={handleSave} className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                                    Save Emails
                                </button>
                            </div>
                        </section>

                        <section className={`border rounded-2xl overflow-hidden shadow-sm ${cardBg}`}>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-500/10 rounded-xl">
                                            <Phone className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <h2 className={`text-xl font-bold ${textColor}`}>Mobile Number</h2>
                                    </div>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="09xx xxx xxx"
                                        className={`w-full py-3 px-5 rounded-xl border text-base font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${inputBg}`}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-orange-500/10 rounded-xl">
                                            <LinkIcon className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <h2 className={`text-xl font-bold ${textColor}`}>Personal Handle</h2>
                                    </div>
                                    <div className="flex">
                                        <span className={`inline-flex items-center px-4 rounded-l-xl border border-r-0 text-sm font-bold ${isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-500' : 'bg-zinc-50 border-zinc-300 text-zinc-500'}`}>
                                            @
                                        </span>
                                        <input
                                            type="text"
                                            value={profile.username}
                                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                            className={`flex-1 py-3 px-5 rounded-r-xl border text-base font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-all ${inputBg}`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`px-8 py-4 border-t flex justify-between items-center ${footerBg}`}>
                                <div className="flex items-center gap-4">
                                    <p className={`text-xs font-bold font-mono flex items-center gap-2 ${subTextColor}`}>
                                        <Fingerprint className="w-4 h-4" /> UID: {profile.userId}
                                    </p>
                                </div>
                                <button onClick={handleSave} className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}>
                                    Apply Changes
                                </button>
                            </div>
                        </section>

                        <section className={`border-2 border-red-500/30 rounded-2xl overflow-hidden shadow-lg transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}>
                            <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-red-500/10 rounded-2xl">
                                        <ShieldAlert className="w-8 h-8 text-red-500" />
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
                                            <Trash2 className="w-5 h-5" /> Account Termination
                                        </h2>
                                        <p className={`text-sm font-medium max-w-lg ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                            This will permanently delete your profile and all data. This action is irreversible.
                                        </p>
                                    </div>
                                </div>
                                <button className="px-8 py-3 rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20">
                                    Delete Account
                                </button>
                            </div>
                        </section>
                    </div>
                </main>
                <Footer />
            </div>

            <div
                className={`fixed top-8 right-8 z-[300] w-80 overflow-hidden rounded-2xl shadow-2xl border transition-all duration-500 transform ${
                    toast.show ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
                } ${
                    toast.type === 'success'
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-white/10'
                        : 'bg-red-600 text-white border-red-400 shadow-[0_20px_50px_rgba(220,38,38,0.3)]'
                }`}
            >
                <div className="flex items-center gap-4 px-6 py-5">
                    <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-white/20'}`}>
                        {toast.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-white" />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-xs uppercase tracking-widest">
                            {toast.type === 'success' ? 'Saved' : 'Error'}
                        </p>
                        <p className="text-[11px] font-medium opacity-90">{toast.message}</p>
                    </div>
                </div>
                <div className={`h-1 w-full ${toast.type === 'success' ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-red-800'}`}>
                    <div
                        className={`h-full transition-all ease-linear ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-white'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;