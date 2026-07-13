import Link from "next/link";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-background) 80%, transparent)",
        borderColor: "var(--color-separator)",
      }}
    >
      <div
        className="mx-auto flex h-12 max-w-[var(--max-width-content)] items-center justify-between px-5"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <Link href="/" className="text-headline text-link" style={{ textDecoration: "none" }}>
          Todo es verdad
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/archivo"
            className="text-subheadline text-secondary transition-opacity hover:opacity-70"
            style={{ color: "var(--color-label-secondary)", textDecoration: "none" }}
          >
            Archivo
          </Link>
          <span
            className="text-caption-1 rounded-full px-2.5 py-0.5"
            style={{
              backgroundColor: "var(--color-fill)",
              color: "var(--color-label-secondary)",
            }}
          >
            IA
          </span>
        </nav>
      </div>
    </header>
  );
}
