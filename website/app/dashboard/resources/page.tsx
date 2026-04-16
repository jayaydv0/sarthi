import Link from "next/link";

export default function DashboardResourcesPage() {
  return (
    <>
      <section className="mb-10">
        <p className="ao-kicker">Workspace</p>
        <h1 className="ao-title-page">Resources</h1>
        <p className="mt-3 max-w-2xl text-[#8b9cb8]">
          Quick links to tools and areas of the app.
        </p>
      </section>
      <ul className="grid max-w-xl gap-3 text-sm">
        <li>
          <Link
            href="/dashboard/new"
            className="block rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-4 font-medium text-white transition-colors hover:border-[rgba(192,193,255,0.35)] hover:bg-[rgba(192,193,255,0.06)]"
          >
            Add project
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/settings"
            className="block rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-4 font-medium text-white transition-colors hover:border-[rgba(192,193,255,0.35)] hover:bg-[rgba(192,193,255,0.06)]"
          >
            Settings
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/profile"
            className="block rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-4 font-medium text-white transition-colors hover:border-[rgba(192,193,255,0.35)] hover:bg-[rgba(192,193,255,0.06)]"
          >
            Profile
          </Link>
        </li>
      </ul>
    </>
  );
}
