import fs from "fs";
import path from "path";
import type { Article } from "./types";

const POSTS_DIR = path.join(process.cwd(), "..", "content", "posts");

export function getAllArticles(): Article[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".json"));

  const articles = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    return JSON.parse(raw) as Article;
  });

  return articles.sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}
