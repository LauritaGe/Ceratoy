import { getAllArticles } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";

export default function HomePage() {
  const articles = getAllArticles();
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div style={{ backgroundColor: "var(--color-background)" }}>
      {/* Hero */}
      <section
        className="px-5 py-16 text-center sm:py-24"
        style={{ backgroundColor: "var(--color-background-secondary)" }}
      >
        <div className="mx-auto" style={{ maxWidth: "var(--max-width-prose)" }}>
          <p
            className="text-subheadline mb-3 font-medium uppercase tracking-widest"
            style={{ color: "var(--color-blue)" }}
          >
            Canal de noticias · IA
          </p>
          <h1 className="text-large-title mb-4">Todo es verdad</h1>
          <p
            className="text-title-3 font-normal"
            style={{ color: "var(--color-label-secondary)" }}
          >
            Crónicas del pasado que nunca ocurrieron, presentadas con la seriedad
            de un reportaje verificado.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="mx-auto px-5 py-12" style={{ maxWidth: "var(--max-width-content)" }}>
          <p
            className="text-footnote mb-4 font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-label-tertiary)" }}
          >
            Destacado
          </p>
          <ArticleCard article={featured} />
        </section>
      )}

      {/* Grid */}
      {rest.length > 0 && (
        <section
          className="mx-auto px-5 pb-16"
          style={{ maxWidth: "var(--max-width-content)" }}
        >
          <p
            className="text-footnote mb-6 font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-label-tertiary)" }}
          >
            Más noticias
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {articles.length === 0 && (
        <section className="px-5 py-24 text-center">
          <p className="text-body text-secondary" style={{ color: "var(--color-label-secondary)" }}>
            Próximamente: las primeras noticias generadas por IA.
          </p>
        </section>
      )}
    </div>
  );
}
