import type { Locale } from "@/lib/types";

interface CategoryBadgeProps {
  category: string;
  locale?: Locale;
}

const LABELS: Record<string, { es: string; en: string }> = {
  descubrimientos: { es: "Descubrimientos", en: "Discoveries" },
  filtraciones: { es: "Filtraciones", en: "Leaks" },
  testimonios: { es: "Testimonios", en: "Testimonies" },
  archivos: { es: "Archivos desclasificados", en: "Declassified files" },
};

export function CategoryBadge({ category, locale = "es" }: CategoryBadgeProps) {
  const label = LABELS[category]?.[locale] ?? category;

  return (
    <span
      className="text-caption-1 inline-flex items-center rounded-full px-3 py-1 font-medium"
      style={{
        backgroundColor: "var(--color-blue)",
        color: "#ffffff",
      }}
    >
      {label}
    </span>
  );
}
