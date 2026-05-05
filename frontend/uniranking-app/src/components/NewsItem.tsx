import React from 'react';
import { ExternalLink, Calendar, Globe } from 'lucide-react';
import type { Article } from '../types/news';

interface NewsItemProps {
    article: Article;
}

const NewsItem: React.FC<NewsItemProps> = ({ article }) => {
    const getSourceColor = (source: string) => {
        switch (source) {
            case 'VNUR': return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'Tuổi Trẻ': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'MOET': return 'bg-amber-100 text-amber-600 border-amber-200';
            default: return 'bg-zinc-100 text-zinc-600 border-zinc-200';
        }
    };

    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row gap-6 p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] hover:shadow-xl hover:border-purple-200 transition-all duration-300"
        >
            <div className="relative shrink-0 w-full sm:w-48 h-48 sm:h-32 rounded-2xl overflow-hidden bg-zinc-100">
                {article.imageUrl ? (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <Globe size={32} />
                    </div>
                )}
                <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getSourceColor(article.source)}`}>
                    {article.source}
                </div>
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-black text-zinc-900 dark:text-white leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                            {article.title}
                        </h3>
                        <ExternalLink size={16} className="text-zinc-300 group-hover:text-purple-400 shrink-0 mt-1" />
                    </div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                        {article.description || "No description available for this article."}
                    </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {article.publishedAt || "Recently"}
                    </div>
                </div>
            </div>
        </a>
    );
};

export default NewsItem;