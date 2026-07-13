export function Footer() {
  return (
    <footer
      className="mt-auto border-t px-5 py-8"
      style={{ borderColor: "var(--color-separator)" }}
    >
      <div
        className="mx-auto flex max-w-[var(--max-width-content)] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        style={{ maxWidth: "var(--max-width-content)" }}
      >
        <p className="text-footnote text-secondary" style={{ color: "var(--color-label-secondary)" }}>
          © {new Date().getFullYear()} Todo es verdad
        </p>
        <p className="text-caption-1 text-tertiary" style={{ color: "var(--color-label-tertiary)" }}>
          Contenido 100% ficticio · Generado con inteligencia artificial
        </p>
      </div>
    </footer>
  );
}
