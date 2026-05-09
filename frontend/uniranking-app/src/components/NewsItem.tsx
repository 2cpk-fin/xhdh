import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Article } from '../types/news';

interface NewsItemProps {
    article: Article;
    featured?: boolean;
    index?: number;
}

const SOURCE_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    'VNUR': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
    'Tuổi Trẻ': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
    'MOET': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
};

const getSource = (source: string) =>
    SOURCE_STYLES[source] ?? { bg: 'bg-zinc-50', text: 'text-zinc-600', border: 'border-zinc-200', dot: 'bg-zinc-400' };

const SourceBadge: React.FC<{ source: string }> = ({ source }) => {
    const s = getSource(source);
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.bg} ${s.text} ${s.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {source}
        </span>
    );
};

const NewsItem: React.FC<NewsItemProps> = ({ article, featured = false, index = 0 }) => {
    const delay = `${index * 60}ms`;

    /* ── FEATURED (first article) — full-width hero layout ── */
    if (featured) {
        return (
            <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ animationDelay: delay }}
                className="group block border-b-2 border-zinc-900 pb-10 mb-10 opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards]"
            >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Text side */}
                    <div className="lg:col-span-3 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <SourceBadge source={article.source} />
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                    Featured
                                </span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 leading-[1.1] tracking-tight mb-4 group-hover:text-zinc-600 transition-colors duration-300">
                                {article.title}
                            </h2>
                            <p className="text-base text-zinc-500 leading-relaxed line-clamp-3 font-medium">
                                {article.description || 'No description available for this article.'}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                {article.publishedAt || 'Recently'}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-black text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                Read Article
                                <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </span>
                        </div>
                    </div>

                    {/* Image side */}
                    <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-zinc-100 aspect-[4/3]">
                        {article.imageUrl ? (
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-5xl font-black text-zinc-200 select-none">
                                    {article.source.slice(0, 1)}
                                </span>
                            </div>
                        )}
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/10 transition-colors duration-300 rounded-2xl" />
                    </div>
                </div>
            </a>
        );
    }

    /* ── REGULAR article — horizontal compact card ── */
    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ animationDelay: delay }}
            className="group flex gap-5 py-5 border-b border-zinc-100 last:border-0 opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards] hover:bg-zinc-50 -mx-4 px-4 rounded-xl transition-colors duration-200"
        >
            {/* Thumbnail */}
            <div className="shrink-0 w-24 h-20 rounded-xl overflow-hidden bg-zinc-100 relative">
                {article.imageUrl ? (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-black text-zinc-200 select-none">
                            {article.source.slice(0, 1)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <SourceBadge source={article.source} />
                    </div>
                    <h3 className="text-sm font-black text-zinc-800 leading-snug line-clamp-2 group-hover:text-zinc-500 transition-colors">
                        {article.title}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
                        {article.publishedAt || 'Recently'}
                    </span>
                    <ExternalLink
                        size={12}
                        className="text-zinc-200 group-hover:text-zinc-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                </div>
            </div>
        </a>
    );
};

export default NewsItem;