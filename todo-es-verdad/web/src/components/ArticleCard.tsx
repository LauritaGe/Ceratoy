import Link from "next/link";
import Image from "next/image";
import type { Article, Locale } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
  locale?: Locale;
}

export function ArticleCard({ article, locale = "es" }: ArticleCardProps) {
  const title = locale === "es" ? article.title_es : article.title_en;
  const excerpt = locale === "es" ? article.excerpt_es : article.excerpt_en;

  return (
    <article>
      <Link
        href={`/noticia/${article.slug}`}
        className="group block overflow-hidden rounded-[var(--radius-lg)] transition-transform duration-200 hover:scale-[1.01]"
        style={{
          backgroundColor: "var(--color-background-secondary)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={article.image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-caption-1 mb-1 font-medium text-white/80">
              {article.location}, {article.year}
            </p>
            <h2 className="text-title-3 text-white">{title}</h2>
          </div>
        </div>
        <div className="p-5">
          <p
            className="text-callout line-clamp-2"
            style={{ color: "var(--color-label-secondary)" }}
          >
            {excerpt}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-caption-2 rounded-full px-2 py-0.5"
                style={{
                  backgroundColor: "var(--color-fill)",
                  color: "var(--color-label-secondary)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
