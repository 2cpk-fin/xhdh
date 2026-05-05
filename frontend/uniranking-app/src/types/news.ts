export interface Article {
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    source: string;
    publishedAt: string;
}

export interface NewsResponse {
    articles: Article[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalResults: number;
    status: string;
}