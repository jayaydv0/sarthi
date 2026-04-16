export default function DashboardAnalyticsPage() {
  return (
    <>
      <section className="mb-10">
        <p className="ao-kicker">Workspace</p>
        <h1 className="ao-title-page">Analytics</h1>
        <p className="mt-3 max-w-2xl text-[#8b9cb8]">
          Usage and sync metrics will appear here as we wire up telemetry.
        </p>
      </section>
      <div className="ao-panel max-w-xl p-8">
        <p className="text-sm text-[#8b9cb8]">
          No analytics data yet. Open a project from the dashboard to sync files,
          then check back.
        </p>
      </div>
    </>
  );
}
