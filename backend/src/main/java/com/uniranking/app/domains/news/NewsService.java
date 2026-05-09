package com.uniranking.app.domains.news;

import com.uniranking.app.domains.news.exceptions.ScrapingException;
import com.uniranking.app.domains.news.exceptions.ScrapingTimeoutException;
import com.uniranking.app.domains.news.exceptions.SiteUnavailableException;
import org.jsoup.HttpStatusException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.rmi.UnknownHostException;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

@Service
public class NewsService {

    private static final int DEFAULT_PAGE_SIZE = 10;

    @Cacheable(value = "news")
    public NewsResponse getNewsPage(int page) {
        List<Article> allArticles = getAllNews();

        int totalResults = allArticles.size();
        int totalPages = (int) Math.ceil((double) totalResults / DEFAULT_PAGE_SIZE);

        int start = Math.min(page * DEFAULT_PAGE_SIZE, totalResults);
        int end = Math.min((page + 1) * DEFAULT_PAGE_SIZE, totalResults);

        return new NewsResponse(
                new ArrayList<>(allArticles.subList(start, end)),
                page,
                totalPages,
                DEFAULT_PAGE_SIZE,
                totalResults,
                "ok"
        );
    }

    private List<Article> getAllNews() {
        List<Article> allNews = new ArrayList<>();

        allNews.addAll(fetchTuoiTreNews());
        allNews.addAll(fetchMOETNews());
        allNews.addAll(fetchGiaoDucThoiDaiNews());

        return allNews;
    }

    private List<Article> fetchTuoiTreNews() {
        String targetUrl = "https://tuoitre.vn/rss/giao-duc.rss";

        return ScraperHelper.execute(targetUrl, doc -> {
            List<Article> articles = new ArrayList<>();
            for (Element item : doc.select("item")) {
                String descriptionHtml = item.select("description").text();
                Document descDoc = Jsoup.parse(descriptionHtml);

                articles.add(Article.builder()
                        .title(item.select("title").text())
                        .description(descDoc.text())
                        .url(item.select("link").text())
                        .imageUrl(descDoc.select("img").attr("src"))
                        .source("Tuổi Trẻ")
                        .publishedAt(item.select("pubDate").text())
                        .build());
            }
            return articles;
        });
    }

    private List<Article> fetchMOETNews() {
        List<Article> articles = new ArrayList<>();
        String[] targetUrls = {
                "https://moet.gov.vn/tin-tuc/tin-tong-hop2/huong-dan-tuyen-sinh-trinh-do-dai-hoc-trinh-do-cao-dang-nganh-giao-duc-mam-non-nam-2026.html",
                "https://moet.gov.vn/tin-tuc-cot-phai/chuong-trinh-giao-duc-pho-thong"
        };

        for (String url : targetUrls) {
            Article article = ScraperHelper.execute(url, doc -> {
                String imageUrl = doc.select("meta[property=og:image]").attr("content");
                if (imageUrl.isEmpty()) {
                    imageUrl = doc.select("#main-content img, .article-content img, img").attr("abs:src");
                }

                return Article.builder()
                        .title(doc.title())
                        .url(url)
                        .imageUrl(imageUrl)
                        .source("MOET")
                        .build();
            });
            articles.add(article);
        }

        return articles;
    }

    private List<Article> fetchGiaoDucThoiDaiNews() {
        String targetUrl = "https://giaoducthoidai.vn/giao-duc/";

        return ScraperHelper.execute(targetUrl, doc -> {
            List<Article> articles = new ArrayList<>();

            for (Element item : doc.select("article")) {
                Element titleLink = item.selectFirst("a[href]");
                if (titleLink == null) continue;

                String title = titleLink.text().trim();
                String url = titleLink.absUrl("href");
                Element img = item.selectFirst("img");
                String imageUrl = (img != null && img.hasAttr("data-src"))
                        ? img.absUrl("data-src")
                        : (img != null ? img.absUrl("src") : null);

                if (!title.isEmpty() && url.contains("giaoducthoidai.vn")) {
                    articles.add(Article.builder()
                            .title(title)
                            .url(url)
                            .imageUrl(imageUrl)
                            .source("Giáo dục & Thời đại")
                            .build());
                }
            }
            return articles;
        });
    }
}

class ScraperHelper {

    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    private static final int TIMEOUT = 15000;

    public static <T> T execute(String url, Function<Document, T> parser) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(TIMEOUT)
                    .get();
            return parser.apply(doc);
        } catch (HttpStatusException e) {
            throw new SiteUnavailableException("Site error: " + e.getStatusCode());
        } catch (SocketTimeoutException e) {
            throw new ScrapingTimeoutException("Timeout reached for " + url);
        } catch (UnknownHostException e) {
            throw new ScrapingException("Host unknown: " + url);
        } catch (IOException e) {
            throw new ScrapingException("Network error: " + e.getMessage());
        } catch (Exception e) {
            throw new ScrapingException("Parsing error: " + e.getMessage());
        }
    }
}