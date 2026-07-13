import { getAllArticles } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archivo",
  description: "Todas las noticias del canal Todo es verdad.",
};

export default function ArchivePage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto px-5 py-12" style={{ maxWidth: "var(--max-width-content)" }}>
      <h1 className="text-large-title mb-2">Archivo</h1>
      <p
        className="text-title-3 mb-10 font-normal"
        style={{ color: "var(--color-label-secondary)" }}
      >
        {articles.length} {articles.length === 1 ? "noticia" : "noticias"} en el archivo
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
