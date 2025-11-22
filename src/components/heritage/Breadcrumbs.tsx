import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 12 }}>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          padding: 0,
          margin: 0,
          listStyle: "none",
          color: "var(--color-text-grey)",
          fontSize: "0.95rem"
        }}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {item.href && !isLast ? (
                <Link href={item.href} style={{ color: "var(--color-primary)" }}>
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: isLast ? "var(--color-text-dark)" : "var(--color-text-grey)" }}>
                  {item.label}
                </span>
              )}
              {!isLast ? <span aria-hidden>›</span> : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
