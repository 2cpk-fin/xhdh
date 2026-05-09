import { useState, useEffect } from 'react';
import newsApi from '../../../api/newsApi';
import NewsItem from './NewsItem';
import Header from '../../../components/Header';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import Pagination from '../../../components/Pagination'; //
import type { NewsResponse } from '../../../types/news';
import { Loader2 } from 'lucide-react';

const KEYFRAMES = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
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

    const [featured, ...rest] = data?.articles ?? [];

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex flex-col font-sans antialiased text-[var(--text-primary)] transition-colors duration-300">
            <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
            <Header />

            <div className="flex flex-1">
                <NavBar />

                <main className="flex-1 ml-64 flex flex-col min-h-[calc(100vh-64px)]">
                    <div className="max-w-4xl mx-auto w-full px-6 pb-24">
                        {/* Header Section */}
                        <div className="pt-12 pb-8 border-b-2 border-[var(--text-primary)] mb-10">
                            <div className="flex items-end justify-between gap-4 flex-wrap">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] opacity-40 mb-2">
                                        University Intelligence
                                    </p>
                                    <h1 className="text-6xl font-black text-[var(--text-primary)] tracking-tighter leading-none">
                                        THE BRIEFING
                                    </h1>
                                </div>

                                <div className="text-right pb-1">
                                    <p className="text-xs font-bold text-[var(--text-primary)] opacity-40 uppercase tracking-widest">
                                        {currentDate}
                                    </p>
                                    {data && (
                                        <p className="text-xs font-bold text-[var(--text-primary)] opacity-40 mt-0.5">
                                            {data.totalResults} articles
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 mt-6 text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] opacity-40">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                    VNUR
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
                                <Loader2 className="w-8 h-8 animate-spin text-[var(--text-primary)] opacity-20" />
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--text-primary)] opacity-40">
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
                                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-primary)] opacity-40 mb-4">
                                            More Stories
                                        </p>
                                        <div className="space-y-1">
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
                                    <div className="text-center py-24 border-t border-[var(--border-color)]">
                                        <p className="text-sm font-bold text-[var(--text-primary)] opacity-40 uppercase tracking-widest">
                                            No stories found
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Pagination Component Integration */}
                        {data && data.totalPages > 1 && (
                            <div className="mt-16 pt-8 border-t-2 border-[var(--text-primary)]">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={data.totalPages}
                                    onPageChange={setCurrentPage}
                                    disabled={isLoading}
                                />
                            </div>
                        )}
                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default NewsPage;