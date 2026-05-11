import { useState, useEffect } from 'react';
import { supportApi } from '../../../api/supportApi';
import type { SupportResponse } from '../../../types/support';
import SupportItem from './SupportItem';
import Pagination from '../../../components/Pagination';
import ControlNavBar from '../../../components/ControlNavBar';
import { LifeBuoy, Loader2, Ghost } from 'lucide-react';

const MessageFromClientsPage = () => {
    const [supports, setSupports] = useState<SupportResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const data = await supportApi.getAllSupportsAdmin(currentPage);
                setSupports(data.content);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error("The void consumed the data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [currentPage]);

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[var(--bg-main)] dark:bg-[#030005]">
            <ControlNavBar />

            <main className="flex-1 flex flex-col pt-14">
                <div className="flex-1 max-w-6xl w-full mx-auto px-8 py-10 space-y-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                            <LifeBuoy className="text-[var(--accent-purple)]" size={32} />
                            Client Support
                        </h1>
                        <p className="text-[var(--text-primary)] opacity-40 mt-1 font-medium italic">
                            Monitoring the voices from the deep.
                        </p>
                    </div>

                    {loading ? (
                        <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-[var(--accent-purple)]" size={40} />
                            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Loading messages...</p>
                        </div>
                    ) : supports.length === 0 ? (
                        <div className="h-[50vh] flex flex-col items-center justify-center opacity-20 bg-[var(--bg-side)] dark:bg-[#0a0a0a] border border-[var(--border-color)] rounded-3xl">
                            <Ghost size={64} className="mb-4" />
                            <p className="font-black uppercase tracking-widest text-xs">No signals found</p>
                        </div>
                    ) : (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {supports.map((s) => (
                                    <SupportItem key={s.id} support={s} />
                                ))}
                            </div>

                            <div className="flex justify-center pt-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MessageFromClientsPage;