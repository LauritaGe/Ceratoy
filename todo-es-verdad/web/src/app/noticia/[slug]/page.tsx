import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getAllSlugs } from "@/lib/content";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title_es,
    description: article.excerpt_es,
    openGraph: {
      title: article.title_es,
      description: article.excerpt_es,
      images: [article.image_url],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const paragraphs = article.body_es.split("\n\n").filter(Boolean);

  return (
    <article>
      {/* Hero image */}
      <div className="relative aspect-[21/9] w-full overflow-hidden">
        <Image
          src={article.image_url}
          alt={article.title_es}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, var(--color-background) 100%)",
          }}
        />
      </div>

      <div
        className="mx-auto -mt-16 px-5 pb-16"
        style={{ maxWidth: "var(--max-width-prose)" }}
      >
        <Link
          href="/"
          className="text-subheadline text-link mb-6 inline-block"
          style={{ color: "var(--color-blue)" }}
        >
          ← Inicio
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <CategoryBadge category={article.category} />
          <span className="text-footnote text-secondary" style={{ color: "var(--color-label-secondary)" }}>
            {article.location} · {article.year}
          </span>
        </div>

        <h1 className="text-large-title mb-2">{article.title_es}</h1>
        <p
          className="text-title-3 mb-8 font-normal"
          style={{ color: "var(--color-label-secondary)" }}
        >
          {article.title_en}
        </p>

        <div
          className="mb-8 rounded-[var(--radius-md)] p-4"
          style={{ backgroundColor: "var(--color-fill)" }}
        >
          <p className="text-callout" style={{ color: "var(--color-label-secondary)" }}>
            {article.excerpt_es}
          </p>
        </div>

        <div className="prose-apple">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-body">
              {p}
            </p>
          ))}
        </div>

        {article.characters.length > 0 && (
          <div
            className="mt-10 border-t pt-6"
            style={{ borderColor: "var(--color-separator)" }}
          >
            <p className="text-footnote mb-2 font-semibold uppercase tracking-wider text-tertiary" style={{ color: "var(--color-label-tertiary)" }}>
              Personajes
            </p>
            <p className="text-callout" style={{ color: "var(--color-label-secondary)" }}>
              {article.characters.join(" · ")}
            </p>
          </div>
        )}

        <div
          className="mt-8 rounded-[var(--radius-md)] border p-4"
          style={{
            borderColor: "var(--color-separator)",
            backgroundColor: "var(--color-background-secondary)",
          }}
        >
          <p className="text-caption-1" style={{ color: "var(--color-label-tertiary)" }}>
            ⚠ Contenido 100% ficticio. Generado con inteligencia artificial.
            Imagen y texto creados por IA. No representa hechos reales.
          </p>
        </div>
      </div>
    </article>
  );
}
