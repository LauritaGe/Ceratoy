export interface Article {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  location: string;
  year: number;
  category: string;
  excerpt_es: string;
  excerpt_en: string;
  body_es: string;
  body_en: string;
  image_prompt: string;
  image_url: string;
  characters: string[];
  tags: string[];
  published_at: string;
  ai_generated: boolean;
}

export type Locale = "es" | "en";
