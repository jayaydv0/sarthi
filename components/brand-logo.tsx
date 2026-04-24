import Link from "next/link";

export function BrandLogo({
  className = "",
  asLink = true,
  href = "/",
}: {
  className?: string;
  asLink?: boolean;
  href?: string;
}) {
  const text = (
    <span
      className={`display-tight text-xl font-bold tracking-tight bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent sm:text-2xl ${className}`.trim()}
    >
      ArchitectOS
    </span>
  );
  if (asLink) {
    return (
      <Link
        href={href}
        className="inline-flex min-h-10 min-w-0 items-center rounded-lg px-1 py-1 outline-none ring-primary/40 focus-visible:ring-2"
      >
        {text}
      </Link>
    );
  }
  return text;
}
