import { useState, useEffect } from 'react';
import newsApi from '../api/newsApi';
import NewsItem from '../components/NewsItem';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import type { NewsResponse } from '../types/news';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const KEYFRAMES = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-bar {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
`;

const NewsPage = () => {
    const [data, setData] = useState<NewsResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentDate(new Date().toLocaleDateString('vi-VN', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric',
        }));
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            try {
                const response = await newsApi.getNews(currentPage);
                setData(response);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (data && newPage >= 0 && newPage < data.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const [featured, ...rest] = data?.articles ?? [];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-zinc-900">
            <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
            <Header />
            <NavBar />

            <main className="flex-grow w-full">
                <div className="max-w-4xl mx-auto w-full px-6 pb-24">
                    <div className="pt-12 pb-8 border-b-2 border-zinc-900 mb-10">
                        <div className="flex items-end justify-between gap-4 flex-wrap">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">
                                    University Intelligence
                                </p>
                                <h1 className="text-6xl font-black text-zinc-900 tracking-tighter leading-none">
                                    THE BRIEFING
                                </h1>
                            </div>

                            <div className="text-right pb-1">
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                    {currentDate}
                                </p>
                                {data && (
                                    <p className="text-xs font-bold text-zinc-400 mt-0.5">
                                        {data.totalResults} articles
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mt-6 text-[11px] font-black uppercase tracking-widest text-zinc-400">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                Giáo Dục Thời Đại
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                Tuổi Trẻ
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                MOET
                            </span>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
                                Fetching the latest…
                            </p>
                        </div>
                    )}

                    {!isLoading && data && (
                        <>
                            {featured && (
                                <NewsItem article={featured} featured index={0} />
                            )}

                            {rest.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-4">
                                        More Stories
                                    </p>
                                    <div>
                                        {rest.map((article, i) => (
                                            <NewsItem
                                                key={`${article.url}-${i}`}
                                                article={article}
                                                index={i + 1}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.articles.length === 0 && (
                                <div className="text-center py-24 border-t border-zinc-100">
                                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                                        No stories found
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {data && data.totalPages > 1 && (
                        <div className="mt-16 pt-8 border-t-2 border-zinc-900 flex items-center justify-between">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0 || isLoading}
                                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>

                            <span className="text-sm font-black text-zinc-900 tabular-nums">
                                {currentPage + 1}
                                <span className="text-zinc-300 mx-2">/</span>
                                {data.totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= data.totalPages - 1 || isLoading}
                                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 disabled:opacity-30 transition-colors"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NewsPage;