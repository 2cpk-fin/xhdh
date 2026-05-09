package com.uniranking.app.domains.news;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

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
        List<Article> articles = new ArrayList<>();
        try {
            Document doc = Jsoup.connect("https://tuoitre.vn/rss/giao-duc.rss").get();
            Elements items = doc.select("item");

            for (Element item : items) {
                String title = item.select("title").text();
                String link = item.select("link").text();
                String pubDate = item.select("pubDate").text();

                String descriptionHtml = item.select("description").text();
                Document descDoc = Jsoup.parse(descriptionHtml);
                String imageUrl = descDoc.select("img").attr("src");
                String description = descDoc.text();

                articles.add(Article.builder()
                        .title(title)
                        .description(description)
                        .url(link)
                        .imageUrl(imageUrl)
                        .source("Tuổi Trẻ")
                        .publishedAt(pubDate)
                        .build());
            }
        } catch (Exception e) {
            System.err.println("Tuoi tre crawl failed: " + e.getMessage());
        }
        return articles;
    }

    private List<Article> fetchMOETNews() {
        List<Article> articles = new ArrayList<>();
        String[] targetUrls = {
                "https://moet.gov.vn/tin-tuc/tin-tong-hop2/huong-dan-tuyen-sinh-trinh-do-dai-hoc-trinh-do-cao-dang-nganh-giao-duc-mam-non-nam-2026.html",
                "https://moet.gov.vn/tin-tuc-cot-phai/chuong-trinh-giao-duc-pho-thong"
        };

        for (String url : targetUrls) {
            try {
                Document doc = Jsoup.connect(url)
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                        .timeout(15000)
                        .get();

                String title = doc.title();

                String imageUrl = doc.select("meta[property=og:image]").attr("content");
                if (imageUrl.isEmpty()) {
                    imageUrl = doc.select("#main-content img, .article-content img, img").attr("abs:src");
                }

                articles.add(Article.builder()
                        .title(title)
                        .url(url)
                        .imageUrl(imageUrl)
                        .source("MOET")
                        .build());
            } catch (Exception e) {
                System.err.println("MOET crawl failed for " + url + ": " + e.getMessage());
            }
        }
        return articles;
    }

    private List<Article> fetchGiaoDucThoiDaiNews() {
        List<Article> articles = new ArrayList<>();
        try {
            Document doc = Jsoup.connect("https://giaoducthoidai.vn/giao-duc/")
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .timeout(15000)
                    .get();

            Elements articleElements = doc.select("article");

            for (Element articleEl : articleElements) {
                Element titleEl = articleEl.selectFirst(".story__title a, h2 a, h3 a");
                if (titleEl == null) {
                    titleEl = articleEl.selectFirst("a[href]");
                }
                if (titleEl == null) continue;

                String title = titleEl.text().trim();
                String url = titleEl.absUrl("href");

                Element imgEl = articleEl.selectFirst("picture img, img");
                String imageUrl = null;
                if (imgEl != null) {
                    imageUrl = imgEl.hasAttr("data-src") ? imgEl.absUrl("data-src") : imgEl.absUrl("src");
                }

                if (!title.isEmpty() && url.contains("giaoducthoidai.vn")) {
                    articles.add(Article.builder()
                            .title(title)
                            .url(url)
                            .imageUrl(imageUrl)
                            .source("Giáo dục & Thời đại")
                            .build());
                }
            }

            articles = new ArrayList<>(articles.stream()
                    .collect(Collectors.toMap(
                            Article::getUrl,
                            a -> a,
                            (a, b) -> a,
                            LinkedHashMap::new
                    ))
                    .values());

        } catch (Exception e) {
            System.err.println("Giao Duc Thoi Dai crawl failed: " + e.getMessage());
        }
        return articles;
    }
}