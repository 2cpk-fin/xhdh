package com.uniranking.app.domains.news;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class NewsService {

    private static final int DEFAULT_PAGE_SIZE = 10;

    @Cacheable(value = "newsCache")
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

    public List<Article> getAllNews() {
        List<Article> allNews = new ArrayList<>();

        allNews.addAll(fetchTuoiTreNews());
        allNews.addAll(fetchVNURNews());
        allNews.addAll(fetchMOETNews());

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
            System.err.println("TT crawl failed: " + e.getMessage());
        }
        return articles;
    }

    private List<Article> fetchVNURNews() {
        List<Article> articles = new ArrayList<>();
        try {
            Document doc = Jsoup.connect("https://vnur.vn/tin-tuc/")
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .timeout(10000)
                    .get();

            Elements items = doc.select(".elementor-post");

            for (Element el : items) {
                articles.add(Article.builder()
                        .title(el.select(".elementor-post__title").text())
                        .url(el.select("a").attr("href"))
                        .imageUrl(el.select("img").attr("src"))
                        .description(el.select(".elementor-post__excerpt").text())
                        .source("VNUR")
                        .build());
            }
        } catch (Exception e) {
            System.err.println("VNUR crawl failed: " + e.getMessage());
        }
        return articles;
    }

    private List<Article> fetchMOETNews() {
        List<Article> articles = new ArrayList<>();
        try {
            Document doc = Jsoup.connect("https://moet.gov.vn/tintuc/Pages/tin-tong-hop.aspx")
                    .userAgent("Mozilla/5.0")
                    .get();

            Elements items = doc.select(".news-item");
            for (Element el : items) {
                Element linkEl = el.selectFirst("a");
                if (linkEl != null) {
                    articles.add(Article.builder()
                            .title(linkEl.text())
                            .url("https://moet.gov.vn" + linkEl.attr("href"))
                            .source("MOET")
                            .build());
                }
            }
        } catch (Exception e) {
            System.err.println("MOET crawl failed: " + e.getMessage());
        }
        return articles;
    }
}