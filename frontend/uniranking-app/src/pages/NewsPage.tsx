import { useState, useEffect } from 'react';
import newsApi from '../api/newsApi';
import NewsItem from '../components/NewsItem';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import type { NewsResponse } from '../types/news';
import { ChevronLeft, ChevronRight, Loader2, Newspaper, Sparkles } from 'lucide-react';

const NewsPage = () => {
    const [data, setData] = useState<NewsResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            try {
                const response = await newsApi.getNews(currentPage);
                setData(response);
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (data && newPage >= 0 && newPage < data.totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] flex flex-col font-sans antialiased text-black dark:text-white">
            <Header />
            <NavBar />

            <main className="flex-grow w-full pt-12 px-6 pb-20">
                <div className="max-w-4xl mx-auto w-full transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
                    <div className="relative mb-16 p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-purple-600 rotate-12 pointer-events-none">
                            <Newspaper size={120} />
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/50 text-purple-600 text-[10px] font-black uppercase tracking-wider mb-4">
                                <Sparkles size={12} />
                                Latest Updates
                            </div>
                            <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
                                University <span className="text-purple-600">News</span>
                            </h1>
                            <p className="text-zinc-500 font-bold max-w-lg">
                                Stay informed with the most recent updates on rankings, education policies, and student life from Tuoi Tre, VNUR, and MOET.
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-purple-500" />
                            <p className="font-bold uppercase tracking-widest text-xs">Scraping latest news for you...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data?.articles.map((article, index) => (
                                <NewsItem key={`${article.url}-${index}`} article={article} />
                            ))}

                            {data?.articles.length === 0 && (
                                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
                                    <p className="font-bold text-zinc-500">No news found at the moment.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {data && data.totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0 || isLoading}
                                className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-purple-300 hover:text-purple-600 disabled:opacity-50 transition-all shadow-sm"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-1 mx-4 bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <span className="text-sm font-black text-zinc-900 dark:text-white">{currentPage + 1}</span>
                                <span className="text-sm font-bold text-zinc-400">/</span>
                                <span className="text-sm font-bold text-zinc-400">{data.totalPages}</span>
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= data.totalPages - 1 || isLoading}
                                className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-purple-300 hover:text-purple-600 disabled:opacity-50 transition-all shadow-sm"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.2em]">
                            Total {data?.totalResults || 0} Articles Found
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NewsPage;