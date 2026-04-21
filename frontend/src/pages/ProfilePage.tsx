import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserInfo from '../components/user/UserInfo';
import UserConfig from '../components/user/UserConfig';
import UserApi from '../api/UserApi';
import type { UserResponse } from '../types/User';

const ProfilePage = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  // Hardcoded ID for now - usually you'd get this from your AuthContext or JWT decodification
  const userId = 1;
  const username = "testing1909";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await UserApi.getUser(username);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

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

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8fafc]';

  if (loading) {
    return (
        <div className={`min-h-screen flex items-center justify-center ${bgMain}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
        </div>
    );
  }

  return (
      <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen text-left">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-[1200px] mx-auto space-y-6">

              {/* 1. Dynamic User Info Card */}
              {user && <UserInfo user={user} />}

              <div className="grid lg:grid-cols-12 gap-6">
                {/* 2. Main Content - Account Settings */}
                <div className="lg:col-span-8">
                  {user && (
                      <UserConfig
                          userId={userId}
                          currentUser={{ username: user.username, email: user.email }}
                      />
                  )}
                </div>

                {/* 3. Sidebar - Keeping your styled elements */}
                <div className="lg:col-span-4 space-y-6">
                  <section className={`border rounded-[2rem] p-8 shadow-sm ${isDark ? 'bg-[#000000] border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Account Status</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Verification</span>
                        <span className="text-emerald-500 font-bold">Verified</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Security</span>
                        <span className="text-purple-500 font-bold">High</span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

            </div>
          </main>
          <Footer />
        </div>
      </div>
  );
};

export default ProfilePage;